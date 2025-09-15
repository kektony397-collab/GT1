
import { useState, useEffect, useCallback, useRef } from 'react';
import type { Settings, BikeState, RefuelRecord, LocationPermission, LocationState } from '../types';
import { HONDA_DREAM_YUGA, DEFAULT_SETTINGS, INITIAL_BIKE_STATE, LOCAL_STORAGE_KEYS } from '../constants';
import { calculateDistance } from '../utils/location';

const getStoredValue = <T,>(key: string, defaultValue: T): T => {
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading from localStorage for key "${key}":`, error);
    return defaultValue;
  }
};

export const useBikeState = () => {
  const bike = HONDA_DREAM_YUGA;

  const [settings, setSettings] = useState<Settings>(() => getStoredValue(LOCAL_STORAGE_KEYS.settings, DEFAULT_SETTINGS));
  const [state, setState] = useState<BikeState>(() => getStoredValue(LOCAL_STORAGE_KEYS.state, INITIAL_BIKE_STATE));
  const [refuelRecords, setRefuelRecords] = useState<RefuelRecord[]>(() => getStoredValue(LOCAL_STORAGE_KEYS.records, []));
  const [locationState, setLocationState] = useState<LocationState>({
      permission: 'prompt',
      speedKph: 0,
      error: null,
  });

  const lastPosition = useRef<{ lat: number; lon: number; time: number } | null>(null);
  const watchId = useRef<number | null>(null);

  // --- Persistence Effects ---
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.settings, JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.state, JSON.stringify(state));
  }, [state]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.records, JSON.stringify(refuelRecords));
  }, [refuelRecords]);

  // --- Low Fuel Notification ---
  useEffect(() => {
    if (state.currentFuelL > 0 && state.currentFuelL <= settings.reserveLiters) {
      if (Notification.permission === 'granted') {
        new Notification('Low Fuel Warning', {
          body: `Fuel is in reserve! Only ${state.currentFuelL.toFixed(1)} L remaining.`,
          icon: '/favicon.ico', // You would place an icon here
        });
      }
    }
  }, [state.currentFuelL, settings.reserveLiters]);

  // --- Location Tracking Logic ---
  const handlePositionUpdate = useCallback((position: GeolocationPosition) => {
    const { latitude, longitude, speed } = position.coords;
    const currentTime = position.timestamp;

    // Convert speed from m/s to km/h, null check for safety
    const speedKph = speed ? speed * 3.6 : 0;
    setLocationState(prev => ({ ...prev, speedKph, error: null }));
    
    if (lastPosition.current) {
        const distanceKm = calculateDistance(
            lastPosition.current.lat,
            lastPosition.current.lon,
            latitude,
            longitude
        );

        if (distanceKm > 0.001) { // Update only if moved more than 1 meter
            const fuelConsumedL = distanceKm / settings.fuelEconomyKmPerL;
            
            setState(prevState => {
                const newFuel = Math.max(0, prevState.currentFuelL - fuelConsumedL);
                return {
                    ...prevState,
                    currentFuelL: newFuel,
                    tripKm: prevState.tripKm + distanceKm,
                    totalOdometerKm: prevState.totalOdometerKm + distanceKm,
                };
            });
        }
    }
    
    lastPosition.current = { lat: latitude, lon: longitude, time: currentTime };
  }, [settings.fuelEconomyKmPerL]);

  const handlePositionError = (error: GeolocationPositionError) => {
      let errorMessage = 'An unknown GPS error occurred.';
      switch(error.code) {
          case error.PERMISSION_DENIED:
              errorMessage = 'GPS access was denied.';
              setLocationState(prev => ({ ...prev, permission: 'denied', error: errorMessage }));
              stopLocationTracking();
              return;
          case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location information is unavailable.';
              break;
          case error.TIMEOUT:
              errorMessage = 'The request to get user location timed out.';
              break;
      }
      setLocationState(prev => ({ ...prev, error: errorMessage }));
  };

  const stopLocationTracking = () => {
      if (watchId.current !== null) {
          navigator.geolocation.clearWatch(watchId.current);
          watchId.current = null;
          lastPosition.current = null;
          setLocationState(prev => ({ ...prev, speedKph: 0 }));
      }
  };

  const startLocationTracking = useCallback(() => {
    if ('geolocation' in navigator) {
      stopLocationTracking(); // Clear any existing watch
      const options = { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 };
      watchId.current = navigator.geolocation.watchPosition(handlePositionUpdate, handlePositionError, options);
    } else {
      setLocationState(prev => ({ ...prev, error: "Geolocation is not supported by this browser." }));
    }
  }, [handlePositionUpdate]);

  const requestLocationPermission = useCallback(async () => {
    if (!('geolocation' in navigator)) {
        setLocationState(prev => ({ ...prev, error: 'Geolocation not supported.' }));
        return;
    }

    try {
        const permissionStatus = await navigator.permissions.query({ name: 'geolocation' });
        if (permissionStatus.state === 'granted') {
            setLocationState(prev => ({ ...prev, permission: 'granted', error: null }));
            startLocationTracking();
        } else if (permissionStatus.state === 'prompt') {
            setLocationState(prev => ({ ...prev, permission: 'prompt' }));
            // The browser will prompt on first use of watchPosition
            startLocationTracking();
        } else if (permissionStatus.state === 'denied') {
            setLocationState(prev => ({ ...prev, permission: 'denied', error: 'GPS access was denied.' }));
        }

        permissionStatus.onchange = () => {
            if (permissionStatus.state === 'granted') {
                setLocationState({ permission: 'granted', speedKph: 0, error: null });
                startLocationTracking();
            } else {
                setLocationState({ permission: 'denied', speedKph: 0, error: 'GPS access was denied.' });
                stopLocationTracking();
            }
        };
    } catch (error) {
        // Fallback for browsers that don't support Permissions API
        startLocationTracking();
    }
  }, [startLocationTracking]);
  
  // Initial permission check and cleanup
  useEffect(() => {
      requestLocationPermission();
      if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
        Notification.requestPermission();
      }
      return () => stopLocationTracking();
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only once

  // --- Public Action Methods ---
  const addFuel = useCallback((liters: number) => {
    setState(prevState => {
      const newFuel = Math.min(bike.tankCapacityL, prevState.currentFuelL + liters);
      const newRecord: RefuelRecord = {
        id: new Date().toISOString(),
        timestamp: new Date().toISOString(),
        liters,
        odometer: prevState.totalOdometerKm,
      };
      setRefuelRecords(prevRecords => [newRecord, ...prevRecords]);
      return { ...prevState, currentFuelL: newFuel };
    });
  }, [bike.tankCapacityL]);

  const setEconomy = useCallback((economy: number) => {
    setSettings(prev => ({ ...prev, fuelEconomyKmPerL: economy }));
  }, []);
  
  const setReserve = useCallback((liters: number) => {
    setSettings(prev => ({ ...prev, reserveLiters: liters }));
  }, []);

  const deleteRecord = useCallback((id: string) => {
    setRefuelRecords(prev => prev.filter(record => record.id !== id));
  }, []);
  
  const resetTrip = useCallback(() => {
    setState(prev => ({ ...prev, tripKm: 0 }));
  }, []);

  // --- Derived State ---
  const estimatedRangeKm = state.currentFuelL * settings.fuelEconomyKmPerL;
  const fuelPercentage = (state.currentFuelL / bike.tankCapacityL) * 100;
  const isReserve = state.currentFuelL <= settings.reserveLiters;

  return {
    bike,
    settings,
    state,
    refuelRecords,
    locationState,
    estimatedRangeKm,
    fuelPercentage,
    isReserve,
    addFuel,
    setEconomy,
    setReserve,
    deleteRecord,
    resetTrip,
    requestLocationPermission,
  };
};
