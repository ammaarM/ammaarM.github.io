const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const selector = '[data-reveal], [data-reveal-item]';

export const initReveal = () => {
  const elements = Array.from(
    document.querySelectorAll<HTMLElement>(selector)
  );

  if (elements.length === 0) {
    return;
  }

  const showAll = () => {
    elements.forEach((el) => {
      el.classList.add('is-visible');
      el.classList.remove('is-reveal-init');
    });
  };

  if (prefersReducedMotion.matches) {
    showAll();
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const target = entry.target as HTMLElement;
          target.classList.add('is-visible');
          target.classList.remove('is-reveal-init');
          observer.unobserve(target);
        }
      });
    },
    {
      threshold: 0.2,
      rootMargin: '0px 0px -10% 0px',
    }
  );

  elements.forEach((el) => {
    el.classList.add('is-reveal-init');
    observer.observe(el);
  });

  const handleMotion = (event: MediaQueryListEvent) => {
    if (event.matches) {
      observer.disconnect();
      showAll();
    }
  };

  if (typeof prefersReducedMotion.addEventListener === 'function') {
    prefersReducedMotion.addEventListener('change', handleMotion);
  } else if (typeof prefersReducedMotion.addListener === 'function') {
    prefersReducedMotion.addListener(handleMotion);
  }
};
