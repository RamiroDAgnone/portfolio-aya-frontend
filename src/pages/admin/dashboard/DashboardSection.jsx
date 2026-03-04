import { Link } from "react-router-dom";

function DashboardSection({ title, stats, links, children }) {
    return (
        <section className="dashboard-section">
        <div className="dashboard-section-header">
            <h3>{title}</h3>
            {stats && (
            <div className="dashboard-stats">
                <span>{stats.total} total</span>
                <span>{stats.published} publicados</span>
                <span>{stats.draft} borrador</span>
            </div>
            )}

        </div>

        {links && (
            <ul className="dashboard-links">
            {links.map((link) => (
                <li key={link.to}>
                <Link to={link.to}>{link.label}</Link>
                </li>
            ))}
            </ul>
        )}

        {children}
        </section>
    );
}

export default DashboardSection;