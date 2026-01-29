import {
  DndContext,
  closestCenter
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";

function SortableRow({ item, children }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };

  return (
    <div ref={setNodeRef} style={style} className="video-row">
      <div className="drag-handle" {...attributes} {...listeners}>
        ☰
      </div>
      {children}
    </div>
  );
}

export default function VideoFields({
  title,
  videos = [],
  onAdd,
  onChange,
  onRemove,
  onReorder
}) {
  return (
    <div className="video-list">
      <h3>{title}</h3>

      <DndContext
        collisionDetection={closestCenter}
        modifiers={[restrictToWindowEdges]}
        onDragEnd={({ active, over }) => {
          if (!over || active.id === over.id) return;
          onReorder(active.id, over.id);
        }}
      >
        <SortableContext
          items={videos.map(v => v.id)}
          strategy={verticalListSortingStrategy}
        >
          {videos.map(video => (
            <SortableRow key={video.id} item={video}>
              <input
                type="text"
                placeholder="URL del video"
                value={video.url || ""}
                onChange={e =>
                  onChange(video.id, e.target.value)
                }
              />

              <button
                type="button"
                onClick={() => onRemove(video.id)}
              >
                Eliminar
              </button>
            </SortableRow>
          ))}
        </SortableContext>
      </DndContext>

      <button type="button" onClick={onAdd}>
        + Agregar video
      </button>
    </div>
  );
}