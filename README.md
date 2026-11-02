# Amelia Burton — Engineering Portfolio

Live site: https://ameliaeburton.github.io

## Files
- `index.html`: the main page (opening screen, project overviews, about, contact)
- `style.css`: all colors, fonts and layout
- `projects/`: one page per project (`spring-fea.html`, `project-two.html`, `project-three.html`)
- `images/`: put your project pictures here
- `resume.pdf`: add your résumé here with this exact name

## Adding a picture
1. Put the image in `images/`, e.g. `images/spring-mesh.jpg`.
2. On the main page, replace `<div class="placeholder">Image coming soon</div>` with
   `<img src="images/spring-mesh.jpg" alt="Abaqus mesh of the spring">`.
3. On a project page, use `../images/spring-mesh.jpg` (the `../` goes up one folder).

## Adding a project
Copy one `<article class="project"> ... </article>` block in `index.html`, then copy a page in `projects/` and rename it.
