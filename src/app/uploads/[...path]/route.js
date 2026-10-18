import { readUpload } from "@/app/lib/uploads";

// Serves admin-uploaded images from <project root>/uploads at /uploads/<folder>/<file>.
// File names are unique per upload, so they can be cached forever.
export async function GET(request, { params }) {
  const { path } = await params;
  const file = await readUpload(path);
  if (!file) {
    return new Response("Not found", { status: 404 });
  }
  return new Response(file.body, {
    headers: {
      "Content-Type": file.contentType,
      "Content-Length": String(file.size),
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
