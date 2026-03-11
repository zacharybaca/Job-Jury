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
import MySubmissions from './components/Auth/MySubmissions/MySubmissions';
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
    {
      id: 1,
      url: 'assets/wallpaper_backgrounds/brick-on-building.jpg',
      name: 'Urban Brick',
    },
    {
      id: 2,
      url: 'assets/wallpaper_backgrounds/cardboard-bg.jpg',
      name: 'Textured Cardboard',
    },
    {
      id: 3,
      url: 'assets/wallpaper_backgrounds/clear-blue-bg.jpg',
      name: 'Clear Blue Sky',
    },
    {
      id: 4,
      url: 'assets/wallpaper_backgrounds/crumbled-notebook-paper.jpg',
      name: 'Drafting Paper',
    },
    {
      id: 5,
      url: 'assets/wallpaper_backgrounds/evening-clouds-bg.jpg',
      name: 'Evening Dusk',
    },
    {
      id: 6,
      url: 'assets/wallpaper_backgrounds/grey-color-bg.jpg',
      name: 'Minimalist Grey',
    },
    {
      id: 7,
      url: 'assets/wallpaper_backgrounds/horizontal-hardwood-bg.jpg',
      name: 'Horizontal Hardwood',
    },
    {
      id: 8,
      url: 'assets/wallpaper_backgrounds/light-cloud-sky-bg.jpg',
      name: 'Morning Clouds',
    },
    {
      id: 9,
      url: 'assets/wallpaper_backgrounds/light-colored-brick-bg.jpg',
      name: 'Light Brick',
    },
    {
      id: 10,
      url: 'assets/wallpaper_backgrounds/light-hardwood-bg.jpg',
      name: 'Light Hardwood',
    },
    {
      id: 11,
      url: 'assets/wallpaper_backgrounds/light-sky-bg.jpg',
      name: 'Bright Sky',
    },
    {
      id: 12,
      url: 'assets/wallpaper_backgrounds/minimal-office-bg.jpg',
      name: 'Minimal Office',
    },
    {
      id: 13,
      url: 'assets/wallpaper_backgrounds/old-used-hardwood-bg.jpg',
      name: 'Vintage Hardwood',
    },
    {
      id: 14,
      url: 'assets/wallpaper_backgrounds/perfect-aligned-brick-bg.jpg',
      name: 'Aligned Brick',
    },
    {
      id: 15,
      url: 'assets/wallpaper_backgrounds/personal-office-alternate-bg.jpg',
      name: 'Executive Suite',
    },
    {
      id: 16,
      url: 'assets/wallpaper_backgrounds/personal-office-bg.jpg',
      name: 'Personal Office',
    },
    {
      id: 17,
      url: 'assets/wallpaper_backgrounds/pink-clouds-bg.jpg',
      name: 'Pink Clouds',
    },
    {
      id: 18,
      url: 'assets/wallpaper_backgrounds/red-orange-bg.jpg',
      name: 'Vibrant Sunset',
    },
    {
      id: 19,
      url: 'assets/wallpaper_backgrounds/red-orange-pastel-bg.jpg',
      name: 'Pastel Sunset',
    },
    {
      id: 20,
      url: 'assets/wallpaper_backgrounds/sand-ripples-bg.jpg',
      name: 'Sand Ripples',
    },
    {
      id: 21,
      url: 'assets/wallpaper_backgrounds/siding.jpg',
      name: 'Classic Siding',
    },
    {
      id: 22,
      url: 'assets/wallpaper_backgrounds/water-bubbles-bg.jpg',
      name: 'Water Bubbles',
    },
    {
      id: 23,
      url: 'assets/wallpaper_backgrounds/yellow-pastel-color.jpg',
      name: 'Mellow Yellow',
    },
  ]);

  const [selectedWallpaper, setSelectedWallpaper] = useState(() => {
    const saved = localStorage.getItem('user-wallpaper');
    return saved ? JSON.parse(saved) : wallpapers[0];
  });

  useEffect(() => {
    const isAuthPage = ['/login', '/register'].includes(pathname);

    if (selectedWallpaper) {
      localStorage.setItem('user-wallpaper', JSON.stringify(selectedWallpaper));
    }

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

        <Route
          path="register-company"
          element={
            <ProtectedRoute>
              <CompanyRegistration />
            </ProtectedRoute>
          }
        />

        <Route path="my-submissions" element={
          <ProtectedRoute>
            <MySubmissions />
          </ProtectedRoute>
        }
        />
        
        <Route element={<AdminRoute />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Route>

        <Route
          path="*"
          element={
            <div className="page-content">
              <h2>404: Verdict Not Found</h2>
            </div>
          }
        />
      </Route>
    </Routes>
  );
}

export default App;
