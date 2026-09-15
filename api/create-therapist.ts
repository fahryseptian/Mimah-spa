import { createClient } from "@supabase/supabase-js";

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, password, profileData } = req.body;
  const url = process.env.VITE_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    return res.status(500).json({ success: false, error: 'Supabase environment variables are missing' });
  }

  const supabaseAdmin = createClient(url, key);

  try {
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });
    
    if (authError) throw authError;

    // The therapist data insert is handled by the frontend via AppContext's addTherapist

    res.json({ success: true, user: authData.user });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
}
