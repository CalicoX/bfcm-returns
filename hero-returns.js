/* Hero returns demo.
   Port of DomHeroReturns in the Returns product landing page
   (src/illustrations/ReturnsDomStages.jsx). */
(function () {
  "use strict";

  var scene = document.querySelector("[data-hero-scene]");
  var stage = document.querySelector("[data-hero-stage]");
  if (!scene || !stage) return;

  var visual = scene.parentElement;
  if (!visual) return;

  var FIT = 676;
  var cards = {
    items: stage.querySelector('[data-card="items"]'),
    reason: stage.querySelector('[data-card="reason"]'),
    method: stage.querySelector('[data-card="method"]')
  };
  var link = stage.querySelector("[data-link]");
  var mouseEl = stage.querySelector("[data-hero-mouse]");
  var itemButtons = Array.prototype.slice.call(stage.querySelectorAll("[data-item]"));
  var reasonButtons = Array.prototype.slice.call(stage.querySelectorAll("[data-reason]"));
  var methodButtons = Array.prototype.slice.call(stage.querySelectorAll("[data-method]"));

  var state = {
    step: 0,
    item: null,
    reason: null,
    method: null,
    mouse: { x: 36, y: 48, on: false, click: false }
  };

  function render() {
    if (cards.items) cards.items.classList.toggle("is-in", state.step >= 1);
    if (link) link.classList.toggle("is-in", state.step >= 2);
    if (cards.reason) cards.reason.classList.toggle("is-in", state.step >= 2);
    if (cards.method) cards.method.classList.toggle("is-in", state.step >= 3);

    itemButtons.forEach(function (btn) {
      var on = state.item === btn.getAttribute("data-item");
      btn.classList.toggle("is-on", on);
      btn.setAttribute("aria-checked", on ? "true" : "false");
    });
    reasonButtons.forEach(function (btn) {
      var on = state.reason === btn.getAttribute("data-reason");
      btn.classList.toggle("is-on", on);
      btn.setAttribute("aria-checked", on ? "true" : "false");
    });
    methodButtons.forEach(function (btn) {
      var on = state.method === btn.getAttribute("data-method");
      btn.classList.toggle("is-on", on);
      btn.setAttribute("aria-checked", on ? "true" : "false");
    });

    if (!mouseEl) return;
    mouseEl.classList.toggle("is-on", state.mouse.on);
    mouseEl.classList.toggle("is-click", state.mouse.click);
    mouseEl.style.setProperty("--mx", state.mouse.x + "px");
    mouseEl.style.setProperty("--my", state.mouse.y + "px");
  }

  function scale() {
    if (!visual.classList.contains("is-fit")) return 1;
    var raw = parseFloat(scene.style.getPropertyValue("--rt-s"));
    return raw > 0 ? raw : 1;
  }

  function fit() {
    var w = visual.clientWidth;
    var s = w > 0 ? Math.min(1, w / FIT) : 1;
    var fitted = s < 0.999;
    var next = (fitted ? s : 1).toFixed(4);
    if (scene.style.getPropertyValue("--rt-s") !== next) {
      scene.style.setProperty("--rt-s", next);
    }
    if (visual.classList.contains("is-fit") !== fitted) {
      visual.classList.toggle("is-fit", fitted);
    }
  }

  fit();
  window.addEventListener("resize", fit);
  if (typeof ResizeObserver !== "undefined") {
    var ro = new ResizeObserver(fit);
    ro.observe(visual);
  }

  var tiltReduceQuery = [
    window.matchMedia("(prefers-reduced-motion: reduce)"),
    window.matchMedia("(pointer: coarse)")
  ];

  function tiltReduced() {
    return tiltReduceQuery[0].matches || tiltReduceQuery[1].matches;
  }

  function setTilt(rx, ry) {
    scene.style.setProperty("--rx", rx.toFixed(2) + "deg");
    scene.style.setProperty("--ry", ry.toFixed(2) + "deg");
  }

  function setLayer(px, py) {
    scene.style.setProperty("--layer-x", (-px * 10).toFixed(2) + "px");
    scene.style.setProperty("--layer-y", (-py * 8).toFixed(2) + "px");
    scene.style.setProperty("--layer-nx", (px * 7).toFixed(2) + "px");
    scene.style.setProperty("--layer-ny", (py * 6).toFixed(2) + "px");
  }

  var raf = 0;
  var latest = null;
  var max = 7;

  function applyTilt() {
    raf = 0;
    if (!latest) return;
    var e = latest;
    latest = null;
    if (tiltReduced()) return;
    var r = visual.getBoundingClientRect();
    var x = e.clientX - r.left;
    var y = e.clientY - r.top;
    var px = Math.max(-1, Math.min(1, (x / Math.max(r.width, 1)) * 2 - 1));
    var py = Math.max(-1, Math.min(1, (y / Math.max(r.height, 1)) * 2 - 1));
    setTilt(-py * max, px * max);
    setLayer(px, py);
  }

  visual.addEventListener("pointerenter", function () {
    scene.classList.add("is-tilting");
  });
  visual.addEventListener("pointermove", function (e) {
    latest = e;
    if (!raf) raf = window.requestAnimationFrame(applyTilt);
  });
  visual.addEventListener("pointerleave", function () {
    if (raf) window.cancelAnimationFrame(raf);
    raf = 0;
    latest = null;
    scene.classList.remove("is-tilting");
    setTilt(0, 0);
    setLayer(0, 0);
  });

  itemButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      state.item = btn.getAttribute("data-item");
      state.step = Math.max(state.step, 2);
      render();
    });
  });
  reasonButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      state.reason = btn.getAttribute("data-reason");
      state.step = Math.max(state.step, 3);
      render();
    });
  });
  methodButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      state.method = btn.getAttribute("data-method");
      render();
    });
  });

  function later(ms) {
    return new Promise(function (resolve) {
      window.setTimeout(resolve, ms);
    });
  }

  function pointAt(el) {
    if (!el) return;
    var sr = stage.getBoundingClientRect();
    var er = el.getBoundingClientRect();
    var s = scale();
    state.mouse.x = (er.left - sr.left + er.width * 0.78) / s;
    state.mouse.y = (er.top - sr.top + er.height * 0.55) / s;
    state.mouse.on = true;
    state.mouse.click = false;
    render();
  }

  function slowDemo() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches
      || window.matchMedia("(max-width: 768px)").matches;
  }

  var run = 0;

  async function clickTarget(sel, apply, my, slow) {
    if (my !== run) return;
    pointAt(stage.querySelector(sel));
    await later(slow ? 900 : 520);
    if (my !== run) return;
    state.mouse.click = true;
    render();
    await later(110);
    if (my !== run) return;
    apply();
    await later(140);
    if (my !== run) return;
    state.mouse.click = false;
    render();
  }

  async function play() {
    var my = ++run;
    while (my === run) {
      var slow = slowDemo();
      state.step = 0;
      state.item = null;
      state.reason = null;
      state.method = null;
      state.mouse = { x: 36, y: 48, on: false, click: false };
      render();
      await later(slow ? 120 : 200);
      if (my !== run) return;
      state.step = 1;
      render();
      await later(380);
      if (my !== run) return;

      await clickTarget("[data-demo='item']", function () {
        state.item = "jacket";
        state.step = 2;
        render();
      }, my, slow);
      await later(slow ? 700 : 360);
      if (my !== run) return;

      await clickTarget("[data-demo='reason']", function () {
        state.reason = "Arrive too late";
        state.step = 3;
        render();
      }, my, slow);
      await later(slow ? 700 : 360);
      if (my !== run) return;

      await clickTarget("[data-demo='method']", function () {
        state.method = "green";
        render();
      }, my, slow);
      await later(4200);
      if (my !== run) return;
      state.mouse.on = false;
      render();
      await later(300);
    }
  }

  render();
  play();
})();
