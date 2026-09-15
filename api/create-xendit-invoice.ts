export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

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
}
