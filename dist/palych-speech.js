(function () {
  'use strict';

  const companion = document.getElementById('palychCompanion');
  const speech = document.getElementById('palychSpeech');
  const text = document.getElementById('palychSpeechText');
  const action = document.getElementById('palychSpeechAction');
  const close = document.getElementById('palychSpeechClose');
  const next = document.getElementById('palychSpeechNext');
  const modal = document.getElementById('mainModal');
  if (!companion || !speech || !text || !action || !close || !next) return;

  const phrases = [
    ['Я нашёл себе рыжую альтушку, найду и тебе.', 'Хочу альтушку'],
    ['Паспорт не нужен. Покажи, где у тебя пульт.', 'Как получить удостоверение скуфа?'],
    ['Гараж — это кабинет. Просто с нормальными инструментами.', 'Хочу в гараж'],
    ['Все проблемы решаемы. Некоторые — после бани.', 'Хочу в баню'],
    ['Не грусти. Даже у дивана бывает раскладной период.', 'Хочу отдохнуть'],
    ['Свидание согласуем. Носки с сандалиями — по обстановке.', 'Как оформить первое свидание?'],
    ['У тебя не кризис среднего возраста. У тебя чай остывает.', 'Хочу перерыв на чай'],
    ['Я бы пошёл на рыбалку, но кто тогда вас консультировать будет?', 'Хочу на рыбалку'],
    ['Ещё один бой — и спать. Документально это не подтверждено.', 'Продлить ещё один бой'],
    ['Для шашлыка плохой погоды нет. Есть короткий навес.', 'Открыть шашлычный сезон'],
    ['Альтушка слушает постпанк? Начни с «привет», не с лекции.', 'У нас с альтушкой разные плейлисты'],
    ['В очереди стоять не надо. Лежать — можно.', 'Показать все услуги'],
    ['Я не торможу. Я соблюдаю скуфский темп.', 'Что ты умеешь?'],
    ['Огород подождёт. Помидоры тоже хотят выходной.', 'На дачу и не копать'],
    ['Загадочность начинается с чистой футболки. Проверено Палычем.', 'Как понравиться альтушке?'],
    ['Если пульт рядом, значит, всё ещё под контролем.', 'Закрепить права на пульт'],
    ['Пять минут ещё не прошли. Я засекал по-скуфски.', 'Хочу ещё пять минут поспать'],
    ['Чёрный худи и тёплый чай. Вот тебе и общие интересы.', 'Хочу альтушку']
  ];
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let index = 0;
  let requestedIndex = 0;
  let dismissed = false;
  let ready = false;
  let hovered = false;
  let cycleTimer;
  let changeTimer;

  function isEditing() {
    const focused = document.activeElement;
    return !!focused && (focused.matches('input, textarea, select') || focused.isContentEditable);
  }
  function blocked() { return dismissed || !ready || document.hidden || modal?.open || isEditing(); }
  function stopCycle() { clearTimeout(cycleTimer); }
  function schedule() {
    stopCycle();
    if (!blocked() && !hovered && !companion.contains(document.activeElement) && !motion.matches) {
      cycleTimer = setTimeout(() => changePhrase(requestedIndex + 1), 12000);
    }
  }
  function changePhrase(target) {
    if (blocked()) return;
    requestedIndex = ((target % phrases.length) + phrases.length) % phrases.length;
    clearTimeout(changeTimer);
    stopCycle();
    const apply = () => {
      if (blocked()) { syncVisibility(); return; }
      index = requestedIndex;
      text.textContent = phrases[index][0];
      action.dataset.palychPrompt = phrases[index][1];
      speech.dataset.phrase = String(index);
      speech.classList.remove('is-changing');
      schedule();
    };
    if (motion.matches) apply();
    else { speech.classList.add('is-changing'); changeTimer = setTimeout(apply, 115); }
  }
  function syncVisibility() {
    if (blocked()) {
      stopCycle();
      clearTimeout(changeTimer);
      requestedIndex = index;
      speech.classList.remove('is-visible', 'is-changing');
      speech.hidden = true;
      return;
    }
    speech.hidden = false;
    requestAnimationFrame(() => { if (!blocked()) speech.classList.add('is-visible'); });
    schedule();
  }

  action.addEventListener('click', () => companion.querySelector('.assistant-button')?.focus({preventScroll:true}));
  next.addEventListener('click', () => changePhrase(requestedIndex + 1));
  close.addEventListener('click', () => {
    dismissed = true;
    syncVisibility();
    companion.querySelector('.assistant-button')?.focus({preventScroll:true});
  });
  companion.addEventListener('pointerenter', () => { hovered = true; stopCycle(); });
  companion.addEventListener('pointerleave', () => { hovered = false; schedule(); });
  document.addEventListener('focusin', syncVisibility);
  document.addEventListener('focusout', () => queueMicrotask(syncVisibility));
  document.addEventListener('visibilitychange', syncVisibility);
  motion.addEventListener('change', syncVisibility);
  if (modal) new MutationObserver(syncVisibility).observe(modal, {attributes:true, attributeFilter:['open']});
  window.addEventListener('pagehide', stopCycle);
  window.addEventListener('pageshow', syncVisibility);
  speech.dataset.phrase = '0';
  setTimeout(() => { ready = true; syncVisibility(); }, 1200);
})();
