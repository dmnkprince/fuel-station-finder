import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import Home from './pages/Home';
import StationDetail from './pages/StationDetail';

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <Header />
        <main className="app-main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/stations/:id" element={<StationDetail />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
