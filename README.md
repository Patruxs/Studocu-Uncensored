# Studocu Uncensored

Studocu Uncensored is a Chrome extension that cleans up Studocu document pages for easier reading, copying, and printing. It removes blur and obstructive overlays from content already loaded in the page, restores scrolling and text selection, and turns the visible document into a print-ready PDF.

Built with Manifest V3. No build step or third-party dependencies required.

## What it does

- Removes CSS blur and watermark layers without reloading the page
- Hides upgrade prompts, modal overlays, banners, and advertisements
- Restores page scrolling and text selection
- Auto-scrolls through lazy-loaded documents to collect every available page
- Rebuilds document pages in a clean, printable viewer
- Lets you preview the result, choose a filename, and print or save it as a PDF
- Supports English and Vietnamese interface strings

> [!NOTE]
> The extension can only process content that Studocu sends to your browser. It does not download pages or assets that are unavailable in the document page.

## Installation

The extension is not distributed through the Chrome Web Store. Install it as an unpacked extension:

1. Clone this repository or download and extract its source code.
2. Open `chrome://extensions/` in Chrome.
3. Enable **Developer mode** in the upper-right corner.
4. Select **Load unpacked**.
5. Choose the repository folder containing `manifest.json`.
6. Optionally pin **Studocu Uncensored** from Chrome's Extensions menu.

Chrome keeps the unpacked extension linked to this folder. After pulling or editing the source, return to `chrome://extensions/` and select the extension's reload button.

### Development build

To keep a clean `dist/` extension directory without `node_modules`, run:

```bash
npm run dev
```

This copies `manifest.json` and `src/` into `dist/`, then updates `dist/` whenever either source changes. Load the `dist/` directory with **Load unpacked**. After changing extension code, select the extension's reload button in `chrome://extensions/` to make Chrome use the updated files.

To create `dist/` once without watching for changes, run `npm run build`.

## Usage

Open a document on `studocu.com` or `studocu.vn`, then select the extension icon. The popup provides two actions.

### Unblur a document

Select **Unblur & Watermark** to remove blur, overlays, and selection restrictions from the current page. This normally updates the live page without a reload.

If no removable elements are found, the extension uses a fallback that clears Studocu cookies and reloads the active tab. You may need to sign in to Studocu again afterward.

### Save a document as PDF

1. Select **Create PDF File**.
2. Keep the document tab open while the extension scrolls through the page and loads available content.
3. Wait for the preview bar to appear at the bottom of the page.
4. Enter the filename you want.
5. Select **Preview** to inspect the result in a new tab, or **Print PDF** to open Chrome's print dialog.
6. In the print dialog, choose **Save to PDF** as the destination and save the file.

Use the close button or press `Esc` to exit the generated viewer and return to the original page.

## Permissions and privacy

The extension requests only the browser access needed for its two workflows:

| Permission | Purpose |
| --- | --- |
| `activeTab` | Runs the requested action in the Studocu tab you are viewing |
| `scripting` | Injects the cleanup and PDF-generation modules into that tab |
| `cookies` | Clears Studocu cookies when the no-reload cleanup cannot find removable elements |
| `studocu.com` and `studocu.vn` host access | Applies early cleanup styles and allows the extension to run on supported Studocu pages |

All document processing happens locally in the browser. The source contains no analytics, remote API calls, or data-upload service.

## How it works

The cleanup stylesheet runs at `document_start` so common overlays are hidden before they paint. When you request an unblur, the extension also inspects the live DOM, removes blur-related styles, hides obstructive elements, and restores text selection.

For PDF export, the extension progressively scrolls through the document while observing newly inserted pages. It then clones each available page with its computed styles, combines background and text layers in a dedicated viewer, and applies print-specific page breaks and sizing.

## Project structure

```text
.
├── manifest.json
├── docs/
│   ├── README.md
│   └── upgrade-plan.md
└── src/
    ├── popup/
    │   ├── popup.html
    │   ├── popup.css
    │   └── popup.js
    └── content/
        ├── core/
        │   ├── config.js          # Runtime constants and tunable values
        │   ├── i18n.js            # English and Vietnamese interface strings
        │   ├── logger.js          # Leveled console logging
        │   └── selectors.js       # Central registry of Studocu selectors
        ├── shared/
        │   ├── dom-utils.js       # DOM lookup and measurement helpers
        │   ├── storage.js         # Promise-based Chrome storage helpers
        │   └── style-cloner.js    # Computed-style cloning and scaling
        ├── features/
        │   ├── unblur/
        │   │   └── unblur.js      # Live DOM cleanup
        │   └── pdf-export/
        │       ├── auto-scroller.js   # Lazy-page loading and progress tracking
        │       ├── pdf-builder.js     # Viewer, preview, and print generation
        │       └── injector.js        # PDF workflow orchestration
        └── styles/
            ├── early-cleanup.css  # Cleanup styles injected before page paint
            └── viewer.css         # Preview viewer and print styles
```

## Maintenance

Studocu can change its page structure at any time. Site-specific selectors are centralized in `src/content/core/selectors.js`; update that file first when page detection, overlay removal, or PDF extraction stops working.

Other common adjustments live in `src/content/core/config.js`, including scroll timing, page scaling, timeouts, log level, and the default language. After making a change, reload the unpacked extension before testing it.

## Troubleshooting

**The extension does not appear to run**

Make sure the active tab is a document page on `studocu.com` or `studocu.vn`, then reload the extension and the page.

**Some pages are missing from the PDF**

Wait for the Studocu document to finish its initial load, run the export again, and leave the tab focused until the preview bar appears. Very long documents can take up to 90 seconds to settle.

**The preview tab does not open**

Allow popups for the current Studocu site, then select **Preview** again. You can still use **Print PDF** without opening a preview tab.

**The layout looks different from the source document**

The exporter reconstructs pages from the DOM and computed styles available in the browser. Complex or newly changed Studocu layouts may require selector or scaling updates.

## Disclaimer

This project is intended for personal learning and research. Use it responsibly, follow the terms that apply to your Studocu account, and respect authors' and publishers' rights.
