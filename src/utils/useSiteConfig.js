import { useEffect, useState } from "react";
import { authFetch } from "../../auth/authFetch";

export function useSiteConfig() {
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authFetch("/pages/site-status")
      .then(data => {
        setMaintenanceMode(Boolean(data.maintenanceMode));
      })
      .finally(() => setLoading(false));
  }, []);

  const updateMaintenance = async (value) => {
    await authFetch("/pages/admin/site-config", {
      method: "PUT",
      body: JSON.stringify({ maintenanceMode: value })
    });

    setMaintenanceMode(value);
  };

  return {
    maintenanceMode,
    setMaintenanceMode: updateMaintenance,
    loading
  };
}