import { useEffect, useState } from "react";
import { UseAuth } from "../../auth/AuthProvider";
import { Link } from "react-router-dom";
import { API_URL } from "../../auth/constants";
import { authFetch } from "../../auth/authFetch";
import MaintenanceToggle from "./MaintenanceToggle";

import "./Admin.css";

const Dashboard = () => {
  const auth = UseAuth();
  const user = auth.getUser();
  
  const [maintenance, setMaintenance] = useState(false);
  const [loadingMaintenance, setLoadingMaintenance] = useState(true);

  // load maintenance mode status
  useEffect(() => {
    async function loadStatus() {
      try {
        const res = await fetch(`${API_URL}/pages/site-status`, {
          credentials: "include"
        });

        const data = await res.json();
        setMaintenance(data.maintenanceMode);
      } catch (err) {
        console.error("Error loading site status", err);
      } finally {
        setLoadingMaintenance(false);
      }
    }

    loadStatus();
  }, []);

  // management mode toggle
  async function handleMaintenanceChange(nextValue) {
    const confirmed = window.confirm(
      nextValue
        ? "⚠️ Vas a poner el sitio en modo mantenimiento.\nEl público no podrá acceder.\n\n¿Continuar?"
        : "El sitio volverá a estar público.\n\n¿Continuar?"
    );

    if (!confirmed) return;

    try {
      setLoadingMaintenance(true);

      const res = await authFetch("/pages/admin/site-config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ maintenanceMode: nextValue })
      });

      if (!res.ok) {
        throw new Error("Failed to update maintenance mode");
      }

      setMaintenance(nextValue);
    } catch (err) {
      console.error(err);
      alert("No se pudo actualizar el modo mantenimiento");
    } finally {
      setLoadingMaintenance(false);
    }
  }

  // sign out
  async function handleSignOut(e) {
    e.preventDefault();

    try {
      const response = await fetch(`${API_URL}/signout`, {
        method: "DELETE",
        credentials: "include"
      });

      if (response.ok) {
        auth.signOut();
      }
    } catch (error) {
      console.error("Error al cerrar sesión", error);
    }
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-card">

        <header className="dashboard-header">
          <h2>Admin Dashboard</h2>
          {user && <span className="dashboard-user">@{user.username}</span>}
        </header>

        <section className="dashboard-section">
          <h3>Trabajos</h3>
          <ul>
            <li><Link to="/admin/works">Ver todos</Link></li>
            <li><Link to="/admin/work/create">Crear</Link></li>
            <li><Link to="/admin/work/reorder">Reordenar</Link></li>
          </ul>
        </section>

        <section className="dashboard-section">
          <h3>Lado B</h3>
          <ul>
            <li><Link to="/admin/b/create">Crear</Link></li>
            <li><Link to="/admin/b/edit">Editar</Link></li>
            <li><Link to="/admin/b/reorder">Reordenar</Link></li>
          </ul>
        </section>

        <section className="dashboard-section">
          <h3>Equipo</h3>
          <ul>
            <li>
              <Link to="/admin/team/edit/696548f9c67b108b21b7e176">
                Editar Agus
              </Link>
            </li>
            <li>
              <Link to="/admin/team/edit/696549bfc67b108b21b7e186">
                Editar Ana
              </Link>
            </li>
          </ul>
        </section>

        <section className="dashboard-section">
          <h3>Páginas</h3>
          <ul>
            <li><Link to="/admin/page/create">Crear</Link></li>
            <li><Link to="/admin/page/edit">Editar</Link></li>
          </ul>
        </section>
        
        <section className="dashboard-section">
          <h3>Sitio</h3>
          <MaintenanceToggle
            value={maintenance}
            onChange={handleMaintenanceChange}
            disabled={loadingMaintenance}
          />
        </section>

        <footer className="dashboard-footer">
          <button
            className="logout-btn"
            onClick={handleSignOut}
          >
            Cerrar sesión
          </button>
        </footer>

      </div>
    </div>
  );
};

export default Dashboard;