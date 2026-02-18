import { Routes, Route, Outlet } from "react-router-dom";
import Header from "./components/Layout/Header/Header";
import Footer from "./components/Layout/Footer/Footer";
import ProtectedRoute from "./components/Utility/ProtectedRoute/ProtectedRoute";
import CompanyList from "./components/Company/CompanyList/CompanyList";
import CompanyDetail from "./components/Company/CompanyDetail/CompanyDetail"; // Import real component
import CompanyRegistration from "./components/Company/CompanyRegistration/CompanyRegistration"; // Import real component
import "./App.css";

// Page imports (Keep these until you build the actual login/register pages)
const Login = () => <div className="page-content"><h2>Login</h2></div>;
const Register = () => <div className="page-content"><h2>Register</h2></div>;

const Layout = () => {
  return (
    <div className="app-container">
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
        {/* Index route: Shows the list immediately on the home page */}
        <Route index element={<CompanyList />} />

        {/* Public Routes */}
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />

        {/* Updated path for better SEO/naming consistency */}
        <Route path="companies/:id" element={<CompanyDetail />} />

        {/* Registration page */}
        <Route path="register-company" element={<CompanyRegistration />} />

        {/* Protected Routes */}
        <Route
          path="add-review/:companyId"
          element={
            <ProtectedRoute>
              {/* This would be your full Review form page */}
              <div className="page-content"><h2>Write a Review</h2></div>
            </ProtectedRoute>
          }
        />

        {/* Catch-all for 404s */}
        <Route path="*" element={<div className="page-content"><h2>404: Page Not Found</h2></div>} />
      </Route>
    </Routes>
  );
}

export default App;
