import { createClient } from '@supabase/supabase-js';

/* Supabase loyihasi: "logist" (lazizjon13's Project)
   Publishable key brauzerda ishlatish uchun mo'ljallangan — uni ochiq qo'yish mumkin.
   Secret key'ni (sb_secret_...) bu yerga HECH QACHON yozmang. */
export const SUPABASE_URL = 'https://wtcyqdmirooypivwipmz.supabase.co';
export const SUPABASE_KEY = 'sb_publishable_qdsL5mWBCTw0QuD4gKX6RQ_l9klcRLi';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: { persistSession: false },
});

export default supabase;
