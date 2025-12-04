// backend/seedJobs.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import Job from "./models/Job.js";

dotenv.config();

// 🎯 All job seed data
const jobs = [
  {
    id: "1",
    title: "Lead Full Stack Engineer",
    company: "Stark Industries",
    location: "New York, USA (Avengers Tower)",
    type: "Full-Time",
    salary: "₹ 45,00,000 - ₹ 60,00,000 / year",
    workMode: "Hybrid",
    description: `📌 About the job
Work with Tony Stark’s R&D division on internal tools, dashboards and core Stark tech systems.

🛠️ Skills we are seeking
- React, Node.js, Express
- MongoDB or PostgreSQL
- REST APIs, authentication, microservices
- Bonus: TypeScript & WebSockets

🎁 Perks and benefits
- Access to Stark R&D knowledge base
- Hologram-capable workstations
- Avengers cafeteria access
- Transportation is included 🚗`,
  },
  {
    id: "2",
    title: "Senior Backend Engineer",
    company: "Wayne Enterprises",
    location: "Gotham City, USA",
    type: "Full-Time",
    salary: "₹ 40,00,000 - ₹ 55,00,000 / year",
    workMode: "Hybrid",
    description: `📌 About the job
Develop highly secure backend systems supporting Wayne Enterprises infrastructure.

🛠️ Skills we are seeking
- Node.js or Java
- SQL and Redis
- Monitoring, logging, clean architecture
- Strong focus on performance and security

🎁 Perks and benefits
- Access to private R&D labs
- Optional Gotham business trips 😉
- Discreet workplace culture
- Transportation is included 🚗`,
  },
  {
    id: "3",
    title: "Platform Architect",
    company: "LexCorp",
    location: "Metropolis, USA",
    type: "Full-Time",
    salary: "₹ 48,00,000 - ₹ 65,00,000 / year",
    workMode: "Onsite",
    description: `📌 About the job
Architect platform solutions for large data and AI systems.

🛠️ Skills we are seeking
- Distributed system design
- Microservices
- Message queues (Kafka/RabbitMQ)
- Cloud (AWS/Azure/GCP)

🎁 Perks and benefits
- Executive-level influence
- Work on cutting-edge AI projects
- Transportation is included 🚗`,
  },
  {
    id: "4",
    title: "Research Software Engineer",
    company: "Fantastic Four Enterprises",
    location: "Baxter Building, New York, USA",
    type: "Full-Time",
    salary: "₹ 30,00,000 - ₹ 45,00,000 / year",
    workMode: "Hybrid",
    description: `📌 About the job
Create scientific simulation tools for advanced research projects.

🛠️ Skills we are seeking
- Python with scientific libs / Node.js
- Data visualization
- API development
- Numerical computing

🎁 Perks and benefits
- Access to experimental tech
- Work with frontier science teams
- Transportation is included 🚗`,
  },
  {
    id: "5",
    title: "Senior DevOps Engineer",
    company: "Wakanda Inc.",
    location: "Birnin Zana, Wakanda",
    type: "Full-Time",
    salary: "₹ 42,00,000 - ₹ 58,00,000 / year",
    workMode: "Remote",
    description: `📌 About the job
Manage deployment pipelines for vibranium-based tech platforms.

🛠️ Skills we are seeking
- Docker, CI/CD
- Kubernetes, Linux
- Terraform or CloudFormation
- Monitoring (Grafana/Prometheus)

🎁 Perks and benefits
- Access to Wakandan tech culture
- Remote work flexibility
- Transportation is included 🚗`,
  },
  {
    id: "6",
    title: "Frontend UI Engineer",
    company: "Queen Industries",
    location: "Star City, USA",
    type: "Full-Time",
    salary: "₹ 22,00,000 - ₹ 32,00,000 / year",
    workMode: "Hybrid",
    description: `📌 About the job
Design modern UI dashboards for logistics and infrastructure operations.

🛠️ Skills we are seeking
- React, JavaScript
- Strong CSS/UI design
- Component-driven design
- UX principles

🎁 Perks and benefits
- Creative freedom
- Access to prototype systems
- Transportation is included 🚗`,
  },
  {
    id: "7",
    title: "Chief Security Engineer",
    company: "Doom Enterprises",
    location: "Latveria",
    type: "Full-Time",
    salary: "₹ 50,00,000 - ₹ 70,00,000 / year",
    workMode: "Onsite",
    description: `📌 About the job
Lead cybersecurity initiatives for mission-critical systems.

🛠️ Skills we are seeking
- Pen testing, threat modeling
- Encryption, IAM frameworks
- SIEM tools
- Secure coding

🎁 Perks and benefits
- High-impact leadership role
- Access to advanced defensive tech
- Transportation is included 🚗`,
  },
  {
    id: "8",
    title: "Cloud Backend Engineer",
    company: "Oscorp Industries",
    location: "New York, USA",
    type: "Full-Time",
    salary: "₹ 26,00,000 - ₹ 38,00,000 / year",
    workMode: "Hybrid",
    description: `📌 About the job
Develop cloud-based backend systems for biotech and research operations.

🛠️ Skills we are seeking
- Node.js / Java / Go
- REST & GraphQL APIs
- Containerization
- Cloud services

🎁 Perks and benefits
- Work with futuristic biotech tools
- Learning budget & conferences
- Transportation is included 🚗`,
  },
  {
    id: "9",
    title: "Junior Full Stack Developer",
    company: "Parker Industries",
    location: "New York, USA",
    type: "Full-Time",
    salary: "₹ 12,00,000 - ₹ 20,00,000 / year",
    workMode: "Remote",
    description: `📌 About the job
Work on tools and internal apps supporting product development.

🛠️ Skills we are seeking
- Basic React and Node.js
- CRUD applications
- Git collaboration

🎁 Perks and benefits
- Mentorship from senior engineers
- Flexible work hours
- Transportation is included 🚗`,
  },
  {
    id: "10",
    title: "Flight Systems Software Engineer",
    company: "Ferris Aircraft",
    location: "Coast City, USA",
    type: "Full-Time",
    salary: "₹ 35,00,000 - ₹ 50,00,000 / year",
    workMode: "Onsite",
    description: `📌 About the job
Develop and maintain software for flight simulations, telemetry, and ground systems used in advanced aircraft testing.

🛠️ Skills we are seeking
- Strong fundamentals in C++/C or Java/Node.js
- Real-time data processing and streaming
- Experience with telemetry or hardware-integrated systems
- Unit testing and reliability engineering

🎁 Perks and benefits
- Work closely with test pilots and flight engineers
- Access to advanced aerospace simulators
- Onsite hangar and test range exposure
- Transportation is included 🚗`,
  },
  {
    id: "11",
    title: "Data Engineer",
    company: "Ross Enterprises",
    location: "New York, USA",
    type: "Full-Time",
    salary: "₹ 24,00,000 - ₹ 36,00,000 / year",
    workMode: "Hybrid",
    description: `📌 About the job
Build and maintain robust data pipelines powering analytics and reporting across Ross Enterprises.

🛠️ Skills we are seeking
- Strong SQL and ETL design
- Python or Node.js for data workflows
- Data modeling and warehousing basics
- Familiarity with BI tools and dashboards

🎁 Perks and benefits
- Exposure to large-scale enterprise datasets
- Opportunity to influence data strategy
- Supportive, experimentation-friendly environment
- Transportation is included 🚗`,
  },
  {
    id: "12",
    title: "Senior Web Developer",
    company: "Daily Bugle",
    location: "New York, USA",
    type: "Full-Time",
    salary: "₹ 18,00,000 - ₹ 26,00,000 / year",
    workMode: "Remote",
    description: `📌 About the job
Maintain and evolve the high-traffic Daily Bugle news platform for breaking stories (often involving masked vigilantes).

🛠️ Skills we are seeking
- Strong React or modern frontend framework experience
- Performance optimization and Core Web Vitals
- SEO-aware architecture and SSR/SSG basics
- Experience with high-traffic web apps

🎁 Perks and benefits
- Work on a globally recognized media brand
- Remote-friendly culture
- Early access to breaking news content
- Transportation is included 🚗`,
  },
  {
    id: "13",
    title: "Systems Integration Engineer",
    company: "Atlantis Technologies",
    location: "Atlantis (Underwater HQ)",
    type: "Full-Time",
    salary: "₹ 40,00,000 - ₹ 55,00,000 / year",
    workMode: "Hybrid",
    description: `📌 About the job
Integrate underwater sensor networks, communication systems, and surface infrastructure for Atlantean operations.

🛠️ Skills we are seeking
- Solid understanding of network protocols and APIs
- Experience with distributed or edge systems
- Monitoring and fault-tolerant system design
- Nice to have: IoT or hardware integration exposure

🎁 Perks and benefits
- Unique underwater R&D environment
- Collaboration with marine technology experts
- Occasional onsite visits to Atlantis HQ
- Transportation is included 🚗`,
  },
  {
    id: "14",
    title: "Junior Backend Developer",
    company: "Wayne Enterprises",
    location: "Gotham City, USA",
    type: "Full-Time",
    salary: "₹ 10,00,000 - ₹ 18,00,000 / year",
    workMode: "Hybrid",
    description: `📌 About the job
Support backend services used across Wayne Enterprises divisions, building internal tools and APIs.

🛠️ Skills we are seeking
- Basics of Node.js or Java backend
- REST API development and JSON handling
- SQL fundamentals
- Willingness to learn system design and best practices

🎁 Perks and benefits
- Strong mentorship from senior engineers
- Exposure to high-security, enterprise systems
- Night-friendly culture (Gotham style)
- Transportation is included 🚗`,
  },
  {
    id: "15",
    title: "Application Security Engineer",
    company: "CatCo",
    location: "National City, USA",
    type: "Full-Time",
    salary: "₹ 28,00,000 - ₹ 40,00,000 / year",
    workMode: "Hybrid",
    description: `📌 About the job
Review and harden internal and external applications used by CatCo media teams and partners.

🛠️ Skills we are seeking
- Strong grasp of OWASP Top 10
- Secure coding best practices
- Experience with SAST/DAST tools
- Ability to perform code reviews with a security lens

🎁 Perks and benefits
- Work alongside high-impact media teams
- Chance to shape security standards across products
- Modern office in a fast-growing city
- Transportation is included 🚗`,
  },
  {
    id: "16",
    title: "Tech Lead - Enterprise Apps",
    company: "Lord Industries",
    location: "New York, USA",
    type: "Full-Time",
    salary: "₹ 38,00,000 - ₹ 55,00,000 / year",
    workMode: "Hybrid",
    description: `📌 About the job
Lead a cross-functional team building enterprise applications and integration services for Lord Industries.

🛠️ Skills we are seeking
- Strong backend experience (Node.js/Java)
- System and solution architecture
- Team leadership and code review skills
- Experience with integration and legacy modernization

🎁 Perks and benefits
- Tech ownership of mission-critical systems
- Leadership opportunities with visibility to executives
- Budget for tools, learning, and conferences
- Transportation is included 🚗`,
  },
  {
    id: "17",
    title: "SRE (Site Reliability Engineer)",
    company: "Cobblepot Enterprises",
    location: "Gotham City, USA",
    type: "Full-Time",
    salary: "₹ 30,00,000 - ₹ 42,00,000 / year",
    workMode: "Hybrid",
    description: `📌 About the job
Ensure reliability, scalability, and uptime for Cobblepot Enterprises' core services.

🛠️ Skills we are seeking
- Strong Linux and networking fundamentals
- Monitoring, alerting, and incident response
- Scripting for automation (Bash/Python/Node.js)
- Understanding of SLAs, SLOs, and error budgets

🎁 Perks and benefits
- Ownership over production stability
- Hands-on experience with complex systems
- Operations in a unique, high-stakes city
- Transportation is included 🚗`,
  },
  {
    id: "18",
    title: "Cloud Solutions Engineer",
    company: "Worthington Industries",
    location: "Metropolis, USA",
    type: "Full-Time",
    salary: "₹ 32,00,000 - ₹ 46,00,000 / year",
    workMode: "Hybrid",
    description: `📌 About the job
Design and implement scalable cloud-native solutions for internal platforms and client projects.

🛠️ Skills we are seeking
- Strong knowledge of AWS/Azure/GCP
- Containers and orchestration basics (Docker/Kubernetes)
- CI/CD pipelines
- API and microservice design

🎁 Perks and benefits
- Work with modern cloud stacks
- Cross-team collaboration with product and infra
- Learning-rich environment with enterprise clients
- Transportation is included 🚗`,
  },
  {
    id: "19",
    title: "Cybersecurity Analyst",
    company: "Mandarin Enterprises",
    location: "Hong Kong",
    type: "Full-Time",
    salary: "₹ 20,00,000 - ₹ 30,00,000 / year",
    workMode: "Hybrid",
    description: `📌 About the job
Monitor, investigate, and mitigate security incidents across sensitive and high-value systems.

🛠️ Skills we are seeking
- Familiarity with SIEM tools and log analysis
- Incident response basics
- Threat hunting and vulnerability assessment
- Strong analytical and communication skills

🎁 Perks and benefits
- Work at the core of cyber defense operations
- Hands-on exposure to real-world threat scenarios
- Fast-paced, globally connected environment
- Transportation is included 🚗`,
  },
  {
    id: "20",
    title: "Principal Engineer",
    company: "Bendix Enterprises",
    location: "Tokyo, Japan",
    type: "Full-Time",
    salary: "₹ 45,00,000 - ₹ 65,00,000 / year",
    workMode: "Onsite",
    description: `📌 About the job
Define technical direction and lead large-scale engineering projects using cutting-edge automation technologies.

🛠️ Skills we are seeking
- High-level architecture design
- Strong programming fundamentals
- Leadership & mentoring experience
- Exposure to robotics or industrial systems

🎁 Perks and benefits
- Strategic involvement in high-impact projects
- Collaboration with robotics R&D teams
- Premium workspace in Tokyo
- Transportation is included 🚗`,
  },
  {
    id: "21",
    title: "Lead Engineer - Steelworks Platform",
    company: "Steelworks",
    location: "Metropolis, USA",
    type: "Full-Time",
    salary: "₹ 34,00,000 - ₹ 48,00,000 / year",
    workMode: "Hybrid",
    description: `📌 About the job
Lead development of engineering dashboards and operational tools managing the Steelworks infrastructure.

🛠️ Skills we are seeking
- Full stack background
- Strong understanding of APIs
- Team collaboration and agile execution
- Knowledge of industrial software (bonus)

🎁 Perks and benefits
- Close collaboration with infrastructure leadership
- Modern tech stack & innovation-focused team
- Access to enterprise-grade development tools
- Transportation is included 🚗`,
  },
  {
    id: "22",
    title: "Tools Developer",
    company: "Stilt-Man Enterprises",
    location: "Chicago, USA",
    type: "Full-Time",
    salary: "₹ 14,00,000 - ₹ 22,00,000 / year",
    workMode: "Remote",
    description: `📌 About the job
Build internal tools and prototypes supporting unconventional engineering projects (expect occasional height changes).

🛠️ Skills we are seeking
- Fast prototyping in JavaScript or Python
- REST APIs
- Basic frontend development
- Problem-solving mindset

🎁 Perks and benefits
- Creative freedom in tool development
- Exposure to experimental engineering use-cases
- Remote flexibility
- Transportation is included 🚗`,
  },
  {
    id: "23",
    title: "Senior Data Scientist",
    company: "Stagg Industries",
    location: "Metropolis, USA",
    type: "Full-Time",
    salary: "₹ 38,00,000 - ₹ 55,00,000 / year",
    workMode: "Hybrid",
    description: `📌 About the job
Design predictive models, analyze business data, and deploy machine learning solutions to enhance decision-making.

🛠️ Skills we are seeking
- Python + ML libraries
- Strong SQL and data wrangling
- Model building and deployment
- Understanding of forecasting and optimization

🎁 Perks and benefits
- Work with real-world enterprise datasets
- Impact business strategies via data
- Mentorship programs and learning budget
- Transportation is included 🚗`,
  },
  {
    id: "24",
    title: "Backend Engineer - Defense Systems",
    company: "Global Defense",
    location: "Washington D.C., USA",
    type: "Full-Time",
    salary: "₹ 32,00,000 - ₹ 46,00,000 / year",
    workMode: "Onsite",
    description: `📌 About the job
Develop highly reliable backend systems powering mission-critical defense and monitoring applications.

🛠️ Skills we are seeking
- Strong backend fundamentals (Java/Node/C++)
- Focus on security and reliability
- Real-time data handling experience
- Knowledge of strict SLA environments

🎁 Perks and benefits
- High-impact, real-world projects
- Secure and structured work environment
- Collaboration with defense experts
- Transportation is included 🚗`,
  },
  {
    id: "25",
    title: "R&D Software Engineer",
    company: "Gold Enterprises",
    location: "London, UK",
    type: "Full-Time",
    salary: "₹ 26,00,000 - ₹ 38,00,000 / year",
    workMode: "Hybrid",
    description: `📌 About the job
Prototype innovative software and support experimental product ideas in Gold Enterprises' research division.

🛠️ Skills we are seeking
- Strong coding fundamentals
- Adaptability & rapid learning ability
- Prototyping mindset
- Bonus: experience with emerging tech

🎁 Perks and benefits
- Work with advanced R&D teams
- Innovation-focused environment
- Exposure to next-gen product development
- Transportation is included 🚗`,
  },
  {
    id: "26",
    title: "Frontend Engineer",
    company: "Ferris Aircraft",
    location: "Coast City, USA",
    type: "Full-Time",
    salary: "₹ 20,00,000 - ₹ 30,00,000 / year",
    workMode: "Hybrid",
    description: `📌 About the job
Build web interfaces and control center dashboards for aircraft systems handling real-time telemetry.

🛠️ Skills we are seeking
- React and responsive UI development
- Experience with real-time updates
- UI/UX fundamentals
- Good decision-making under pressure

🎁 Perks and benefits
- Work with aerospace engineers
- Test access to simulation systems
- Futuristic user interface projects
- Transportation is included 🚗`,
  },
  {
    id: "27",
    title: "Product Engineer",
    company: "CatCo Worldwide Media",
    location: "National City, USA",
    type: "Full-Time",
    salary: "₹ 18,00,000 - ₹ 28,00,000 / year",
    workMode: "Remote",
    description: `📌 About the job
Collaborate with product and editorial teams to build internal media tools and content systems.

🛠️ Skills we are seeking
- Full stack JS experience
- Product thinking
- Understanding of content workflows
- Good communication and documentation

🎁 Perks and benefits
- Creative media-tech environment
- Fully remote work setup
- Visibility across editorial operations
- Transportation is included 🚗`,
  },
  {
    id: "28",
    title: "Lab Systems Engineer",
    company: "S.T.A.R. Labs",
    location: "Central City, USA",
    type: "Full-Time",
    salary: "₹ 34,00,000 - ₹ 50,00,000 / year",
    workMode: "Hybrid",
    description: `📌 About the job
Develop software connecting lab hardware, sensors, and data processing systems for high-speed research teams.

🛠️ Skills we are seeking
- APIs & device integration
- Experience in Python or Node.js
- Debugging and troubleshooting skills
- Real-time system familiarity

🎁 Perks and benefits
- Access to futuristic lab equipment
- Work with world-renowned researchers
- Fast-paced, innovative environment
- Transportation is included 🚗`,
  },
  {
    id: "29",
    title: "Platform Engineer",
    company: "Brock Enterprises",
    location: "San Francisco, USA",
    type: "Full-Time",
    salary: "₹ 28,00,000 - ₹ 40,00,000 / year",
    workMode: "Hybrid",
    description: `📌 About the job
Work on scalable and high-availability platforms. Must be comfortable around cutting-edge biotech computing systems.

🛠️ Skills we are seeking
- Backend + infrastructure basics
- Monitoring, scaling & logging
- AWS/GCP or Kubernetes knowledge
- Incident handling

🎁 Perks and benefits
- Work with next-gen biotech platforms
- Hands-on infra scaling projects
- Innovation-minded engineering culture
- Transportation is included 🚗`,
  },
  {
    id: "30",
    title: "Senior Software Engineer",
    company: "Tanaka Corporation",
    location: "Tokyo, Japan",
    type: "Full-Time",
    salary: "₹ 32,00,000 - ₹ 46,00,000 / year",
    workMode: "Hybrid",
    description: `📌 About the job
Build high-performance software systems powering robotics and industrial automation.

🛠️ Skills we are seeking
- Strong problem-solving ability
- Experience building production systems
- Node.js/Java/C++ experience
- Knowledge of robotics or automation (bonus)

🎁 Perks and benefits
- Work with advanced robotics teams
- Engineering-driven organization
- Tech innovation budget
- Transportation is included 🚗`,
  },
];

// 🌱 Seeder
const seedJobs = async () => {
  try {
    console.log("🔌 Connecting to MongoDB...");
    await connectDB();

    console.log("🗑️ Clearing existing jobs...");
    await Job.deleteMany();

    // Drop custom id field before inserting (Mongo will create _id)
    const docs = jobs.map(({ id, ...rest }) => rest);

    console.log("🌱 Inserting seeded jobs...");
    const result = await Job.insertMany(docs);
    console.log(`✅ Jobs successfully seeded: ${result.length} documents`);

    await mongoose.connection.close();
    console.log("🔌 DB connection closed");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding jobs:", error);
    process.exit(1);
  }
};

seedJobs();
