import { Link } from "react-router-dom";
import { UseAuth } from "../auth/AuthProvider";
import "./Components.css";

export default function Footer() {
  const { isAuthenticated, user } = UseAuth();
  const isAdmin = isAuthenticated && user?.role === "admin";
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-social">
          <a href="https://www.behance.net/AgusXAna" target="_blank" rel="noreferrer">Behance</a>
          {/*<a href="/" target="_blank" rel="noreferrer">Linkedin</a>*/}
          {/*<a href="/" target="_blank" rel="noreferrer">Instagram</a>*/}
        </div>

        <div className="footer-links">
          <Link to="/">Inicio</Link>
          <Link to="/la-dupla">La Dupla</Link>
          <Link to="/lado-b">Lado B</Link>
          {isAdmin && (
            <Link to="/admin/dashboard" className="admin-link">
              Admin
            </Link>
          )}
        </div>
      </div>
      <span className="footer-copy">
          © {new Date().getFullYear()} · Todos los derechos reservados
      </span>
    </footer>
  );
}