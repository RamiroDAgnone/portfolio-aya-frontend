import { MAX_IMAGE_SIZE } from "../auth/constants";

export function validateImageFile(file) {
  if (!file) return null;

  if (!file.type.startsWith("image/")) {
    return "El archivo no es una imagen válida";
  }

  if (file.size > MAX_IMAGE_SIZE) {
    return "La imagen supera el límite de 15MB";
  }

  return null;
}