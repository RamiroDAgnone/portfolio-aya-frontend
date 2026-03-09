import ReorderManager from "./ReorderManager";
import Card from "../../works/Card";

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