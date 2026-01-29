import { useState } from "react";
import { authFetch } from "../auth/authFetch";
import { MAX_IMAGE_SIZE } from "../auth/constants";
import { reorderByIndex } from "./orderUtils";

const genId = () =>
  (typeof crypto !== "undefined" && crypto.randomUUID)
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);

const normalizeArray = (items = []) =>
  [...items]
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .map((img, index) => ({
      id: genId(),
      current: img ?? null,
      file: null,
      remove: false,
      description: img?.description ?? "",
      order: img?.order ?? index * 10
    }));

  export function useImageFiles({
    resource = "",
    config = {},
    initialData = {}
  } = {}) {

  const [files, setFiles] = useState(() => {
    const state = {};

    Object.entries(config).forEach(([field, cfg]) => {
      if (cfg.type === "single") {
        state[field] = initialData[field] ?? null;
      }

      if (cfg.type === "array") {
        state[field] = normalizeArray(initialData[field]);
      }
    });

    return state;
  });

  const [fileErrors, setFileErrors] = useState({});
  const hasInvalidFiles = Object.keys(fileErrors).length > 0;

  // validation
  const validateImage = (key, file) => {
    if (!file) return true;

    if (file.size > MAX_IMAGE_SIZE) {
      setFileErrors(prev => ({
        ...prev,
        [key]: `La imagen "${file.name}" supera ${
          Math.round(MAX_IMAGE_SIZE / 1024 / 1024)
        } MB`
      }));
      return false;
    }

    setFileErrors(prev => {
      const copy = { ...prev };
      delete copy[key];
      return copy;
    });

    return true;
  };

  // single image handlers
  const setSingle = (field, file) => {
    if (!validateImage(field, file)) return;

    setFiles(prev => ({
      ...prev,
      [field]: file
    }));
  };

  // array handlers factory
  const createArrayHandlers = field => {

    const onFileChange = (id, file) => {
      const key = `${field}_${id}`;
      if (!validateImage(key, file)) return;

      setFiles(prev => ({
        ...prev,
        [field]: prev[field].map(item =>
          item.id === id ? { ...item, file } : item
        )
      }));
    };

    const onDescChange = (id, value) => {
      setFiles(prev => ({
        ...prev,
        [field]: prev[field].map(item =>
          item.id === id ? { ...item, description: value } : item
        )
      }));
    };

    const onAdd = () => {
      setFiles(prev => ({
        ...prev,
        [field]: [
          ...prev[field],
          {
            id: genId(),
            current: null,
            file: null,
            remove: false,
            description: "",
            order: prev[field].length
              ? Math.max(...prev[field].map(i => i.order ?? 0)) + 10
              : 0
          }
        ]
      }));
    };

    const onToggleRemove = id => {
      setFiles(prev => ({
        ...prev,
        [field]: prev[field].map(item =>
          item.id === id
            ? { ...item, remove: !item.remove }
            : item
        )
      }));
    };

    const onReorder = (activeId, overId) => {
      setFiles(prev => {
        const list = [...prev[field]];
        const from = list.findIndex(i => i.id === activeId);
        const to = list.findIndex(i => i.id === overId);

        if (from === -1 || to === -1) return prev;

        return {
          ...prev,
          [field]: reorderByIndex(list, from, to)
        };
      });
    };

    return {
      onFileChange,
      onDescChange,
      onAdd,
      onToggleRemove,
      onReorder
    };
  };

  // arrays
  const imageArrays = Object.entries(config)
    .filter(([, cfg]) => cfg.type === "array")
    .reduce((acc, [field]) => {
      acc[field] = createArrayHandlers(field);
      return acc;
    }, {});

  // upload
  const uploadImage = async (id, file, field) => {
    const formData = new FormData();
    formData.append("image", file);

    return authFetch(
      `/${resource}/uploads/${id}/${field}`,
      {
        method: "POST",
        body: formData
      }
    );
  };

  return {
    files,
    setFiles,
    fileErrors,
    hasInvalidFiles,

    setSingle,
    imageArrays,

    uploadImage
  };
}