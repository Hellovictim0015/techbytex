import { getCurrentAdmin, logAudit, getClientIp } from "@/app/lib/auth";
import { saveUpload, IMAGE_TYPES, UPLOAD_FOLDERS } from "@/app/lib/uploads";

const MAX_BYTES = 5 * 1024 * 1024;

// POST /api/admin/upload (multipart: file, folder=projects|portfolio|blog)
// Saves into <root>/uploads/<folder>/ and returns { url: "/uploads/..." }.
export async function POST(req) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const form = await req.formData();
    const file = form.get("file");
    const folder = String(form.get("folder") || "");
    if (!UPLOAD_FOLDERS.has(folder)) throw new Error("Unknown upload folder.");
    if (!file || typeof file === "string") throw new Error("Choose an image file.");
    const ext = IMAGE_TYPES[file.type];
    if (!ext) throw new Error("Only PNG, JPG, WebP, AVIF or GIF images.");
    if (file.size > MAX_BYTES) throw new Error("Image must be 5 MB or smaller.");

    const url = await saveUpload(Buffer.from(await file.arrayBuffer()), {
      folder,
      ext,
      name: file.name.replace(/\.[^.]+$/, ""),
    });

    await logAudit({
      adminUserId: admin.id,
      action: "image_uploaded",
      targetType: "uploads",
      targetId: url.slice(0, 255),
      ip: await getClientIp(),
    });
    return Response.json({ success: true, url });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 400 });
  }
}
