# cPanel production deployment

This repo is set up so cPanel can deploy from Git **without running a build on the server**. The production `.next` folder is committed to Git.

## One-time setup in cPanel

1. **Git Version Control** – Add this repository: `https://github.com/ritheshbalipersad/kirtanwebsite.git`, branch `main`. Enable **Deploy** so cPanel runs `.cpanel.yml` on pull.
2. **Setup Node.js App** – Create an application:
   - **Application root**: path to the cloned repo (e.g. `kirtanwebsite` or `repositories/kirtanwebsite`)
   - **Application URL**: your domain or subdomain
   - **Application startup file**: `node_modules/next/dist/bin/next start`  
     (or leave default and set **Run script** to `npm start` if your host supports it)
   - **Node.js version**: 18.x or 20.x

After each pull, cPanel runs the tasks in `.cpanel.yml` (`npm install --production`). No build step runs on the server because `.next` is already in the repo.

## Your workflow (build locally, then push)

When you change code and want to update production:

```bash
npm run build
git add .
git commit -m "Your message"
git push origin main
```

Then in cPanel, use **Pull** (or your host’s “Deploy” button) so it pulls the latest commit and runs the deployment tasks. Your site will serve the new `.next` build.

## Notes

- **data/** and **node_modules** are not in the repo. cPanel creates `node_modules` from `npm install --production`. For user/data files, ensure the server has a writable `data/` directory if the app needs it.
- Set any **environment variables** (e.g. `ENCRYPTION_KEY`, `NEXTAUTH_SECRET`) in cPanel’s Node.js App or `.env` on the server.
