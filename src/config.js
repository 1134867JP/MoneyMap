import Constants from 'expo-constants';

const config = Constants.expoConfig || Constants.manifest;

const { SUPABASE_URL, SUPABASE_KEY, API_KEY } = config.extra;

export { SUPABASE_URL, SUPABASE_KEY, API_KEY };
