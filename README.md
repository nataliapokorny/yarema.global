# yarema.global — Personal Website of Maksym Yarema

Personal academic website for Maksym Yarema — researcher, educator, and science communicator at ETH Zurich.

**Live site:** https://yaremaglobal.netlify.app 

---

## Tech Stack

- **Frontend:** Single-file HTML/CSS/JS (no build step)
- **Hosting:** Netlify
- **Forms:** FormSubmit.co → `pokornynatalia@gmail.com`
- **CMS:** Netlify CMS (GitHub-backed)

---

## Project Structure

```
yarema-global/
├── index.html          # Main website (all CSS + JS inline)
├── admin/
│   ├── index.html      # Netlify CMS entry point
│   └── config.yml      # CMS collections config
├── static/
│   └── uploads/        # Images uploaded via CMS
├── _data/              # Content JSON files (edited via CMS)
│   ├── settings.json
│   ├── about.json
│   ├── research.json
│   ├── teaching.json
│   ├── international.json
│   ├── publications/   # One JSON per publication
│   └── media/          # One JSON per media item
├── netlify.toml        # Netlify config + headers
└── README.md
```

---

## Local Development

No build step needed. Open `index.html` directly in a browser, or use a simple server:

```bash
# Python
python3 -m http.server 3000

# Node (npx)
npx serve .
```

---

## Deploying to Netlify

1. Push this repo to GitHub
2. In Netlify → **Add new site** → **Import from Git** → select this repo
3. Build settings:
   - Build command: *(leave empty)*
   - Publish directory: `.`
4. Click **Deploy**

---

## Setting up the CMS (Admin Panel)

### Step 1 — Update config.yml

In `admin/config.yml`, replace:
```yaml
repo: YOUR_GITHUB_USERNAME/yarema-global
```
with your actual GitHub username and repo name.

### Step 2 — Enable Netlify Identity

1. Netlify dashboard → **Site settings** → **Identity** → **Enable Identity**
2. Under **Registration** → set to **Invite only**
3. Under **Services** → **Git Gateway** → **Enable Git Gateway**

### Step 3 — Invite yourself

1. Netlify → **Identity** tab → **Invite users**
2. Enter your email → accept invite from email

### Step 4 — Access the admin

Go to: `https://yaremaglobal.netlify.app/admin/`

Login with your Netlify Identity credentials. You can now edit content without touching code.

---

## Form Setup (FormSubmit.co)

The contact form sends to `pokornynatalia@gmail.com` via FormSubmit.co.

**First-time activation:** After deploying, submit the contact form once. FormSubmit will send an activation email to `pokornynatalia@gmail.com` — click the confirmation link. All subsequent submissions will arrive automatically.

---

## For Developers

### Editing Content

- **Quick text changes:** Edit `index.html` directly — all content is inline
- **Structured content:** Use the CMS at `/admin/` or edit JSON files in `_data/`
- **Images:** Upload via CMS or place in `static/uploads/`

### Key CSS Variables

```css
:root {
  --navy:   #1C2B4A;   /* Primary dark */
  --amber:  #E8A020;   /* Accent color */
  --bg:     #F8F7F4;   /* Off-white sections */
  --white:  #FFFFFF;
  --text:   #111827;
  --muted:  #6B7280;
}
```

### Breakpoints

| Breakpoint | Target |
|---|---|
| `≤ 1100px` | Tablet |
| `≤ 768px`  | Mobile |
| `≤ 480px`  | Small mobile |

### Contact Form

The form uses `async function handleSubmit()` in the main `<script>` block at the bottom of `index.html`. It posts via `FormData` to FormSubmit.co. To change the recipient email, search for `formsubmit.co/pokornynatalia@gmail.com` and update.

---

## Contact

**Maksym Yarema** · yaremam@ethz.ch · yarema.global
