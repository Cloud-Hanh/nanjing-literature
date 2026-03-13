import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Timeline from './pages/Timeline';
import LiteraryMap from './pages/LiteraryMap';
import DataInsights from './pages/DataInsights';
import Strategies from './pages/Strategies';

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/"           element={<Home />} />
            <Route path="/timeline"   element={<Timeline />} />
            <Route path="/map"        element={<LiteraryMap />} />
            <Route path="/data"       element={<DataInsights />} />
            <Route path="/strategies" element={<Strategies />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
