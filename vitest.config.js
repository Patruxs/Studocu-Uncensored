import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "happy-dom",
    include: ["tests/**/*.test.js"],
    setupFiles: ["./tests/setup.js"],
    coverage: {
      provider: "istanbul",
      include: ["src/content/**/*.js"],
      exclude: [
        "src/content/features/pdf-export/injector.js",
        "src/content/styles/**",
      ],
      thresholds: {
        statements: 40,
        branches: 30,
        functions: 40,
        lines: 40,
      },
    },
  },
});
