import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import Home from './pages/Home';
import StationDetail from './pages/StationDetail';
import About from './pages/About';
import AdminDashboard from './pages/AdminDashboard';
import ManagerDashboard from './pages/ManagerDashboard';
import FooterSection from './components/FooterSection';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="flex flex-col h-screen overflow-hidden bg-slate-950 text-slate-100">
          <Header />
          <main className="flex-1 overflow-hidden flex flex-col relative">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/stations/:id" element={<StationDetail />} />
              <Route path="/about" element={<About />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/manager" element={<ManagerDashboard />} />
            </Routes>
          </main>
          <FooterSection />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}
