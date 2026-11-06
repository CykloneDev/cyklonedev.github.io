const previewCards = document.querySelectorAll('#work .card[data-video]');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const previewDialog = document.querySelector('.preview-dialog');
const previewTitle = previewDialog.querySelector('h2');
const previewVideo = previewDialog.querySelector('video');
const previewError = previewDialog.querySelector('.preview-error');
let stopActivePreview;

previewDialog.addEventListener('click', (event) => {
  if (event.target === previewDialog) previewDialog.close();
});
previewDialog.addEventListener('close', () => {
  if (previewDialog.open) return;
  previewVideo.pause();
  previewVideo.removeAttribute('src');
  previewVideo.load();
});
previewVideo.addEventListener('error', () => {
  if (previewDialog.open) previewError.hidden = false;
});

for (const card of previewCards) {
  const viewport = card.querySelector('.viewport');
  const title = card.querySelector('h3').textContent;
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'card-action preview-button';
  button.textContent = 'Preview';
  button.setAttribute('aria-label', `Preview: ${title}`);
  button.setAttribute('aria-haspopup', 'dialog');
  viewport.append(button);

  let video;

  function stop() {
    stopActivePreview = undefined;
    video.pause();
    video.currentTime = 0;
    card.classList.remove('is-live');
  }

  async function start() {
    if (stopActivePreview === stop) return;
    stopActivePreview?.();
    stopActivePreview = stop;

    if (!video) {
      video = document.createElement('video');
      video.muted = true;
      video.playsInline = true;
      video.preload = 'none';
      video.setAttribute('aria-hidden', 'true');
      video.src = card.dataset.video;
      viewport.querySelector('.poster').after(video);
      video.addEventListener('playing', () => {
        if (stopActivePreview === stop) card.classList.add('is-live');
      });
      video.addEventListener('ended', () => {
        if (stopActivePreview === stop) stop();
      });
    }

    try {
      await video.play();
    } catch (error) {
      if (error.name === 'AbortError' || stopActivePreview !== stop) return;
      stop();
    }
  }

  button.addEventListener('click', () => {
    stopActivePreview?.();
    previewTitle.textContent = title;
    previewError.hidden = true;
    previewVideo.muted = true;
    previewVideo.src = card.dataset.video;
    previewDialog.showModal();
    previewVideo.play().catch(() => {
      // The native Play control is available if autoplay is blocked.
    });
  });
  card.addEventListener('pointerenter', (event) => {
    if (event.pointerType === 'mouse' && !reducedMotion.matches && !previewDialog.open) start();
  });
  card.addEventListener('pointerleave', (event) => {
    if (event.pointerType === 'mouse' && stopActivePreview === stop) stop();
  });

  new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting && stopActivePreview === stop) stop();
  }).observe(viewport);
}

if (previewCards.length) {
  document.querySelector('.preview-note').hidden = false;
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stopActivePreview?.();
  });
}

for (const link of document.querySelectorAll('.resume-link')) {
  link.addEventListener('click', async (event) => {
    if (location.protocol === 'file:' || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();

    const status = link.nextElementSibling;
    status.textContent = '';
    try {
      const response = await fetch(link.href, { method: 'HEAD' });
      if (response.ok) {
        location.assign(link.href);
        return;
      }
    } catch {
      // Keep visitors on the portfolio if the PDF cannot be reached.
    }
    status.textContent = 'The résumé PDF is currently unavailable.';
  });
}
