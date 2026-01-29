import { useState } from "react";
import { moveItemByOrder, reorderByIndex } from "./orderUtils";

const genId = () =>
  (typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2));

export function useVideos(initialVideos = []) {
  const normalize = (videos = []) =>
    videos.map(v => ({
      id: genId(),
      url: v?.url || "",
      title: v?.title || "",
      order: v?.order ?? 0
    }));

  const [videos, setVideos] = useState(() => normalize(initialVideos));

  const setAllVideos = (incoming = []) => {
    setVideos(normalize(incoming));
  };

  const addVideo = () => {
    setVideos(prev => {
      const maxOrder = Math.max(
        -1,
        ...prev.map(v => v.order ?? 0)
      );

      return [
        ...prev,
        {
          id: genId(),
          url: "",
          title: "",
          order: maxOrder + 10
        }
      ];
    });
  };

  const changeVideo = (id, value) => {
    setVideos(prev =>
      prev.map(v =>
        v.id === id ? { ...v, url: value } : v
      )
    );
  };

  const removeVideo = (id) => {
    setVideos(prev => prev.filter(v => v.id !== id));
  };

  const moveVideo = (id, direction) => {
    setVideos(prev =>
      moveItemByOrder(prev, id, direction)
    );
  };
  const reorderVideos = (activeId, overId) => {
    setVideos(prev => {
      const from = prev.findIndex(v => v.id === activeId);
      const to = prev.findIndex(v => v.id === overId);
      if (from === -1 || to === -1) return prev;

      return reorderByIndex(prev, from, to);
    });
  };

  const serializeVideos = () =>
    videos
      .map(({ id, ...rest }) => rest)
      .filter(v => v.url && v.url.trim());

  return {
    videos,
    setAllVideos,
    addVideo,
    changeVideo,
    removeVideo,
    moveVideo,
    reorderVideos,
    serializeVideos
  };
}