# Amelia Burton — Engineering Portfolio

Live site: https://ameliaeburton.github.io

## Files
- `index.html`: the main page (opening screen, project overviews, about, contact)
- `style.css`: all colors, fonts and layout
- `projects/`: one page per project (`camera-mount.html`, `rover.html`, `walking-dispenser.html`, `spring-fea.html`)
- `media/`: project videos (MP4, H.264, which plays on iPhone and in every browser)
- `main.js`: shared scripts (scroll fade-in, video buttons, tabs, parts diagram)
- `images/`: put your project pictures here
- `resume.pdf`: add your résumé here with this exact name

## Adding a picture
1. Put the image in `images/`, e.g. `images/spring-mesh.jpg`.
2. On the main page, replace `<div class="placeholder">Image coming soon</div>` with
   `<img src="images/spring-mesh.jpg" alt="Abaqus mesh of the spring">`.
3. On a project page, use `../images/spring-mesh.jpg` (the `../` goes up one folder).

## Adding a project
Copy one `<article class="project"> ... </article>` block in `index.html`, then copy a page in `projects/` and rename it.

## Adding a video
1. Export or convert it to `.mp4` (iPhone `.mov` files often won't play in Chrome).
2. Put it in `media/`.
3. Copy the `<header class="video-hero">` block from `projects/rover.html` and change the `src`.
   Keep `autoplay muted loop playsinline`: iPhones only autoplay muted videos.

## Theme: Deep Ocean
- Colors, fonts and spacing are at the top of `style.css`.
- Sun rays, caustic light and drifting particles are added by `main.js` (section "0. Ocean").
  The caustic pattern is `images/caustics.png`.
- Silver headings: any element with class `silver` gets the polished-silver text effect.
- The depth gauge reading at the very bottom of the page is set by `MAX_DEPTH` in `main.js`.
