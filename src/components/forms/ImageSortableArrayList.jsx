import React, { useCallback, useState } from "react";
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

import { validateImageFile } from "../../utils/validateImageFile";
import { useSinglePreview } from "../../utils/previews/useSinglePreview";

function SortableWrapper({ item, children }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: item.id });

  return (
    <div
      ref={setNodeRef}
      className={`image-row ${isDragging ? "dragging" : ""}`}
      style={{
        transform: CSS.Transform.toString(transform),
        transition
      }}
    >
      <div className="drag-handle" {...attributes} {...listeners}>
        ☰
      </div>
      {children}
    </div>
  );
}

const ImageRowContent = React.memo(function ImageRowContent({
  item,
  onFileChange,
  onDescChange,
  onToggleRemove,
  onValidationChange
}) {
  const preview = useSinglePreview(item, 600);

  const [localDesc, setLocalDesc] = useState(item.description || "");
  const [error, setError] = useState(null);

  const handleFileChange = e => {
    const file = e.target.files[0];
    const validationError = validateImageFile(file);

    if (validationError) {
      setError(validationError);
      onValidationChange(item.id, true);
      return;
    }

    setError(null);
    onValidationChange(item.id, false);
    onFileChange(item.id, file);
  };


  const handleBlur = useCallback(() => {
    if (localDesc !== (item.description || "")) {
      onDescChange(item.id, localDesc);
    }
  }, [localDesc, item, onDescChange]);

  return (
    <>
      <div className="image-first-row">
        {preview && (
          <img
            src={preview}
            className="single-image-preview"
            alt=""
            loading="lazy"
            decoding="async"
          />
        )}

        {!item.remove && (
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />
        )}

        <button
          type="button"
          onClick={() => onToggleRemove(item.id)}
        >
          {item.remove ? "Deshacer" : "Eliminar"}
        </button>
      </div>

      {error && (
        <div className="image-error">
          {error}
        </div>
      )}

      {!item.remove && (
        <div className="image-second-row">
          <input
            type="text"
            placeholder="Descripción de la imágen (opcional)"
            value={localDesc}
            onChange={e => setLocalDesc(e.target.value)}
            onBlur={handleBlur}
          />
        </div>
      )}
    </>
  );
});


export default function ImageSortableArrayList({
  title,
  items = [],
  onFileChange,
  onDescChange,
  onToggleRemove,
  onAdd,
  onReorder,
  onValidationChange
}) {
  return (
    <div className="image-list">
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
          items={items.map(i => i.id)}
          strategy={verticalListSortingStrategy}
        >
          {items.map(item => (
            <SortableWrapper key={item.id} item={item}>
              <ImageRowContent
                item={item}
                onFileChange={onFileChange}
                onDescChange={onDescChange}
                onToggleRemove={onToggleRemove}
                onValidationChange={onValidationChange}
              />
            </SortableWrapper>
          ))}
        </SortableContext>
      </DndContext>

      <button type="button" onClick={onAdd}>
        + Agregar
      </button>
    </div>
  );
}
