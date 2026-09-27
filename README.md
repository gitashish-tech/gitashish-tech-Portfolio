https://gitashish-tech.github.io/gitashish-tech-Portfolio/

# Ashish Gade — Portfolio

A premium, 3D, cybersecurity-themed personal portfolio built with plain HTML/CSS/JS, **Three.js** (hero shield + SOC globe), **GSAP + ScrollTrigger** (scroll reveals, timeline progress), and **Lenis** (smooth scrolling).

---

## 1. Folder structure

```
portfolio/
│
├── index.html
├── css/
│   └── style.css
├── js/
│   └── script.js
├── assets/
│   ├── profile.jpg              ← add your photo here (optional, not wired in yet)
│   └── Ashish_Gade_Resume.pdf   ← add your resume here
└── README.md
```

Create these folders exactly as shown if you're setting the project up from scratch:

```bash
mkdir portfolio
cd portfolio
mkdir css js assets
```

Then place `index.html` and `README.md` in `portfolio/`, `style.css` in `portfolio/css/`, and `script.js` in `portfolio/js/`.

---

## 2. Running locally (VS Code Live Server)

1. Open the `portfolio` folder in VS Code.
2. Install the **Live Server** extension (by Ritwick Dey) if you don't have it.
3. Right-click `index.html` → **Open with Live Server**.
4. The site opens at something like `http://127.0.0.1:5500/`.

The site uses CDN links for Three.js, GSAP, ScrollTrigger and Lenis — you need an internet connection the first time you load it (browsers will cache them after).

---

## 3. Adding your resume

1. Export your resume as a PDF.
2. Name it exactly: `Ashish_Gade_Resume.pdf`
3. Place it inside `portfolio/assets/`.

Both **DOWNLOAD RESUME** buttons already point to `assets/Ashish_Gade_Resume.pdf`, so no code changes are needed once the file is in place.

---

## 4. Adding your profile photo (optional)

The current design doesn't use a photo (it uses the 3D shield instead), but if you'd like to add one later:

1. Place your image at `assets/profile.jpg`.
2. Reference it anywhere in `index.html` with `<img src="assets/profile.jpg" alt="Ashish Gade" />`.

---

## 5. Replacing your contact details

Open `index.html` and search for these placeholders inside the **Contact** and **Footer** sections, then replace them:

| Placeholder | Replace with |
|---|---|
| `[YOUR EMAIL]` | your real email address (appears twice: text + `mailto:` link) |
| `[YOUR GITHUB]` | your GitHub profile URL |
| `[YOUR LINKEDIN]` | your LinkedIn profile URL |

These appear in the **Contact** section and again in the **Footer**.

---

## 6. Connecting the contact form to a real backend

The form currently validates input in the browser but does not send email — it just shows a confirmation message. To wire it up:

**Option A — Formspree**
1. Create a form at [formspree.io](https://formspree.io) and copy your form endpoint.
2. In `js/script.js`, find `handleContactSubmit()` and replace the `setTimeout` block with:
   ```js
   fetch('https://formspree.io/f/yourFormId', {
     method: 'POST',
     headers: { Accept: 'application/json' },
     body: new FormData(form)
   })
     .then(() => { status.textContent = 'Message sent — thank you!'; form.reset(); })
     .catch(() => { status.textContent = 'Something went wrong. Please try again.'; });
   ```

**Option B — EmailJS**
1. Set up a service + template at [emailjs.com](https://www.emailjs.com).
2. Add the EmailJS SDK script tag to `index.html`.
3. Call `emailjs.sendForm(...)` inside `handleContactSubmit()` in `js/script.js`.

---

## 7. Deploying to GitHub Pages

1. Create a new GitHub repository, e.g. `ashish-portfolio`.
2. Push the project:
   ```bash
   git init
   git add .
   git commit -m "Initial portfolio"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/ashish-portfolio.git
   git push -u origin main
   ```
3. On GitHub: go to **Settings → Pages**.
4. Under **Build and deployment → Source**, choose **Deploy from a branch**.
5. Select branch `main` and folder `/root`, then **Save**.
6. Your site will be live at:
   `https://YOUR_USERNAME.github.io/ashish-portfolio/`

(GitHub Pages can take 1–2 minutes to publish after the first deploy.)

---

## 8. Notes on the SOC "Security Operations" section

The dashboard (system status, threat level, animated graph, rotating globe) is a **visual concept**, explicitly labeled "INTERACTIVE CONCEPT" on the page. It is not connected to any real security monitoring data — it exists to demonstrate design/UI skill, not to make factual claims.

---

## 9. Performance & accessibility notes

- All heavy 3D/particle effects are reduced or simplified on mobile widths.
- `prefers-reduced-motion` is respected — animations are disabled/shortened for users who request it at the OS level.
- The custom cursor is automatically disabled on touch devices.
- Semantic HTML landmarks (`header`, `main`, `section`, `footer`, `form` labels) are used throughout for screen-reader friendliness.

---

## 10. Tech stack

- HTML5 / CSS3 (custom properties, glassmorphism, CSS grid)
- Vanilla JavaScript (modular, no framework)
- [Three.js](https://threejs.org/) r128 — hero shield scene, SOC globe
- [GSAP](https://gsap.com/) + ScrollTrigger — scroll-based reveals and timeline progress
- [Lenis](https://github.com/darkroomengineering/lenis) — smooth scrolling
- Google Fonts: Space Grotesk, Orbitron, JetBrains Mono
