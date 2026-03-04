import AdminList from "./AdminList";

export default function AdminBProjectList() {
  return (
    <AdminList
      title="Proyectos"
      endpoint="/bprojects/admin"
      createUrl="/admin/b/create"
      reorderUrl="/admin/b/reorder"
      publicUrl="/lado-b"
      editUrlBuilder={(p) => `/admin/b/edit/${p._id}`}
      imageField={(p) => p.graphics?.[0]}
    />
  );
}