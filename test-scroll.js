const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:8080/src/project1-docs.html#privacy');
  
  // Wait for content to load
  await page.waitForTimeout(1000);
  
  const metrics = await page.evaluate(() => {
    return {
      html: { clientHeight: document.documentElement.clientHeight, scrollHeight: document.documentElement.scrollHeight },
      body: { clientHeight: document.body.clientHeight, scrollHeight: document.body.scrollHeight },
      docsPage: { clientHeight: document.querySelector('.docs-page').clientHeight, scrollHeight: document.querySelector('.docs-page').scrollHeight },
      docsMain: { clientHeight: document.querySelector('.docs-main').clientHeight, scrollHeight: document.querySelector('.docs-main').scrollHeight },
      docsMainInner: { clientHeight: document.querySelector('.docs-main-inner').clientHeight, scrollHeight: document.querySelector('.docs-main-inner').scrollHeight },
      docToc: { clientHeight: document.querySelector('.doc-toc').clientHeight, scrollHeight: document.querySelector('.doc-toc').scrollHeight, top: getComputedStyle(document.querySelector('.doc-toc')).top, position: getComputedStyle(document.querySelector('.doc-toc')).position }
    };
  });
  console.log(metrics);
  await browser.close();
})();
