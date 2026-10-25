(() => {
  const $ = (id) => document.getElementById(id);
  const C = CONFIG;
  const DAYS = ["일", "월", "화", "수", "목", "금", "토"];
  const date = new Date(C.date);

  function formatDate(d) {
    const h = d.getHours();
    const ampm = h < 12 ? "오전" : h === 12 ? "낮" : "오후";
    const hour = h % 12 || 12;
    const min = d.getMinutes() ? ` ${d.getMinutes()}분` : "";
    return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일 ${DAYS[d.getDay()]}요일 ${ampm} ${hour}시${min}`;
  }

  function toast(msg) {
    const t = $("toast");
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(t._timer);
    t._timer = setTimeout(() => t.classList.remove("show"), 1800);
  }

  async function copy(text, msg) {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
    toast(msg);
  }

  // ---------- 메인 ----------
  $("hero-photo").src = C.mainImage;
  $("hero-groom").textContent = C.groom.name;
  $("hero-bride").textContent = C.bride.name;
  $("hero-tagline").textContent = C.tagline || "";
  $("hero-date").textContent = formatDate(date);
  $("hero-venue").textContent = `${C.venue.name} ${C.venue.hall}`;

  // ---------- 인사말 ----------
  $("greeting").textContent = C.greeting;
  const parentLine = (p) =>
    `<p>${p.father} · ${p.mother}<span class="rel">의 ${p.relation}</span><strong>${p.name}</strong></p>`;
  $("parents").innerHTML = parentLine(C.groom) + parentLine(C.bride);

  // ---------- 연락하기 ----------
  const contactRow = (label, name, phone) =>
    `<div class="contact-row"><span>${label} ${name}</span><span>` +
    `<a href="tel:${phone}">전화</a><a href="sms:${phone}">문자</a></span></div>`;
  const contacts = [["신랑", C.groom], ["신부", C.bride]].filter(([, p]) => p.phone);
  $("contact-list").innerHTML = contacts.map(([label, p]) => contactRow(label, p.name, p.phone)).join("");
  $("btn-contact").hidden = contacts.length === 0;
  $("btn-contact").onclick = () => ($("contact-modal").hidden = false);

  // ---------- 달력 ----------
  const y = date.getFullYear();
  const m = date.getMonth();
  $("cal-head").textContent = `${y}. ${String(m + 1).padStart(2, "0")}. ${String(date.getDate()).padStart(2, "0")}`;
  let html = "<tr>" + DAYS.map((d, i) => `<th class="${i === 0 ? "sun" : i === 6 ? "sat" : ""}">${d}</th>`).join("") + "</tr><tr>";
  const first = new Date(y, m, 1).getDay();
  const last = new Date(y, m + 1, 0).getDate();
  for (let i = 0; i < first; i++) html += "<td></td>";
  for (let d = 1; d <= last; d++) {
    const dow = (first + d - 1) % 7;
    const cls = [dow === 0 ? "sun" : dow === 6 ? "sat" : "", d === date.getDate() ? "day-mark" : ""].join(" ");
    html += `<td class="${cls}"><span>${d}</span></td>`;
    if (dow === 6 && d !== last) html += "</tr><tr>";
  }
  $("calendar").innerHTML = html + "</tr>";

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(y, m, date.getDate());
  const diff = Math.round((target - today) / 86400000);
  $("dday").innerHTML =
    diff > 0 ? `${C.groom.name} ♥ ${C.bride.name}의 결혼식이 <strong>${diff}일</strong> 남았습니다`
    : diff === 0 ? `오늘은 <strong>${C.groom.name} ♥ ${C.bride.name}</strong>의 결혼식입니다`
    : `${C.groom.name} ♥ ${C.bride.name}의 결혼식이 <strong>${-diff}일</strong> 지났습니다`;

  // ---------- 갤러리 ----------
  const track = $("viewer-track");
  const thumbs = $("thumbs");
  const total = C.gallery.length;
  let current = -1;
  C.gallery.forEach((src, i) => {
    track.insertAdjacentHTML("beforeend", `<img src="${src}" alt="사진 ${i + 1}"${i ? ' loading="lazy"' : ""} />`);
    const b = document.createElement("button");
    b.setAttribute("aria-label", `사진 ${i + 1} 보기`);
    b.innerHTML = `<img src="${src}" alt="" loading="lazy" />`;
    b.onclick = () => goTo(i);
    thumbs.appendChild(b);
  });
  function goTo(i) {
    i = (i + total) % total;
    track.scrollTo({ left: i * track.clientWidth, behavior: "smooth" });
  }
  function setActive(i) {
    if (i === current) return;
    current = i;
    [...thumbs.children].forEach((b, j) => b.classList.toggle("active", j === i));
    $("viewer-count").textContent = `${i + 1} / ${total}`;
    const b = thumbs.children[i];
    thumbs.scrollTo({ left: b.offsetLeft - (thumbs.clientWidth - b.offsetWidth) / 2, behavior: "smooth" });
  }
  // 손가락으로 넘겨도 썸네일·번호가 따라오도록 스크롤 위치로 현재 사진을 계산
  track.addEventListener("scroll", () => setActive(Math.round(track.scrollLeft / track.clientWidth)), { passive: true });
  $("viewer-prev").onclick = () => goTo(current - 1);
  $("viewer-next").onclick = () => goTo(current + 1);
  setActive(0);

  // ---------- 오시는 길 ----------
  $("venue-name").textContent = `${C.venue.name} ${C.venue.hall}`;
  $("venue-addr").innerHTML = C.venue.address + (C.venue.tel ? `<br />Tel. ${C.venue.tel}` : "");
  const q = encodeURIComponent(C.venue.mapQuery);
  $("map-buttons").innerHTML = `
    <a href="https://map.naver.com/p/search/${q}" target="_blank" rel="noopener">네이버 지도</a>
    <a href="https://map.kakao.com/?q=${q}" target="_blank" rel="noopener">카카오맵</a>
    <a href="tmap://search?name=${q}">티맵</a>`;
  $("transport").innerHTML = C.venue.transport.map((t) => `<dt>${t.title}</dt><dd>${t.desc}</dd>`).join("");
  $("transport-notice").textContent = C.venue.notice ? `* ${C.venue.notice}` : "";

  // ---------- 계좌 ----------
  function accordion(el, title, list) {
    if (!list.length) return (el.hidden = true);
    el.innerHTML =
      `<button class="acc-head">${title}</button><div class="acc-body">` +
      list.map((a, i) =>
        `<div class="acc-row"><div><small>${a.role ? a.role + " · " : ""}${a.bank}</small>${a.number} ${a.name}</div>` +
        `<div class="acc-btns"><button data-copy="${i}">복사</button>` +
        `<button class="toss" data-toss="${i}">토스</button>` +
        (a.kakaopay ? `<a class="kakaopay" href="${a.kakaopay}" target="_blank" rel="noopener">카카오페이</a>` : "") +
        "</div></div>").join("") +
      "</div>";
    el.querySelector(".acc-head").onclick = () => el.classList.toggle("open");
    el.querySelectorAll("[data-copy]").forEach((b) => {
      const a = list[b.dataset.copy];
      b.onclick = () => copy(`${a.bank} ${a.number}`, "계좌번호가 복사되었습니다");
    });
    // 토스 비공식 딥링크: 앱이 안 열릴 때를 대비해 계좌번호도 함께 복사
    el.querySelectorAll("[data-toss]").forEach((b) => {
      const a = list[b.dataset.toss];
      b.onclick = async () => {
        await copy(`${a.bank} ${a.number}`, "계좌번호 복사 완료 · 토스를 엽니다");
        const params = new URLSearchParams({ amount: "0", bank: a.bank, accountNo: a.number.replace(/\D/g, ""), origin: "qr" });
        location.href = `supertoss://send?${params}`;
      };
    });
  }
  accordion($("acc-groom"), "신랑측 계좌번호", C.accounts.groom);
  accordion($("acc-bride"), "신부측 계좌번호", C.accounts.bride);
  $("account-section").hidden = !C.accounts.groom.length && !C.accounts.bride.length;

  // ---------- 공유 ----------
  $("btn-copy-link").onclick = () => copy(location.href, "링크가 복사되었습니다");
  $("btn-share").onclick = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: document.title, url: location.href });
      } catch {}
    } else {
      copy(location.href, "링크가 복사되었습니다");
    }
  };

  // ---------- 모달 닫기 ----------
  document.querySelectorAll("[data-close]").forEach((b) => {
    b.onclick = () => (b.closest(".modal").hidden = true);
  });
  document.querySelectorAll(".modal").forEach((el) => {
    el.addEventListener("click", (e) => {
      if (e.target === el) el.hidden = true;
    });
  });

  // ---------- 눈 내리는 효과 ----------
  const canvas = $("snow");
  const ctx = canvas.getContext("2d");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let flakes = [];

  // 눈 결정 모양을 한 번만 그려두고 매 프레임 복사해서 사용
  const sprite = document.createElement("canvas");
  sprite.width = sprite.height = 64;
  (() => {
    const g = sprite.getContext("2d");
    g.translate(32, 32);
    g.strokeStyle = "#a9bdd6";
    g.lineWidth = 3;
    g.lineCap = "round";
    for (let i = 0; i < 6; i++) {
      g.beginPath();
      g.moveTo(0, 0);
      g.lineTo(0, -28);
      // 가지
      g.moveTo(0, -12);
      g.lineTo(-8, -20);
      g.moveTo(0, -12);
      g.lineTo(8, -20);
      g.moveTo(0, -20);
      g.lineTo(-5, -25);
      g.moveTo(0, -20);
      g.lineTo(5, -25);
      g.stroke();
      g.rotate(Math.PI / 3);
    }
  })();

  function resize() {
    const dpr = window.devicePixelRatio || 1;
    canvas.width = innerWidth * dpr;
    canvas.height = innerHeight * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = Math.round(Math.min(innerWidth, 600) / 12);
    flakes = Array.from({ length: count }, () => ({
      x: Math.random() * innerWidth,
      y: Math.random() * innerHeight,
      size: 8 + Math.random() * 10,
      speed: 0.3 + Math.random() * 0.7,
      drift: Math.random() * Math.PI * 2,
      angle: Math.random() * Math.PI,
      spin: (Math.random() - 0.5) * 0.02,
      alpha: 0.5 + Math.random() * 0.4,
    }));
  }
  function snow() {
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    for (const f of flakes) {
      f.y += f.speed;
      f.drift += 0.01;
      f.x += Math.sin(f.drift) * 0.4;
      f.angle += f.spin;
      if (f.y > innerHeight + f.size) {
        f.y = -f.size;
        f.x = Math.random() * innerWidth;
      }
      ctx.save();
      ctx.translate(f.x, f.y);
      ctx.rotate(f.angle);
      ctx.globalAlpha = f.alpha;
      ctx.drawImage(sprite, -f.size / 2, -f.size / 2, f.size, f.size);
      ctx.restore();
    }
    requestAnimationFrame(snow);
  }
  if (!reduceMotion) {
    resize();
    addEventListener("resize", resize);
    snow();
  }

  // ---------- 스크롤 페이드인 ----------
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("show");
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.15 });
  document.querySelectorAll(".fade").forEach((el) => io.observe(el));
})();
