import ReorderManager from "../../components/reorder/ReorderManager";
import Card from "../../pages/works/Card";

export default function WorksReorderPage() {
  return (
      <ReorderManager
        apiBase="/works/admin"
        renderItem={(work) => (
            <Card
              id={work._id}
              title={work.title}
              cover={work.cover}
            />
        )}
      />
  );
}