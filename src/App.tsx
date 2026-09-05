import { Route, Router, Switch } from 'wouter';
import { memoryLocation } from 'wouter/memory-location';
import { PaddleCursor } from './components/PaddleCursor';
import { Home } from './pages/home';
import Booking from './pages/booking';
import Privacy from './pages/privacy';
import Terms from './pages/terms';
import NotFound from './pages/not-found';

const base = import.meta.env.BASE_URL.replace(/\/$/, '');

// Standalone single-file builds (VITE_MEMORY_ROUTER=1) are served from an
// unknown path, so path-based routing would always fall through to the 404
// route. An in-memory location starts at "/" wherever the file is opened, and
// unlike hash routing it leaves the in-page "#section" anchors alone.
const standalone = import.meta.env.VITE_MEMORY_ROUTER === '1';
const memoryHook = standalone ? memoryLocation({ path: '/', record: true }).hook : undefined;

function App() {
  return (
    <Router base={standalone ? '' : base} hook={memoryHook}>
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
