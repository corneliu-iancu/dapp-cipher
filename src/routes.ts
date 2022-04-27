import { dAppName } from 'config';
import Mint from 'pages/Mint';
import withPageTitle from './components/PageTitle';
import Dashboard from './pages/Dashboard';
import Demo from './pages/Demo';
import Home from './pages/Home';
import Transaction from './pages/Transaction';

export const routeNames = {
  home: '/',
  dashboard: '/dashboard',
  mint: '/mint',
  demo: '/demo',
  transaction: '/transaction',
  unlock: '/unlock',
  ledger: '/ledger',
  walletconnect: '/walletconnect'
};

const routes: Array<any> = [
  {
    path: routeNames.home,
    title: 'Home',
    component: Home
  },
  {
    path: routeNames.dashboard,
    title: 'Dashboard',
    component: Dashboard,
    authenticatedRoute: true
  },
  {
    path: routeNames.mint,
    title: 'Mint NFTs',
    component: Mint,
    authenticatedRoute: true
  },
  {
    path: routeNames.demo,
    title: 'Demo NFTs',
    component: Demo,
    authenticatedRoute: true
  },
  {
    path: routeNames.transaction,
    title: 'Transaction',
    component: Transaction
  }
];

const mappedRoutes = routes.map((route) => {
  const title = route.title
    ? `${route.title} • Elrond ${dAppName}`
    : `Elrond ${dAppName}`;

  const requiresAuth = Boolean(route.authenticatedRoute);
  const wrappedComponent = withPageTitle(title, route.component);

  return {
    path: route.path,
    component: wrappedComponent,
    authenticatedRoute: requiresAuth
  };
});

export default mappedRoutes;
