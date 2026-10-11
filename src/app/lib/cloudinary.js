import { createHash } from "crypto";
import { getSecret } from "./secrets";

// Signed upload of a base64 image to Cloudinary. Returns an optimized delivery
// URL (auto format/quality, capped width) plus the raw secure_url.
export async function uploadImageBase64(base64Png, { folder, publicId }) {
  const [cloud, apiKey, apiSecret] = await Promise.all([
    getSecret("CLOUDINARY_CLOUD_NAME"),
    getSecret("CLOUDINARY_API_KEY"),
    getSecret("CLOUDINARY_API_SECRET"),
  ]);
  if (!cloud || !apiKey || !apiSecret) throw new Error("Cloudinary keys are not set.");

  const timestamp = Math.floor(Date.now() / 1000);
  const signed = { folder, overwrite: "true", public_id: publicId, timestamp };
  const toSign = Object.keys(signed)
    .sort()
    .map((k) => `${k}=${signed[k]}`)
    .join("&");
  const signature = createHash("sha1").update(toSign + apiSecret).digest("hex");

  const form = new FormData();
  form.append("file", `data:image/png;base64,${base64Png}`);
  form.append("api_key", apiKey);
  for (const [k, v] of Object.entries(signed)) form.append(k, String(v));
  form.append("signature", signature);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${encodeURIComponent(cloud)}/image/upload`, {
    method: "POST",
    body: form,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error?.message || `Cloudinary upload failed (${res.status})`);

  return {
    secureUrl: data.secure_url,
    url: data.secure_url.replace("/image/upload/", "/image/upload/f_auto,q_auto,w_1600/"),
  };
}
