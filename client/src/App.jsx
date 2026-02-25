import { Routes, Route, Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Header from './components/Layout/Header/Header';
import NavBar from './components/Layout/NavBar/NavBar';
import Footer from './components/Layout/Footer/Footer';
import ProtectedRoute from './components/Utility/ProtectedRoute/ProtectedRoute';
import CompanyList from './components/Company/CompanyList/CompanyList';
import CompanyDetail from './components/Company/CompanyDetail/CompanyDetail';
import CompanyRegistration from './components/Company/CompanyRegistration/CompanyRegistration';
import Login from './components/Auth/Login/Login';
import Register from './components/Auth/Register/Register';
import './App.css';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const Layout = () => {
  return (
    <div className="app-container">
      <ScrollToTop />
      <NavBar />
      <main className="main-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Public Routes */}
        <Route index element={<CompanyList />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="companies/:id" element={<CompanyDetail />} />

        {/* Protected Company Routes */}
        <Route
          path="register-company"
          element={
            <ProtectedRoute>
              <CompanyRegistration />
            </ProtectedRoute>
          }
        />

        {/* Protected Review Actions */}
        <Route
          path="companies/:companyId/add-review"
          element={
            <ProtectedRoute>
              <div className="page-content">
                <h2>Submit Your Verdict</h2>
                {/* Your review form component would go here */}
              </div>
            </ProtectedRoute>
          }
        />

        {/* 404 Route */}
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
