// netlify/functions/compra-agil.js
// Proxy hacia https://api2.mercadopublico.cl/v2/compra-agil
// El ticket de MP se guarda en variable de entorno Netlify: MP_TICKET

exports.handler = async (event) => {
  const CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: CORS, body: '' };
  }

  const ticket = process.env.MP_TICKET;
  if (!ticket) {
    return {
      statusCode: 500,
      headers: CORS,
      body: JSON.stringify({ error: 'MP_TICKET no configurado en variables de entorno Netlify.' })
    };
  }

  // Reenviar query params del frontend a la API
  const params = new URLSearchParams(event.queryStringParameters || {});
  const url = `https://api2.mercadopublico.cl/v2/compra-agil?${params.toString()}`;

  try {
    const resp = await fetch(url, {
      headers: { 'ticket': ticket }
    });

    const data = await resp.json();

    return {
      statusCode: resp.status,
      headers: { ...CORS, 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: CORS,
      body: JSON.stringify({ error: err.message })
    };
  }
};
