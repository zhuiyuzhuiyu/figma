import { createBrowserRouter } from 'react-router';
import { SoloSimulator } from './pages/SoloSimulator';
import { HeroStats } from './pages/HeroStats';
import { CounterAnalysis } from './pages/CounterAnalysis';
import { ItemSimulator } from './pages/ItemSimulator';
import { AdminDashboard } from './pages/AdminDashboard';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: AdminDashboard,
  },
  {
    path: '/admin',
    Component: AdminDashboard,
  },
  {
    path: '/solo',
    Component: SoloSimulator,
  },
  {
    path: '/stats',
    Component: HeroStats,
  },
  {
    path: '/counter',
    Component: CounterAnalysis,
  },
  {
    path: '/items',
    Component: ItemSimulator,
  },
]);
