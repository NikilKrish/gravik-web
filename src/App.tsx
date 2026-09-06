import { Route, Router, Switch, useLocation } from 'wouter';
import { PaddleCursor } from './components/PaddleCursor';
import { RouteTransition } from './components/motion';
import { useDevelopmentPerformanceDiagnostics } from './lib/motion';
import { Home } from './pages/home';
import Booking from './pages/booking';
import Privacy from './pages/privacy';
import Terms from './pages/terms';
import NotFound from './pages/not-found';

const base = import.meta.env.BASE_URL.replace(/\/$/, '');

function AppRoutes() {
  const [location] = useLocation();
  const routes = <Switch>
    <Route path="/" component={Home} />
    <Route path="/book" component={Booking} />
    <Route path="/privacy" component={Privacy} />
    <Route path="/terms" component={Terms} />
    <Route component={NotFound} />
  </Switch>;
  // Booking owns section progression. Its sticky rails and fixed CTA must
  // remain outside transformed route ancestors.
  return location.replace(/\/$/, '') === '/book' ? routes : <RouteTransition key={location}>{routes}</RouteTransition>;
}

function App() {
  useDevelopmentPerformanceDiagnostics();
  return (
    <Router base={base}>
      <a href="#main-content" className="skip-link" onClick={() => document.getElementById('main-content')?.focus()}>Skip to content</a>
      <PaddleCursor />
      <AppRoutes />
    </Router>
  );
}

export default App;
