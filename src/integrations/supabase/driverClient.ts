// Separate Supabase client for drivers to avoid session conflicts with admin
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

// Custom storage that uses a different key prefix for drivers
const driverStorage = {
  getItem: (key: string) => {
    return localStorage.getItem(`driver_${key}`);
  },
  setItem: (key: string, value: string) => {
    localStorage.setItem(`driver_${key}`, value);
  },
  removeItem: (key: string) => {
    localStorage.removeItem(`driver_${key}`);
  },
};

export const driverSupabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: driverStorage,
    storageKey: 'driver-auth',
    persistSession: true,
    autoRefreshToken: true,
  }
});
