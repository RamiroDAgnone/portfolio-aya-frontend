import { Link } from "react-router-dom";
import "./Components.css";

export default function Navbar() {
  return (
    <nav className="navbar">
      <ul>
        <li className="nav-left">
          <Link to="/la-dupla">La Dupla</Link>
        </li>

        <li className="nav-center">
          <Link to="/">
            A&A            
          </Link>
        </li>

        <li className="nav-right">
          <Link to="/lado-b">Lado B</Link>
        </li>
      </ul>
    </nav>
  );
}