document.addEventListener('DOMContentLoaded', () => {
  const year = new Date().getFullYear();
  document.querySelectorAll('#year, .js-year, [data-year-target]').forEach((el) => {
    el.textContent = year;
  });

  const currentPage = document.body.dataset.page;
  if (currentPage) {
    document.querySelectorAll(`[data-nav="${currentPage}"]`).forEach((link) => {
      link.classList.add('is-active');
      link.setAttribute('aria-current', 'page');
    });
  }

  document.querySelectorAll('[data-nav-toggle]').forEach((toggle) => {
    const nav = toggle.closest('[data-nav-container]');
    if (!nav) return;
    const menu = nav.querySelector('[data-nav-list]');
    if (!menu) return;

    const closeMenu = () => {
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    };

    toggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      if (isOpen) {
        const firstLink = menu.querySelector('a');
        if (firstLink) {
          firstLink.focus({ preventScroll: true });
        }
      }
    });

    menu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => closeMenu());
    });

    const mq = window.matchMedia('(min-width: 961px)');
    const handleMq = (event) => {
      if (event.matches) {
        closeMenu();
      }
    };

    mq.addEventListener('change', handleMq);

    document.addEventListener('keyup', (event) => {
      if (event.key === 'Escape' && nav.classList.contains('is-open')) {
        closeMenu();
        toggle.focus({ preventScroll: true });
      }
    });
  });

  document.querySelectorAll('[data-filter-target]').forEach((group) => {
    const targetSelector = group.getAttribute('data-filter-target');
    if (!targetSelector) return;
    const target = document.querySelector(targetSelector);
    if (!target) return;
    const mode = group.getAttribute('data-filter-mode') || 'includes';
    const items = target.querySelectorAll('[data-tags]');
    const buttons = group.querySelectorAll('[data-filter]');

    if (!buttons.length || !items.length) return;

    const setActive = (button) => {
      buttons.forEach((btn) => btn.setAttribute('aria-pressed', 'false'));
      button.setAttribute('aria-pressed', 'true');
    };

    const applyFilter = (filter) => {
      items.forEach((item) => {
        const tags = (item.dataset.tags || '').split(/\s+/).filter(Boolean);
        const shouldShow = filter === 'all'
          ? true
          : mode === 'equals'
            ? tags.includes(filter)
            : tags.some((tag) => tag.includes(filter));
        item.style.display = shouldShow ? '' : 'none';
      });
    };

    const active = group.querySelector('[aria-pressed="true"]') || buttons[0];
    if (active) {
      setActive(active);
      applyFilter(active.dataset.filter);
    }

    buttons.forEach((button) => {
      button.addEventListener('click', () => {
        setActive(button);
        applyFilter(button.dataset.filter);
      });
    });
  });

  document.querySelectorAll('[data-role-select]').forEach((link) => {
    link.addEventListener('click', () => {
      const selectId = link.getAttribute('data-role-select');
      const select = document.querySelector(selectId);
      const role = link.getAttribute('data-role');
      if (!select || !role) return;
      [...select.options].forEach((option, index) => {
        if (option.text.trim() === role.trim()) {
          select.selectedIndex = index;
        }
      });
    });
  });

  document.querySelectorAll('form').forEach((form) => {
    const action = form.getAttribute('action') || '';
    if (action.includes('your-id') || action === '#') {
      form.addEventListener('submit', (event) => {
        event.preventDefault();
        alert('Form endpoint not configured yet. Replace the form action URL to enable submissions.');
      });
    }
  });

  document.querySelectorAll('[data-rotation]').forEach((rotation) => {
    const panels = rotation.querySelectorAll('[data-rotation-panel]');
    if (!panels.length) return;
    const count = rotation.querySelector('[data-rotation-count]');
    const interval = parseInt(rotation.dataset.rotationInterval || '', 10);
    const delay = Number.isFinite(interval) && interval > 0 ? interval : 8000;
    let index = 0;
    let timer;

    const update = (nextIndex) => {
      panels.forEach((panel, panelIndex) => {
        const isActive = panelIndex === nextIndex;
        panel.classList.toggle('is-active', isActive);
        panel.setAttribute('aria-hidden', isActive ? 'false' : 'true');
      });
      if (count) {
        count.textContent = `${nextIndex + 1} of ${panels.length}`;
      }
      index = nextIndex;
    };

    const goNext = () => {
      update((index + 1) % panels.length);
    };

    const goPrev = () => {
      update((index - 1 + panels.length) % panels.length);
    };

    const stop = () => {
      if (timer) {
        window.clearInterval(timer);
        timer = undefined;
      }
    };

    const start = () => {
      stop();
      timer = window.setInterval(goNext, delay);
    };

    const nextBtn = rotation.querySelector('[data-rotation-next]');
    const prevBtn = rotation.querySelector('[data-rotation-prev]');

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        goNext();
        start();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        goPrev();
        start();
      });
    }

    rotation.addEventListener('mouseenter', stop);
    rotation.addEventListener('mouseleave', start);
    rotation.addEventListener('focusin', stop);
    rotation.addEventListener('focusout', (event) => {
      if (!rotation.contains(event.relatedTarget)) {
        start();
      }
    });

    panels.forEach((panel, panelIndex) => {
      panel.setAttribute('role', 'group');
      panel.setAttribute('aria-roledescription', 'Slide');
      panel.setAttribute('aria-hidden', panelIndex === index ? 'false' : 'true');
    });

    update(0);
    start();
  });
});
