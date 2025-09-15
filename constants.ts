
import type { Bike, Settings, BikeState, RefuelRecord } from './types';

export const HONDA_DREAM_YUGA: Bike = {
  model: 'Honda Dream Yuga',
  year: 2014,
  tankCapacityL: 8.0,
};

export const DEFAULT_SETTINGS: Settings = {
  fuelEconomyKmPerL: 44.0,
  reserveLiters: 1.5,
};

export const INITIAL_BIKE_STATE: BikeState = {
  currentFuelL: HONDA_DREAM_YUGA.tankCapacityL,
  tripKm: 0,
  totalOdometerKm: 0,
};

export const INITIAL_REFUEL_RECORDS: RefuelRecord[] = [];

export const LOCAL_STORAGE_KEYS = {
  settings: 'bike_dashboard_settings',
  state: 'bike_dashboard_state',
  records: 'bike_dashboard_records',
};
