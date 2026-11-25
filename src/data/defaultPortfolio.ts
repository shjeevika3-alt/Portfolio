import { PortfolioData } from '../types/portfolio';

export const DEFAULT_PORTFOLIO_DATA: PortfolioData = {
  profile: {
    name: 'Jeevika',
    headline: 'Building Ideas into Intelligent Digital Solutions.',
    identityLine: 'Aspiring Software Engineer | AI Enthusiast | Future Full-Stack Developer',
    degreeShort: 'Bachelor of Engineering (BE)',
    department: 'Computer Science and Engineering (CSE)',
    year: '2nd Year',
    college: 'Atria Institute of Technology',
    city: 'Bengaluru, Karnataka',
    profilePhotoUrl: '',
    aboutParagraphs: [
      'I am a second-year Computer Science and Engineering student at Atria Institute of Technology, Bengaluru, passionate about technology, software development, artificial intelligence, and structured problem-solving.',
      'I enjoy exploring new technologies, developing practical web and AI-powered projects, and transforming innovative ideas into useful digital solutions.',
      'My learning journey centers on strengthening core programming fundamentals while applying modern development workflows and prompt engineering to solve everyday problems.',
    ],
    careerGoal:
      'I am continuously improving my programming, analytical thinking, and engineering skills. My goal is to become a skilled software engineer, gain industry internship experience, collaborate with talented peers, and contribute to meaningful technological innovations.',
    resumeSummary:
      'Second-year Computer Science and Engineering undergraduate at Atria Institute of Technology, Bengaluru, focused on software development, AI-integrated web applications, and practical problem-solving. Built and deployed working AI web platforms including SmartFood AI, FindIt AI, and Sentinel AI.',
  },
  skills: [
    // Programming
    {
      id: 'skill-c',
      name: 'C Programming',
      category: 'Programming',
      level: 68,
      status: 'Intermediate',
      note: 'Core syntax, pointers, arrays, and foundational data structures.',
    },
    {
      id: 'skill-python',
      name: 'Python',
      category: 'Programming',
      level: 72,
      status: 'Intermediate',
      note: 'Scripting, problem solving, and AI/ML conceptual prototyping.',
    },
    {
      id: 'skill-java',
      name: 'Java',
      category: 'Programming',
      level: 38,
      status: 'Learning',
      note: 'Currently learning object-oriented programming principles.',
    },
    // Web Development
    {
      id: 'skill-html',
      name: 'HTML5',
      category: 'Web Development',
      level: 82,
      status: 'Proficient',
      note: 'Semantic markup, accessible document structure, and SEO basics.',
    },
    {
      id: 'skill-css',
      name: 'CSS3',
      category: 'Web Development',
      level: 76,
      status: 'Proficient',
      note: 'Responsive layouts, Flexbox, Grid, and modern styling.',
    },
    {
      id: 'skill-js',
      name: 'JavaScript',
      category: 'Web Development',
      level: 64,
      status: 'Intermediate',
      note: 'DOM interaction, async API calls, and application logic.',
    },
    // Tools and Technologies
    {
      id: 'skill-git',
      name: 'Git',
      category: 'Tools and Technologies',
      level: 65,
      status: 'Intermediate',
      note: 'Branching, commits, and collaborative version control workflows.',
    },
    {
      id: 'skill-github',
      name: 'GitHub',
      category: 'Tools and Technologies',
      level: 70,
      status: 'Intermediate',
      note: 'Repository management, code hosting, and deployment integration.',
    },
    {
      id: 'skill-vscode',
      name: 'VS Code',
      category: 'Tools and Technologies',
      level: 85,
      status: 'Proficient',
      note: 'Daily editor setup, debugging, extensions, and terminal workflow.',
    },
    {
      id: 'skill-ai-builders',
      name: 'AI Website Builders',
      category: 'Tools and Technologies',
      level: 80,
      status: 'Proficient',
      note: 'Rapid prototyping and full-stack deployment using modern AI workflows.',
    },
    // AI and Development
    {
      id: 'skill-ai-apps',
      name: 'AI-Powered Applications',
      category: 'AI and Development',
      level: 72,
      status: 'Intermediate',
      note: 'Designing user-facing products around intelligent classification and recommendations.',
    },
    {
      id: 'skill-prompt-eng',
      name: 'Prompt Engineering',
      category: 'AI and Development',
      level: 78,
      status: 'Proficient',
      note: 'Structured system prompting, iterative refinement, and constraint design.',
    },
    {
      id: 'skill-ml-basics',
      name: 'Basic Machine Learning Concepts',
      category: 'AI and Development',
      level: 45,
      status: 'Foundational',
      note: 'Supervised learning concepts, anomaly detection basics, and evaluation metrics.',
    },
  ],
  projects: [
    {
      id: 'smartfood-ai',
      title: 'SmartFood AI',
      category: 'AI Application',
      summary:
        'An AI-powered food management platform designed to reduce household and community food waste through intelligent inventory tracking, expiry prediction, recipe suggestions, and surplus donation coordination.',
      problemStatement:
        'Households and local kitchens frequently discard usable groceries because expiry dates go untracked and people lack immediate ideas for combining leftover ingredients.',
      proposedSolution:
        'Designed a unified web platform that tracks pantry stock and shelf-life timelines, flags items at risk of spoilage, recommends recipes from available ingredients, and streamlines surplus food donations.',
      features: [
        'Food inventory management with category organization',
        'Expiry date tracking and timely spoilage alerts',
        'Food waste risk prediction for stored items',
        'AI-based recipe recommendations from existing stock',
        'Food donation management to share surplus items',
        'Interactive dashboard and waste-reduction analytics',
      ],
      technologies: ['AI Workflows', 'HTML / CSS', 'JavaScript', 'Responsive UI', 'Analytics Dashboard'],
      roleAndContributions:
        'Conceived the product workflow, structured the inventory and expiry tracking logic, designed the dashboard layout, and deployed the live web application.',
      screenshotUrl: '/src/assets/images/project_smartfood_ai_1795578448920.jpg',
      liveDemoUrl: 'https://fresh-stock-recipe-finder.lovable.app',
    },
    {
      id: 'findit-ai',
      title: 'FindIt AI',
      category: 'Web Platform',
      summary:
        'An intelligent lost-and-found digital platform built to help campuses and communities report, match, and recover misplaced belongings efficiently.',
      problemStatement:
        'Traditional lost-and-found processes rely on scattered notice boards or chat groups, making it slow and unreliable to match lost items with found reports.',
      proposedSolution:
        'Created a structured digital lost-and-found system where users can log lost or found items with key descriptors, browse categorized listings, and receive smart item match suggestions.',
      features: [
        'Dedicated Lost and Found item reporting flows',
        'AI-assisted item categorization and description matching',
        'Location, date, and category search filters',
        'Structured item status tracking (Reported, Matched, Recovered)',
        'Clear verification workflow to help owners reclaim belongings safely',
      ],
      technologies: ['AI Studio', 'Web Application', 'JavaScript', 'Smart Matching Logic', 'UI/UX Design'],
      roleAndContributions:
        'Defined the user journey for both finders and owners, built the structured item reporting and matching interface, and deployed the interactive prototype.',
      screenshotUrl: '/src/assets/images/project_findit_ai_1795578451031.jpg',
      liveDemoUrl: 'https://findit-ai-9597jeevika.ai.studio',
    },
    {
      id: 'sentinel-ai',
      title: 'Sentinel AI',
      category: 'Cybersecurity',
      summary:
        'An AI-powered cybersecurity monitoring platform created to surface suspicious activities, classify potential threats, and organize security incidents in a single view.',
      problemStatement:
        'Monitoring security logs manually makes it difficult to spot anomalous patterns early or prioritize which suspicious events require immediate review.',
      proposedSolution:
        'Built an intelligent security monitoring dashboard that organizes incoming events, classifies threat severity, highlights behavioral anomalies, and tracks incident resolution.',
      features: [
        'Centralized security monitoring dashboard',
        'Automated threat classification by severity',
        'Anomaly detection indicators across activity feeds',
        'Structured incident tracking and status history',
        'Visual security analytics and alert summaries',
      ],
      technologies: ['AI Threat Logic', 'HTML / CSS', 'JavaScript', 'Security Analytics', 'Vercel'],
      roleAndContributions:
        'Designed the incident monitoring experience, structured the threat classification and anomaly presentation, and deployed the live interface on Vercel.',
      screenshotUrl: '/src/assets/images/project_sentinel_ai_1795578451063.jpg',
      liveDemoUrl: 'https://cerulean-tawny.vercel.app',
    },
  ],
  education: [
    {
      id: 'edu-be-cse',
      degree: 'Bachelor of Engineering (BE) — Computer Science & Engineering',
      institution: 'Atria Institute of Technology',
      location: 'Bengaluru, Karnataka',
      period: '2025 – Present (Currently in 2nd Year)',
      status: 'Pursuing',
      highlights: [
        'Core coursework in C programming, Data Structures, Computer Organization, and Discrete Mathematics',
        'Active self-directed project building in Python, web technologies, and AI application design',
      ],
    },
    {
      id: 'edu-puc',
      degree: 'Pre-University / Higher Secondary Education (Science)',
      institution: 'Pre-University College (Editable Institution Name)',
      location: 'Karnataka',
      period: 'Completed Prior to BE',
      status: 'Completed',
      highlights: [
        'Mathematics, Physics, and Computer Science / Chemistry foundation',
        'Built analytical problem-solving habits leading into Computer Science Engineering',
      ],
    },
  ],
  experience: [
    {
      id: 'exp-personal-projects',
      title: 'Independent AI & Web Application Builder',
      context: 'Personal Projects',
      period: '2025 – Present',
      description:
        'Designed, structured, and shipped three live web applications—SmartFood AI, FindIt AI, and Sentinel AI—taking each concept from problem definition to live deployment.',
      focusAreas: ['Problem Framing', 'Prompt Engineering', 'UI Prototyping', 'Live Deployment'],
    },
    {
      id: 'exp-tech-learning',
      title: 'Core Software Engineering Foundations',
      context: 'Technical Learning',
      period: 'Ongoing',
      description:
        'Building daily fluency in C, Python, Java (OOP), and web fundamentals (HTML, CSS, JavaScript) alongside Git and GitHub workflows.',
      focusAreas: ['C & Python', 'Java OOP', 'Git & GitHub', 'Algorithmic Thinking'],
    },
    {
      id: 'exp-collab',
      title: 'Peer & Academic Collaborative Development',
      context: 'Collaborative Development',
      period: 'College Labs & Peer Groups',
      description:
        'Collaborating with fellow CSE students on coursework exercises, debugging sessions, and brainstorming practical technology ideas.',
      focusAreas: ['Team Communication', 'Code Debugging', 'Iterative Design'],
    },
  ],
  achievements: [
    {
      id: 'ach-workshop',
      category: 'Technical Workshops',
      title: 'Editable Workshop Slot',
      issuerOrEvent: 'Add workshop name & organizer',
      dateLabel: 'Ready to add',
      description:
        'Space reserved to document technical workshops attended on AI, web development, or cloud tools.',
      isPlaceholder: true,
    },
    {
      id: 'ach-hackathon',
      category: 'Hackathons',
      title: 'Editable Hackathon Slot',
      issuerOrEvent: 'Add hackathon event & project',
      dateLabel: 'Ready to add',
      description:
        'Space reserved to record upcoming college or inter-college hackathons, team projects, and prototypes.',
      isPlaceholder: true,
    },
    {
      id: 'ach-aiclub',
      category: 'AI Club Participation',
      title: 'Editable AI Club Slot',
      issuerOrEvent: 'Atria Institute of Technology / Community',
      dateLabel: 'Ready to add',
      description:
        'Space reserved to highlight AI club sessions, peer discussions, or campus technical community involvement.',
      isPlaceholder: true,
    },
    {
      id: 'ach-cert',
      category: 'Certifications',
      title: 'Editable Certification Slot',
      issuerOrEvent: 'Add verified course or credential',
      dateLabel: 'Ready to add',
      description:
        'Space reserved for verified online or institutional certifications in Python, Web Development, or AI.',
      isPlaceholder: true,
    },
    {
      id: 'ach-academic',
      category: 'Academic Achievements',
      title: 'Editable Academic Milestone Slot',
      issuerOrEvent: 'Department of CSE',
      dateLabel: 'Ready to add',
      description:
        'Space reserved for semester honors, project presentations, or notable academic recognitions.',
      isPlaceholder: true,
    },
    {
      id: 'ach-competition',
      category: 'Technical Competitions',
      title: 'Editable Competition Slot',
      issuerOrEvent: 'Add coding or tech competition',
      dateLabel: 'Ready to add',
      description:
        'Space reserved for coding contests, ideathons, or technical symposium participation.',
      isPlaceholder: true,
    },
  ],
  social: {
    email: 'jeevika.cse@example.com',
    linkedin: 'https://www.linkedin.com',
    github: 'https://github.com',
    location: 'Bengaluru, Karnataka, India',
  },
};
