// netlify/functions/auth.js
exports.handler = async (event) => {
  // Hanya terima POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ok: false, msg: 'Method Not Allowed' })
    };
  }

  // Parse body JSON
  let body = {};
  try {
    body = JSON.parse(event.body || '{}');
  } catch (err) {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ok: false, msg: 'Invalid JSON' })
    };
  }

  const { username, password } = body;

  if (!username || !password) {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ok: false, msg: 'Missing username or password' })
    };
  }

  // Ambil credential dari Environment Variables
  const VALID_USER = process.env.AUTH_USER || '';
  const VALID_PASS = process.env.AUTH_PASSWORD || '';

  if (!VALID_USER || !VALID_PASS) {
    console.error('AUTH env vars not set');
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ok: false, msg: 'Server misconfigured' })
    };
  }

  // Cek login
  if (username === VALID_USER && password === VALID_PASS) {
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ok: true })
    };
  }

  // Gagal login
  return {
    statusCode: 401,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ok: false, msg: 'Invalid credentials' })
  };
};
