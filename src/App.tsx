import { Route, Router, Switch } from 'wouter';
import { PaddleCursor } from './components/PaddleCursor';
import { Home } from './pages/home';
import Booking from './pages/booking';
import Privacy from './pages/privacy';
import Terms from './pages/terms';
import NotFound from './pages/not-found';

const base = import.meta.env.BASE_URL.replace(/\/$/, '');

function App() {
  return (
    <Router base={base}>
      <a href="#main-content" className="skip-link">Skip to content</a>
      <PaddleCursor />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/book" component={Booking} />
        <Route path="/privacy" component={Privacy} />
        <Route path="/terms" component={Terms} />
        <Route component={NotFound} />
      </Switch>
    </Router>
  );
}

export default App;
