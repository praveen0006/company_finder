
import fs from 'fs';
import path from 'path';
import { ResumeAgent } from './agents/ResumeAgent';
import { generatePdfFromHtml } from './utils/pdf';
import dotenv from 'dotenv';

dotenv.config();

const baseResume = fs.readFileSync(path.join(__dirname, '../../career-ops-temp/cv.md'), 'utf-8');

const targetCompanies = [
  {
    name: 'AegisVision',
    techStack: ['YOLOv8', 'OpenCV', 'PyTorch', 'TensorFlow', 'Python'],
    roles: ['Junior Computer Vision Engineer', 'Machine Learning Intern']
  },
  {
    name: 'Mavionix AI',
    techStack: ['PyTorch', 'Deep Learning', 'Computer Vision', 'Edge AI'],
    roles: ['Junior AI Research Engineer', 'Embedded Systems Intern']
  },
  {
    name: 'PolyAI',
    techStack: ['Python', 'LLMs', 'Conversational AI'],
    roles: ['Agent Designer']
  }
];

async function generateAllResumes() {
  const agent = new ResumeAgent();
  const outputDir = path.join(__dirname, '../data/resumes');
  
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  for (const company of targetCompanies) {
    try {
      console.log(`Working on ${company.name}...`);
      const html = await agent.run(baseResume, company.name, company.techStack, company.roles);
      const pdf = await generatePdfFromHtml(html);
      const fileName = `${company.name.replace(/\s+/g, '_')}_Resume.pdf`;
      const filePath = path.join(outputDir, fileName);
      fs.writeFileSync(filePath, pdf);
      console.log(`✅ Saved: ${filePath}`);
    } catch (err) {
      console.error(`❌ Failed for ${company.name}:`, err);
    }
  }
}

generateAllResumes();
