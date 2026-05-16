import { askLLM } from '../utils/llm'

const PREMIUM_RESUME_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Resume</title>
<style>
  @font-face { font-family: 'Space Grotesk'; src: url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;700&display=swap'); font-weight: 300 700; }
  @font-face { font-family: 'DM Sans'; src: url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;700&display=swap'); font-weight: 100 1000; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'DM Sans', sans-serif; font-size: 11px; line-height: 1.5; color: #1a1a2e; background: #ffffff; }
  .page { width: 100%; max-width: 800px; margin: 0 auto; padding: 30px; }
  .header { margin-bottom: 20px; }
  .header h1 { font-family: 'Space Grotesk', sans-serif; font-size: 28px; font-weight: 700; color: #1a1a2e; margin-bottom: 6px; }
  .header-gradient { height: 2px; background: linear-gradient(to right, #007c91, #6a1b9a); margin-bottom: 10px; }
  .contact-row { display: flex; flex-wrap: wrap; gap: 8px 14px; font-size: 10.5px; color: #555; }
  .section { margin-bottom: 18px; }
  .section-title { font-family: 'Space Grotesk', sans-serif; font-size: 12px; font-weight: 700; text-transform: uppercase; color: #007c91; border-bottom: 1.5px solid #e2e2e2; padding-bottom: 4px; margin-bottom: 10px; }
  .summary-text { font-size: 11px; line-height: 1.7; color: #2f2f2f; }
  .competency-tag { font-size: 10px; font-weight: 500; color: #004d40; background: #e0f2f1; padding: 4px 10px; border-radius: 3px; border: 1px solid #b2dfdb; display: inline-block; margin: 4px; }
</style>
</head>
<body>
  <div class="page">
    <!--CONTENT-->
  </div>
</body>
</html>
`

const RESUME_PROMPT = `
You are the Resume Tailoring Agent. Your goal is to generate high-performance, ATS-optimized HTML resume content.
Use the following sections:
1. <div class="header"><h1>Name</h1><div class="header-gradient"></div><div class="contact-row"><span>Email</span>...</div></div>
2. <div class="section"><div class="section-title">Professional Summary</div><div class="summary-text">Tailored Summary</div></div>
3. <div class="section"><div class="section-title">Core Competencies</div><div class="competencies-grid"><span class="competency-tag">Skill</span>...</div></div>
4. <div class="section"><div class="section-title">High-Impact Projects</div><div class="project"><h3>Title</h3><p>Details</p></div></div>
5. <div class="section"><div class="section-title">Technical Expertise</div><div class="summary-text">List of skills</div></div>

Rules:
- Highlight the candidate's PATENT and IEEE publications for AI roles.
- Emphasize Edge AI, YOLOv8, and Sensor Fusion if relevant to the job.
- Use valid HTML fragments. No <html> or <body> tags.
- DO NOT invent facts.

Return ONLY the raw HTML string.
`.trim()

export class ResumeAgent {
  async run(baseResume: string, companyName: string, techStack: string[], rolesHiring: string[]): Promise<string> {
    console.log(`📄 [ResumeAgent] Crafting premium resume for ${companyName}...`)
    
    const userPrompt = `
TARGET COMPANY: ${companyName}
TECH STACK: ${techStack.join(', ')}
ROLES HIRING: ${rolesHiring.join(', ')}

CANDIDATE DATA (Base Resume):
${baseResume}

Task: Generate the tailored premium HTML content.
    `.trim()

    const rawHtmlContent = await askLLM(RESUME_PROMPT, userPrompt, 0.2)
    const cleanHtml = rawHtmlContent.replace(/```html|```/gi, '').trim()
    
    return PREMIUM_RESUME_TEMPLATE.replace('<!--CONTENT-->', cleanHtml)
  }
}
