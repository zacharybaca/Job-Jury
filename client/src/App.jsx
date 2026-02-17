import { Routes, Route, Outlet } from "react-router-dom";
import Header from "./components/Layout/Header/Header";
import Footer from "./components/Layout/Footer/Footer";
import ProtectedRoute from "./components/Utility/ProtectedRoute/ProtectedRoute";
import "./App.css";

// Page imports would eventually go here
const Home = () => <div className="page-content"><h2>Welcome to Job-Jury</h2></div>;
const Login = () => <div className="page-content"><h2>Login</h2></div>;
const Register = () => <div className="page-content"><h2>Register</h2></div>;
const CompanyDetail = () => <div className="page-content"><h2>Company Details</h2></div>;
const ReviewForm = () => <div className="page-content"><h2>Write a Review</h2></div>;

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
        {/* Public Routes */}
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="company/:id" element={<CompanyDetail />} />

        {/* Protected Routes */}
        <Route
          path="add-review/:companyId"
          element={
            <ProtectedRoute>
              <ReviewForm />
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
