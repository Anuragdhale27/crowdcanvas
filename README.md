# CrowdCanvas V1 — GitHub Pages + Supabase

## Included
- `index.html`: responsive upload form and global gallery.
- `supabase-setup.sql`: storage bucket, table, and public access policies.

## 1. Create Supabase project
1. Create a project at https://supabase.com/dashboard.
2. Open SQL Editor -> New query.
3. Paste all of `supabase-setup.sql` and run it.
4. Go to Project Settings -> API (or Connect, depending on dashboard layout).
5. Copy the Project URL and the publishable/anon public key. Never use `service_role` or secret keys in browser code.

## 2. Configure the website
1. Open `index.html` in a text editor.
2. Find:
   - `PASTE_YOUR_SUPABASE_PROJECT_URL_HERE`
   - `PASTE_YOUR_SUPABASE_PUBLISHABLE_OR_ANON_KEY_HERE`
3. Replace each placeholder with your project's URL and public/publishable anon key.
4. Save. Do not add a service-role key to the website.

## 3. Deploy on GitHub Pages
1. Create a GitHub repository, e.g. `crowdcanvas`.
2. Upload `index.html` to the repository root. You may keep `supabase-setup.sql` and this README in the repo too.
3. Repository -> Settings -> Pages -> Deploy from a branch -> `main` -> `/ (root)` -> Save.
4. Wait for the GitHub Pages URL to become available.

## 4. Connect crowdcanvas.workslab.in
1. In the repository Settings -> Pages, set Custom domain to `crowdcanvas.workslab.in` and save.
2. In your DNS provider for `workslab.in`, create a CNAME:
   - Type: `CNAME`
   - Host/Name: `crowdcanvas`
   - Target/Value: `YOUR-GITHUB-USERNAME.github.io` (replace with your actual GitHub Pages hostname; do not include `/crowdcanvas`).
3. Wait for DNS propagation. Then enable Enforce HTTPS in GitHub Pages when it becomes available.

## 5. Enable clickable poster links
1. In Supabase Dashboard -> SQL Editor, run `supabase-migration-poster-links.sql` to add the optional `target_url` column. Existing posters remain valid and their links stay blank.
2. The upload form now accepts an optional destination URL. Use a full `https://` or `http://` URL. Posters with a URL open the destination in a new tab when clicked; posters without one remain non-clickable.
3. The website only accepts HTTP(S) destinations and opens them with `rel="noopener noreferrer"` for safer new-tab behavior.

## 6. Test
- Open the deployed site in a private/incognito window.
- Upload a small JPG/PNG/WebP with a title.
- Refresh the page and open the URL on another device/browser. The poster should appear in the shared gallery.
- If uploads fail, check the browser console and Supabase Storage/Table policies.

## Important limits and security
- This first MVP publishes uploaded images immediately, without moderation or user accounts. It is vulnerable to spam, abusive images, and free-tier quota abuse. Keep the URL private during testing; add moderation, upload throttling/CAPTCHA, and admin removal before promoting publicly.
- The displayed gallery currently fetches the latest 100 posters. The counter is therefore the number loaded (up to 100), not a reliable lifetime/global visitor count. Add a database count endpoint or RPC for an accurate count.
- Public uploads are not the same as secure monetization. Do not add payments until you have moderation, clear terms, and a reliable way to enforce the first-1,000 free slots.
- Never put Supabase `service_role` or secret keys in frontend JavaScript.
