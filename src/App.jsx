import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import Home from './pages/Home';
import StationDetail from './pages/StationDetail';
import About from './pages/About';
import FooterSection from './components/FooterSection';

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col h-screen overflow-hidden bg-slate-950 text-slate-100">
        <Header />
        <main className="flex-1 overflow-hidden flex flex-col relative">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/stations/:id" element={<StationDetail />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>
        <FooterSection/>
      </div>
    </BrowserRouter>
  );
}
