import { Routes, Route, Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Header from "./components/Layout/Header/Header";
import Footer from "./components/Layout/Footer/Footer";
import ProtectedRoute from "./components/Utility/ProtectedRoute/ProtectedRoute";
import CompanyList from "./components/Company/CompanyList/CompanyList";
import CompanyDetail from "./components/Company/CompanyDetail/CompanyDetail";
import CompanyRegistration from "./components/Company/CompanyRegistration/CompanyRegistration";
import Login from "./components/Auth/Login/Login";
import Register from "./components/Auth/Register/Register";
import "./App.css";

// Scroll to top on every route change
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
      <Header />
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
        {/* Home / Company Feed */}
        <Route index element={<CompanyList />} />

        {/* Auth Routes */}
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />

        {/* Company Routes */}
        <Route path="companies/:id" element={<CompanyDetail />} />
        <Route path="register-company" element={<CompanyRegistration />} />

        {/* Protected Actions */}
        <Route
          path="companies/:companyId/add-review"
          element={
            <ProtectedRoute>
              {/* Replace this with a dedicated ReviewFormPage if needed */}
              <div className="page-content"><h2>Submit Your Verdict</h2></div>
            </ProtectedRoute>
          }
        />

        {/* 404 Route */}
        <Route path="*" element={<div className="page-content"><h2>404: Verdict Not Found</h2></div>} />
      </Route>
    </Routes>
  );
}

export default App;
