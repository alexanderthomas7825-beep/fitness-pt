// IndexedDB-Layer für eigene Übungsfotos. Fotos liegen nur lokal auf dem Gerät.
// Zuordnung erfolgt über die eindeutige Übungs-ID (nicht über den geteilten illus-Schlüssel).

const PHOTO_DB_NAME = "fitnessPhotosDB";
const PHOTO_DB_VERSION = 1;
const PHOTO_STORE = "photos";
const PHOTO_MAX_EDGE = 1000;
const PHOTO_QUALITY = 0.8;

function openPhotoDB() {
  return new Promise((resolve, reject) => {
    if (!("indexedDB" in window)) {
      reject(new Error("IndexedDB nicht verfügbar"));
      return;
    }
    const req = indexedDB.open(PHOTO_DB_NAME, PHOTO_DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(PHOTO_STORE)) {
        db.createObjectStore(PHOTO_STORE, { keyPath: "id" });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function getExercisePhoto(exerciseId) {
  try {
    const db = await openPhotoDB();
    return await new Promise((resolve, reject) => {
      const tx = db.transaction(PHOTO_STORE, "readonly");
      const req = tx.objectStore(PHOTO_STORE).get(exerciseId);
      req.onsuccess = () => resolve(req.result ? req.result.blob : null);
      req.onerror = () => reject(req.error);
    });
  } catch (e) {
    return null;
  }
}

async function saveExercisePhoto(exerciseId, blob) {
  const db = await openPhotoDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(PHOTO_STORE, "readwrite");
    tx.objectStore(PHOTO_STORE).put({ id: exerciseId, blob, savedAt: Date.now() });
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

async function deleteExercisePhoto(exerciseId) {
  const db = await openPhotoDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(PHOTO_STORE, "readwrite");
    tx.objectStore(PHOTO_STORE).delete(exerciseId);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

function resizeAndCompressImage(file) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      let { width, height } = img;
      const scale = Math.min(1, PHOTO_MAX_EDGE / Math.max(width, height));
      width = Math.max(1, Math.round(width * scale));
      height = Math.max(1, Math.round(height * scale));
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, width, height);
      URL.revokeObjectURL(url);
      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob);
          else reject(new Error("Komprimierung fehlgeschlagen"));
        },
        "image/jpeg",
        PHOTO_QUALITY
      );
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Bild konnte nicht geladen werden"));
    };
    img.src = url;
  });
}
