# cyklonedev.github.io

## Update the portfolio

Find the project by its title in the Work section of `index.html`. Each project is an `<article class="card">`.

### Add or replace a gameplay preview

Export a short H.264 MP4 and save it in `media/` with the filename below. Replacing a file with the same name requires no HTML changes.

| Project | File path |
| --- | --- |
| Core Breachers | `media/core-breachers.mp4` |
| Dead Weight | `media/deadweight.mp4` |
| Soul Reaper | `media/soulreaper.mp4` |
| The Drop: Mine & Extract | `media/the-drop.mp4` |

For a new project or a different filename, set `data-video` on the project's opening article tag.

```html
<article class="card" data-video="media/deadweight.mp4">
```

The site adds a Preview button that opens a larger player with playback controls. Desktop visitors can also hover over the card for a muted preview. Keep filenames and their capitalization consistent with the path in `data-video`.

### Add or replace a project link

Update the `href` in the card's `project-cover-link`. For a card without one, paste this inside its `<div class="viewport">`, after the bracket spans. Replace the example URL and project name.

```html
<a class="project-cover-link" href="https://your-name.itch.io/your-game" aria-label="View project: Your Game on itch.io">
  <span class="card-action">View project <span aria-hidden="true">↗</span></span>
</a>
```

The link covers the image. The Preview button remains a separate control. For an unlisted itch.io release, use its shareable page URL and check it in a private browser window.

### Add your résumé

Save the PDF as `media/resume.pdf`. The Resume links at the top and bottom both use that file.

Commit the updated `index.html` and the new media files to the branch used by GitHub Pages to put the changes live.
