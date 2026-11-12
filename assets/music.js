/* Music page: click-to-play YouTube cards.
   Nothing from YouTube loads until the visitor presses play (faster page, no tracking). */
(function () {
  "use strict";

  document.querySelectorAll("button.yt[data-yt]").forEach(function (btn) {
    var id = btn.getAttribute("data-yt");
    var img = btn.querySelector("img");

    // Use the HD thumbnail when the video has one; YouTube answers with a
    // 120px placeholder when it does not, so fall back to the standard one.
    if (img) {
      var hd = new Image();
      hd.onload = function () {
        if (hd.naturalWidth > 120) img.src = hd.src;
      };
      hd.src = "https://i.ytimg.com/vi/" + id + "/maxresdefault.jpg";
    }

    btn.addEventListener("click", function () {
      var start = btn.getAttribute("data-start");
      var frame = document.createElement("iframe");
      frame.src = "https://www.youtube-nocookie.com/embed/" + id +
        "?autoplay=1&rel=0&playsinline=1" + (start ? "&start=" + start : "");
      frame.title = btn.getAttribute("aria-label") || "YouTube video";
      frame.allow = "autoplay; encrypted-media; picture-in-picture; fullscreen";
      frame.allowFullscreen = true;
      frame.className = "yt yt-live";
      btn.replaceWith(frame);
    });
  });

  // Instagram: load Instagram's embed script only when the posts come near the screen.
  var ig = document.querySelector(".ig-grid"); // first grid on the page; the script fills every post
  if (ig) {
    var loadIg = function () {
      if (window.instgrm) { window.instgrm.Embeds.process(); return; }
      var s = document.createElement("script");
      s.async = true;
      s.src = "https://www.instagram.com/embed.js";
      document.body.appendChild(s);
    };
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) { io.disconnect(); loadIg(); }
      }, { rootMargin: "800px 0px" });
      io.observe(ig);
    } else {
      loadIg();
    }
  }
})();
