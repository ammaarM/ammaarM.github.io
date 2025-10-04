const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

document.addEventListener('DOMContentLoaded', () => {
  const body = document.body;
  body.classList.add('is-ready');

  const navToggle = document.querySelector<HTMLButtonElement>('[data-nav-toggle]');
  const nav = document.querySelector<HTMLElement>('.site-nav');
  const navLinks = Array.from(document.querySelectorAll<HTMLAnchorElement>('.nav-link'));
  const sections = Array.from(document.querySelectorAll<HTMLElement>('section[data-section]'));
  const avatars = Array.from(document.querySelectorAll<HTMLElement>('[data-avatar]'));

  const initAvatars = () => {
    avatars.forEach((avatar) => {
      const img = avatar.querySelector<HTMLImageElement>('img');
      const fallback = avatar.querySelector<HTMLElement>('.avatar-fallback');
      const initials = avatar.dataset.initials || 'AM';
      if (fallback) {
        fallback.textContent = initials;
      }
      const showFallback = () => {
        avatar.classList.add('is-fallback');
        if (fallback) {
          fallback.removeAttribute('aria-hidden');
        }
        if (img) {
          img.hidden = true;
          img.setAttribute('aria-hidden', 'true');
        }
      };
      if (!img) {
        showFallback();
        return;
      }
      img.addEventListener('error', showFallback, { once: true });
      if (img.complete && img.naturalWidth === 0) {
        showFallback();
      }
    });
  };

  initAvatars();

  navToggle?.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!expanded));
    nav?.classList.toggle('open', !expanded);
  });

  const closeMobileNav = () => {
    navToggle?.setAttribute('aria-expanded', 'false');
    nav?.classList.remove('open');
  };

  const highlightSection = (target: HTMLElement | null) => {
    if (!target) return;
    target.classList.add('is-anchor-target');
    window.setTimeout(() => target.classList.remove('is-anchor-target'), 1400);
  };

  const updateActiveNav = (id: string) => {
    navLinks.forEach((link) => {
      const targetId = (link.getAttribute('href') || '').replace('#', '');
      const isActive = targetId === id;
      link.classList.toggle('is-active', isActive);
      if (isActive) {
        link.setAttribute('aria-current', 'page');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  };

  if ('IntersectionObserver' in window && sections.length > 0) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            updateActiveNav(entry.target.id);
          }
        });
      },
      { threshold: 0.45, rootMargin: '-35% 0px -45% 0px' }
    );
    sections.forEach((section) => observer.observe(section));
  }

  const scrollLinks = Array.from(document.querySelectorAll<HTMLAnchorElement>('[data-scroll]'));
  scrollLinks.forEach((link) => {
    const href = link.getAttribute('href') || '';
    if (!href.startsWith('#')) return;
    const target = document.querySelector<HTMLElement>(href);
    if (!target) return;

    link.addEventListener('click', (event) => {
      event.preventDefault();
      if (link.classList.contains('nav-link')) {
        closeMobileNav();
      }
      const behavior: ScrollBehavior = prefersReducedMotion.matches ? 'auto' : 'smooth';
      target.scrollIntoView({ behavior, block: 'start' });
      window.setTimeout(() => highlightSection(target), prefersReducedMotion.matches ? 0 : 900);
      try {
        target.focus({ preventScroll: true });
      } catch (error) {
        target.focus();
      }
    });
  });

  const yearTarget = document.querySelector<HTMLElement>('[data-year]');
  if (yearTarget) {
    yearTarget.textContent = String(new Date().getFullYear());
  }
});
