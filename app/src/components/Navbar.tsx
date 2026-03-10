import React, { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

// Smooth scroll to a section by its id, respecting the sticky navbar height
function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const navbarH = 80; // height of sticky header in px
  const top = el.getBoundingClientRect().top + window.scrollY - navbarH - 16;
  window.scrollTo({ top, behavior: 'smooth' });
}

export const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // When the page loads with a hash (e.g. /#servicos), scroll after mount
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      // Short delay gives React time to render the Home page before scrolling
      const timer = setTimeout(() => scrollToSection(id), 120);
      return () => clearTimeout(timer);
    }
  }, [location]);

  const isActive = (path: string) => location.pathname === path && !location.hash;

  // If already on Home, scroll directly; otherwise navigate and let the effect handle it
  const handleAnchorClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    sectionId: string
  ) => {
    e.preventDefault();
    if (location.pathname === '/') {
      // Already on home — just scroll
      scrollToSection(sectionId);
      window.history.pushState(null, '', `/#${sectionId}`);
    } else {
      // Go to home with the hash — useEffect will scroll on arrival
      navigate(`/#${sectionId}`);
    }
  };

  // Desktop & mobile nav items
  const navItems = [
    { label: 'Início',    to: '/',              sectionId: null,         icon: 'home' },
    { label: 'Serviços',  to: '/#servicos',      sectionId: 'servicos',   icon: 'business_center' },
    { label: 'Processo',  to: '/#processo',      sectionId: 'processo',   icon: 'route' },
    { label: 'Blog',      to: '/blog',           sectionId: null,         icon: 'newspaper' },
  ];

  return (
    <>
      {/* ─── Desktop/Tablet Header ─── */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-silver shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-20 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="size-10 rounded-full bg-navy text-white flex items-center justify-center font-bold font-lexend text-xl group-hover:scale-105 transition-transform">
              S
            </div>
            <div className="hidden md:flex flex-col">
              <span className="font-lexend font-bold text-navy leading-none">Suyane Melre</span>
              <span className="text-[10px] uppercase tracking-widest text-executive">Consultora CFP®</span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map(({ label, to, sectionId }) =>
              sectionId ? (
                <a
                  key={label}
                  href={to}
                  onClick={e => handleAnchorClick(e, sectionId)}
                  className={`text-sm font-medium transition-colors cursor-pointer ${
                    location.hash === `#${sectionId}`
                      ? 'text-navy font-bold'
                      : 'text-executive hover:text-navy'
                  }`}
                >
                  {label}
                </a>
              ) : (
                <Link
                  key={label}
                  to={to}
                  className={`text-sm font-medium transition-colors ${
                    isActive(to) ? 'text-navy font-bold' : 'text-executive hover:text-navy'
                  }`}
                >
                  {label}
                </Link>
              )
            )}
          </nav>

          {/* CTA Button */}
          <a
            href="https://wa.me/5581994018011" target="_blank" rel="noopener noreferrer"
            className="bg-navy text-white px-6 py-2.5 rounded-full text-sm font-bold shadow-md hover:shadow-lg transition-all hover:scale-105 hidden sm:block"
          >
            Falar com Suyane
          </a>
        </div>
      </header>

      {/* ─── Mobile Bottom Nav ─── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-[60] flex gap-2 border-t border-silver bg-white/95 backdrop-blur-lg px-4 pb-6 pt-3 shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)]">
        {navItems.map(({ label, to, sectionId, icon }) => {
          const activeClass = sectionId
            ? location.hash === `#${sectionId}` ? 'text-navy' : 'text-executive opacity-70'
            : location.pathname === to && !location.hash ? 'text-navy' : 'text-executive opacity-70';

          return sectionId ? (
            <a
              key={label}
              href={to}
              onClick={e => handleAnchorClick(e, sectionId)}
              className={`flex flex-1 flex-col items-center justify-center gap-1 ${activeClass}`}
            >
              <span className="material-symbols-outlined text-[24px]">{icon}</span>
              <p className="text-[10px] font-medium">{label}</p>
            </a>
          ) : (
            <Link
              key={label}
              to={to}
              className={`flex flex-1 flex-col items-center justify-center gap-1 ${activeClass}`}
            >
              <span className="material-symbols-outlined text-[24px]">{icon}</span>
              <p className="text-[10px] font-medium">{label}</p>
            </Link>
          );
        })}

        {/* Falar com Suyane — mobile CTA */}
        <a
          href="https://wa.me/5581994018011" target="_blank" rel="noopener noreferrer"
          className="flex flex-1 flex-col items-center justify-center gap-1 text-executive opacity-70"
        >
          <span className="material-symbols-outlined text-[24px]">chat</span>
          <p className="text-[10px] font-medium">Contato</p>
        </a>
      </nav>
    </>
  );
};
