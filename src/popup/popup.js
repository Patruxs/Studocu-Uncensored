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

function setBusy(isBusy) {
  for (const button of actionButtons) {
    button.disabled = isBusy;
  }
}

function getErrorMessage(error) {
  if (error instanceof Error && error.message) return error.message;
  return t("status.error.generic");
}

async function getCurrentTab() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.id) throw new Error(t("status.error.noTab"));
  return tab;
}

function isSupportedTab(tab) {
  if (!tab.url) return false;
  try {
    return isStudocuHost(new URL(tab.url).hostname);
  } catch {
    return false;
  }
}

async function requireStudocuTab() {
  const tab = await getCurrentTab();
  if (!isSupportedTab(tab)) {
    throw new Error(t("status.error.tab"));
  }
  return tab;
}

async function runTask(task) {
  setBusy(true);
  try {
    await task();
  } catch (error) {
    updateStatus({
      title: t("status.error.title"),
      detail: getErrorMessage(error),
      progress: 100,
      state: "error",
    });
    console.error("[StudocuHelper] Popup action failed:", error);
  } finally {
    setBusy(false);
  }
}

async function clearStudocuCookiesAndReload(tab) {
  updateStatus({
    title: t("status.unblur.reloading"),
    detail: t("status.unblur.notFound"),
    progress: 72,
    state: "working",
  });

  const TLDs = [
    "com", "vn", "de", "fr", "it", "es", "pl", "co", "id", "nl",
    "be", "ch", "at", "in", "ph", "se", "no", "dk", "fi", "pt",
    "ro", "hu", "cz", "gr",
  ];

  let studocuCookies = [];
  for (const tld of TLDs) {
    try {
      const domainCookies = await chrome.cookies.getAll({
        domain: `.studocu.${tld}`,
      });
      studocuCookies = studocuCookies.concat(domainCookies);
    } catch {
    }
  }

  for (const tld of TLDs) {
    try {
      const domainCookies = await chrome.cookies.getAll({
        domain: `studocu.${tld}`,
      });
      studocuCookies = studocuCookies.concat(domainCookies);
    } catch {
    }
  }

  const seen = new Set();
  studocuCookies = studocuCookies.filter((c) => {
    const key = `${c.name}|${c.domain}|${c.path}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  for (const [index, cookie] of studocuCookies.entries()) {
    const cleanDomain = cookie.domain.startsWith(".")
      ? cookie.domain.slice(1)
      : cookie.domain;
    const protocol = cookie.secure ? "https:" : "http:";
    const url = `${protocol}//${cleanDomain}${cookie.path}`;

    await chrome.cookies.remove({
      url,
      name: cookie.name,
      storeId: cookie.storeId,
    });

    const removalProgress = studocuCookies.length
      ? 72 + ((index + 1) / studocuCookies.length) * 23
      : 95;
    setProgress(removalProgress);
  }

  updateStatus({
    title: t("status.unblur.reloading"),
    detail: t("status.unblur.reloadingDetail", { count: studocuCookies.length }),
    progress: 100,
    state: "success",
  });

  setTimeout(() => chrome.tabs.reload(tab.id), 650);
}

// ── Clear cookies & reload (like Studocu-Helper) ──────────