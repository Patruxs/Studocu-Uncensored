((global) => {
  const STUDOCU = (global.__STUDOCU__ = global.__STUDOCU__ || {});
  const S = STUDOCU.selectors || {};
  const dom = STUDOCU.dom || {};
  const cfg = STUDOCU.config || {};


  const NORMAL_PROPS = Object.freeze([
    "position",
    "left",
    "top",
    "bottom",
    "right",
    "font-family",
    "font-weight",
    "font-style",
    "color",
    "background-color",
    "text-align",
    "white-space",
    "display",
    "visibility",
    "opacity",
    "z-index",
    "text-shadow",
    "unicode-bidi",
    "font-feature-settings",
    "padding",
  ]);


  const SCALE_PROPS = Object.freeze(["font-size", "line-height"]);


  const MARGIN_PROPS = Object.freeze([
    "margin-top",
    "margin-right",
    "margin-bottom",
    "margin-left",
  ]);


  const FORCE_STYLES =
    "overflow: visible !important; " +
    "max-width: none !important; " +
    "max-height: none !important; " +
    "clip: auto !important; " +
    "clip-path: none !important; ";


  function parseDimension(value) {
    if (!value || value === "none" || value === "auto" || value === "normal") {
      return null;
    }
    const num = parseFloat(value);
    if (isNaN(num) || num === 0) return null;
    const unit = value.replace(String(num), "");
    return { num, unit };
  }


  function buildProp(style, prop, scaleOpts = {}) {
    const raw = style.getPropertyValue(prop);
    if (!raw || raw === "none" || raw === "auto" || raw === "normal") return "";

    if (scaleOpts.scale && scaleOpts.divisor) {
      const parsed = parseDimension(raw);
      if (parsed) {
        const scaled = parsed.num / scaleOpts.divisor;
        return `${prop}: ${scaled}${parsed.unit} !important; `;
      }
    }
    return `${prop}: ${raw} !important; `;
  }


  function copyComputedStyle(source, target, scaleFactor, opts = {}) {
    const {
      scaleHeight = false,
      scaleWidth = false,
      heightDivisor = cfg.HEIGHT_SCALE_DIVISOR || 4,
      widthDivisor = cfg.WIDTH_SCALE_DIVISOR || 4,
      scaleMargin = false,
      marginDivisor = cfg.MARGIN_DIVISOR || 4,
    } = opts;

    const computed = window.getComputedStyle(source);
    const parts = [];

    for (const prop of NORMAL_PROPS) {
      parts.push(buildProp(computed, prop));
    }

    const widthRaw = computed.getPropertyValue("width");
    if (widthRaw && widthRaw !== "none" && widthRaw !== "auto") {
      if (scaleWidth) {
        const p = parseDimension(widthRaw);
        if (p) {
          parts.push(
            `width: ${p.num / widthDivisor}${p.unit} !important; `
          );
        } else {
          parts.push(`width: ${widthRaw} !important; `);
        }
      } else {
        parts.push(`width: ${widthRaw} !important; `);
      }
    }

    const heightRaw = computed.getPropertyValue("height");
    if (heightRaw && heightRaw !== "none" && heightRaw !== "auto") {
      if (scaleHeight) {
        const p = parseDimension(heightRaw);
        if (p) {
          parts.push(
            `height: ${p.num / heightDivisor}${p.unit} !important; `
          );
        } else {
          parts.push(`height: ${heightRaw} !important; `);
        }
      } else {
        parts.push(`height: ${heightRaw} !important; `);
      }
    }

    for (const prop of MARGIN_PROPS) {
      const raw = computed.getPropertyValue(prop);
      if (!raw || raw === "auto") continue;
      const parsed = parseDimension(raw);
      if (!parsed) {
        parts.push(`${prop}: ${raw} !important; `);
      } else if (scaleMargin && parsed.num !== 0) {
        parts.push(
          `${prop}: ${parsed.num / marginDivisor}${parsed.unit} !important; `
        );
      } else {
        parts.push(`${prop}: ${raw} !important; `);
      }
    }

    for (const prop of SCALE_PROPS) {
      const raw = computed.getPropertyValue(prop);
      const parsed = parseDimension(raw);
      if (parsed) {
        parts.push(
          `${prop}: ${parsed.num / scaleFactor}${parsed.unit} !important; `
        );
      } else if (raw && raw !== "none" && raw !== "auto" && raw !== "normal") {
        parts.push(`${prop}: ${raw} !important; `);
      }
    }

    const tOrigin = computed.getPropertyValue("transform-origin");
    if (tOrigin) {
      parts.push(
        `transform-origin: ${tOrigin} !important; ` +
          `-webkit-transform-origin: ${tOrigin} !important; `
      );
    }

    parts.push(FORCE_STYLES);

    target.style.cssText += parts.join("");
  }


  function deepCloneWithStyles(
    element,
    scaleFactor,
    heightScaleDivisor,
    depth = 0
  ) {
    const clone = element.cloneNode(false);

    const textClass = S.TEXT_CLASS || "t";
    const underClass = S.UNDERSCORE_CLASS || "_";
    const pcClass = S.PC_CLASS || "pc";
    const regex = S.UNDERSCORE_SPAN_REGEX || /^_(?:\d+[a-z]*|[a-z]+\d*)$/i;

    const hasTextClass = dom.hasClass(element, textClass);
    const hasUnderscoreClass = dom.hasClass(element, underClass);

    const shouldScaleMargin =
      element.tagName === "SPAN" &&
      dom.hasClass(element, underClass) &&
      dom.hasClassMatching(element, regex);

    copyComputedStyle(element, clone, scaleFactor, {
      scaleHeight: hasTextClass,
      scaleWidth: hasUnderscoreClass,
      heightDivisor: heightScaleDivisor,
      widthDivisor: cfg.WIDTH_SCALE_DIVISOR || 4,
      scaleMargin: shouldScaleMargin,
      marginDivisor: scaleFactor,
    });

    if (dom.hasClass(element, pcClass)) {
      clone.style.setProperty("transform", "none", "important");
      clone.style.setProperty("-webkit-transform", "none", "important");
      clone.style.setProperty("overflow", "visible", "important");
      clone.style.setProperty("max-width", "none", "important");
      clone.style.setProperty("max-height", "none", "important");
    }

    if (
      element.childNodes.length === 1 &&
      element.childNodes[0].nodeType === Node.TEXT_NODE
    ) {
      clone.textContent = element.textContent;
    } else {
      for (const child of element.childNodes) {
        try {
          if (child.nodeType === Node.ELEMENT_NODE) {
            clone.appendChild(
              deepCloneWithStyles(
                child,
                scaleFactor,
                heightScaleDivisor,
                depth + 1
              )
            );
          } else if (child.nodeType === Node.TEXT_NODE) {
            clone.appendChild(child.cloneNode(true));
          }
        } catch (childErr) {
          STUDOCU.logger?.exception(
            `deepCloneWithStyles: child depth ${depth}`,
            childErr
          );
          // continue with next child; don't lose the whole page
        }
      }
    }

    return clone;
  }

  STUDOCU.styleCloner = {
    copyComputedStyle,
    deepCloneWithStyles,
  };
})(window);
