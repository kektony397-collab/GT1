
export interface Bike {
  model: string;
  year: number;
  tankCapacityL: number;
}

export interface Settings {
  fuelEconomyKmPerL: number;
  reserveLiters: number;
}

export interface BikeState {
  currentFuelL: number;
  tripKm: number;
  totalOdometerKm: number;
}

export interface RefuelRecord {
  id: string;
  timestamp: string;
  liters: number;
  odometer: number;
}

export type LocationPermission = 'prompt' | 'granted' | 'denied';

export interface LocationState {
    permission: LocationPermission;
    speedKph: number;
    error: string | null;
}
