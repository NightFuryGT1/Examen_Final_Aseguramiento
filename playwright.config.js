// playwright.config.js
// Archivo generado por Playwright, solo ajustamos lo necesario

/** @type {import('@playwright/test').PlaywrightTestConfig} */
const config = {
  use: {
    baseURL: 'https://buggy.justtestit.org/', // 🔴 CAMBIA ESTA URL POR LA TUYA
    headless: true,
  },
  timeout: 60000,
  retries: 0,
};

module.exports = config;
