import { Routes, Route, Outlet, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Header from './components/Layout/Header/Header';
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

// 1. Update Layout to accept props
const Layout = ({ wallpapers, selectedWallpaper, onSelect }) => {
  return (
    <div className="app-container">
      <ScrollToTop />
      <NavBar />
      {/* Now these variables are defined! */}
      <WallpaperSelector
        wallpapers={wallpapers}
        currentWallpaper={selectedWallpaper}
        onSelect={onSelect}
      />
      <main className="main-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

function App() {
  const [wallpapers] = useState([
    { id: 1, url: '/bg-dark.jpg', name: 'Jury Night' },
    { id: 2, url: '/bg-light.jpg', name: 'Emerald Day' },
  ]);

  const [selectedWallpaper, setSelectedWallpaper] = useState(() => {
    const saved = localStorage.getItem('user-wallpaper');
    return saved ? JSON.parse(saved) : wallpapers[0];
  });

  useEffect(() => {
    if (selectedWallpaper) {
      localStorage.setItem('user-wallpaper', JSON.stringify(selectedWallpaper));
      document.body.style.backgroundImage = `url(${selectedWallpaper.url})`;
      document.body.style.backgroundSize = 'cover';
      document.body.style.backgroundAttachment = 'fixed';
    }
  }, [selectedWallpaper]);

  const handleSelect = (wallpaper) => {
    setSelectedWallpaper(wallpaper);
  };

  return (
    <Routes>
      {/* 2. Pass the props into the Layout element here */}
      <Route
        path="/"
        element={
          <Layout
            wallpapers={wallpapers}
            selectedWallpaper={selectedWallpaper}
            onSelect={handleSelect}
          />
        }
      >
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="companies/:id" element={<CompanyDetail />} />

        <Route path="register-company" element={
          <ProtectedRoute>
            <CompanyRegistration />
          </ProtectedRoute>
        } />

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
