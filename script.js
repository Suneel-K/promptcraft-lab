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

// Examples gallery. To add one, copy a block, paste it before the last "]", and edit the text.
const EXAMPLES = [
  {
    domain: "IT administration",
    context: "I manage IT for a 40-person office. We are moving everyone's email to a new provider next month.",
    objective: "Write a checklist of the steps needed to move every mailbox without losing messages.",
    style: "A clear, step-by-step how-to guide.",
    tone: "Calm and reassuring.",
    audience: "Office staff with no technical background.",
    response: "A numbered list of no more than 10 steps, each under 20 words."
  },
  {
    domain: "Marketing",
    context: "I run a small bakery that just launched a gluten-free sourdough loaf. We sell mostly to local families.",
    objective: "Write three Instagram captions announcing the new loaf.",
    style: "Short, vivid social media copy.",
    tone: "Warm, playful and inviting.",
    audience: "Local parents who care about healthy eating.",
    response: "Three captions, each under 40 words, with two hashtags each."
  },
  {
    domain: "Education",
    context: "I teach a Year 8 science class. We have just started a unit on photosynthesis.",
    objective: "Explain how photosynthesis works and give a short quiz to check understanding.",
    style: "A friendly classroom explanation using one everyday comparison.",
    tone: "Encouraging and curious.",
    audience: "Students aged 12 to 13 who are new to the topic.",
    response: "A 150-word explanation followed by 4 multiple-choice questions with answers."
  }
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

// Render the examples gallery
const gallery = document.getElementById("gallery");
const esc = s => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");
EXAMPLES.forEach(ex => {
  const inputs = PARTS.map(p => "<dt>" + p.title[0] + p.title.slice(1).toLowerCase() + "</dt><dd>" + esc(ex[p.key]) + "</dd>").join("");
  const div = document.createElement("article");
  div.className = "ex";
  div.innerHTML = "<h3>" + esc(ex.domain) + "</h3><div class='grid'><div><h4>Inputs</h4><dl>" + inputs +
    "</dl></div><div><h4>Generated prompt</h4><pre>" + esc(buildPrompt(ex).text) + "</pre></div></div>";
  gallery.appendChild(div);
});

document.getElementById("year").textContent = new Date().getFullYear();

// Reading progress bar in the header
const bar = document.getElementById("bar");
addEventListener("scroll", () => {
  const max = document.documentElement.scrollHeight - innerHeight;
  bar.style.width = (max > 0 ? scrollY / max * 100 : 0) + "%";
});
