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
