import { askLLM } from '../utils/llm'

const RESUME_HTML_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Resume</title>
  <style>
    body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; margin: 0 auto; max-width: 800px; padding: 20px; }
    h1 { font-size: 24px; border-bottom: 2px solid #333; padding-bottom: 5px; margin-bottom: 20px; }
    h2 { font-size: 18px; color: #555; border-bottom: 1px solid #ddd; margin-top: 20px; }
    p { margin: 10px 0; font-size: 14px; }
    ul { margin: 10px 0; padding-left: 20px; font-size: 14px; }
    li { margin-bottom: 5px; }
    .header { text-align: center; margin-bottom: 30px; }
    .header h1 { border: none; margin-bottom: 5px; }
    .header p { color: #666; }
  </style>
</head>
<body>
  <!--CONTENT-->
</body>
</html>
`

const RESUME_PROMPT = `
You are the Resume Tailoring Agent. Your goal is to take a candidate's base resume and optimize it for a specific target company.
You must return valid HTML content (without the <html> or <body> tags, just the inner content).
Use simple semantic HTML tags: <div class="header"><h1>Name</h1><p>Contact Info</p></div>, <h2>Section</h2>, <ul><li>Item</li></ul>, <p>.

Rules:
1. Emphasize skills from the base resume that match the target company's tech stack.
2. DO NOT invent or hallucinate experience the candidate does not have.
3. Tailor the professional summary to mention the specific company and role.
4. Keep the design clean and professional.

Return ONLY the raw HTML string. No markdown code blocks.
`.trim()

export class ResumeAgent {
  async run(baseResume: string, companyName: string, techStack: string[], rolesHiring: string[]): Promise<string> {
    console.log(`📄 [ResumeAgent] Tailoring resume for ${companyName}...`)
    
    const userPrompt = `
TARGET COMPANY: ${companyName}
TECH STACK: ${techStack.join(', ')}
ROLES HIRING: ${rolesHiring.join(', ')}

BASE RESUME:
${baseResume}

Task: Generate the tailored HTML resume content.
    `.trim()

    const rawHtmlContent = await askLLM(RESUME_PROMPT, userPrompt, 0.3)
    
    // Clean up markdown fences if Groq outputs them
    const cleanHtml = rawHtmlContent.replace(/```html|```/gi, '').trim()
    
    console.log(`📄 [ResumeAgent] Resume tailored. Injecting into template...`)
    return RESUME_HTML_TEMPLATE.replace('<!--CONTENT-->', cleanHtml)
  }
}
