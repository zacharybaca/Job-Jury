import { Routes, Route, Outlet, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import NavBar from './components/Layout/NavBar/NavBar';
import Footer from './components/Layout/Footer/Footer';
import ProtectedRoute from './components/Utility/ProtectedRoute/ProtectedRoute';
import CompanyList from './components/Company/CompanyList/CompanyList';
import CompanyDetail from './components/Company/CompanyDetail/CompanyDetail';
import CompanyRegistration from './components/Company/CompanyRegistration/CompanyRegistration';
import Login from './components/Auth/Login/Login';
import Register from './components/Auth/Register/Register';
import AdminRoute from './components/Utility/AdminRoute/AdminRoute';
import AdminDashboard from './components/Admin/AdminDashboard/AdminDashboard';
import Home from './components/Pages/Home/Home';
import WallpaperSelector from './components/Layout/WallpaperSelector/WallpaperSelector';
import './App.css';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// Layout handles the global structure and conditional Wallpaper visibility
const Layout = ({ wallpapers, selectedWallpaper, onSelect }) => {
  const { pathname } = useLocation();
  const isAuthPage = ['/login', '/register'].includes(pathname);

  return (
    <div className="app-container">
      <ScrollToTop />
      <NavBar />

      {!isAuthPage && (
        <WallpaperSelector
          wallpapers={wallpapers}
          currentWallpaper={selectedWallpaper}
          onSelect={onSelect}
        />
      )}

      <main className="main-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

function App() {
  const { pathname } = useLocation();

  const [wallpapers] = useState([
    { id: 1, url: 'assets/wallpaper_backgrounds/brick-on-building.jpg', name: 'Brick on Building' },
    { id: 2, url: 'assets/wallpaper_backgrounds/cardboard-bg.jpg', name: 'Cardboard Background' },
    { id: 3, url: 'assets/wallpaper_backgrounds/clear-blue-bg.jpg', name: 'Clear Blue' },
    { id: 4, url: 'assets/wallpaper_backgrounds/crumbled-notebook-paper.jpg', name: 'Crumpled Notebook' },
  ]);

  const [selectedWallpaper, setSelectedWallpaper] = useState(() => {
    const saved = localStorage.getItem('user-wallpaper');
    return saved ? JSON.parse(saved) : wallpapers[0];
  });

  useEffect(() => {
    const isAuthPage = ['/login', '/register'].includes(pathname);

    if (selectedWallpaper && !isAuthPage) {
      document.body.style.backgroundImage = `url(${selectedWallpaper.url})`;
      document.body.style.backgroundSize = 'cover';
      document.body.style.backgroundAttachment = 'fixed';
      document.body.style.backgroundPosition = 'center';
    } else {
      // Clean slate for Auth pages
      document.body.style.backgroundImage = 'none';
      document.body.style.backgroundColor = '#0f172a';
    }
  }, [selectedWallpaper, pathname]);

  const handleSelect = (wallpaper) => {
    setSelectedWallpaper(wallpaper);
  };

  return (
    <Routes>
      <Route path="/" element={
        <Layout
          wallpapers={wallpapers}
          selectedWallpaper={selectedWallpaper}
          onSelect={handleSelect}
        />
      }>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="companies/:id" element={<CompanyDetail />} />

        <Route path="register-company" element={
          <ProtectedRoute>
            <CompanyRegistration />
          </ProtectedRoute>
        } />

        <Route element={<AdminRoute />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Route>

        <Route path="*" element={
          <div className="page-content">
            <h2>404: Verdict Not Found</h2>
          </div>
        } />
      </Route>
    </Routes>
  );
}

export default App;
