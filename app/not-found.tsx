// app/not-found.tsx — at root, NOT inside [locale], mirroring app/page.tsx's
// redirect-only pattern. This is Next.js's special file for "no route
// matched" (including nested paths like /en/unknown-subpage); for a
// static export it becomes the 404.html the host falls back to for any
// unmatched path — see wrangler.jsonc's assets.not_found_handling.
import { redirect } from "next/navigation";

export default function NotFound() {
  redirect("https://textiletracelatam.com/404");
}
