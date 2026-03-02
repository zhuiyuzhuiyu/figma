import { useEffect, useMemo, useState, type CSSProperties } from 'react';

type OverviewStats = {
  users: number;
  activeUsers: number;
  pendingOrders: number;
  revenue: number;
};

type UserRecord = {
  id: string;
  name: string;
  role: 'Admin' | 'Editor' | 'Viewer';
  status: 'active' | 'inactive';
  email: string;
};

type OrderRecord = {
  id: string;
  customer: string;
  amount: number;
  status: 'pending' | 'paid' | 'refunded';
};

const API_BASE = (import.meta.env.VITE_API_BASE_URL ?? '/api').replace(/\/$/, '');

const mockStats: OverviewStats = {
  users: 12,
  activeUsers: 9,
  pendingOrders: 4,
  revenue: 58230,
};

const mockUsers: UserRecord[] = [
  { id: 'u-1001', name: 'Alice Zhang', role: 'Admin', status: 'active', email: 'alice@example.com' },
  { id: 'u-1002', name: 'Ryan Liu', role: 'Editor', status: 'active', email: 'ryan@example.com' },
  { id: 'u-1003', name: 'Mia Chen', role: 'Viewer', status: 'inactive', email: 'mia@example.com' },
];

const mockOrders: OrderRecord[] = [
  { id: 'o-3401', customer: 'Tech Nova', amount: 12800, status: 'paid' },
  { id: 'o-3402', customer: 'Blue Coral', amount: 4200, status: 'pending' },
  { id: 'o-3403', customer: 'Paper Jet', amount: 930, status: 'refunded' },
];

async function fetchJson<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`);
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }
  return (await response.json()) as T;
}

function tileLabelColor(label: string): string {
  if (label === 'active') return '#1f9d63';
  if (label === 'inactive') return '#9ca3af';
  if (label === 'pending') return '#c27c2c';
  if (label === 'paid') return '#1f9d63';
  if (label === 'refunded') return '#5d76ff';
  return '#64748b';
}

export function AdminDashboard() {
  const [stats, setStats] = useState<OverviewStats>(mockStats);
  const [users, setUsers] = useState<UserRecord[]>(mockUsers);
  const [orders, setOrders] = useState<OrderRecord[]>(mockOrders);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      setLoading(true);
      setError(null);

      try {
        const [s, u, o] = await Promise.all([
          fetchJson<OverviewStats>('/stats'),
          fetchJson<UserRecord[]>('/users'),
          fetchJson<OrderRecord[]>('/orders'),
        ]);
        if (!isMounted) return;
        setStats(s);
        setUsers(u);
        setOrders(o);
      } catch {
        if (!isMounted) return;
        setError('API 暂不可用，当前展示本地演示数据。');
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  const summaryCards = useMemo(
    () => [
      { title: 'Total Users', value: stats.users },
      { title: 'Active Users', value: stats.activeUsers },
      { title: 'Pending Orders', value: stats.pendingOrders },
      { title: 'Revenue', value: `¥${stats.revenue.toLocaleString()}` },
    ],
    [stats],
  );

  function toggleStatus(userId: string) {
    setUsers((current) =>
      current.map((user) =>
        user.id === userId
          ? { ...user, status: user.status === 'active' ? 'inactive' : 'active' }
          : user,
      ),
    );
  }

  function createUser() {
    const name = newUserName.trim();
    const email = newUserEmail.trim();
    if (!name || !email) return;

    const user: UserRecord = {
      id: `u-${Date.now()}`,
      name,
      email,
      role: 'Viewer',
      status: 'active',
    };

    setUsers((current) => [user, ...current]);
    setNewUserName('');
    setNewUserEmail('');
  }

  return (
    <main style={styles.page}>
      <section style={styles.hero}>
        <h1 style={styles.title}>Admin Console</h1>
        <p style={styles.subtitle}>Simple management system powered by React + AWS API.</p>
      </section>

      {error ? <p style={styles.notice}>{error}</p> : null}

      <section style={styles.grid}>
        {summaryCards.map((card) => (
          <article key={card.title} style={styles.card}>
            <p style={styles.cardLabel}>{card.title}</p>
            <p style={styles.cardValue}>{card.value}</p>
          </article>
        ))}
      </section>

      <section style={styles.panelWrap}>
        <article style={styles.panel}>
          <header style={styles.panelHeader}>
            <h2 style={styles.panelTitle}>Users</h2>
            {loading ? <span style={styles.badge}>Loading...</span> : <span style={styles.badge}>Ready</span>}
          </header>

          <div style={styles.formRow}>
            <input
              value={newUserName}
              onChange={(event) => setNewUserName(event.target.value)}
              placeholder="Name"
              style={styles.input}
            />
            <input
              value={newUserEmail}
              onChange={(event) => setNewUserEmail(event.target.value)}
              placeholder="Email"
              style={styles.input}
            />
            <button type="button" onClick={createUser} style={styles.primaryButton}>
              Add
            </button>
          </div>

          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Role</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td style={styles.td}>
                    <div>{user.name}</div>
                    <small style={styles.muted}>{user.email}</small>
                  </td>
                  <td style={styles.td}>{user.role}</td>
                  <td style={styles.td}>
                    <span style={{ ...styles.status, background: tileLabelColor(user.status) }}>{user.status}</span>
                  </td>
                  <td style={styles.td}>
                    <button type="button" onClick={() => toggleStatus(user.id)} style={styles.secondaryButton}>
                      Toggle
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </article>

        <article style={styles.panel}>
          <header style={styles.panelHeader}>
            <h2 style={styles.panelTitle}>Orders</h2>
          </header>

          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Order ID</th>
                <th style={styles.th}>Customer</th>
                <th style={styles.th}>Amount</th>
                <th style={styles.th}>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td style={styles.td}>{order.id}</td>
                  <td style={styles.td}>{order.customer}</td>
                  <td style={styles.td}>¥{order.amount.toLocaleString()}</td>
                  <td style={styles.td}>
                    <span style={{ ...styles.status, background: tileLabelColor(order.status) }}>{order.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </article>
      </section>
    </main>
  );
}

const styles: Record<string, CSSProperties> = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(140deg, #f5f7ff 0%, #f0fdf9 50%, #eef2ff 100%)',
    color: '#0f172a',
    padding: '40px 28px 56px',
    fontFamily: 'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, sans-serif',
  },
  hero: {
    maxWidth: 980,
    margin: '0 auto 24px',
  },
  title: {
    fontSize: 36,
    fontWeight: 700,
    marginBottom: 8,
  },
  subtitle: {
    color: '#334155',
    fontSize: 16,
  },
  notice: {
    maxWidth: 980,
    margin: '0 auto 18px',
    padding: '10px 12px',
    borderRadius: 10,
    background: '#fff2f2',
    color: '#9f1239',
  },
  grid: {
    maxWidth: 980,
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: 14,
  },
  card: {
    background: '#ffffffd8',
    border: '1px solid #dbe5ff',
    borderRadius: 14,
    padding: 16,
    boxShadow: '0 8px 24px rgba(15, 23, 42, 0.06)',
  },
  cardLabel: {
    color: '#475569',
    fontSize: 13,
    marginBottom: 4,
  },
  cardValue: {
    fontSize: 28,
    fontWeight: 700,
    letterSpacing: -0.4,
  },
  panelWrap: {
    maxWidth: 980,
    margin: '16px auto 0',
    display: 'grid',
    gap: 16,
  },
  panel: {
    background: '#ffffffd8',
    border: '1px solid #dbe5ff',
    borderRadius: 14,
    padding: 16,
    boxShadow: '0 8px 24px rgba(15, 23, 42, 0.06)',
  },
  panelHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  panelTitle: {
    fontSize: 18,
    fontWeight: 700,
  },
  badge: {
    fontSize: 12,
    padding: '4px 8px',
    borderRadius: 999,
    background: '#d1fae5',
    color: '#065f46',
    fontWeight: 600,
  },
  formRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr auto',
    gap: 8,
    marginBottom: 12,
  },
  input: {
    border: '1px solid #cbd5e1',
    borderRadius: 10,
    padding: '8px 10px',
    background: 'white',
  },
  primaryButton: {
    border: 0,
    borderRadius: 10,
    padding: '8px 14px',
    background: '#0f172a',
    color: 'white',
    cursor: 'pointer',
    fontWeight: 600,
  },
  secondaryButton: {
    border: '1px solid #cbd5e1',
    borderRadius: 10,
    padding: '6px 10px',
    background: 'white',
    cursor: 'pointer',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    textAlign: 'left',
    fontSize: 12,
    color: '#64748b',
    borderBottom: '1px solid #e2e8f0',
    padding: '8px 6px',
  },
  td: {
    borderBottom: '1px solid #eef2f7',
    padding: '10px 6px',
    verticalAlign: 'middle',
    fontSize: 14,
  },
  muted: {
    color: '#64748b',
  },
  status: {
    color: '#fff',
    fontSize: 12,
    padding: '3px 8px',
    borderRadius: 999,
    display: 'inline-block',
    textTransform: 'capitalize',
  },
};
