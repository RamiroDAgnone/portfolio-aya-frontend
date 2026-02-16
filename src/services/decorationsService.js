import { API_URL } from "../auth/constants";

let decorationsCache = null;
let decorationsPromise = null;

export async function getDecorations() {
  if (decorationsCache) {
    return decorationsCache;
  }

  if (decorationsPromise) {
    return decorationsPromise;
  }

  decorationsPromise = fetch(`${API_URL}/decorations`)
    .then(res => res.json())
    .then(data => {
      decorationsCache = data;
      return data;
    })
    .finally(() => {
      decorationsPromise = null;
    });
    
  return decorationsPromise;
}