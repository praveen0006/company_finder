
import { ResearcherAgent } from './agents/ResearcherAgent';
import { AnalystAgent } from './agents/AnalystAgent';
import { MatchmakerAgent } from './agents/MatchmakerAgent';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const skills = `
Machine Learning: Scikit-learn, TensorFlow, PyTorch, Keras. 
Computer Vision: YOLOv8, OpenCV, Object Detection, Image Processing. 
Edge AI: Raspberry Pi, Embedded Inference, Real-Time Processing. 
IoT & Embedded: Arduino, Sensor Integration, Control Systems. 
Sensors: LiDAR, Ultrasonic, Thermal, Optical, Gyroscope. 
Tools: Git, Jupyter Notebook, Twilio API, CAD. 
Programming: Python, Java, SQL.
Bachelor of Technology in Computer Science (AI & ML), Woxsen University.
`;

async function scout() {
  const researcher = new ResearcherAgent();
  const analyst = new AnalystAgent();
  const matchmaker = new MatchmakerAgent();

  const domain = "Junior AI and Machine Vision";
  const location = "Hyderabad or Remote";
  const count = 5;

  console.log("Starting scout for Praveen...");
  
  try {
    const discovered = await researcher.run(domain, location, count);
    console.log(`Found ${discovered.length} companies. Enriching...`);
    
    const enriched = await analyst.runBatch(discovered);
    console.log("Analyzing matches...");
    
    const matches = await matchmaker.run(enriched, skills);
    
    console.log("\n--- RESULTS ---\n");
    console.log(JSON.stringify(matches, null, 2));
  } catch (err) {
    console.error("Error during scout:", err);
  }
}

scout();
