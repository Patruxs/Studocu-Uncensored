const statusPanel = document.getElementById("status");
const statusText = document.getElementById("status-text");
const statusDetail = document.getElementById("status-detail");
const progressTrack = document.getElementById("progress-track");
const progressFill = document.getElementById("progress-fill");
const progressValue = document.getElementById("progress-value");
const siteContext = document.getElementById("site-context");
const actionButtons = [...document.querySelectorAll(".action")];

const i18n = window.__POPUP_I18N__;
const t = (key, params) => i18n?.translate(key, params) ?? key;

const STUDOCU_HOST_RE = /(^|\.)studocu\.[a-z]{2,}(\.[a-z]{2,})?$/;

function isStudocuHost(hostname) {
  return STUDOCU_HOST_RE.test(hostname);
}

function setProgress(value) {
  const safeValue = Math.max(0, Math.min(100, Math.round(value)));
  progressFill.style.width = `${safeValue}%`;
  progressValue.textContent = `${safeValue}%`;
  progressTrack.setAttribute("aria-valuenow", String(safeValue));
}

function updateStatus({ title, detail, progress, state = "ready" }) {
  statusText.textContent = title;
  statusDetail.textContent = detail;
  statusPanel.dataset.state = state;
  setProgress(progress);
}
