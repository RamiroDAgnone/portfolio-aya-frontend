export async function uploadImages({
  workId,
  files,
  uploadImage,
  concurrency = 2
}) {
  const taskFns = [];

  /* ---------- recorrer fields dinámicamente ---------- */

  for (const field in files) {
    const value = files[field];

    // single image
    if (value instanceof File) {
      taskFns.push(async () => {
        const img = await uploadImage(workId, value, field);
        return { field, img };
      });
      continue;
    }

    // array images
    if (Array.isArray(value)) {
      value.forEach(item => {
        if (item.remove) return;

        if (item.file) {
          taskFns.push(async () => {
            const img = await uploadImage(workId, item.file, field);
            return {
              field,
              tempId: item.id,
              img: {
                ...img,
                description: item.description || "",
                order: item.order
              }
            };
          });
        }
      });
    }
  }

  // concurrency runner
  const results = new Array(taskFns.length);
  let nextIndex = 0;

  const worker = async () => {
    while (true) {
      const i = nextIndex++;
      if (i >= taskFns.length) break;
      try {
        const res = await taskFns[i]();
        results[i] = { status: "fulfilled", value: res };
      } catch (err) {
        results[i] = { status: "rejected", reason: err };
      }
    }
  };

  // lanzar N workers
  await Promise.all(Array(Math.min(concurrency, taskFns.length)).fill().map(() => worker()));

  // collect uploaded images
  const uploadedByField = {};
  const updates = {};

  for (const r of results) {
    if (!r) continue;
    if (r.status === "fulfilled") {
      const payload = r.value;
      if (!uploadedByField[payload.field]) uploadedByField[payload.field] = {};
      if (payload.tempId) {
        uploadedByField[payload.field][payload.tempId] = payload.img;
      } else {
        updates[payload.field] = payload.img;
      }
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
          return uploadedByField[field]?.[item.id] ?? null;
        }

        const base = item.current ?? item;
        return {
          ...base,
          description: item.description ?? "",
          order: item.order
        };
      }).filter(Boolean);
  }

  return updates;
}