import { Route, Router, Switch } from 'wouter';
import { PaddleCursor } from './components/PaddleCursor';
import { Home } from './pages/home';
import Booking from './pages/booking';
import NotFound from './pages/not-found';

const base = import.meta.env.BASE_URL.replace(/\/$/, '');

function App() {
  return (
    <Router base={base}>
      <PaddleCursor />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/book" component={Booking} />
        <Route component={NotFound} />
      </Switch>
    </Router>
  );
}

export default App;
