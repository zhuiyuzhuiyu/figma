const users = [
  { id: 'u-1001', name: 'Alice Zhang', role: 'Admin', status: 'active', email: 'alice@example.com' },
  { id: 'u-1002', name: 'Ryan Liu', role: 'Editor', status: 'active', email: 'ryan@example.com' },
  { id: 'u-1003', name: 'Mia Chen', role: 'Viewer', status: 'inactive', email: 'mia@example.com' },
];

const orders = [
  { id: 'o-3401', customer: 'Tech Nova', amount: 12800, status: 'paid' },
  { id: 'o-3402', customer: 'Blue Coral', amount: 4200, status: 'pending' },
  { id: 'o-3403', customer: 'Paper Jet', amount: 930, status: 'refunded' },
];

function response(statusCode, body) {
  return {
    statusCode,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'access-control-allow-origin': '*',
      'access-control-allow-methods': 'GET,POST,OPTIONS',
      'access-control-allow-headers': 'content-type',
    },
    body: JSON.stringify(body),
  };
}

function getPath(event) {
  const rawPath = event?.rawPath ?? event?.requestContext?.http?.path ?? '/';
  return rawPath.replace(/^\/api/, '');
}

export async function handler(event) {
  const method = event?.requestContext?.http?.method ?? event?.httpMethod ?? 'GET';
  const path = getPath(event);

  if (method === 'OPTIONS') {
    return response(204, {});
  }

  if (method === 'GET' && path === '/stats') {
    const activeUsers = users.filter((user) => user.status === 'active').length;
    const pendingOrders = orders.filter((order) => order.status === 'pending').length;
    const revenue = orders.filter((order) => order.status === 'paid').reduce((sum, item) => sum + item.amount, 0);

    return response(200, {
      users: users.length,
      activeUsers,
      pendingOrders,
      revenue,
    });
  }

  if (method === 'GET' && path === '/users') {
    return response(200, users);
  }

  if (method === 'GET' && path === '/orders') {
    return response(200, orders);
  }

  if (method === 'POST' && path === '/users') {
    let payload = {};
    try {
      payload = JSON.parse(event.body ?? '{}');
    } catch {
      return response(400, { message: 'Invalid JSON body' });
    }

    const name = String(payload.name ?? '').trim();
    const email = String(payload.email ?? '').trim();

    if (!name || !email) {
      return response(400, { message: 'name and email are required' });
    }

    const record = {
      id: `u-${Date.now()}`,
      name,
      email,
      role: 'Viewer',
      status: 'active',
    };

    users.unshift(record);
    return response(201, record);
  }

  return response(404, { message: 'Not Found' });
}
