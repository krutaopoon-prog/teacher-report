/* ==========================================================================
   main.js — galleries (from manifest), videos, lightbox, nav, reveal
   ========================================================================== */
(function () {
  "use strict";

  /* ---------- navbar scroll + progress ---------- */
  var navbar = document.getElementById("navbar");
  var progress = document.getElementById("scrollProgress");
  function onScroll() {
    var y = window.pageYOffset;
    navbar.classList.toggle("scrolled", y > 20);
    var h = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = (h > 0 ? (y / h) * 100 : 0) + "%";
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- mobile nav ---------- */
  var toggle = document.getElementById("navToggle");
  var links = document.getElementById("navLinks");
  toggle.addEventListener("click", function () {
    links.classList.toggle("open");
    toggle.classList.toggle("open");
  });
  links.addEventListener("click", function (e) {
    if (e.target.tagName === "A") { links.classList.remove("open"); toggle.classList.remove("open"); }
  });

  /* ---------- hero + profile background images ---------- */
  document.querySelectorAll("[data-img]").forEach(function (el) {
    var src = el.getAttribute("data-img");
    var img = new Image();
    img.onload = function () {
      el.style.backgroundImage = "url('" + src + "')";
      el.classList.add("has-img");
    };
    img.src = src;
  });

  /* ---------- reveal on scroll ---------- */
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
  }, { threshold: 0.12 });
  document.querySelectorAll(".reveal").forEach(function (el) { io.observe(el); });

  /* ---------- galleries from manifest ---------- */
  // MANIFEST: { "folder-key": ["file1.jpg","file2.jpg", ...] }
  var MANIFEST = window.SITE_MANIFEST || {};
  var allLightboxSets = {};

  document.querySelectorAll("[data-gallery]").forEach(function (grid) {
    var key = grid.getAttribute("data-gallery");
    var wantCount = parseInt(grid.getAttribute("data-count") || "6", 10);
    var base = "assets/images/" + key + "/";
    var files = MANIFEST[key] || [];
    var setId = key;
    allLightboxSets[setId] = [];

    if (files.length === 0) {
      // show placeholder empty slots so the layout is visible before photos are added
      for (var i = 0; i < wantCount; i++) {
        var ph = document.createElement("div");
        ph.className = "g-empty";
        ph.innerHTML = "<span>🖼️</span>วางรูปในโฟลเดอร์<br>" + key;
        grid.appendChild(ph);
      }
      return;
    }

    files.forEach(function (fname, idx) {
      var url = base + fname;
      allLightboxSets[setId].push(url);
      var item = document.createElement("div");
      item.className = "g-item";
      item.setAttribute("data-set", setId);
      item.setAttribute("data-idx", idx);
      var im = document.createElement("img");
      im.loading = "lazy";
      im.src = url;
      im.alt = key + " " + (idx + 1);
      item.appendChild(im);
      grid.appendChild(item);
    });
  });

  /* ---------- lightbox ---------- */
  var lb = document.getElementById("lightbox");
  var lbImg = document.getElementById("lbImg");
  var curSet = [], curIdx = 0;
  function openLb(set, idx) {
    curSet = allLightboxSets[set] || []; curIdx = idx;
    if (!curSet.length) return;
    lbImg.src = curSet[curIdx];
    lb.classList.add("open"); lb.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }
  function closeLb() { lb.classList.remove("open"); lb.setAttribute("aria-hidden", "true"); document.body.style.overflow = ""; }
  function step(d) { curIdx = (curIdx + d + curSet.length) % curSet.length; lbImg.src = curSet[curIdx]; }

  document.addEventListener("click", function (e) {
    var item = e.target.closest(".g-item");
    if (item) { openLb(item.getAttribute("data-set"), parseInt(item.getAttribute("data-idx"), 10)); }
  });
  document.getElementById("lbClose").addEventListener("click", closeLb);
  document.getElementById("lbPrev").addEventListener("click", function (e) { e.stopPropagation(); step(-1); });
  document.getElementById("lbNext").addEventListener("click", function (e) { e.stopPropagation(); step(1); });
  lb.addEventListener("click", function (e) { if (e.target === lb) closeLb(); });
  document.addEventListener("keydown", function (e) {
    if (!lb.classList.contains("open")) return;
    if (e.key === "Escape") closeLb();
    else if (e.key === "ArrowRight") step(1);
    else if (e.key === "ArrowLeft") step(-1);
  });

  /* ---------- videos ---------- */
  var VIDEOS = window.SITE_VIDEOS || {};
  document.querySelectorAll("[data-videos]").forEach(function (grid) {
    var key = grid.getAttribute("data-videos");
    var list = VIDEOS[key] || [];
    if (!list.length) {
      grid.innerHTML =
        '<div class="video-empty"><strong>▶ พื้นที่สำหรับวิดีโอการสอน</strong>' +
        'อัปโหลดคลิปการสอนขึ้น YouTube (ตั้งเป็นไม่แสดงต่อสาธารณะ/unlisted ได้) ' +
        'แล้วนำรหัสวิดีโอมาใส่ในไฟล์ <code>assets/js/config.js</code></div>';
      return;
    }
    list.forEach(function (v) {
      var card = document.createElement("div");
      card.className = "video-card";
      var embed = '<div class="video-embed">';
      if (v.youtube) {
        embed += '<iframe src="https://www.youtube-nocookie.com/embed/' + v.youtube +
          '" title="' + (v.title || "") + '" loading="lazy" allow="accelerometer;autoplay;clipboard-write;encrypted-media;gyroscope;picture-in-picture" allowfullscreen></iframe>';
      } else if (v.file) {
        embed += '<video controls preload="metadata" src="' + v.file + '"></video>';
      }
      embed += "</div>";
      if (v.title) embed += '<div class="video-caption">' + v.title + "</div>";
      card.innerHTML = embed;
      grid.appendChild(card);
    });
  });
})();
