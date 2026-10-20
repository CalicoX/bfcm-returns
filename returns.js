(function () {
  var REGISTER = "https://user.17track.net/register?lang=en";
  var CONTACT = "https://www.17track.com/en/contact-us";

  var PRICING = {
    returns: {
      tabline: "Billed by monthly return volume, and you can change tier anytime. Yearly is about 18% off, then Black Friday takes more off by tier. Every yearly tier includes 20% extra quota.",
      yearlyBase: 0.82,
      plans: [
        { name: "Free", price: 0, volume: "10 free returns a month", overage: null, feats: ["Green returns", "Cancel unfulfilled orders", "Basic workflows"], cta: "Start free" },
        { name: "Basic", price: 5, volume: "20 returns a month", overage: "US $0.20 per extra return", feats: ["Green returns", "Cancel unfulfilled orders", "Basic workflows", "Email support"], monthlyOff: 0.85, yearlyOff: 0.8, cta: "Start free" },
        { name: "Pro", price: 11, volume: "20 returns a month", overage: "US $0.50 per extra return", feats: ["Branded portal and self-serve returns", "Refunds, exchanges, and green returns", "Status tracking and an embed center", "24 core features"], monthlyOff: 0.8, yearlyOff: 0.75, cta: "Start free" },
        { name: "Max", price: 29, volume: "20 returns a month", overage: "US $1.20 per extra return", feats: ["Everything in Pro", "Advanced workflows by amount, country, or delivery time", "Small make-goods to keep the sale", "Analytics"], monthlyOff: 0.75, yearlyOff: 0.7, tag: "Recommended", highlight: true, cta: "Start free" }
      ]
    },
    tracking: {
      tabline: "Yearly plans start at 20% off the monthly rate, then Black Friday takes more off by tier. Tracking prices are still a draft.",
      yearlyBase: 0.8,
      plans: [
        { name: "Free", price: 0, volume: "50 shipments a month", overage: null, feats: ["3,500+ carrier lookups", "Branded tracking page", "PayPal integration"], cta: "Get started" },
        { name: "Basic", price: 9, volume: "200 shipments a month", overage: null, feats: ["3,500+ carrier lookups", "Shipment status emails", "Basic analytics", "Branded tracking page"], monthlyOff: 0.9, yearlyOff: 0.85, cta: "Get started" },
        { name: "Pro", price: 49, volume: "1,000 shipments a month", overage: null, feats: ["Seller notifications", "Shipment export", "Product recommendations", "Remove 17TRACK branding"], monthlyOff: 0.85, yearlyOff: 0.8, tag: "Popular", highlight: true, cta: "Get started" },
        { name: "Premium", price: 89, volume: "1,000 shipments a month", overage: null, feats: ["Custom notification rules", "Transit time analytics", "On-time delivery analytics", "Exception shipment analytics"], monthlyOff: 0.8, yearlyOff: 0.7, cta: "Get started" }
      ]
    }
  };

  var product = "returns";
  var billing = "yearly";

  function el(tag, className) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    return node;
  }

  function money(n) {
    var v = Math.round(Number(n) * 100) / 100;
    var body = Math.abs(v - Math.round(v)) < 0.001 ? String(Math.round(v)) : v.toFixed(2);
    return "US $" + body;
  }

  function offLabel(off) {
    return Math.round((1 - off) * 100) + "% off";
  }

  function yearlyList(plan, key) {
    return plan.price * 12 * PRICING[key].yearlyBase;
  }

  function bfPrice(plan, key) {
    if (!plan.monthlyOff) return 0;
    if (billing === "monthly") return plan.price * plan.monthlyOff;
    return yearlyList(plan, key) * plan.yearlyOff;
  }

  function cardArticle(plan, key) {
    var article = el("article", "price-card" + (plan.highlight ? " is-popular" : ""));
    if (plan.tag) {
      var ribbon = el("div", "price-ribbon");
      ribbon.textContent = plan.tag;
      article.appendChild(ribbon);
    }

    var head = el("div", "price-card-head");
    var heading = el("h3");
    heading.textContent = plan.name;
    var desc = el("p");
    desc.textContent = plan.monthlyOff ? plan.volume : "For teams just getting started";
    head.appendChild(heading);
    head.appendChild(desc);
    article.appendChild(head);

    var offer = el("div", "price-offer");
    var period = billing === "monthly" ? "/month" : "/year";
    var isFree = !plan.monthlyOff;

    if (isFree) {
      var freeAmount = el("p", "price-amount");
      var freeFigure = el("span", "price-figure");
      freeFigure.textContent = "US $0";
      var freePeriod = el("span", "price-period");
      freePeriod.textContent = period;
      freeAmount.appendChild(freeFigure);
      freeAmount.appendChild(freePeriod);
      offer.appendChild(freeAmount);
      var quota = el("p", "price-quota-line");
      quota.textContent = plan.volume;
      offer.appendChild(quota);
    } else {
      var off = billing === "monthly" ? plan.monthlyOff : plan.yearlyOff;
      var list = billing === "monthly" ? plan.price : yearlyList(plan, key);
      var salePrice = bfPrice(plan, key);
      var amount = el("p", "price-amount is-offer");
      var was = el("s", "price-was");
      was.textContent = money(list);
      amount.appendChild(was);
      var sale = el("span", "price-sale");
      var figure = el("span", "price-figure");
      figure.textContent = money(salePrice);
      var per = el("span", "price-period");
      per.textContent = period;
      var badge = el("span", "price-off");
      badge.textContent = offLabel(off);
      sale.appendChild(figure);
      sale.appendChild(per);
      sale.appendChild(badge);
      amount.appendChild(sale);
      offer.appendChild(amount);
      if (key === "returns" && billing === "yearly") {
        var gift = el("span", "price-save");
        gift.textContent = "20% extra quota";
        offer.appendChild(gift);
      }
      var save = el("p", "price-quota-line");
      save.textContent = "Save " + money(list - salePrice) + (billing === "monthly" ? " a month" : " a year");
      offer.appendChild(save);
      if (plan.overage) {
        var over = el("p", "price-over");
        over.textContent = plan.overage + ", not discounted";
        offer.appendChild(over);
      }
      var mark = el("span", "price-bf");
      mark.textContent = "Black Friday";
      article.appendChild(mark);
    }

    article.appendChild(offer);

    var cta = el("a", "price-cta" + (plan.highlight ? " is-filled" : ""));
    cta.href = REGISTER;
    cta.target = "_blank";
    cta.rel = "noopener noreferrer";
    cta.textContent = plan.cta;
    article.appendChild(cta);

    var feats = el("div", "price-features");
    var featTitle = el("h4");
    featTitle.textContent = "Includes";
    var listEl = el("ul");
    plan.feats.forEach(function (item) {
      var li = el("li");
      li.textContent = item;
      listEl.appendChild(li);
    });
    feats.appendChild(featTitle);
    feats.appendChild(listEl);
    article.appendChild(feats);
    return article;
  }

  function renderPlans() {
    var data = PRICING[product];
    var tagline = document.getElementById("product-tagline");
    var grid = document.getElementById("plan-grid");
    if (tagline) tagline.textContent = data.tabline;
    if (!grid) return;
    grid.replaceChildren();
    data.plans.forEach(function (plan) {
      grid.appendChild(cardArticle(plan, product));
    });
    syncPlanTabs();
  }

  var planName = "";

  function syncPlanTabs() {
    var grid = document.getElementById("plan-grid");
    var bar = document.getElementById("plan-tabs");
    if (!grid || !bar) return;
    var cards = Array.prototype.slice.call(grid.querySelectorAll(".price-card"));
    var names = cards.map(function (card) {
      return card.querySelector("h3").textContent;
    });
    if (names.indexOf(planName) === -1) {
      var highlighted = cards.filter(function (card) { return card.classList.contains("is-popular"); })[0];
      planName = highlighted ? highlighted.querySelector("h3").textContent : names[0];
    }
    bar.replaceChildren();
    names.forEach(function (name) {
      var tab = document.createElement("button");
      tab.type = "button";
      tab.className = "plan-tab";
      tab.setAttribute("role", "tab");
      tab.setAttribute("aria-selected", name === planName ? "true" : "false");
      tab.textContent = name;
      tab.addEventListener("click", function () {
        planName = name;
        syncPlanTabs();
      });
      bar.appendChild(tab);
    });
    cards.forEach(function (card) {
      card.classList.toggle("is-plan-on", card.querySelector("h3").textContent === planName);
    });
  }

  function selectTab(selector, attr, value) {
    document.querySelectorAll(selector).forEach(function (tab) {
      tab.setAttribute("aria-selected", tab.getAttribute(attr) === value ? "true" : "false");
    });
  }

  document.querySelectorAll("[data-bill]").forEach(function (tab) {
    tab.addEventListener("click", function () {
      billing = tab.getAttribute("data-bill");
      selectTab("[data-bill]", "data-bill", billing);
      renderPlans();
    });
  });

  var noticeClose = document.querySelector("[data-notice-close]");
  if (noticeClose) {
    noticeClose.addEventListener("click", function () {
      var notice = document.getElementById("notice");
      if (notice) notice.remove();
    });
  }

  renderPlans();
})();
