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
