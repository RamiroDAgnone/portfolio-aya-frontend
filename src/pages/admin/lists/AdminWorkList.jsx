import AdminList from "./AdminList";

export default function AdminWorkList() {
  return (
    <AdminList
      title="Trabajos"
      endpoint="/works/admin"
      createUrl="/admin/work/create"
      reorderUrl="/admin/work/reorder"
      publicUrl="/"
      editUrlBuilder={(w) => `/admin/work/edit/${w._id}`}
      viewUrlBuilder={(w) => `/trabajos/${w.slug}`}
    />
  );
}
