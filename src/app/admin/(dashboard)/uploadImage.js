const MAX_MB = 5;

// Uploads one image to /api/admin/upload and returns its "/uploads/..." URL.
// Throws an Error with a message the admin can act on — including the case
// where the web server (nginx) rejects the file before it reaches the app.
export async function uploadImage(file, folder) {
  if (file.size > MAX_MB * 1024 * 1024) {
    throw new Error(`Image is ${(file.size / 1024 / 1024).toFixed(1)} MB — max ${MAX_MB} MB. Compress it or save as JPG/WebP.`);
  }
  const body = new FormData();
  body.append("file", file);
  body.append("folder", folder);

  let res;
  try {
    res = await fetch("/api/admin/upload", { method: "POST", body });
  } catch {
    throw new Error("Could not reach the server. Check your connection and try again.");
  }
  if (res.status === 413) {
    throw new Error(
      `The server rejected this ${(file.size / 1024 / 1024).toFixed(1)} MB image as too large. Raise client_max_body_size in the nginx config (e.g. 10M), or upload a smaller JPG/WebP.`
    );
  }
  const data = await res.json().catch(() => null);
  if (!data) throw new Error(`Upload failed (server returned ${res.status}).`);
  if (!res.ok || !data.success) throw new Error(data.error || `Upload failed (${res.status}).`);
  return data.url;
}
