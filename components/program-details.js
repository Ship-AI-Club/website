import { MessageSquare, Code2, Rocket, Repeat2 } from "lucide-react";

export const PROGRAM_DETAILS = {
  "day-zero": { n: "01", scene: "field", goal: "learn", stage: "Learn the tools", audience: "For AI beginners", icon: MessageSquare, tone: "blue", description: "Turn a blank chat box into useful skills, scheduled routines, a website, and a support agent.", outcome: "AI workflows you can use every day", steps: ["Skills", "Routines", "Agents"] },
  "the-first-build": { n: "02", scene: "workbench", goal: "build", stage: "Build the product", audience: "For first-time product builders", icon: Code2, tone: "violet", description: "Learn the stack, connect interfaces and data, and direct an agent to build and demo a focused product.", outcome: "A working product you can demo", steps: ["Prompt", "Build", "Demo"] },
  "zero-to-launch": { n: "03", scene: "launch", goal: "launch", stage: "Take it to market", audience: "For builders ready to launch", icon: Rocket, tone: "green", description: "Find your audience, sharpen your positioning, and ship a marketing site. Six free sessions led into the GTM hackathon.", outcome: "A live marketing site", steps: ["Position", "Market", "Launch"] },
  "growth-loops": { n: "04", scene: "swell", goal: "grow", stage: "Keep people coming back", audience: "For teams with a live product", icon: Repeat2, tone: "amber", description: "Measure the customer journey, improve activation and retention, and ship a growth loop you can track.", outcome: "A measurable growth loop", steps: ["Measure", "Improve", "Repeat"] },
};
