export async function uploadImages({
  workId,
  files,
  uploadImage
}) {
  const uploadTasks = [];
  const updates = {};

  /* ---------- recorrer fields dinámicamente ---------- */

  for (const field in files) {
    const value = files[field];

    // single image
    if (value instanceof File) {
      uploadTasks.push(
        uploadImage(workId, value, field)
          .then(img => ({ field, img }))
      );
      continue;
    }

    // array images
    if (Array.isArray(value)) {
      updates[field] = [];
      value.forEach(item => {
        if (item.remove) return;

        if (item.file) {
          uploadTasks.push(
            uploadImage(workId, item.file, field)
              .then(img => ({
                field,
                tempId: item.id,
                img: {
                  ...img,
                  description: item.description || "",
                  order: item.order
                }
              }))
          );
        }
      });
    }
  }

  const results = await Promise.all(uploadTasks);

  // collect uploaded images
  const uploadedByField = {};

  for (const r of results) {
    if (!uploadedByField[r.field]) {
      uploadedByField[r.field] = {};
    }
    if (r.tempId) {
      uploadedByField[r.field][r.tempId] = r.img;
    } else {
      updates[r.field] = r.img;
    }
  }

  // rebuild arrays
  for (const field in files) {
    const value = files[field];
    if (!Array.isArray(value)) continue;

    updates[field] = value
      .filter(i => !i.remove)
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
      .map(item => {
        if (item.file) {
          return uploadedByField[field]?.[item.id];
        }
        
        const base = item.current ?? item;
        return {
          ...base,
          description: item.description ?? "",
          order: item.order
        };
      });
  }

  return updates;
}