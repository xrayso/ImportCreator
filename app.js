export const sections = [
  {
    eyebrow: "01 · Identity",
    title: "Who is this record for?",
    description: "Start with the user’s core Epic identity and account details.",
    fields: [
      { id: "1", label: "User ID", placeholder: "Enter the user ID" },
      { id: "2", label: "User name OT", placeholder: "Enter the user name OT" },
      { id: "45", label: "System login", placeholder: "Enter the system login" },
      { id: "50", label: "User status", placeholder: "Enter the user status" },
      { id: "55", label: "Login blocked", placeholder: "Enter the required value" },
      {
        id: "150",
        label: "Email address",
        placeholder: "name@example.com",
        type: "email",
      },
      { id: "280", label: "RPT GRP One", placeholder: "Enter RPT GRP One" },
    ],
  },
  {
    eyebrow: "02 · Templates",
    title: "Configure templates",
    description:
      "Add the default template, linkable templates, and their access rules.",
    fields: [
      {
        id: "1101",
        label: "Default linkable template",
        placeholder: "Enter the default template",
      },
      {
        id: "1110",
        label: "Linkable templates",
        placeholder: "Enter one or more templates",
        type: "textarea",
        helper: "Use the delimiter required by your import when entering multiple values.",
      },
      {
        id: "1111",
        label: "Linkable templates effective from date",
        placeholder: "Enter the date in your required format",
      },
      {
        id: "1112",
        label: "Linkable templates effective to date",
        placeholder: "Enter the date in your required format",
      },
      {
        id: "1115",
        label: "Linkable templates login types",
        placeholder: "Enter the login types",
      },
      {
        id: "1118",
        label: "Linkable templates login provider blueprint",
        placeholder: "Enter the provider blueprint",
      },
      {
        id: "1119",
        label: "Linkable templates exclusive access group",
        placeholder: "Enter the exclusive access group",
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
        label: "Sub-templates",
        placeholder: "Enter the sub-templates",
        type: "textarea",
        helper: "Use the delimiter required by your import when entering multiple values.",
      },
      {
        id: "9207",
        label: "Sub-template",
        placeholder: "Enter the sub-template",
      },
      {
        id: "17500",
        label: "User-specific environment provider ID",
        placeholder: "Enter the provider ID",
        helper: "This is one combined Epic item.",
      },
      {
        id: "19601",
        label: "HR system department",
        placeholder: "Enter the department",
      },
      {
        id: "19602",
        label: "HR system job role",
        placeholder: "Enter the job role",
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
        label: "Job category validation manager",
        placeholder: "Enter the manager value",
      },
      {
        id: "19611",
        label: "Job category validation status",
        placeholder: "Enter the validation status",
      },
      {
        id: "19612",
        label: "Job category validation comment",
        placeholder: "Enter a comment",
        type: "textarea",
      },
      {
        id: "19615",
        label: "Job category validation assigned jobs",
        placeholder: "Enter the assigned jobs",
        type: "textarea",
        helper: "Use the delimiter required by your import when entering multiple jobs.",
      },
    ],
  },
];

export const allFields = sections.flatMap((section) => section.fields);

export function buildTextOutput(answers) {
  return allFields
    .map((field) => {
      const value = (answers[field.id] ?? "").replace(/\r?\n/g, " ").trim();
      return `${field.id}=${value}`;
    })
    .join("\r\n");
}

const state = {
  activeSection: 0,
  showReview: false,
  answers: {},
};

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

function fieldMarkup(field) {
  const answer = state.answers[field.id] ?? "";
  const safeAnswer = answer
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll('"', "&quot;");
  const input =
    field.type === "textarea"
      ? `<textarea data-field-id="${field.id}" placeholder="${field.placeholder}" rows="3">${safeAnswer}</textarea>`
      : `<input data-field-id="${field.id}" placeholder="${field.placeholder}"
          type="${field.type ?? "text"}" value="${safeAnswer}" />`;

  return `
    <label class="field ${field.type === "textarea" ? "wide" : ""}">
      <span class="field-label">
        <span>${field.label}</span>
        <small>#${field.id}</small>
      </span>
      ${input}
      ${field.helper ? `<span class="field-helper">${field.helper}</span>` : ""}
    </label>`;
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
          Every line contains the Epic item ID, an equals sign, and your
          response. Blank responses are kept as blank values.
        </span>
      </div>

      <div class="review-summary">
        <div><strong>${allFields.length}</strong><span>Total items</span></div>
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
    const userId = state.answers["1"]?.trim().replace(/[^a-zA-Z0-9_-]+/g, "-");
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
    state.answers = {};
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

if (typeof document !== "undefined") {
  initializeApp();
}
