import { Link } from "react-router-dom";
import { UseAuth } from "../auth/AuthProvider";
import { useState } from "react";
import { IoIosMail, IoIosMailOpen } from "react-icons/io";
import "./Components.css";

export default function Footer({ onCookieClick }) {
  const { isAuthenticated, user } = UseAuth();
  const isAdmin = isAuthenticated && user?.role === "admin";
  const [copied, setCopied] = useState(false);
  const email = "agusyanapublicidad@gmail.com"

  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-social">
          <a href="https://www.behance.net/AgusXAna" target="_blank" rel="noreferrer">Behance</a>
          <span
              className={` email ${copied ? "copied" : ""}`}
              onClick={() => {
                  navigator.clipboard.writeText(email);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 1500);
              }}
          > 
              {copied ? <IoIosMailOpen /> : <IoIosMail />}
              {copied ? "Copiado!" : email}
          </span>
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

      <div className="footer-bottom">
        <span className="footer-copy">
            © {new Date().getFullYear()} · Todos los derechos reservados
        </span>
        
        <div className="footer-cookie" onClick={onCookieClick}>
          <img src="/assets/img/cookie.png" alt="cookie?" />
        </div>
      
      </div>
    </footer>
  );
}