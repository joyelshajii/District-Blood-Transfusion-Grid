# Deployment & Custom Domain Guide: District Blood Coordinator (SC-12)

This guide details how to deploy the single-binary prototype to production and connect your custom domain for hackathon submission.

---

## 1. Local Run & Demonstration

The system operates as a single executable running both the Go REST API and the embedded React frontend:

### Windows:
```powershell
# Run the precompiled server binary
.\server.exe -port 8080 -frontend frontend/dist
```

Open your browser at:
`http://localhost:8080`

### Build from source anytime:
```powershell
# 1. Compile frontend
cd frontend
npm run build
cd ..

# 2. Compile Go binary
go build -o server.exe .

# 3. Launch
.\server.exe -port 8080
```

---

## 2. Deploy to Cloud (Render / Railway / Fly.io)

### Option A: Render (Free Web Service)
1. Push this repository to GitHub or GitLab.
2. In the Render Dashboard, click **New +** > **Web Service**.
3. Select your repository.
4. Render automatically detects the `Dockerfile` at the root.
5. Set the Environment Variables:
   - `PORT`: `8080`
   - `DATABASE_PATH`: `/app/data/blood_matching.db`
6. Click **Deploy Web Service**.
7. Render gives you an HTTPS URL (e.g. `https://district-blood-matching.onrender.com`).

### Option B: Railway
1. Click **New Project** > **Deploy from GitHub repo**.
2. Railway detects Dockerfile and builds automatically.
3. In **Settings** > **Networking**, click **Generate Domain**.

### Option C: Fly.io
```bash
fly launch --name district-blood-matching
fly deploy
```

---

## 3. Connecting a Custom Domain

To satisfy the hackathon production checklist:

1. Purchase or configure your domain (e.g., `blood.yourdomain.org` or `sc12.yourname.in`).
2. Add a **CNAME** DNS record at your registrar (Cloudflare, Namecheap, GoDaddy):
   - **Type**: `CNAME`
   - **Name / Host**: `blood` (or `@` for root)
   - **Target / Value**: your Render or Railway domain (e.g., `district-blood-matching.onrender.com`)
   - **TTL**: Auto or 300 seconds
3. In your Render or Railway dashboard:
   - Navigate to **Settings** > **Custom Domains**.
   - Enter your domain name (e.g., `blood.yourdomain.org`).
   - The platform will issue a free automated Let's Encrypt TLS/SSL certificate within 2 to 5 minutes.

---

## 4. Hackathon Evaluation Checklist (ANAVANDI 2026)

- [x] **Working deployed prototype (35%)**: Live interactive link with full Request, Match, Notify, and Accept cycle.
- [x] **Problem understanding (25%)**: Solves WhatsApp broadcast fatigue, eliminates spam calls to ineligible donors, enforces 90/120-day clinical recovery intervals.
- [x] **Technical approach & quality (25%)**: Pure Go backend, ACID SQLite store with foreign keys, Haversine geographic radius, cryptographic tokenized privacy, and audit logging.
- [x] **Presentation clarity (15%)**: Built-in 8-slide presentation deck matching the exact criteria on page 6 of the hackathon brief.
- [x] **Civic Healthcare Standards**: Zero purple gradients, zero pill buttons, zero fake metrics, custom SVG favicon, privacy policy page, and terms of service.
