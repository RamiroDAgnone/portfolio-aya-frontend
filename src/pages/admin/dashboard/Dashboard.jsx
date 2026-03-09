import { useEffect, useState } from "react";
import { UseAuth } from "../../../auth/AuthProvider";
import { API_URL } from "../../../auth/constants";
import { authFetch } from "../../../auth/authFetch";

import DashboardSection from "./DashboardSection";
import AdvancedOptions from "./AdvancedOptions";

import "./Dashboard.css";

const Dashboard = () => {
  const auth = UseAuth();
  const user = auth.getUser();
  
  const [stats, setStats] = useState({
    works: { total: 0, published: 0, draft: 0 },
    bProjects: { total: 0, published: 0, draft: 0 }
  });

  useEffect(() => {
    authFetch("/dashboard/stats")
      .then(setStats)
      .catch(console.error);
  }, []);

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

        <header className="dashboard-header">
          <h2>Admin Dashboard</h2>
          {user && <span className="dashboard-user">@{user.username}</span>}
        </header>
        
        <div className="dashboard-options">
          <div className="dashboard-sections">

            <DashboardSection
              title="Trabajos"
              stats={stats?.works}
              links={[
                { to: "/admin/works", label: "Ver todos los trabajos" },
                { to: "/admin/work/create", label: "Crear un nuevo trabajo" },
                { to: "/admin/work/reorder", label: "Reordenar trabajos" }
              ]}
            />

            <DashboardSection
              title="Lado B"
              stats={stats?.bProjects}
              links={[
                { to: "/admin/b", label: "Ver todos los proyectos del lado B" },
                { to: "/admin/b/create", label: "Crear un proyecto del lado B" },
                { to: "/admin/b/reorder", label: "Reordenar proyectos" }
              ]}
            />

            <DashboardSection
              title="Dupla"
              links={[
                { to: "/admin/team/edit/696548f9c67b108b21b7e176", label: "Editar perfil de Agus" },
                { to: "/admin/team/edit/696549bfc67b108b21b7e186", label: "Editar perfil de Ana" }
              ]}
            />

            <DashboardSection
              title="Páginas"
              links={[
                { to: "/admin/page/edit", label: "Editar una Página" },
                { to: "/admin/decorations", label: "Editar Decoraciones" }
              ]}
            />
            
          </div>
            
          <AdvancedOptions />
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