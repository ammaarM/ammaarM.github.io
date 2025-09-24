const docEl = document.documentElement;
const themeButton = document.querySelector('.theme-toggle');
const navToggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.site-nav');
const navLinks = Array.from(document.querySelectorAll('.nav-link'));
const scrollLinks = Array.from(document.querySelectorAll('a[data-scroll]'));
const sections = Array.from(document.querySelectorAll('section[data-section]'));
const projectsGrid = document.getElementById('projects-grid');
const projectTemplate = document.getElementById('project-card-template');
const yearTarget = document.querySelector('[data-year]');
const avatarImg = document.querySelector('.avatar img');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const systemTheme = window.matchMedia('(prefers-color-scheme: dark)');
const THEME_KEY = 'theme-preference';
const themeCycle = ['light', 'dark', 'system'];
const anchorHighlightTimeouts = new WeakMap();

const getStoredTheme = () => {
  try {
    return localStorage.getItem(THEME_KEY) || 'system';
  } catch (error) {
    return 'system';
  }
};

const resolveTheme = (mode) =>
  mode === 'system' ? (systemTheme.matches ? 'dark' : 'light') : mode;

const applyTheme = (mode) => {
  const applied = resolveTheme(mode);
  docEl.dataset.theme = applied;
  if (themeButton) {
    themeButton.dataset.mode = mode;
    const nextMode = themeCycle[(themeCycle.indexOf(mode) + 1) % themeCycle.length];
    themeButton.setAttribute('aria-label', `Activate ${nextMode} theme`);
    themeButton.setAttribute('title', `Switch to ${nextMode} theme`);
  }
};

const watchSystemChange = () => {
  const handler = () => {
    if ((themeButton?.dataset.mode || 'system') === 'system') {
      applyTheme('system');
    }
  };
  if (systemTheme.addEventListener) {
    systemTheme.addEventListener('change', handler);
  } else if (systemTheme.addListener) {
    systemTheme.addListener(handler);
  }
};

if (themeButton) {
  applyTheme(getStoredTheme());
  watchSystemChange();
  themeButton.addEventListener('click', () => {
    const current = themeButton.dataset.mode || getStoredTheme();
    const next = themeCycle[(themeCycle.indexOf(current) + 1) % themeCycle.length];
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch (error) {
      // ignore storage errors
    }
    applyTheme(next);
  });
}

if (yearTarget) {
  yearTarget.textContent = new Date().getFullYear();
}

if (navToggle && nav) {
  navToggle.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!expanded));
    nav.classList.toggle('open', !expanded);
  });
}

const closeMobileNav = () => {
  if (!navToggle || !nav) return;
  navToggle.setAttribute('aria-expanded', 'false');
  nav.classList.remove('open');
};

const handleAnchorScroll = (event, target) => {
  if (!target) return;
  event.preventDefault();
  if (!reduceMotion) {
    target.classList.add('is-anchor-target');
    const timeoutId = anchorHighlightTimeouts.get(target);
    if (timeoutId) {
      window.clearTimeout(timeoutId);
    }
    anchorHighlightTimeouts.set(
      target,
      window.setTimeout(() => {
        target.classList.remove('is-anchor-target');
      }, 700)
    );
  }
  target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  if (typeof target.focus === 'function') {
    window.requestAnimationFrame(() => {
      try {
        target.focus({ preventScroll: true });
      } catch (error) {
        target.focus();
      }
    });
  }
  if (typeof history.pushState === 'function') {
    history.pushState(null, '', `#${target.id}`);
  } else {
    window.location.hash = `#${target.id}`;
  }
};

scrollLinks.forEach((link) => {
  const href = link.getAttribute('href') || '';
  if (!href.startsWith('#')) return;
  const target = document.querySelector(href);
  if (!target) return;
  link.addEventListener('click', (event) => {
    if (link.classList.contains('nav-link')) {
      closeMobileNav();
    }
    handleAnchorScroll(event, target);
  });
});

if (avatarImg) {
  avatarImg.addEventListener('error', () => {
    const wrapper = avatarImg.closest('.avatar');
    if (!wrapper || wrapper.classList.contains('is-fallback')) return;
    wrapper.classList.add('is-fallback');
    const fallback = document.createElement('span');
    fallback.className = 'avatar-fallback';
    fallback.textContent = wrapper.dataset.initials || 'AM';
    fallback.setAttribute('aria-hidden', 'true');
    wrapper.append(fallback);
    wrapper.setAttribute('role', 'img');
    wrapper.setAttribute('aria-label', 'Initials for Ammaar Murshid');
  });
}

const revealSections = () => {
  const targets = document.querySelectorAll('[data-reveal]');
  if (!targets.length) return;
  if (reduceMotion || !('IntersectionObserver' in window)) {
    targets.forEach((el) => el.classList.add('is-visible'));
    return;
  }
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  targets.forEach((el) => observer.observe(el));
};

revealSections();

const fallbackProjects = [
  {
    name: 'azure-labs-toolkit',
    description: 'Infrastructure blueprints and scripts for Azure learning environments.',
    html_url: 'https://github.com/ammaarM/azure-labs-toolkit',
    homepage: '',
    stargazers_count: 12,
    topics: ['azure', 'terraform', 'iac'],
    updated_at: '2024-01-12T00:00:00Z',
    full_name: 'ammaarM/azure-labs-toolkit',
  },
  {
    name: 'k8s-deployment-templates',
    description: 'Opinionated Kubernetes deployment templates for rapid app delivery.',
    html_url: 'https://github.com/ammaarM/k8s-deployment-templates',
    homepage: '',
    stargazers_count: 8,
    topics: ['kubernetes', 'helm', 'devops'],
    updated_at: '2023-11-02T00:00:00Z',
    full_name: 'ammaarM/k8s-deployment-templates',
  },
  {
    name: 'platform-observability-kit',
    description: 'Dashboards and alerts that surface platform health signals.',
    html_url: 'https://github.com/ammaarM/platform-observability-kit',
    homepage: '',
    stargazers_count: 5,
    topics: ['observability', 'dashboards'],
    updated_at: '2023-09-18T00:00:00Z',
    full_name: 'ammaarM/platform-observability-kit',
  },
];

const projectSorter = (a, b) =>
  b.stargazers_count !== a.stargazers_count
    ? b.stargazers_count - a.stargazers_count
    : new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();

const buildPreviewUrl = (project) => {
  if (project.open_graph_image_url) {
    return project.open_graph_image_url;
  }
  if (project.full_name) {
    return `https://opengraph.githubassets.com/1/${project.full_name}`;
  }
  return '';
};

const applyProjectPreview = (element, project) => {
  const previewUrl = buildPreviewUrl(project);
  if (previewUrl) {
    element.style.backgroundImage = `url("${previewUrl}")`;
    element.classList.remove('is-placeholder');
    element.textContent = '';
  } else {
    element.style.backgroundImage = '';
    element.classList.add('is-placeholder');
    const initials = (project.name || 'Project')
      .split(/[-_\s]+/)
      .map((chunk) => chunk.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('');
    element.textContent = initials || 'PR';
  }
};

const renderProjects = (projects) => {
  if (!projectsGrid || !projectTemplate) return;
  projectsGrid.innerHTML = '';
  if (!projects.length) {
    const empty = document.createElement('p');
    empty.textContent = 'No projects to show right now. Check back soon!';
    projectsGrid.append(empty);
    return;
  }

  projects.forEach((project) => {
    const card = projectTemplate.content.firstElementChild.cloneNode(true);
    const title = card.querySelector('.project-title');
    const stars = card.querySelector('.project-stars');
    const description = card.querySelector('.project-description');
    const tags = card.querySelector('.project-tags');
    const repoLink = card.querySelector('.project-repo');
    const demoLink = card.querySelector('.project-demo');
    const preview = card.querySelector('.project-preview');

    if (title) {
      title.textContent = project.name;
    }

    if (stars) {
      stars.textContent = `⭐ ${project.stargazers_count}`;
      stars.setAttribute('aria-label', `${project.stargazers_count} stars`);
    }

    if (description) {
      description.textContent =
        project.description || 'A recent project by Ammaar Murshid.';
    }

    if (preview) {
      applyProjectPreview(preview, project);
    }

    if (tags) {
      tags.innerHTML = '';
      (project.topics || [])
        .slice(0, 6)
        .forEach((topic) => {
          const tag = document.createElement('span');
          tag.textContent = topic;
          tags.append(tag);
        });
      if (!tags.children.length) {
        tags.remove();
      }
    }

    if (repoLink) {
      repoLink.href = project.html_url;
      repoLink.setAttribute('aria-label', `${project.name} repository`);
    }

    if (demoLink) {
      if (project.homepage) {
        demoLink.href = project.homepage;
        demoLink.hidden = false;
      } else {
        demoLink.hidden = true;
      }
    }

    projectsGrid.append(card);
  });
};

const loadProjects = async () => {
  if (!projectsGrid || !projectTemplate) return;
  const loading = document.createElement('p');
  loading.textContent = 'Loading projects…';
  loading.className = 'project-loading';
  projectsGrid.append(loading);

  try {
    const response = await fetch(
      'https://api.github.com/users/ammaarM/repos?per_page=100&sort=updated',
      {
        headers: {
          Accept: 'application/vnd.github+json',
        },
      }
    );
    if (!response.ok) {
      throw new Error('Network response not ok');
    }
    const data = await response.json();
    const filtered = data
      .filter((repo) => !repo.fork && !repo.archived)
      .sort(projectSorter)
      .slice(0, 12);
    renderProjects(filtered.length ? filtered : fallbackProjects);
  } catch (error) {
    console.error('GitHub projects failed to load', error);
    renderProjects(fallbackProjects);
  }
};

loadProjects();

const updateActiveNav = (sectionId) => {
  navLinks.forEach((link) => {
    const targetId = (link.getAttribute('href') || '').replace('#', '');
    const isActive = targetId === sectionId;
    link.classList.toggle('is-active', isActive);
    if (isActive) {
      link.setAttribute('aria-current', 'page');
    } else {
      link.removeAttribute('aria-current');
    }
  });
};

if (sections.length && navLinks.length) {
  if (!reduceMotion && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            updateActiveNav(entry.target.id);
          }
        });
      },
      {
        threshold: 0.45,
        rootMargin: '-35% 0px -45% 0px',
      }
    );

    sections.forEach((section) => observer.observe(section));
  } else {
    const handleScroll = () => {
      const scrollY = window.scrollY + window.innerHeight * 0.35;
      let currentId = sections[0].id;
      sections.forEach((section) => {
        if (scrollY >= section.offsetTop) {
          currentId = section.id;
        }
      });
      updateActiveNav(currentId);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
  }
}
