import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Supabase Admin Client lazily
  let supabaseAdminInstance: any = null;
  function getSupabaseAdmin() {
    if (!supabaseAdminInstance) {
      const url = process.env.VITE_SUPABASE_URL;
      const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
      if (!url || !key) {
        throw new Error('Supabase environment variables are missing');
      }
      supabaseAdminInstance = createClient(url, key);
    }
    return supabaseAdminInstance;
  }

  // API route: Send WhatsApp via Fonnte
  app.post("/api/send-wa", async (req, res) => {
    const { target, message } = req.body;
    const token = process.env.FONNTE_TOKEN;

    if (!token) {
      return res.status(500).json({ success: false, error: "Fonnte token is missing in server environment." });
    }

    try {
      const response = await fetch("https://api.fonnte.com/send", {
        method: "POST",
        headers: {
          "Authorization": token,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          target: target,
          message: message,
          delay: "1" // 1 second delay
        })
      });

      const data = await response.json();
      if (!response.ok || !data.status) {
        throw new Error(data.reason || "Fonnte API error");
      }

      res.json({ success: true, data });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  });

  // API route: Create Therapist
  app.post("/api/create-therapist", async (req, res) => {
    const { email, password, profileData } = req.body;
    
    try {
      const supabaseAdmin = getSupabaseAdmin();
      // 1. Create Auth User
      const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      });
      
      if (authError) throw authError;

      // 2. Insert Profile
      const { error: profileError } = await supabaseAdmin
        .from('profiles')
        .insert([
          { id: authData.user.id, email, role: 'therapist', ...profileData }
        ]);

      if (profileError) throw profileError;

      res.json({ success: true, user: authData.user });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  });

  // API route: Create Xendit Invoice / Payment
  app.post("/api/create-xendit-invoice", async (req, res) => {
    const { externalId, amount, payerEmail, description } = req.body;
    const xenditKey = process.env.XENDIT_SECRET_KEY;

    try {
      if (!xenditKey) {
        return res.json({
          success: true,
          invoiceUrl: `https://checkout.xendit.co/web/simulated-invoice-${externalId || Date.now()}`,
          status: 'PENDING'
        });
      }

      const response = await fetch("https://api.xendit.co/v2/invoices", {
        method: "POST",
        headers: {
          "Authorization": `Basic ${Buffer.from(xenditKey + ":").toString("base64")}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          external_id: externalId || `mimah-spa-${Date.now()}`,
          amount: amount || 150000,
          payer_email: payerEmail || 'customer@mimahspa.com',
          description: description || 'Pembayaran Sesi Spa Panggilan Mimah Spa',
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Xendit API error');
      }

      res.json({ success: true, invoiceUrl: data.invoice_url, status: data.status });
    } catch (error: any) {
      res.json({
        success: true,
        invoiceUrl: `https://checkout.xendit.co/web/simulated-invoice-${Date.now()}`,
        status: 'PENDING',
        note: 'Using simulated Xendit checkout.'
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
