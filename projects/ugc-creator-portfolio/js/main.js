/*
  Video behaviour.
  Rules: autoplay is always muted and inline, only one video plays at a time,
  videos stop when they scroll out of view or the tab is hidden, and coming back
  shows the cover again.
*/

(function () {
  'use strict';

  var frames = Array.prototype.slice.call(document.querySelectorAll('.video-frame'));
  if (!frames.length) return;

  /* Let the first visible video play straight away. */
  var first = frames[0].querySelector('video');
  if (first) {
    first.play().catch(function () {
      /* Autoplay refused: the cover image stays, which is correct. */
    });
  }

  function setPlaying(frame, playing) {
    frame.setAttribute('data-playing', playing ? 'true' : 'false');
  }

  function play(frame) {
    var video = frame.querySelector('video');
    if (!video) return;
    frames.forEach(function (other) {
      if (other === frame) return;
      var otherVideo = other.querySelector('video');
      if (otherVideo && !otherVideo.paused) {
        otherVideo.pause();
        setPlaying(other, false);
      }
    });
    video.muted = false;
    video.play().then(
      function () {
        setPlaying(frame, true);
      },
      function () {
        setPlaying(frame, false);
      }
    );
  }

  function stopAndReset(frame) {
    var video = frame.querySelector('video');
    if (!video) return;
    video.pause();
    /* load() brings the cover image back; seeking to 0 would show frame one. */
    video.load();
    setPlaying(frame, false);
  }

  frames.forEach(function (frame) {
    var video = frame.querySelector('video');
    if (!video) return;

    setPlaying(frame, false);

    frame.addEventListener('click', function () {
      if (video.paused) play(frame);
      else video.pause();
    });

    video.addEventListener('pause', function () {
      setPlaying(frame, false);
    });

    video.addEventListener('play', function () {
      setPlaying(frame, true);
    });

    if (video.textTracks && video.textTracks.length) {
      Array.prototype.forEach.call(video.textTracks, function (track) {
        track.mode = 'showing';
      });
    }
  });

  /* Stop whatever is playing when it leaves the screen. */
  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) {
            var video = entry.target.querySelector('video');
            if (video && !video.paused) stopAndReset(entry.target);
          }
        });
      },
      { threshold: 0.35 }
    );
    frames.forEach(function (frame) {
      observer.observe(frame);
    });
  }

  /* Browser tab switched away. */
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) frames.forEach(stopAndReset);
  });

  /* Jumping to a section must not hide it under the sticky header. */
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (event) {
      var id = link.getAttribute('href');
      if (!id || id === '#') return;
      var target = document.querySelector(id);
      if (!target) return;
      event.preventDefault();
      var offset = document.querySelector('.site-nav').offsetHeight;
      var top = target.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });
})();