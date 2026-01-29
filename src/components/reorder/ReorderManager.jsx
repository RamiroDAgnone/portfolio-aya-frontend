import { useEffect, useState } from "react";
import { authFetch } from "../../auth/authFetch";

import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
  useSortable
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";

import "./Reorder.css";

function SortableItem({ id, children }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id });

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className={`reorder-item ${isDragging ? "is-dragging" : ""}`}
      style={{
        transform: CSS.Transform.toString(transform),
        transition
      }}
    >
      {children}
    </div>
  );
}

// reorder manager
export default function ReorderManager({ apiBase, renderItem }) {
  const [items, setItems] = useState([]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  // load items
  useEffect(() => {
    authFetch(apiBase)
      .then(data => {
        setItems(Array.isArray(data) ? data : []);
      })
      .catch(err => {
        console.error("Error loading items:", err);
        setMessage({ type: "error", text: "Error cargando items" });
      });
  }, [apiBase]);

  const handleDragEnd = ({ active, over }) => {
    if (!over || active.id === over.id) return;

    setItems(prev => {
      const oldIndex = prev.findIndex(i => i._id === active.id);
      const newIndex = prev.findIndex(i => i._id === over.id);
      return arrayMove(prev, oldIndex, newIndex);
    });
  };

  const saveOrder = async () => {
    try {
      setSaving(true);
      setMessage(null);

      const ids = items.map(i => i._id);

      await authFetch(`${apiBase}/reorder`, {
        method: "PUT",
        body: JSON.stringify({ ids })
      });

      setMessage({ type: "success", text: "Orden guardado" });
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: err.message });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="reorder-manager">
      <h1>Reordenar</h1>

      {message && (
        <div className={`reorder-msg ${message.type}`}>
          {message.text}
        </div>
      )}

      <DndContext
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToWindowEdges]}
      >
        <SortableContext
          items={items.map(i => i._id)}
          strategy={rectSortingStrategy}
        >
          <div className="reorder-grid">
            {items.map(item => (
              <SortableItem key={item._id} id={item._id}>
                {renderItem(item)}
              </SortableItem>
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <button
        onClick={saveOrder}
        disabled={saving}
        className="reorder-button"
      >
        {saving ? "Guardando..." : "Guardar orden"}
      </button>
    </div>
  );
}