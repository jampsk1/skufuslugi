(function () {
  'use strict';

  const carousel = document.getElementById('heroCarousel');
  if (!carousel) return;
  const find = id => document.getElementById(id);
  const fields = {
    label: find('heroSlideLabel'), title: find('heroSlideTitle'),
    description: find('heroSlideDescription'), action: find('heroSlideAction'),
    note: find('heroSlideNote'), image: find('heroSlideImage'),
    stampTitle: find('heroStampTitle'), stampSubtitle: find('heroStampSubtitle'),
    status: find('heroSlideStatus')
  };
  if (Object.values(fields).some(field => !field)) return;
  const dots = [...carousel.querySelectorAll('[data-hero-slide]')];
  const previous = carousel.querySelector('[data-hero-prev]');
  const next = carousel.querySelector('[data-hero-next]');
  const pause = carousel.querySelector('[data-hero-pause]');
  const controls = carousel.querySelector('.hero-carousel-controls');
  if (!previous || !next || !pause || !controls) return;

  const slides = [
    {
      name: 'На диване', image: 'assets/hero-skuf.png',
      alt: 'Довольный скуф отдыхает на оранжевом диване с кружкой чая и спящим котом',
      label: 'Всё решается с дивана', title: ['Дела подождут.', 'Скуфство — нет.'],
      description: ['Оформляйте важное, получайте положенное.', 'Тапочки снимать не обязательно.'],
      button: 'Подтвердить скуфство', action: 'quiz',
      note: '2 минуты · без очереди и осуждения',
      stampTitle: 'Право на отдых', stampSubtitle: 'Подтверждено жизнью'
    },
    {
      name: 'В бане', image: 'assets/hero-banya.png',
      alt: 'Тот же добродушный скуф в банной шапке отдыхает на деревянной скамейке в уютной бане',
      label: 'Суету оставьте в предбаннике', title: ['С лёгким паром.', 'И без лишних дел.'],
      description: ['Пар, веник и заслуженный покой.', 'Важные вопросы обсудим после бани.'],
      button: 'Оформить банный день', service: 'banya',
      note: '1 минута · справка от суеты не нужна',
      stampTitle: 'С лёгким паром', stampSubtitle: 'Одобрено банным советом'
    },
    {
      name: 'В гараже', image: 'assets/hero-garage.png',
      alt: 'Усатый скуф с кружкой чая отдыхает в тёплом гараже рядом с верстаком, инструментами и котом',
      label: 'Ваше личное место силы', title: ['Ушёл в гараж.', 'Нашёл себя.'],
      description: ['Инструменты на месте. Чай заварен.', 'Можно просто посидеть и посмотреть.'],
      button: 'Оформить пропуск', service: 'garage',
      note: '1 минута · уважительная причина готова',
      stampTitle: 'Территория покоя', stampSubtitle: 'Посторонним делам вход закрыт'
    }
  ];
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const modal = document.getElementById('mainModal');
  let index = 0;
  let requestedIndex = 0;
  let generation = 0;
  let timer;
  let transitionTimer;
  let paused = motion.matches;
  let hovered = false;
  let focused = false;
  let onScreen = true;
  let changing = false;
  let pointerStart = null;
  const preload = slides.map(slide => {
    const image = new Image();
    image.decoding = 'async';
    image.src = slide.image;
    return image;
  });

  function lineText(element, lines) {
    const content = document.createDocumentFragment();
    lines.forEach((line, position) => {
      if (position) content.append(document.createElement('br'));
      content.append(document.createTextNode(line));
    });
    element.replaceChildren(content);
  }
  function stopTimer() { clearTimeout(timer); }
  function autoAllowed() { return !paused && !hovered && !focused && onScreen && !document.hidden && !modal?.open; }
  function canPlay() { return autoAllowed() && !changing; }
  function cancelChange() {
    changing = false;
    requestedIndex = index;
    carousel.classList.remove('is-changing');
    armTimer();
  }
  function armTimer() {
    stopTimer();
    if (canPlay()) timer = setTimeout(() => requestSlide(index + 1, false), 8000);
  }
  function updatePauseButton() {
    pause.setAttribute('aria-pressed', String(paused));
    pause.setAttribute('aria-label', paused ? 'Включить автопрокрутку' : 'Остановить автопрокрутку');
    pause.textContent = paused ? '▶' : 'Ⅱ';
    carousel.dataset.autoplay = paused ? 'paused' : 'playing';
  }
  function updateSlide(target, manual) {
    const slide = slides[target];
    index = target;
    carousel.dataset.slide = String(target);
    fields.label.textContent = slide.label;
    lineText(fields.title, slide.title);
    lineText(fields.description, slide.description);
    fields.action.removeAttribute('data-action');
    fields.action.removeAttribute('data-service');
    if (slide.action) fields.action.dataset.action = slide.action;
    if (slide.service) fields.action.dataset.service = slide.service;
    fields.action.replaceChildren(document.createTextNode(`${slide.button} `));
    const arrow = document.createElement('span');
    arrow.setAttribute('aria-hidden', 'true');
    arrow.textContent = '↗';
    fields.action.append(arrow);
    fields.note.textContent = slide.note;
    fields.image.src = slide.image;
    fields.image.alt = slide.alt;
    fields.stampTitle.textContent = slide.stampTitle;
    fields.stampSubtitle.textContent = slide.stampSubtitle;
    dots.forEach((dot, position) => {
      const active = position === target;
      dot.classList.toggle('is-active', active);
      dot.setAttribute('aria-pressed', String(active));
    });
    if (manual) fields.status.textContent = `Слайд ${target + 1} из ${slides.length}. ${slide.name}.`;
  }
  async function requestSlide(target, manual) {
    target = ((target % slides.length) + slides.length) % slides.length;
    requestedIndex = target;
    const sequence = ++generation;
    stopTimer();
    clearTimeout(transitionTimer);
    if (target === index) {
      changing = false;
      carousel.classList.remove('is-changing');
      armTimer();
      return;
    }
    changing = true;
    const image = preload[target];
    try {
      if (!image.complete || !image.naturalWidth) await image.decode();
    } catch {
      if (sequence !== generation) return;
      changing = false;
      carousel.classList.remove('is-changing');
      requestedIndex = index;
      if (manual) fields.status.textContent = 'Иллюстрация пока не загрузилась. Попробуйте переключить слайд ещё раз.';
      armTimer();
      return;
    }
    if (sequence !== generation) return;
    if (!manual && !autoAllowed()) { cancelChange(); return; }
    carousel.classList.add('is-changing');
    transitionTimer = setTimeout(() => {
      if (sequence !== generation) return;
      if (!manual && !autoAllowed()) { cancelChange(); return; }
      updateSlide(target, manual);
      requestAnimationFrame(() => {
        if (sequence !== generation) return;
        carousel.classList.remove('is-changing');
        changing = false;
        armTimer();
      });
    }, motion.matches ? 0 : 140);
  }

  previous.addEventListener('click', () => requestSlide(requestedIndex - 1, true));
  next.addEventListener('click', () => requestSlide(requestedIndex + 1, true));
  dots.forEach(dot => dot.addEventListener('click', () => requestSlide(Number(dot.dataset.heroSlide), true)));
  pause.addEventListener('click', () => {
    paused = !paused;
    updatePauseButton();
    armTimer();
  });
  controls.addEventListener('keydown', event => {
    let target;
    if (event.key === 'ArrowRight') target = requestedIndex + 1;
    else if (event.key === 'ArrowLeft') target = requestedIndex - 1;
    else if (event.key === 'Home') target = 0;
    else if (event.key === 'End') target = slides.length - 1;
    else return;
    event.preventDefault();
    requestSlide(target, true);
  });
  carousel.addEventListener('mouseenter', () => { hovered = true; armTimer(); });
  carousel.addEventListener('mouseleave', () => { hovered = false; armTimer(); });
  carousel.addEventListener('focusin', () => { focused = true; armTimer(); });
  carousel.addEventListener('focusout', () => queueMicrotask(() => {
    focused = carousel.contains(document.activeElement);
    armTimer();
  }));
  carousel.addEventListener('pointerdown', event => {
    if (event.pointerType !== 'touch' || !event.isPrimary || event.target.closest('button, a')) return;
    pointerStart = {x: event.clientX, y: event.clientY, id: event.pointerId};
  });
  carousel.addEventListener('pointerup', event => {
    if (!pointerStart || pointerStart.id !== event.pointerId) return;
    const dx = event.clientX - pointerStart.x;
    const dy = event.clientY - pointerStart.y;
    pointerStart = null;
    if (Math.abs(dx) >= 45 && Math.abs(dx) > Math.abs(dy) * 1.4) requestSlide(requestedIndex + (dx < 0 ? 1 : -1), true);
  });
  carousel.addEventListener('pointercancel', () => { pointerStart = null; });
  document.addEventListener('visibilitychange', armTimer);
  motion.addEventListener('change', event => {
    if (event.matches) paused = true;
    updatePauseButton();
    armTimer();
  });
  if (modal) new MutationObserver(armTimer).observe(modal, {attributes: true, attributeFilter: ['open']});
  if ('IntersectionObserver' in window) new IntersectionObserver(entries => {
    onScreen = entries[0].isIntersecting;
    armTimer();
  }, {threshold: .15}).observe(carousel);
  updatePauseButton();
  updateSlide(0, false);
  armTimer();
})();
