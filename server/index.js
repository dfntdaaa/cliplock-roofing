
import 'dotenv/config';
import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json({ limit: '50kb' }));

const API_BASE = 'https://api.whop.com/api/v1';
const apiKey = process.env.WHOP_API_KEY;
const accountId = process.env.WHOP_ACCOUNT_ID;

app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    whopConfigured: Boolean(apiKey && accountId)
  });
});

// Server-side only.
// Never expose the private API key in browser code.
app.post('/api/leads', async (req, res) => {
  if (!apiKey || !accountId) {
    return res.status(503).json({
      error: 'Whop API credentials are not configured on the server.'
    });
  }

  const {
    name,
    email,
    phone,
    zip,
    service,
    details
  } = req.body ?? {};

  if (!name || !email || !zip || !service) {
    return res.status(400).json({
      error: 'Name, email, ZIP code, and service are required.'
    });
  }

  try {
    const response = await fetch(`${API_BASE}/leads`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        account_id: accountId,
        metadata: {
          name,
          email,
          phone: phone || '',
          zip,
          service,
          details: details || '',
          source: 'cliplock-roofing-website'
        },
        ...(process.env.WHOP_INSPECTION_PRODUCT_ID
          ? {
              product_id:
                process.env.WHOP_INSPECTION_PRODUCT_ID
            }
          : {})
      })
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      return res.status(response.status).json({
        error:
          'Whop did not accept the lead request. Check the API schema and required IDs.',
        details: data
      });
    }

    return res.status(201).json({
      ok: true,
      lead: data
    });
  } catch (error) {
    return res.status(502).json({
      error: 'Could not reach Whop API.'
    });
  }
});

// Admin-only invoice creation starter.
// Do not call this route directly from the public website.
app.post('/api/admin/invoices', async (req, res) => {
  const adminSecret = process.env.INVOICE_ADMIN_SECRET;

  if (
    !adminSecret ||
    req.get('x-admin-secret') !== adminSecret
  ) {
    return res.status(401).json({
      error: 'Unauthorized.'
    });
  }

  if (!apiKey || !accountId) {
    return res.status(503).json({
      error: 'Whop API credentials are not configured.'
    });
  }

  const {
    email_address,
    customer_name,
    line_items,
    due_date,
    payment_method_id,
    product_id
  } = req.body ?? {};

  if (
    !email_address ||
    !Array.isArray(line_items) ||
    !line_items.length
  ) {
    return res.status(400).json({
      error: 'email_address and line_items are required.'
    });
  }

  try {
    const response = await fetch(`${API_BASE}/invoices`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        account_id: accountId,
        email_address,
        customer_name,
        line_items,
        due_date,
        payment_method_id,
        product_id
      })
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      return res.status(response.status).json({
        error:
          'Whop did not create the invoice. Verify the current API schema and customer/payment-method IDs.',
        details: data
      });
    }

    return res.status(201).json({
      ok: true,
      invoice: data
    });
  } catch {
    return res.status(502).json({
      error: 'Could not reach Whop API.'
    });
  }
});

const port = Number(process.env.PORT || 8787);

app.listen(port, () => {
  console.log(
    `Cliplock Roofing API starter listening on http://localhost:${port}`
  );
});
