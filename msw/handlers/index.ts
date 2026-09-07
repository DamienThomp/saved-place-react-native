import { supabaseHandlers } from './supabase';
import { mapboxHandlers } from './mapbox';

export const handlers = [...supabaseHandlers, ...mapboxHandlers];
