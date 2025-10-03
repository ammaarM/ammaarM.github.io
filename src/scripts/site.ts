import { initTheme, setTheme, type ThemeMode } from './theme';
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const mobileQuery = window.matchMedia('(max-width: 768px)');

document.addEventListener('DOMContentLoaded', () => {
  const body = document.body;
  body.classList.add('is-ready');

  const themeButtons = Array.from(
    document.querySelectorAll<HTMLButtonElement>('[data-theme-option]')
  );
  const themeLabel = document.querySelector<HTMLElement>('[data-theme-label]');
  const navToggle = document.querySelector<HTMLButtonElement>('[data-nav-toggle]');
  const nav = document.querySelector<HTMLElement>('.site-nav');
  const navLinks = Array.from(
    document.querySelectorAll<HTMLAnchorElement>('.nav-link')
  );
  const sections = Array.from(
    document.querySelectorAll<HTMLElement>('section[data-section]')
  );
  const avatars = Array.from(
    document.querySelectorAll<HTMLElement>('[data-avatar]')
  );

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

  const formatLabel = (mode: ThemeMode, theme: 'light' | 'dark') => {
    if (mode === 'system') {
      return `Follow system preference (${theme})`;
    }
    return `Use ${mode} theme`;
  };

  const updateThemeButtons = (theme: 'light' | 'dark', mode: ThemeMode) => {
    themeButtons.forEach((button) => {
      const value = (button.dataset.themeOption as ThemeMode) || 'system';
      const isActive = value === mode;
      button.setAttribute('aria-pressed', String(isActive));
      button.classList.toggle('is-active', isActive);
      const label = formatLabel(value, theme);
      button.setAttribute('aria-label', label);
      button.setAttribute('title', label);
    });
    if (themeLabel) {
      const displayMode =
        mode === 'system' ? `Auto · ${theme.charAt(0).toUpperCase()}${theme.slice(1)}` : `${theme.charAt(0).toUpperCase()}${theme.slice(1)}`;
      themeLabel.textContent = displayMode;
    }
  };

  initTheme(updateThemeButtons);

  themeButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const value = (button.dataset.themeOption as ThemeMode) || 'system';
      setTheme(value);
    });
  });

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
    window.setTimeout(
      () => target.classList.remove('is-anchor-target'),
      prefersReducedMotion.matches ? 0 : 900
    );
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

  const scrollLinks = Array.from(
    document.querySelectorAll<HTMLAnchorElement>('[data-scroll]')
  );
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
      const behavior: ScrollBehavior = prefersReducedMotion.matches
        ? 'auto'
        : 'smooth';
      target.scrollIntoView({ behavior, block: 'start' });
      window.setTimeout(
        () => highlightSection(target),
        prefersReducedMotion.matches ? 0 : 900
      );
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

  const parallaxTarget = document.querySelector<HTMLElement>('[data-parallax]');
  if (parallaxTarget) {
    let frame = 0;
    const applyParallax = () => {
      frame = 0;
      if (prefersReducedMotion.matches || mobileQuery.matches) {
        parallaxTarget.style.removeProperty('--parallax-offset');
        return;
      }
      const rect = parallaxTarget.getBoundingClientRect();
      const midpoint = window.innerHeight / 2;
      const distance = rect.top + rect.height / 2 - midpoint;
      const offset = Math.max(-36, Math.min(36, distance * -0.08));
      parallaxTarget.style.setProperty('--parallax-offset', `${offset.toFixed(2)}px`);
    };

    const handleScroll = () => {
      if (frame === 0) {
        frame = window.requestAnimationFrame(applyParallax);
      }
    };

    applyParallax();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', applyParallax);

    const handleMotionChange = () => {
      if (prefersReducedMotion.matches) {
        parallaxTarget.style.removeProperty('--parallax-offset');
      }
      applyParallax();
    };

    if (typeof prefersReducedMotion.addEventListener === 'function') {
      prefersReducedMotion.addEventListener('change', handleMotionChange);
    } else if (typeof prefersReducedMotion.addListener === 'function') {
      prefersReducedMotion.addListener(handleMotionChange);
    }

    const handleMobileChange = () => {
      if (mobileQuery.matches) {
        parallaxTarget.style.removeProperty('--parallax-offset');
      }
      applyParallax();
    };

    if (typeof mobileQuery.addEventListener === 'function') {
      mobileQuery.addEventListener('change', handleMobileChange);
    } else if (typeof mobileQuery.addListener === 'function') {
      mobileQuery.addListener(handleMobileChange);
    }
  }
});
