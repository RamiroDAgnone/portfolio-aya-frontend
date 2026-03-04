import { useEffect, useState } from "react";
import { API_URL } from "../../../auth/constants";
import { authFetch } from "../../../auth/authFetch";
import MaintenanceToggle from "./MaintenanceToggle";
import { FaCog } from "react-icons/fa";

function AdvancedOptions() {
  const [open, setOpen] = useState(false);
  const [maintenance, setMaintenance] = useState(false);
  const [loadingMaintenance, setLoadingMaintenance] = useState(true);

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

  async function handleMaintenanceChange(nextValue) {
    const confirmed = window.confirm(
      nextValue
        ? "⚠️ Vas a poner el sitio en modo mantenimiento.\nEl público no podrá acceder.\n\n¿Continuar?"
        : "El sitio volverá a estar público.\n\n¿Continuar?"
    );

    if (!confirmed) return;

    try {
      setLoadingMaintenance(true);

      await authFetch("/pages/admin/site-config", {
        method: "PUT",
        body: JSON.stringify({ maintenanceMode: nextValue })
      });

      setMaintenance(nextValue);
    } catch (err) {
      console.error(err);
      alert("No se pudo actualizar el modo mantenimiento");
    } finally {
      setLoadingMaintenance(false);
    }
  }

  return (
    <section className="dashboard-advanced">
      <button
        className="advanced-toggle"
        onClick={() => setOpen(!open)}
      >
        <FaCog /> Opciones avanzadas
      </button>

      {open && (
        <div className="advanced-panel">
          <MaintenanceToggle
            value={maintenance}
            onChange={handleMaintenanceChange}
            disabled={loadingMaintenance}
          />
        </div>
      )}
    </section>
  );
}

export default AdvancedOptions;