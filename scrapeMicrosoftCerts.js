const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const fs = require("fs");

puppeteer.use(StealthPlugin());

async function scrapeMicrosoftCerts() {
  console.log("🔍 Scraping Microsoft certifications...");

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();
  const url = "https://learn.microsoft.com/en-us/credentials/certifications/";

  console.log("🧭 Navigating to page...");
  await page.goto(url, {
    waitUntil: "networkidle2",
    timeout: 90000,
  });

  // ⏳ Wait a few seconds for page content to fully load
  await new Promise((resolve) => setTimeout(resolve, 5000));

  // 📜 Scroll to trigger lazy loading (if any)
  await page.evaluate(() => {
    window.scrollBy(0, window.innerHeight);
  });

  await new Promise((resolve) => setTimeout(resolve, 3000));

  // 🧪 DEBUG: Save full HTML content for inspection
  const html = await page.content();
  fs.writeFileSync("debug-microsoft-certifications.html", html);
  console.log("📄 Saved page content to debug-microsoft-certifications.html");

  // 🖼️ DEBUG: Take screenshot for visual confirmation
  await page.screenshot({ path: "certs.png", fullPage: true });
  console.log("📸 Screenshot saved as certs.png");

  try {
    await page.waitForSelector("article.card[data-bi-name='card']", { timeout: 30000 });
  } catch (err) {
    console.log("❌ Could not find certification cards. Maybe the page took too long or structure changed.");
    await browser.close();
    return [];
  }

  const certs = await page.evaluate(() => {
    const items = Array.from(document.querySelectorAll('article.card[data-bi-name="card"]'));
    return items.map((el) => {
      const name = el.querySelector("a.card-title")?.innerText.trim();
      const description = el.querySelector("div.card-template-detail")?.innerText.trim() || "Microsoft certification";
      return name
        ? {
            name,
            vendor: "Microsoft",
            price: 165.0,
            description,
          }
        : null;
    }).filter(Boolean);
  });

  await browser.close();

  console.log(`🧪 Scraped ${certs.length} Microsoft certifications.`);
  return certs;
}

module.exports = scrapeMicrosoftCerts;
