/* ---------- Settings you can edit ---------- */

// The six CO-STAR parts. "fallback" is used when a field is left empty.
const PARTS = [
  { key: "context",   title: "CONTEXT",   fallback: "No special background. Treat this as a general request." },
  { key: "objective", title: "OBJECTIVE", fallback: "Help me with the task described in the context above." },
  { key: "style",     title: "STYLE",     fallback: "Clear, well organized and easy to follow." },
  { key: "tone",      title: "TONE",      fallback: "Professional and friendly." },
  { key: "audience",  title: "AUDIENCE",  fallback: "A general reader with no specialist knowledge." },
  { key: "response",  title: "RESPONSE",  fallback: "A short, well-structured answer. Ask me if anything is unclear." }
];

/* ---------- Code (no need to edit below) ---------- */

// Builds the prompt text. Returns the text and a list of parts that used defaults.
function buildPrompt(values) {
  const defaulted = [];
  const text = PARTS.map(p => {
    const v = (values[p.key] || "").trim();
    if (!v) defaulted.push(p.title.toLowerCase());
    return "# " + p.title + "\n" + (v || p.fallback);
  }).join("\n\n");
  return { text, defaulted };
}

const form = document.getElementById("form");
const output = document.getElementById("output");
const copyBtn = document.getElementById("copy");
const status = document.getElementById("status");
const note = document.getElementById("note");
const EMPTY_TEXT = "Start filling the fields above to see your prompt build in real time...";

function render(force) {
  const values = {};
  PARTS.forEach(p => { values[p.key] = document.getElementById("f-" + p.key).value; });
  const anyText = Object.values(values).some(v => v.trim());
  if (!anyText && !force) {
    output.textContent = EMPTY_TEXT; copyBtn.disabled = true; note.textContent = ""; return;
  }
  const { text, defaulted } = buildPrompt(values);
  output.textContent = text;
  copyBtn.disabled = false;
  note.textContent = defaulted.length
    ? "Defaults were used for: " + defaulted.join(", ") + ". Fill these in for a more tailored result."
    : "";
}

form.addEventListener("input", () => render(false));
form.addEventListener("submit", e => { e.preventDefault(); status.textContent = ""; render(true); });
form.addEventListener("reset", () => {
  output.textContent = EMPTY_TEXT; copyBtn.disabled = true; status.textContent = ""; note.textContent = "";
});

copyBtn.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(output.textContent);
  } catch (err) {
    const range = document.createRange();
    range.selectNodeContents(output);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
    document.execCommand("copy");
  }
  status.textContent = "Copied!";
  setTimeout(() => { status.textContent = ""; }, 2000);
});

document.getElementById("year").textContent = new Date().getFullYear();

// Reading progress bar in the header
const bar = document.getElementById("bar");
addEventListener("scroll", () => {
  const max = document.documentElement.scrollHeight - innerHeight;
  bar.style.width = (max > 0 ? scrollY / max * 100 : 0) + "%";
});
