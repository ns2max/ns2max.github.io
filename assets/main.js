/* NISHAL — Cyber-Crypt behaviours. No dependencies. */
(function () {
  "use strict";
  var doc = document;
  var root = doc.documentElement;
  root.classList.add("js");
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var $ = function (s, c) { return (c || doc).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || doc).querySelectorAll(s)); };

  /* ---------- external links open in a new tab ---------- */
  $$('a[href^="http"]').forEach(function (a) {
    if (a.hostname !== location.hostname) { a.target = "_blank"; a.rel = "noopener noreferrer"; }
  });

  /* ---------- nav ---------- */
  var burger = $(".burger"), menu = $(".menu");
  if (burger && menu) {
    burger.addEventListener("click", function () {
      var open = menu.classList.toggle("open");
      burger.setAttribute("aria-expanded", open);
    });
    menu.addEventListener("click", function (e) { if (e.target.tagName === "A") menu.classList.remove("open"); });
  }

  /* ---------- reveal on scroll ---------- */
  var REVEAL = ".section-head, .panel, .stats, .pub, .story, .vcard, .review-list, .timeline li, .talks li, .moon-div";
  var revealEls = $$(REVEAL);
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---------- count-up stats ---------- */
  $$("[data-count]").forEach(function (el) {
    var end = parseFloat(el.getAttribute("data-count")), suffix = el.getAttribute("data-suffix") || "";
    if (reduce || !("IntersectionObserver" in window)) { el.textContent = end + suffix; return; }
    var o = new IntersectionObserver(function (es) {
      if (!es[0].isIntersecting) return;
      o.disconnect();
      var t0 = performance.now(), dur = 1400;
      (function tick(t) {
        var p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(end * e) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      })(t0);
    });
    o.observe(el);
  });

  /* ---------- hero: boot text, role rotator, glitch, embers ---------- */
  var boot = $("[data-boot]");
  if (boot) {
    var lines = boot.getAttribute("data-boot").split("|"), li = 0, ci = 0;
    if (reduce) { boot.textContent = lines[0]; }
    else (function type() {
      var line = lines[li];
      boot.textContent = line.slice(0, ++ci);
      if (ci < line.length) setTimeout(type, 34);
      else if (li < lines.length - 1) setTimeout(function () { li++; ci = 0; type(); }, 1300);
    })();
  }

  var roles = $("[data-roles]");
  if (roles && !reduce) {
    var words = roles.getAttribute("data-roles").split("|"), wi = 0;
    var frame = "▓▒░#%&@*";
    function scramble(to) {
      var n = 0, steps = 12;
      var iv = setInterval(function () {
        n++;
        var out = "";
        for (var i = 0; i < to.length; i++) {
          out += (i < (n / steps) * to.length || to[i] === " ") ? to[i] : frame[Math.floor(Math.random() * frame.length)];
        }
        roles.textContent = out;
        if (n >= steps) { clearInterval(iv); roles.textContent = to; }
      }, 40);
    }
    setInterval(function () { wi = (wi + 1) % words.length; scramble(words[wi]); }, 2600);
  }

  var gl = $(".glitch");
  if (gl && !reduce) {
    var fire = function () {
      gl.classList.remove("go"); void gl.offsetWidth; gl.classList.add("go");
      setTimeout(fire, 3500 + Math.random() * 5000);
    };
    setTimeout(fire, 900);
    gl.addEventListener("mouseenter", function () { gl.classList.remove("go"); void gl.offsetWidth; gl.classList.add("go"); });
  }

  var cv = $(".hero canvas");
  var bgEl = $(".hero-bg");
  if (cv && !reduce) {
    /* data-fx: embers (default) | rain | sand | motes ; data-colors: "r,g,b|r,g,b" (first colour is dominant) */
    var fx = cv.getAttribute("data-fx") || "embers", matte = cv.hasAttribute("data-matte");
    var pal = (cv.getAttribute("data-colors") || "255,66,88|45,226,255").split("|");
    var ctx = cv.getContext("2d"), W, H, parts = [], dpr = Math.min(window.devicePixelRatio || 1, 2);
    var resize = function () {
      var r = cv.getBoundingClientRect();
      W = r.width; H = r.height; cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    var rnd = Math.random;
    var pick = function () { return rnd() < 0.72 || pal.length < 2 ? pal[0] : pal[1 + Math.floor(rnd() * (pal.length - 1))]; };
    var spawn = function (init) {
      var p = { x: rnd() * W, y: rnd() * H, a: rnd() * 0.7 + 0.2, ph: rnd() * 6.28, c: pick(), r: rnd() * 1.9 + 0.4, vx: 0, vy: 0, len: 0 };
      if (fx === "embers") { if (!init) p.y = H + 10; p.vy = -(rnd() * 0.45 + 0.12); p.vx = (rnd() - 0.5) * 0.25; }
      else if (fx === "rain") { if (!init) p.y = -40; p.vy = rnd() * 7 + 5; p.vx = 1.2; p.len = rnd() * 38 + 14; p.a = rnd() * 0.5 + 0.12; p.r = rnd() * 0.9 + 0.5; }
      else if (fx === "sand") { if (!init) p.x = -10; p.vx = rnd() * 1.6 + 0.5; p.vy = (rnd() - 0.4) * 0.3; p.r = rnd() * 1.5 + 0.4; }
      else { p.vx = (rnd() - 0.5) * 0.3; p.vy = (rnd() - 0.5) * 0.3; p.r = rnd() * 2.6 + 0.8; }
      return p;
    };
    resize();
    var count = Math.min(fx === "rain" ? 110 : 90, Math.round(W / (fx === "rain" ? 10 : 14)));
    for (var i = 0; i < count; i++) parts.push(spawn(true));
    window.addEventListener("resize", resize);
    var running = true;
    new IntersectionObserver(function (e) { running = e[0].isIntersecting; }).observe(cv);
    (function loop() {
      if (running) {
        ctx.clearRect(0, 0, W, H);
        for (var i = 0; i < parts.length; i++) {
          var p = parts[i];
          p.ph += 0.01;
          if (fx === "rain") {
            p.y += p.vy; p.x += p.vx;
            if (p.y > H + 50) { parts[i] = spawn(false); continue; }
            var g = ctx.createLinearGradient(p.x, p.y, p.x - p.vx * 4, p.y - p.len);
            g.addColorStop(0, "rgba(" + p.c + "," + p.a + ")"); g.addColorStop(1, "rgba(" + p.c + ",0)");
            ctx.strokeStyle = g; ctx.lineWidth = p.r; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p.x - p.vx * 4, p.y - p.len); ctx.stroke();
            continue;
          }
          if (fx === "embers") { p.y += p.vy; p.x += p.vx + Math.sin(p.ph) * 0.2; if (p.y < -10) { parts[i] = spawn(false); continue; } }
          else if (fx === "sand") { p.x += p.vx; p.y += p.vy + Math.sin(p.ph * 3) * 0.15; if (p.x > W + 10) { parts[i] = spawn(false); continue; } }
          else { p.x += p.vx + Math.sin(p.ph) * 0.15; p.y += p.vy + Math.cos(p.ph * 0.8) * 0.15; if (p.x < -10) p.x = W + 10; if (p.x > W + 10) p.x = -10; if (p.y < -10) p.y = H + 10; if (p.y > H + 10) p.y = -10; }
          var al = fx === "motes" ? p.a * (0.5 + 0.5 * Math.sin(p.ph * 5)) : p.a;
          ctx.beginPath();
          ctx.fillStyle = "rgba(" + p.c + "," + al + ")";
          ctx.shadowBlur = matte ? 0 : (fx === "sand" ? 3 : 10); ctx.shadowColor = "rgba(" + p.c + ",0.9)";
          ctx.arc(p.x, p.y, p.r, 0, 6.283); ctx.fill();
        }
        ctx.shadowBlur = 0;
      }
      requestAnimationFrame(loop);
    })();
    window.addEventListener("mousemove", function (e) {
      if (!bgEl) return;
      var dx = (e.clientX / window.innerWidth - 0.5) * -18, dy = (e.clientY / window.innerHeight - 0.5) * -12;
      bgEl.style.transform = "translate(" + dx + "px," + dy + "px) scale(1.03)";
    }, { passive: true });
  }

  /* ---------- lightbox (a <dialog>, so it stacks above other modals) ---------- */
  var lb = doc.createElement("dialog");
  lb.className = "lb";
  lb.setAttribute("aria-label", "Image viewer");
  lb.innerHTML = '<div class="stage"><img alt=""></div><button class="x" aria-label="Close">✕</button>' +
    '<button class="prev" aria-label="Previous">←</button><button class="next" aria-label="Next">→</button><div class="cap"></div>';
  doc.body.appendChild(lb);
  var lbImg = $("img", lb), lbCap = $(".cap", lb), group = [], gi = 0;

  function show(i) {
    gi = (i + group.length) % group.length;
    var a = group[gi];
    lbImg.src = a.getAttribute("href");
    var im = $("img", a);
    lbImg.alt = im ? im.alt : "";
    var fc = a.parentElement && $("figcaption", a.parentElement);
    lbCap.textContent = (fc ? fc.textContent : (im ? im.alt : "")) + (group.length > 1 ? "   [" + (gi + 1) + "/" + group.length + "]" : "");
    $(".prev", lb).style.display = $(".next", lb).style.display = group.length > 1 ? "" : "none";
  }
  doc.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest("a.zoom, [data-zoom]");
    if (!a || !a.getAttribute("href")) return;
    e.preventDefault();
    var scope = a.closest("[data-group]") || a.closest("dialog") || doc;
    group = $$("a.zoom, [data-zoom]", scope).filter(function (x) { return x.getAttribute("href"); });
    show(group.indexOf(a));
    if (!lb.open) lb.showModal();
  });
  $(".x", lb).addEventListener("click", function () { lb.close(); });
  $(".prev", lb).addEventListener("click", function () { show(gi - 1); });
  $(".next", lb).addEventListener("click", function () { show(gi + 1); });
  lb.addEventListener("click", function (e) { if (e.target === lb || e.target.classList.contains("stage")) lb.close(); });
  lb.addEventListener("keydown", function (e) {
    if (e.key === "ArrowLeft") show(gi - 1);
    if (e.key === "ArrowRight") show(gi + 1);
  });
  lb.addEventListener("close", function () { lbImg.removeAttribute("src"); });

  /* ---------- research: filter, search, dossier dialog ---------- */
  var grid = $("#cards");
  if (grid) {
    var cards = $$(".rcard", grid), chips = $$(".chip[data-tag]"), q = $("#q"), none = $("#none");
    var active = "all";
    var apply = function () {
      var term = q ? q.value.trim().toLowerCase() : "", shown = 0;
      cards.forEach(function (c) {
        var okTag = active === "all" || c.getAttribute("data-tags").split("|").indexOf(active) > -1;
        var okQ = !term || c.textContent.toLowerCase().indexOf(term) > -1;
        c.hidden = !(okTag && okQ);
        if (!c.hidden) shown++;
      });
      if (none) none.classList.toggle("show", shown === 0);
    };
    chips.forEach(function (ch) {
      ch.addEventListener("click", function () {
        active = ch.getAttribute("data-tag");
        chips.forEach(function (x) { x.setAttribute("aria-pressed", x === ch); });
        apply();
      });
    });
    if (q) q.addEventListener("input", apply);

    var dlg = $("#dossier"), dTags = $("#d-tags"), dTitle = $("#d-title"), dBody = $("#d-body");
    var openProject = function (slug, push) {
      var tpl = $("#tpl-" + slug);
      var card = cards.filter(function (c) { return c.id === slug; })[0];
      if (!tpl || !card) return;
      dTitle.textContent = $("h3", card).textContent;
      dTags.innerHTML = $(".tags", card).innerHTML;
      dBody.innerHTML = "";
      dBody.appendChild(tpl.content.cloneNode(true));
      dBody.scrollTop = 0;
      $$("video", dBody).forEach(function (v) { v.preload = "metadata"; });
      if (!dlg.open) dlg.showModal();
      if (push) history.replaceState(null, "", "#" + slug);
    };
    cards.forEach(function (c) { c.addEventListener("click", function () { openProject(c.id, true); }); });
    $(".dclose", dlg).addEventListener("click", function () { dlg.close(); });
    dlg.addEventListener("click", function (e) { if (e.target === dlg) dlg.close(); });
    dlg.addEventListener("close", function () {
      $$("video", dBody).forEach(function (v) { v.pause(); });
      if (location.hash) history.replaceState(null, "", location.pathname + location.search);
    });
    if (location.hash.length > 1) openProject(location.hash.slice(1), false);
  }

  /* ---------- Instagram click-to-load ---------- */
  var igBtn = $("#ig-load");
  if (igBtn) {
    igBtn.addEventListener("click", function () {
      var host = $("#ig-grid");
      JSON.parse(host.getAttribute("data-posts")).forEach(function (u) {
        var w = doc.createElement("div"); w.className = "ig";
        w.innerHTML = '<blockquote class="instagram-media" data-instgrm-permalink="' + u + '" data-instgrm-version="14"></blockquote>';
        host.appendChild(w);
      });
      var s = doc.createElement("script");
      s.async = true; s.src = "https://www.instagram.com/embed.js";
      doc.body.appendChild(s);
      igBtn.closest(".insta-gate").style.display = "none";
    });
  }

  /* ---------- easter egg ---------- */
  var buf = "";
  doc.addEventListener("keydown", function (e) {
    buf = (buf + e.key).slice(-3);
    if (buf === "666") {
      root.style.setProperty("--sage", "#ff4258");
      root.style.setProperty("--accent", "#ff1a33");
      console.log("%cThe number of the beast.", "color:#ff4258;font:700 16px monospace");
    }
  });
  if (window.console) console.log("%cValar morghulis ⚡", "color:#2de2ff;font:700 14px monospace");
})();
