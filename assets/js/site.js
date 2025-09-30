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
});
