import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { authFetch } from "../../../auth/authFetch";
import AdminCard from "./AdminCard";
import "./AdminLists.css"
export default function AdminList({
    title,
    endpoint,
    createUrl,
    reorderUrl,
    publicUrl,
    editUrlBuilder,
    viewUrlBuilder,
    imageField = "cover"
    }) {

    const [items, setItems] = useState([]);
    const [overlayId, setOverlayId] = useState(null);
    const [statusFilter, setStatusFilter] = useState("");

    useEffect(() => {
        authFetch(endpoint).then(setItems);
    }, [endpoint]);

    const filteredItems = statusFilter
        ? items.filter(i => i.status === statusFilter)
        : items;

    return (
        <div className="admin-works-page">
        <header className="admin-works-header">
            <h2>{title}</h2>

            <div className="admin-actions">
            <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="admin-btn select-filter"
            >
                <option value="">Todos</option>
                <option value="draft">Borrador</option>
                <option value="published">Publicado</option>
                <option value="archived">Archivado</option>
            </select>

            {createUrl && (
                <Link to={createUrl} className="admin-btn primary">
                Crear
                </Link>
            )}

            {reorderUrl && (
                <Link to={reorderUrl} className="admin-btn primary">
                Reordenar
                </Link>
            )}

            {publicUrl && (
                <Link to={publicUrl} className="admin-btn secondary" target="_blank">
                Ver público
                </Link>
            )}
            <Link to="/admin/dashboard" className="admin-btn back">
                Volver al Dashboard
            </Link>
            </div>
        </header>

        <div className="works">
            {filteredItems.map(item => (
            <AdminCard
                key={item._id}                
                item={item}
                image={
                    typeof imageField === "function"
                        ? imageField(item)
                        : item[imageField]
                }

                title={item.title}
                status={item.status}
                editUrl={editUrlBuilder(item)}
                viewUrl={viewUrlBuilder?.(item)}
                overlayId={overlayId}
                setOverlayId={setOverlayId}
            />
            ))}
        </div>
        </div>
    );
}