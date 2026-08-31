export const sections = [
  {
    eyebrow: "01 · Identity",
    title: "Who is this record for?",
    description: "Start with the user’s core Epic identity and account details.",
    fields: [
      {
        id: "1",
        label: "User ID",
        placeholder: "Enter the user ID",
        helper: "Defaults to * for a new EMP import.",
      },
      {
        id: "2",
        label: "User Name OT",
        placeholder: "Lastname, Firstname",
      },
      {
        id: "23",
        label: "Contact Comment",
        placeholder: "Enter a comment",
        helper: "Enter a reason for creating the new contact.",
      },
      {
        id: "45",
        label: "System Login",
        placeholder: "Enter the system login",
        helper: "The user’s operating system login, e.g. first three letters of the last name plus the first two of the first name.",
      },
      {
        id: "50",
        label: "User status",
        options: [
          ["", "Select a status"],
          ["1", "1 — Active"],
          ["2", "2 — Inactive"],
        ],
      },
      {
        id: "55",
        label: "Login Blocked",
        options: [
          ["", "No blocked reason"],
          ["0", "0 — Other"],
          ["10", "10 — Too many failed logins"],
          ["20", "20 — Inactive for too many days"],
          ["30", "30 — External reporting user"],
          ["1001", "1001 — Provider left organization"],
          ["1002", "1002 — Training incomplete"],
        ],
      },
      {
        id: "150",
        label: "Email Address",
        placeholder: "name@example.com",
        type: "email",
      },
      { id: "280", label: "Rpt Grp One", placeholder: "Enter Rpt Grp One" },
    ],
  },
  {
    eyebrow: "02 · Templates",
    title: "Configure templates",
    description:
      "Add the default and linkable templates. Required blank companion rows are generated automatically.",
    fields: [
      {
        id: "198",
        label: "Linked Template",
        placeholder: "Enter the linked template",
        helper:
          "The active linkable template linked to this user. Usually matches the default linkable template below.",
      },
      {
        id: "1101",
        label: "Default Linkable Template",
        placeholder: "Enter the default template",
      },
      {
        id: "1110",
        label: "Linkable Templates",
        placeholder: "T123400",
        type: "list",
        join: "rows",
        addLabel: "template",
        helper:
          "Each entry becomes its own 1110 row. The companion items — 1111 and 1112 (effective from/to dates), 1115 (login types), 1118, and 1119 — are added blank once per template.",
      },
    ],
  },
  {
    eyebrow: "03 · Environment",
    title: "Add environment details",
    description: "Capture sub-template, provider, and HR-system information.",
    fields: [
      {
        id: "9205",
        label: "Subtemplates",
        placeholder: "T1002",
        type: "list",
        join: "rows",
        addLabel: "subtemplate",
        helper:
          "Each entry becomes its own 9205 row, with a blank 9207 row added for each.",
      },
      {
        id: "17500",
        label: "Provider ID",
        placeholder: "Enter the provider ID",
      },
      {
        id: "19601",
        label: "HR System Department",
        placeholder: "Enter the department",
      },
      {
        id: "19602",
        label: "HR System Job Code",
        placeholder: "Enter the job code",
      },
    ],
  },
  {
    eyebrow: "04 · Job validation",
    title: "Finish job validation",
    description: "Complete the validation values and review the generated text file.",
    fields: [
      {
        id: "19610",
        label: "Job Category Validation Manager",
        placeholder: "Enter the manager value",
      },
      {
        id: "19611",
        label: "Job Category Validation Status",
        placeholder: "1",
        type: "list",
        join: "control-a",
        addLabel: "job + status",
        pairWith: "19615",
        helper:
          "One status per assigned job — this list adds and removes rows together with the assigned jobs below. Every status exports on one 19611 line: the entry count, then each value, joined by Epic’s Control-A separator (19611,3␁2␁1␁2 holds three entries). Codes: 1 Ready, 2 Validated, 3 Job Changes, 4 Wrong Manager, 5 Employee Leaving, 6 HR Changes.",
      },
      {
        id: "19612",
        label: "Job Category Validation Comment",
        placeholder: "Enter a comment",
        type: "textarea",
      },
      {
        id: "19615",
        label: "Job Category Validation Assigned Jobs",
        placeholder: "1783",
        type: "list",
        join: "control-a",
        addLabel: "job + status",
        pairWith: "19611",
        helper:
          "One job category ID per entry. Every job exports on one 19615 line: the entry count, then each value, joined by Epic’s Control-A separator (19615,3␁1783␁275␁4637 holds three entries). Entry 1 here pairs with entry 1 of the status list above.",
      },
    ],
  },
];

export const allFields = sections.flatMap((section) => section.fields);

const fieldsById = new Map(allFields.map((field) => [field.id, field]));

// Paired lists (e.g. one validation status per assigned job) gain and lose rows
// together, so row N of one always lines up with row N of the other.
function listGroup(id) {
  const partner = fieldsById.get(id)?.pairWith;
  return partner ? [id, partner] : [id];
}

const blankTemplateCompanionIds = ["1111", "1112", "1115", "1118", "1119"];
const defaultAnswers = { "1": "*" };

function singleLine(value) {
  return String(value ?? "").replace(/\r?\n/g, " ").trim();
}

export function splitRows(value) {
  return String(value ?? "")
    .split(/\r?\n/)
    .map((row) => row.trim())
    .filter(Boolean);
}

function itemLine(id, value = "") {
  return `${id},${singleLine(value)}`;
}

// Related-group items export on a single row: the number of entries, then
// every value, each joined by Control-A. 19611,3␁2␁1␁2 holds three values.
function controlALine(id, value) {
  const rows = splitRows(value);
  if (!rows.length) return itemLine(id);
  return `${id},${rows.length}\x01${rows.join("\x01")}`;
}

export function buildLines(answers) {
  const lines = [
    "##INI=EMP",
    itemLine("1", singleLine(answers["1"]) || "*"),
    itemLine("2", answers["2"]),
    itemLine("23", answers["23"]),
    itemLine("45", answers["45"]),
    itemLine("50", answers["50"]),
    itemLine("55", answers["55"]),
    itemLine("150", answers["150"]),
    itemLine("198", answers["198"]),
    itemLine("280", answers["280"]),
    itemLine("1101", answers["1101"]),
  ];

  const templates = splitRows(answers["1110"]);
  const templateRows = templates.length ? templates : [""];
  lines.push(...templateRows.map((template) => itemLine("1110", template)));
  for (const id of blankTemplateCompanionIds) {
    lines.push(...templateRows.map(() => itemLine(id)));
  }

  const subTemplates = splitRows(answers["9205"]);
  const subTemplateRows = subTemplates.length ? subTemplates : [""];
  lines.push(...subTemplateRows.map((template) => itemLine("9205", template)));
  lines.push(...subTemplateRows.map(() => itemLine("9207")));

  lines.push(
    itemLine("17500", answers["17500"]),
    itemLine("19601", answers["19601"]),
    itemLine("19602", answers["19602"]),
    itemLine("19610", answers["19610"]),
    controlALine("19611", answers["19611"]),
    itemLine("19612", answers["19612"]),
    controlALine("19615", answers["19615"]),
  );

  return lines;
}

export function buildTextOutput(answers) {
  return `${buildLines(answers).join("\r\n")}\r\n`;
}

const state = {
  activeSection: 0,
  showReview: false,
  answers: { ...defaultAnswers },
  // Per-field box lists. Kept separate from answers so an empty box can stay on
  // screen while the export continues to ignore it.
  lists: {},
};

function getList(id) {
  if (!state.lists[id]) {
    const stored = splitRows(state.answers[id]);
    state.lists[id] = stored.length ? stored : [""];
  }
  return state.lists[id];
}

function setList(id, values) {
  state.lists[id] = values;
  state.answers[id] = values
    .map((value) => value.trim())
    .filter(Boolean)
    .join("\n");
}

// Pad both halves of a paired list to the same row count.
function alignPair(id) {
  const group = listGroup(id);
  if (group.length < 2) return;
  const rows = Math.max(...group.map((target) => getList(target).length));
  for (const target of group) {
    const values = getList(target);
    if (values.length < rows) {
      setList(target, [...values, ...Array(rows - values.length).fill("")]);
    }
  }
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

const arrowIcon = (left = false) => `
  <svg aria-hidden="true" class="${left ? "rotate-180" : ""}" fill="none"
    height="18" viewBox="0 0 18 18" width="18">
    <path d="M3.75 9h10.5m-4-4 4 4-4 4" stroke="currentColor"
      stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path>
  </svg>`;

const downloadIcon = `
  <svg aria-hidden="true" fill="none" height="18" viewBox="0 0 18 18" width="18">
    <path d="M9 2.75v8.5m0 0 3-3m-3 3-3-3M3.25 13v1.25c0 .55.45 1 1 1h9.5c.55 0 1-.45 1-1V13"
      stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
      stroke-width="1.5"></path>
  </svg>`;

const copyIcon = `
  <svg aria-hidden="true" fill="none" height="17" viewBox="0 0 18 18" width="17">
    <rect height="10" rx="2" stroke="currentColor" stroke-width="1.4"
      width="9" x="6" y="5.5"></rect>
    <path d="M4 12.5H3.75a1.5 1.5 0 0 1-1.5-1.5V3.75a1.5 1.5 0 0 1 1.5-1.5H11a1.5 1.5 0 0 1 1.5 1.5V4"
      stroke="currentColor" stroke-linecap="round" stroke-width="1.4"></path>
  </svg>`;

function completedCount() {
  return allFields.reduce(
    (count, field) => count + (state.answers[field.id]?.trim() ? 1 : 0),
    0,
  );
}

function progressPercent() {
  return Math.round((completedCount() / allFields.length) * 100);
}

function sectionCompleted(section) {
  return section.fields.filter((field) => state.answers[field.id]?.trim()).length;
}

function renderNav() {
  const nav = document.querySelector("#section-nav");
  nav.innerHTML = sections
    .map((section, index) => {
      const done = sectionCompleted(section);
      const active = !state.showReview && index === state.activeSection;
      return `
        <button class="nav-step ${active ? "active" : ""}" data-section="${index}" type="button">
          <span class="step-number">${done === section.fields.length ? "✓" : index + 1}</span>
          <span class="step-copy">
            <strong>${section.title}</strong>
            <small>${done} of ${section.fields.length} complete</small>
          </span>
        </button>`;
    })
    .join("") +
    `
      <button class="nav-step ${state.showReview ? "active" : ""}" data-review type="button">
        <span class="step-number">5</span>
        <span class="step-copy">
          <strong>Review & download</strong>
          <small>${completedCount()} responses entered</small>
        </span>
      </button>`;

  nav.querySelectorAll("[data-section]").forEach((button) => {
    button.addEventListener("click", () => {
      navigateToSection(Number(button.dataset.section));
    });
  });
  nav.querySelector("[data-review]").addEventListener("click", openReview);
}

function updateProgressChrome() {
  const progress = progressPercent();
  document.querySelector("#top-progress").style.width = `${progress}%`;
  document.querySelector("#completion-percent").textContent = `${progress}%`;
  document.querySelector("#completion-bar").style.width = `${progress}%`;
  document.querySelector("#completion-copy").textContent =
    `${completedCount()} of ${allFields.length} fields completed`;
  renderNav();
}

function listMarkup(field) {
  alignPair(field.id);
  const values = getList(field.id);
  const showSeparator = field.join === "control-a";
  const removeLabel = field.pairWith ? "Remove this row from both lists" : "Remove entry";
  const rows = values
    .map(
      (value, index) => `
        <div class="list-row">
          ${showSeparator ? `<span class="list-join" aria-hidden="true">␁</span>` : ""}
          <input data-list-id="${field.id}" data-index="${index}"
            placeholder="${escapeHtml(field.placeholder ?? "")}" type="text"
            value="${escapeHtml(value)}" />
          <button aria-label="${removeLabel}" class="list-remove"
            data-list-remove="${field.id}" data-index="${index}" title="${removeLabel}"
            type="button" ${values.length === 1 ? "disabled" : ""}>&times;</button>
        </div>`,
    )
    .join("");

  return `
    <div class="list-rows">${rows}</div>
    <button class="list-add" data-list-add="${field.id}" type="button">
      + Add ${field.addLabel ?? "entry"}
    </button>`;
}

function fieldMarkup(field) {
  const answer = state.answers[field.id] ?? "";
  const safeAnswer = escapeHtml(answer);
  const input = field.type === "list"
    ? listMarkup(field)
    : field.options
      ? `<select data-field-id="${field.id}">
          ${field.options
            .map(
              ([value, label]) =>
                `<option value="${value}" ${answer === value ? "selected" : ""}>${label}</option>`,
            )
            .join("")}
        </select>`
      : field.type === "textarea"
        ? `<textarea data-field-id="${field.id}" placeholder="${field.placeholder}" rows="3">${safeAnswer}</textarea>`
        : `<input data-field-id="${field.id}" placeholder="${field.placeholder}"
            type="${field.type ?? "text"}" value="${safeAnswer}" />`;

  // A list renders several inputs plus buttons, so it cannot sit inside a label.
  const tag = field.type === "list" ? "div" : "label";
  const wide = field.type === "textarea" || field.type === "list";

  return `
    <${tag} class="field ${wide ? "wide" : ""}">
      <span class="field-label">
        <span>${field.label}</span>
        <small>#${field.id}</small>
      </span>
      ${input}
      ${field.helper ? `<span class="field-helper">${field.helper}</span>` : ""}
    </${tag}>`;
}

function sectionMarkup() {
  const section = sections[state.activeSection];
  return `
    <div class="section-heading">
      <p>${section.eyebrow}</p>
      <h2>${section.title}</h2>
      <span>${section.description}</span>
    </div>
    <div class="fields-grid">
      ${section.fields.map(fieldMarkup).join("")}
    </div>
    <div class="form-actions">
      <button class="button secondary" id="back-button"
        ${state.activeSection === 0 ? "disabled" : ""} type="button">
        ${arrowIcon(true)} Back
      </button>
      ${
        state.activeSection < sections.length - 1
          ? `<button class="button primary" id="continue-button" type="button">
              Continue ${arrowIcon()}
            </button>`
          : `<button class="button primary" id="review-button" type="button">
              Review file ${arrowIcon()}
            </button>`
      }
    </div>`;
}

function renderSection() {
  const panel = document.querySelector("#content-panel");
  panel.innerHTML = sectionMarkup();

  panel.querySelectorAll("[data-field-id]").forEach((input) => {
    input.addEventListener("input", (event) => {
      state.answers[event.target.dataset.fieldId] = event.target.value;
      updateProgressChrome();
    });
  });

  panel.querySelectorAll("[data-list-id]").forEach((input) => {
    input.addEventListener("input", (event) => {
      const id = event.target.dataset.listId;
      const values = [...getList(id)];
      values[Number(event.target.dataset.index)] = event.target.value;
      setList(id, values);
      updateProgressChrome();
    });
  });

  panel.querySelectorAll("[data-list-add]").forEach((button) => {
    button.addEventListener("click", () => {
      const id = button.dataset.listAdd;
      for (const target of listGroup(id)) {
        setList(target, [...getList(target), ""]);
      }
      renderSection();
      updateProgressChrome();
      document
        .querySelector(`[data-list-id="${id}"][data-index="${getList(id).length - 1}"]`)
        ?.focus();
    });
  });

  panel.querySelectorAll("[data-list-remove]").forEach((button) => {
    button.addEventListener("click", () => {
      const id = button.dataset.listRemove;
      const index = Number(button.dataset.index);
      for (const target of listGroup(id)) {
        const remaining = getList(target).filter((_, i) => i !== index);
        setList(target, remaining.length ? remaining : [""]);
      }
      renderSection();
      updateProgressChrome();
    });
  });

  panel.querySelector("#back-button").addEventListener("click", () => {
    if (state.activeSection > 0) navigateToSection(state.activeSection - 1);
  });

  const continueButton = panel.querySelector("#continue-button");
  if (continueButton) {
    continueButton.addEventListener("click", () => {
      navigateToSection(state.activeSection + 1);
    });
  }

  const reviewButton = panel.querySelector("#review-button");
  if (reviewButton) reviewButton.addEventListener("click", openReview);
}

function reviewMarkup() {
  return `
    <div class="review-view">
      <div class="section-heading">
        <p>05 · Ready to export</p>
        <h2>Review your import file</h2>
        <span>
          The file begins with ##INI=EMP. Each item uses a comma separator,
          required blank template rows are repeated automatically, and each
          multi-value job field exports on one row — the entry count, then
          every value, joined by the Epic Control-A separator.
        </span>
      </div>

      <div class="review-summary">
        <div><strong>${buildLines(state.answers).length}</strong><span>Output rows</span></div>
        <div><strong>${completedCount()}</strong><span>Completed</span></div>
        <div><strong>${allFields.length - completedCount()}</strong><span>Blank</span></div>
      </div>

      <div class="file-preview">
        <div class="file-toolbar">
          <div>
            <span class="file-icon">TXT</span>
            <span>
              <strong>user-import.txt</strong>
              <small>Plain text · UTF-8</small>
            </span>
          </div>
          <button id="copy-button" type="button">${copyIcon}<span>Copy</span></button>
        </div>
        <pre id="file-output"></pre>
      </div>

      <div class="download-callout">
        <div>
          <strong>Your file is generated locally.</strong>
          <span>Responses are not submitted to or stored by this website.</span>
        </div>
        <button class="button primary download" id="download-button" type="button">
          ${downloadIcon} Download text file
        </button>
      </div>

      <div class="review-actions">
        <button class="text-button" id="edit-button" type="button">
          ${arrowIcon(true)} Edit responses
        </button>
        <button class="text-button danger" id="clear-button" type="button">
          Clear form
        </button>
      </div>
    </div>`;
}

function renderReview() {
  const panel = document.querySelector("#content-panel");
  panel.innerHTML = reviewMarkup();
  const output = buildTextOutput(state.answers);
  panel.querySelector("#file-output").textContent = output;

  panel.querySelector("#copy-button").addEventListener("click", async (event) => {
    await navigator.clipboard.writeText(output);
    const label = event.currentTarget.querySelector("span");
    label.textContent = "Copied";
    window.setTimeout(() => {
      label.textContent = "Copy";
    }, 1800);
  });

  panel.querySelector("#download-button").addEventListener("click", () => {
    const rawUserId = state.answers["1"]?.trim();
    const userId =
      rawUserId && rawUserId !== "*"
        ? rawUserId.replace(/[^a-zA-Z0-9_-]+/g, "-").replace(/^-+|-+$/g, "")
        : "";
    const fileName = userId ? `user-${userId}-import.txt` : "user-import.txt";
    const blob = new Blob([output], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  });

  panel.querySelector("#edit-button").addEventListener("click", () => {
    navigateToSection(sections.length - 1);
  });

  panel.querySelector("#clear-button").addEventListener("click", () => {
    if (!window.confirm("Clear every response and start again?")) return;
    state.answers = { ...defaultAnswers };
    state.lists = {};
    navigateToSection(0);
  });
}

function navigateToSection(index) {
  state.activeSection = index;
  state.showReview = false;
  renderSection();
  updateProgressChrome();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function openReview() {
  state.showReview = true;
  renderReview();
  updateProgressChrome();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

export function initializeApp() {
  document.querySelector("#brand-link").addEventListener("click", (event) => {
    event.preventDefault();
    navigateToSection(0);
  });
  renderSection();
  updateProgressChrome();
}

if (typeof document !== "undefined" && document.querySelector("#content-panel")) {
  initializeApp();
}
