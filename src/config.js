import Constants from 'expo-constants';

const config = Constants.expoConfig || Constants.manifest || {};

const SUPABASE_URL = config.extra?.SUPABASE_URL || process.env.EXPO_SUPABASE_URL;
const SUPABASE_KEY = config.extra?.SUPABASE_KEY || process.env.EXPO_SUPABASE_KEY;
const API_KEY = config.extra?.API_KEY || process.env.EXPO_API_KEY;

export { SUPABASE_URL, SUPABASE_KEY, API_KEY };
