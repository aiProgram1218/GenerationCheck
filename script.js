const MONTHS = [
  "січня",
  "лютого",
  "березня",
  "квітня",
  "травня",
  "червня",
  "липня",
  "серпня",
  "вересня",
  "жовтня",
  "листопада",
  "грудня",
];

const COORDS = {
  img: { w: 1170, h: 2532 },

  date: {
    cover: { x: 0, y: 585, w: 1170, h: 62 },
    text: { cx: 585, cy: 615, size: 44 },
    color: "#aaaaaa",
    bg: "rgb(39,39,39)",
  },
};

function getNow() {
  const d = new Date();
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");

  return {
    datetime: `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}, ${hh}:${mm}`,
  };
}

function generate(type) {
  const file = type === "trol" ? "./photo/tralik.jpg" : "./photo/bus.jpg";
  const label = type === "trol" ? "tralik" : "bus";

  setStatus("loading", "Завантаження фото…");

  const img = new Image();
  img.crossOrigin = "anonymous";

  img.onload = () => {
    const { datetime } = getNow();

    const canvas = document.createElement("canvas");
    canvas.width = COORDS.img.w;
    canvas.height = COORDS.img.h;
    const ctx = canvas.getContext("2d");

    ctx.drawImage(img, 0, 0, COORDS.img.w, COORDS.img.h);

    const d = COORDS.date;

    ctx.fillStyle = d.bg;
    ctx.fillRect(d.cover.x, d.cover.y, d.cover.w, d.cover.h);

    ctx.fillStyle = d.color;
    ctx.font = `${d.text.size}px -apple-system, "SF Pro Display", "Helvetica Neue", Arial`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(datetime, d.text.cx, d.text.cy);

    setStatus("saving", "Зберігаємо…");

    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");

      const ts = datetime
        .replace(/\s+/g, "-")
        .replace(/,/g, "")
        .replace(/:/g, "-");

      link.download = `citycard-${label}-${ts}.png`;
      link.href = url;
      link.click();

      URL.revokeObjectURL(url);

      setStatus(
        "done",
        `✓ ${type === "trol" ? "Тролейбус" : "Автобус"} · ${datetime}`,
      );
    }, "image/png");
  };

  img.onerror = () => {
    setStatus(
      "error",
      `⚠ Не вдалося знайти ./photo/${type === "trol" ? "tralik" : "bus"}.png`,
    );
  };

  img.src = file;
}

function setStatus(state, text) {
  const dot = document.getElementById("dot");
  const label = document.getElementById("label");
  if (!dot || !label) return;

  dot.className = "status-dot";
  label.className = "status-label";

  if (state === "loading" || state === "saving") {
    dot.classList.add("on");
    label.classList.add("on");
  } else if (state === "done") {
    dot.classList.add("on");
    label.classList.add("on");
    setTimeout(() => {
      dot.classList.remove("on");
      label.classList.remove("on");
      label.textContent = "Оберіть тип транспорту";
    }, 4000);
  } else if (state === "error") {
    dot.style.background = "#ff4444";
    label.style.color = "#ff4444";
  }

  label.textContent = text;
}

document.addEventListener("DOMContentLoaded", () => {
  const btnTrol = document.getElementById("btnTrol");
  const btnAvt = document.getElementById("btnAvt");

  if (btnTrol) btnTrol.addEventListener("click", () => generate("trol"));
  if (btnAvt) btnAvt.addEventListener("click", () => generate("avt"));
});
