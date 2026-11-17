# Elumalai M – Personal Developer Portfolio

> **Modern, Premium-Grade Developer Portfolio & Personal Landing Page**  
> Designed and engineered for internship submissions, placement evaluations, technical interviews, and personal branding.

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

---

## 📌 Executive Summary

This repository contains the complete source code for the professional portfolio website of **Elumalai M**, an Artificial Intelligence and Data Science undergraduate at **Rajalakshmi Institute of Technology (Anna University)**.

Built with **pure semantic HTML5, modern CSS3, and vanilla JavaScript (ES6+)**, this website avoids third-party heavyweight frameworks (e.g., React, Bootstrap) to showcase foundational proficiency in responsive layouts, CSS Flexbox & Grid, CSS variables, DOM manipulation, accessibility standards, and performant web animations.

---

## 👨‍💻 Candidate Profile

* **Full Name:** Elumalai M
* **Title:** AI &amp; Data Science Student | Python Developer | Aspiring AI/ML Engineer
* **Degree:** B.Tech in Artificial Intelligence and Data Science
* **Institution:** Rajalakshmi Institute of Technology, Chennai
* **University:** Anna University
* **Core Interests:** Artificial Intelligence, Machine Learning, Data Engineering, Natural Language Processing, and Full Stack Web Development.

---

## ✨ Key Features & Technical Highlights

### 1. Modern Dark-Themed Developer UI/UX
* Deep black (`#07090e`) and dark navy (`#0d121d`, `#161e31`) color palette.
* Cohesive cyan (`#38bdf8`), royal blue (`#3b82f6`), and violet (`#8b5cf6`) gradient accents.
* Glassmorphism cards with backdrop blur filters and subtle glowing borders.
* Responsive typography using fluid `clamp()` sizing with Google Fonts (Inter, Outfit, JetBrains Mono).

### 2. Comprehensive Portfolio Sections
* **Sticky Navigation Bar:** Fluid glass navbar with active section highlighting (ScrollSpy), smooth scrolling, mobile drawer menu, and instant resume download action.
* **Hero Section:** Dynamic typewriter role rotation, clear professional tagline, call-to-action buttons, verified social links, and an avatar container with glowing aura.
* **About Me:** Academic background, professional objective callout, personal strengths badges, and 4 structured information cards (Degree, Institution, University, Core Focus).
* **Technical Skills:** Categorized visual skill cards across 6 domains (Programming, Web Development, Database, Data Science, AI & Machine Learning, Tools) with **zero fake percentages**.
* **Projects Showcase:** Interactive filtering (All, AI & ML, Web Development, Databases & Systems) with 5 detailed project cards, technology tags, and interactive detail modals.
* **Internship Experience Timeline:** Chronological timeline covering industry internships at **Cognifyz Technologies** and **Datheon**.
* **Certifications Gallery:** Credentials display with modal preview dialogs for NPTEL, Python, and C programming certifications.
* **Honors & Achievements:** Structured grid of verified academic and technical milestones.
* **Contact Section:** Direct contact cards (Email, LinkedIn, GitHub, Location), one-click clipboard email copy, and a fully validated contact form with honest client-side mailto integration.
* **Footer:** Dynamic year calculation, brand statement, navigation links, and back-to-top button.

### 3. Accessibility & Performance
* 100% semantic HTML (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`).
* Single main `<h1>` hierarchy strictly observed.
* Accessible skip-to-content anchor link.
* Full keyboard navigability with visible `:focus-visible` indicators.
* Comprehensive `prefers-reduced-motion` support for motion sensitivity.
* Zero external script dependencies (vanilla JavaScript).

---

## 📂 Project File Structure

```text
intern_circle_1/
│
├── index.html                  # Semantic HTML5 master document
│
├── css/
│   └── style.css               # Complete stylesheet (Flexbox, Grid, CSS Variables)
│
├── js/
│   └── script.js               # Vanilla JavaScript interactions (ScrollSpy, Menu, Modals)
│
├── assets/
│   ├── images/
│   │   ├── profile-placeholder.svg  # Crisp vector avatar with glowing tech rings
│   │   └── profile.svg              # Scalable avatar backup
│   │
│   ├── icons/                  # Directory for custom icons / SVGs
│   │
│   └── certificates/
│       └── certificate-placeholder.svg # High-resolution credential vector preview
│
├── documents/
│   ├── resume.pdf              # Candidate resume (replace with your updated PDF)
│   └── README.txt              # Quick instructions for resume updating
│
└── README.md                   # Comprehensive repository documentation
```

---

## 🛠️ Technologies & Tools

| Domain | Technologies Used |
| :--- | :--- |
| **Markup & Semantics** | HTML5, Semantic Elements, Open Graph Protocol, Meta Viewport |
| **Styling & Design** | CSS3, CSS Custom Properties (Variables), Flexbox, CSS Grid, Media Queries |
| **Interactivity** | Vanilla JavaScript (ES6+), IntersectionObserver API, Clipboard API |
| **Typography & Icons** | Google Fonts (Inter, Outfit, JetBrains Mono), Font Awesome 6 CDN |
| **Asset Formats** | SVG (Scalable Vector Graphics), PDF |

---

## 🚀 Running the Project Locally

No build tools, bundlers, or package managers are required.

### Method 1: Direct File Launch
1. Clone or download the repository to your local computer.
2. Navigate to the project folder: `intern_circle_1`.
3. Double click `index.html` to open it in your default web browser (Edge, Chrome, Firefox, Safari).

### Method 2: Local Development Server (Recommended)

#### Using Python:
```bash
# In the project directory:
python -m http.server 8000
```
Open [http://localhost:8000](http://localhost:8000) in your web browser.

#### Using Node.js `npx serve`:
```bash
npx serve .
```

#### Using VS Code Live Server Extension:
1. Open the project folder in **Visual Studio Code**.
2. Right-click `index.html` in the file explorer.
3. Select **"Open with Live Server"**.

---

## 🌐 Deployment to GitHub Pages (Step-by-Step)

Follow these steps to deploy this portfolio live on the web for free using GitHub Pages:

### Step 1: Create a New GitHub Repository
1. Log in to [GitHub](https://github.com/).
2. Click the **`+`** icon in the top-right corner and select **New repository**.
3. Name your repository (e.g., `elumalai-portfolio` or `intern_circle_1`).
4. Keep it **Public**.
5. Do **not** initialize with a README (this project already includes one).
6. Click **Create repository**.

### Step 2: Initialize Git and Push Local Code
Open your terminal or PowerShell in this project directory:
```bash
# Initialize local git repository
git init

# Stage all project files
git add .

# Create initial commit
git commit -m "Initial commit: Elumalai M personal developer portfolio"

# Rename branch to main
git branch -M main

# Link remote repository
git remote add origin https://github.com/elumalai0083/intern_circle-all-task.git

# Push to GitHub
git push -u origin main
```

### Step 3: Enable GitHub Pages
1. Go to your repository on GitHub: `https://github.com/elumalai0083/intern_circle-all-task`
2. Click **Settings** (tab with the gear icon).
3. In the left navigation menu, click **Pages** (under the "Code and automation" section).
4. Under **Build and deployment** > **Branch**:
   * Select branch: **`main`**.
   * Select folder: **`/ (root)`**.
5. Click **Save**.

### Step 4: Access Your Live Website
* GitHub will build and publish your site in 1 to 2 minutes.
* Your live URL will appear at the top of the Pages settings page:  
  `https://elumalai0083.github.io/intern_circle-all-task/`
* Test the live link in mobile and desktop browsers.

---

## 📝 Customization Guide (For Elumalai M)

Before public submission or interview sharing, update these placeholder items with your live details:

1. **Profile Photograph:**
   * Place your headshot photograph in `assets/images/profile.jpg`.
   * The website automatically falls back to the clean vector avatar if not supplied.

2. **Official Resume:**
   * Replace `documents/resume.pdf` with your latest official resume PDF.
   * Maintain the file name `resume.pdf` so all download buttons link to it seamlessly.

3. **Social & Repository URLs:**
   * In `index.html`, search for `your-github-username` and replace with your actual GitHub handle.
   * Search for `your-linkedin-username` and replace with your LinkedIn vanity slug.
   * Update `elumalai.rit@example.com` with your active email address.

4. **Contact Form Backend (Optional):**
   * The form currently executes client-side validation and opens the user's email client with pre-filled details.
   * To connect direct automatic form submissions, integrate [Formspree](https://formspree.io/) or [EmailJS](https://www.emailjs.com/) in `js/script.js`.

---

## 🧪 Testing & Validation Results

* **Semantic HTML5:** Tested and validated against W3C standards; single `<h1>`, logical `<h2>`/`<h3>` hierarchy.
* **Responsive Testing:** Verified across viewports:
  * 360px (Small Mobile)
  * 390px (Modern Mobile)
  * 768px (Tablet)
  * 1024px (Laptop)
  * 1280px & 1440px+ (Desktop)
* **Zero Horizontal Scroll:** Tested with `overflow-x: hidden` and fluid containers.
* **JavaScript Console:** Zero syntax errors; defensive event listeners attached.
* **Cross-Browser Compatibility:** Edge, Chrome, Firefox, Safari.

---

## 📄 License & Attribution

Designed and developed by **Elumalai M**.  
Open-source under the [MIT License](LICENSE).

