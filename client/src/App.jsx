import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import "./App.css";

// Placeholder components for pages (until you create real ones in src/pages)
const Home = () => <div className="page-content"><h2>Home Page</h2><p>Welcome to the MERN Starter.</p></div>;
const Login = () => <div className="page-content"><h2>Login</h2><p>Login form goes here.</p></div>;
const Register = () => <div className="page-content"><h2>Register</h2><p>Register form goes here.</p></div>;

// The Layout Component: Wraps pages with Header and Footer
const Layout = () => {
  return (
    <div className="app-container">
      <Header />
      <main className="main-content">
        {/* Outlet renders the child route's element (e.g., Home, Login) */}
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

function App() {
  return (
      <Routes>
        {/* Wrap all routes in the Layout */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />

          {/* Catch-all for 404s */}
          <Route path="*" element={<div className="page-content"><h2>404: Page Not Found</h2></div>} />
        </Route>
      </Routes>
  );
}

export default App;
