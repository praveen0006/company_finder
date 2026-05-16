import { chromium } from 'playwright'

export async function generatePdfFromHtml(html: string): Promise<Buffer> {
  const browser = await chromium.launch({ headless: true })
  try {
    const page = await browser.newPage()
    
    // Set content and wait for network idle to ensure fonts/styles load
    await page.setContent(html, { waitUntil: 'networkidle' })
    // @ts-ignore
    await page.evaluate(() => document.fonts.ready)

    // Generate PDF
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '0.6in', right: '0.6in', bottom: '0.6in', left: '0.6in' },
    })
    return pdfBuffer
  } finally {
    await browser.close()
  }
}
