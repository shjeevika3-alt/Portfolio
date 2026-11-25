import { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import AboutSection from './components/AboutSection';
import SkillsSection from './components/SkillsSection';
import ProjectsSection from './components/ProjectsSection';
import ProjectModal from './components/ProjectModal';
import JourneySection from './components/JourneySection';
import AchievementsSection from './components/AchievementsSection';
import ResumeSection from './components/ResumeSection';
import ContactSection from './components/ContactSection';
import PortfolioEditorModal from './components/PortfolioEditorModal';
import { DEFAULT_PORTFOLIO_DATA } from './data/defaultPortfolio';
import type { PortfolioData, ProjectItem, ResumeStatus } from './types/portfolio';

export default function App() {
  const [portfolio, setPortfolio] = useState<PortfolioData>(DEFAULT_PORTFOLIO_DATA);
  const [resumeStatus, setResumeStatus] = useState<ResumeStatus>({ uploaded: false });
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/portfolio')
      .then((res) => (res.ok ? res.json() : null))
      .then((data: PortfolioData | null) => {
        if (data?.profile && Array.isArray(data.projects)) {
          setPortfolio(data);
        }
      })
      .catch(() => {
        // Fallback to DEFAULT_PORTFOLIO_DATA already in state
      });

    fetch('/api/resume/status')
      .then((res) => (res.ok ? res.json() : null))
      .then((status: ResumeStatus | null) => {
        if (status) setResumeStatus(status);
      })
      .catch(() => {
        // Keep uploaded: false
      });
  }, []);

  function handleDownloadResume() {
    if (resumeStatus.uploaded) {
      const link = document.createElement('a');
      link.href = '/api/resume';
      link.download = resumeStatus.fileName || 'Jeevika_Resume.pdf';
      document.body.appendChild(link);
      link.click();
      link.remove();
      return;
    }

    const resumeEl = document.getElementById('resume');
    if (resumeEl) {
      resumeEl.scrollIntoView({ behavior: 'smooth' });
    }
    setNotice('No PDF uploaded yet — preview the structured resume below or upload your PDF in the Portfolio Editor.');
    setTimeout(() => setNotice(null), 5000);
  }

  async function handleSavePortfolio(updated: PortfolioData) {
    if (!authToken) {
      throw new Error('Owner authentication required.');
    }
    const res = await fetch('/api/portfolio', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify(updated),
    });

    const payload = (await res.json()) as PortfolioData & { error?: string };
    if (!res.ok) {
      if (res.status === 401) {
        setAuthToken(null);
      }
      throw new Error(payload.error || 'Could not save portfolio changes.');
    }
    setPortfolio(payload);
  }

  return (
    <div className="min-h-screen bg-[#0B0A0A] text-[#F5F4F2]">
      <Navbar name={portfolio.profile.name} />

      {notice && (
        <div
          role="status"
          className="no-print fixed bottom-5 right-5 z-50 max-w-sm rounded-xl border border-[#D46B48]/40 bg-[#171312] px-4 py-3 text-xs leading-relaxed text-[#F5F4F2] shadow-xl"
        >
          {notice}
        </div>
      )}

      <main>
        <HeroSection
          profile={portfolio.profile}
          resumeStatus={resumeStatus}
          onDownloadResume={handleDownloadResume}
          onOpenEditor={() => setEditorOpen(true)}
        />

        <AboutSection profile={portfolio.profile} />

        <SkillsSection
          skills={portfolio.skills}
          onOpenEditor={() => setEditorOpen(true)}
        />

        <ProjectsSection
          projects={portfolio.projects}
          onSelectProject={setSelectedProject}
          onOpenEditor={() => setEditorOpen(true)}
        />

        <JourneySection
          education={portfolio.education}
          experience={portfolio.experience}
        />

        <AchievementsSection
          achievements={portfolio.achievements}
          onOpenEditor={() => setEditorOpen(true)}
        />

        <ResumeSection
          data={portfolio}
          resumeStatus={resumeStatus}
          onDownloadResume={handleDownloadResume}
          onOpenEditor={() => setEditorOpen(true)}
        />

        <ContactSection social={portfolio.social} />
      </main>

      {/* Clean Minimal Footer */}
      <footer className="no-print border-t border-white/8 py-8">
        <div className="mx-auto flex max-w-[1200px] flex-col items-center justify-between gap-4 px-6 text-xs text-[#A8A39E] sm:flex-row">
          <p>
            © {new Date().getFullYear()} {portfolio.profile.name} · {portfolio.profile.college}, {portfolio.profile.city}
          </p>
          <div className="flex items-center gap-6">
            <a href="#about" className="hover:text-[#F5F4F2] transition-colors">About</a>
            <a href="#projects" className="hover:text-[#F5F4F2] transition-colors">Projects</a>
            <a href="#resume" className="hover:text-[#F5F4F2] transition-colors">Resume</a>
            <button
              type="button"
              onClick={() => setEditorOpen(true)}
              className="hover:text-[#D46B48] transition-colors"
            >
              Portfolio Editor
            </button>
          </div>
        </div>
      </footer>

      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />

      <PortfolioEditorModal
        open={editorOpen}
        onClose={() => setEditorOpen(false)}
        data={portfolio}
        resumeStatus={resumeStatus}
        authToken={authToken}
        onAuthenticated={(token) => setAuthToken(token)}
        onSaveData={handleSavePortfolio}
        onResumeUpdated={(status) => setResumeStatus(status)}
      />
    </div>
  );
}
