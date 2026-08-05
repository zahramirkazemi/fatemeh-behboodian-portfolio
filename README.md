# fatemeh.jam — UI/UX & Product Designer Portfolio

A one-page portfolio for Fatemeh Behboodian, UI/UX & product designer, with five linked case studies. Static HTML/CSS/JS, no build step, deployed to GitHub Pages.

## Structure

```
index.html          Home — hero, work rail, experience timeline, story, resume, contact
vamax.html           Case study: Vamax, fintech loan management dashboard
divaran.html         Case study: Divaran, classifieds marketplace
agrobazar.html        Case study: Agroobazar, marketplace seller dashboard
karanex.html         Case study: Karanex, crypto trading & learning platform
taxi-shahr.html      Case study: Taxi Shahr, bilingual ride-hailing app

css/site.css         Shared base styles, keyframes, responsive rules
js/site.js           Reveal-on-scroll, scroll progress bar, home page
                      cursor trails and contact form behavior

assets/              Case study screenshots
images/              Portrait photos used on the home page
```

## Local preview

No build step — serve the directory with any static file server, e.g.:

```
python3 -m http.server 8000
```

then open `http://localhost:8000`.

## Deployment

Pushing to `main` runs `.github/workflows/deploy.yml`, which publishes the repository root to GitHub Pages. In the repo's **Settings → Pages**, set the source to **GitHub Actions** once to enable this.

## Credit

Originally designed and prototyped in Claude Design, then rebuilt here as a dependency-free static site for production hosting.
