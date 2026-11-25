# Nexora – SaaS Pricing Website

> **Premium, Responsive SaaS Pricing Interface**
> Built with pure HTML5, CSS3, and Vanilla JavaScript — no frameworks.

---

## 📌 Project Description

Nexora is a fictional SaaS company pricing website built as **Project 03** for the **InternCircle Full Stack Web Development Internship**. It demonstrates professional-grade frontend development including CSS transitions, transform-based hover effects, JavaScript-driven billing toggles, responsive design, and accessible UI patterns.

---

## ✨ Features

### Design & Layout
- Premium dark theme with deep navy/black backgrounds
- Purple-to-blue gradient accent system
- Glassmorphism header with backdrop blur
- Responsive grid layouts using CSS Flexbox and Grid
- Decorative hero section with subtle grid patterns and gradient glows

### Interactive Pricing Cards
- **Three-tier pricing**: Starter ($9), Professional ($19), Enterprise ($49)
- **Monthly/Yearly billing toggle** with real JavaScript calculations
- **20% yearly discount** accurately calculated and displayed
- Effective monthly equivalent shown when yearly billing is selected
- Dynamic savings text (e.g., "Save $21.60/year")
- **"Most Popular"** and **"Best Value"** ribbon badges using CSS positioning

### CSS Transitions & Transform Effects
- **Card hover**: `translateY(-10px)` lift with intensified box-shadow
- **Featured card**: `scale(1.04)` elevation with purple glow
- **Button hover**: `translateY(-2px)` lift with `scale(1.02)` growth
- **Badge ribbons**: Absolutely positioned with rounded bottom corners
- All transitions use `cubic-bezier(.4,0,.2,1)` for smooth easing

### JavaScript Functionality
| Function | Purpose |
|---|---|
| `initializePricing()` | Attaches event listeners to billing toggle controls |
| `updateBillingCycle(cycle)` | Sets the billing cycle and refreshes the UI |
| `updatePrices()` | Updates all three card prices, periods, and savings text |
| `calculateYearlySavings(monthlyPrice)` | Computes annual savings at 20% discount |
| `updateActiveToggle()` | Syncs toggle button/switch visual state |
| `initializeFAQ()` | Builds accordion with aria-expanded management |
| `initializeMobileMenu()` | Hamburger drawer with body scroll lock |
| `initializeNavigation()` | ScrollSpy, sticky header class, back-to-top |
| `updateCopyrightYear()` | Dynamic footer year via `new Date().getFullYear()` |

### Responsive Design
- **360px** – Small mobile: stacked cards, collapsed nav
- **390px** – Modern mobile
- **768px** – Tablet: single-column pricing, 2-column footer
- **1024px** – Laptop: stacked pricing for readability
- **1280px** – Desktop: full 3-column pricing grid
- **1440px+** – Large desktop

### Accessibility
- Semantic HTML5 (`<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`)
- Skip-to-content link
- ARIA attributes on toggle (`aria-pressed`), accordion (`aria-expanded`, `aria-controls`), and navigation
- Keyboard-navigable with visible `:focus-visible` outlines
- `prefers-reduced-motion` support disables all animations
- Sufficient color contrast for text readability

### Additional Sections
- **Features grid**: 6 feature cards with icon, title, description
- **Feature comparison table**: 8-row responsive table with plan columns
- **FAQ accordion**: 6 questions with smooth open/close animation
- **CTA section**: Social proof avatars, action buttons
- **Footer**: 3-column nav, social icons, disclaimer, dynamic year

---

## 🛠️ Technologies Used

| Category | Technologies |
|---|---|
| **Markup** | HTML5, Semantic Elements, ARIA |
| **Styling** | CSS3, Custom Properties, Flexbox, Grid, Transitions, Transforms, Media Queries |
| **Interactivity** | Vanilla JavaScript (ES6+), IntersectionObserver API |
| **Typography** | Google Fonts (Inter, Plus Jakarta Sans) |
| **Icons** | Font Awesome 6 CDN |

---

## 📂 Folder Structure

```
nexora-pricing/
├── index.html          # Main HTML document
├── css/
│   └── style.css       # Complete stylesheet
├── js/
│   └── script.js       # All JavaScript logic
├── assets/
│   └── icons/          # Custom icon assets (if needed)
└── README.md           # This documentation
```

---

## 🚀 How to Run Locally

No build tools or package managers required.

### Option A: Open directly
Double-click `index.html` in your file explorer. It opens in your default browser.

### Option B: Local server (recommended)
```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve .
```
Then open **http://localhost:8000** in your browser.

### Option C: VS Code Live Server
1. Open the `nexora-pricing` folder in VS Code
2. Right-click `index.html` → **Open with Live Server**

---

## 💰 Billing Toggle Explanation

### How it works
1. User clicks **Monthly** button, **Yearly** button, or the **toggle switch pill**
2. JavaScript `updateBillingCycle()` sets the internal `currentCycle` variable
3. `updateActiveToggle()` moves the visual thumb and highlights the active button
4. `updatePrices()` iterates over all three plans and updates:
   - **Price amount**: Monthly price or yearly effective monthly rate
   - **Period label**: "/month" or "/mo (billed yearly)"
   - **Savings subtext**: Empty for monthly, "Save $X.XX/year" for yearly
5. `calculateYearlySavings(monthlyPrice)` returns `12 × monthlyPrice × 0.20`

### Price Calculations (20% yearly discount)
| Plan | Monthly | × 12 | 20% Off | Yearly Total | Effective Monthly |
|---|---|---|---|---|---|
| Starter | $9 | $108 | −$21.60 | **$86.40** | **$7.20** |
| Professional | $19 | $228 | −$45.60 | **$182.40** | **$15.20** |
| Enterprise | $49 | $588 | −$117.60 | **$470.40** | **$39.20** |

---

## 🎨 CSS Hover Effects Explanation

### Pricing Card Hover
```css
.pricing-card:hover {
  transform: translateY(-10px);       /* Lift card upward */
  border-color: rgba(139,92,246,.4);  /* Purple border glow */
  box-shadow: 0 16px 48px rgba(0,0,0,.55),
              0 0 40px rgba(139,92,246,.2); /* Depth + glow */
}
```

### Featured Card (Professional)
```css
.card-featured {
  transform: scale(1.04);  /* Slightly enlarged by default */
  border-color: rgba(139,92,246,.5);
  box-shadow: /* elevated shadow + purple glow */;
}
.card-featured:hover {
  transform: scale(1.04) translateY(-10px); /* Lift while maintaining scale */
}
```

### Button Hover
```css
.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(139,92,246,.45);
}
```

All transitions use `cubic-bezier(.4, 0, .2, 1)` for natural, smooth easing.

---

## 📸 Screenshots

> _Add screenshots here after deployment._

---

## 🌐 Deployment to GitHub Pages

### Step 1: Create a GitHub Repository
1. Go to [github.com/new](https://github.com/new)
2. Name it (e.g., `nexora-pricing`)
3. Set to **Public**
4. Click **Create repository**

### Step 2: Push Code
```bash
cd nexora-pricing
git init
git add .
git commit -m "Initial commit: Nexora SaaS pricing website"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/nexora-pricing.git
git push -u origin main
```

### Step 3: Enable GitHub Pages
1. Go to **Settings** → **Pages**
2. Source: **Deploy from a branch**
3. Branch: **main**, Folder: **/ (root)**
4. Click **Save**

### Step 4: Access Live URL
Your site will be live at:
```
https://YOUR_USERNAME.github.io/nexora-pricing/
```

---

## 👤 Author

**Elumalai M**
B.Tech – Artificial Intelligence and Data Science
Rajalakshmi Institute of Technology, Chennai | Anna University

---

## 📝 License

This project is a fictional demonstration created for educational purposes as part of the InternCircle Full Stack Web Development Internship.
