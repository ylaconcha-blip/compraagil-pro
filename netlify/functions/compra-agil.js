// netlify/functions/compra-agil-detalle.js
// Proxy hacia https://api2.mercadopublico.cl/v2/compra-agil/{codigo}

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
      body: JSON.stringify({ error: 'MP_TICKET no configurado.' })
    };
  }

  // El código de la Compra Ágil viene como query param: ?codigo=1057539-228-COT26
  const codigo = event.queryStringParameters?.codigo;
  if (!codigo) {
    return {
      statusCode: 400,
      headers: CORS,
      body: JSON.stringify({ error: 'Falta parámetro codigo.' })
    };
  }

  const url = `https://api2.mercadopublico.cl/v2/compra-agil/${encodeURIComponent(codigo)}`;

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
