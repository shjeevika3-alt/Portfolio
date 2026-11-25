export type SkillCategoryKey =
  | 'Programming'
  | 'Web Development'
  | 'Tools and Technologies'
  | 'AI and Development';

export interface SkillItem {
  id: string;
  name: string;
  category: SkillCategoryKey;
  level: number; // 0 to 100
  status: 'Proficient' | 'Intermediate' | 'Foundational' | 'Learning';
  note?: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  category: 'AI Application' | 'Cybersecurity' | 'Web Platform';
  summary: string;
  problemStatement: string;
  proposedSolution: string;
  features: string[];
  technologies: string[];
  roleAndContributions: string;
  screenshotUrl: string;
  liveDemoUrl: string;
  githubUrl?: string;
}

export interface EducationItem {
  id: string;
  degree: string;
  institution: string;
  location: string;
  period: string;
  status: string;
  highlights: string[];
}

export interface ExperienceItem {
  id: string;
  title: string;
  context: string;
  period: string;
  description: string;
  focusAreas: string[];
}

export type AchievementCategory =
  | 'Technical Workshops'
  | 'Hackathons'
  | 'AI Club Participation'
  | 'Certifications'
  | 'Academic Achievements'
  | 'Technical Competitions';

export interface AchievementItem {
  id: string;
  category: AchievementCategory;
  title: string;
  issuerOrEvent: string;
  dateLabel: string;
  description: string;
  isPlaceholder: boolean;
}

export interface SocialLinks {
  email: string;
  linkedin: string;
  github: string;
  location: string;
}

export interface ProfileInfo {
  name: string;
  headline: string;
  identityLine: string;
  degreeShort: string;
  department: string;
  year: string;
  college: string;
  city: string;
  profilePhotoUrl: string;
  aboutParagraphs: string[];
  careerGoal: string;
  resumeSummary: string;
}

export interface PortfolioData {
  profile: ProfileInfo;
  skills: SkillItem[];
  projects: ProjectItem[];
  education: EducationItem[];
  experience: ExperienceItem[];
  achievements: AchievementItem[];
  social: SocialLinks;
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  submittedAt: string;
}

export interface ResumeStatus {
  uploaded: boolean;
  fileName?: string;
  uploadedAt?: string;
  sizeBytes?: number;
}
