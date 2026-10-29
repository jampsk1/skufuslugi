'use strict';

const $ = (query, root = document) => root.querySelector(query);
const $$ = (query, root = document) => [...root.querySelectorAll(query)];
const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const icons = {
  sofa: '<path d="M4 12V8a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v4M4 12a2 2 0 0 0-2 2v5h20v-5a2 2 0 0 0-4 0v2H6v-2a2 2 0 0 0-2-2ZM5 19v2m14-2v2"/>',
  garage: '<path d="m3 9 9-6 9 6v12H3V9Zm3 12V11h12v10M6 15h12M6 18h12"/>',
  fish: '<path d="M3 12s4-6 10-6c4 0 7 6 7 6s-3 6-7 6c-6 0-10-6-10-6Zm0 0-2-5v10l2-5ZM10 6l3-3 2 3m-5 12 3 3 2-3"/><circle cx="16" cy="11" r=".8"/>',
  grill: '<path d="M3 10h18a9 9 0 0 1-18 0Zm4 8-2 4m12-4 2 4M7 5c-2-2 2-2 0-4m5 4c-2-2 2-2 0-4m5 4c-2-2 2-2 0-4M6 21h12"/>',
  games: '<path d="M7 7h10a5 5 0 0 1 5 5l-1 6a2 2 0 0 1-3 1l-4-3h-4l-4 3a2 2 0 0 1-3-1l-1-6a5 5 0 0 1 5-5ZM7 10v5m-2.5-2.5h5M15 11h.1m3 3h.1"/>',
  badge: '<path d="M5 3h14v13l-7 5-7-5V3Zm7 4 1.2 2.4L16 10l-2 2 .5 2.7-2.5-1.3-2.5 1.3L10 12l-2-2 2.8-.6L12 7Z"/>',
  heart: '<path d="M20.8 4.6a5.4 5.4 0 0 0-7.6 0L12 5.8l-1.2-1.2a5.4 5.4 0 0 0-7.6 7.6L12 21l8.8-8.8a5.4 5.4 0 0 0 0-7.6Z"/><path d="m16 4 1-2m4 5 2-1"/>'
};
const categories = [
  {id:'dating', title:'Альтушки и знакомства', icon:'heart', color:'pink'},
  {id:'rest', title:'Диван и отдых', icon:'sofa', color:'blue'},
  {id:'garage', title:'Гараж и авто', icon:'garage', color:'purple'},
  {id:'fishing', title:'Рыбалка и дача', icon:'fish', color:'teal'},
  {id:'grill', title:'Мангал и кухня', icon:'grill', color:'orange'},
  {id:'games', title:'Игры и досуг', icon:'games', color:'violet'},
  {id:'status', title:'Льготы и статус', icon:'badge', color:'red'}
];
const services = [
  {id:'altushka', category:'dating', title:'Получение альтушки по скуфквоте', description:'Мемная заявка на знакомство. Чёрный худи, общий вайб и взаимная симпатия приветствуются.', emoji:'💜', tag:'Новая скуфльгота', time:'2 минуты', popular:true, keywords:'альтушка альтушки альтушку получение выдача скуфквота знакомство девушка любовь романтика готка'},
  {id:'date', category:'dating', title:'Согласование первого свидания', description:'Выберите дату и место. Палыч рекомендует кофе, искренность и футболку без пятна от шашлыка.', emoji:'🌹', tag:'Выход из зоны дивана', time:'1 минута', popular:true, keywords:'свидание первое встреча девушка пригласить кофе романтика знакомство'},
  {id:'concert', category:'dating', title:'Пропуск на концерт «я такое не слушаю»', description:'Сходите с альтушкой на концерт. Разрешено кивать в ритм и не спрашивать, когда будет Газманов.', emoji:'🎸', tag:'Культурный обмен', time:'1 минута', popular:true, keywords:'концерт альтушка рок панк метал музыка группа выступление билет'},
  {id:'sofa', category:'rest', title:'Разрешение на ничего не делание', description:'Официальное право полежать. Без чувства вины и «ну сделай хоть что-нибудь».', emoji:'🛋️', tag:'Самое нужное', time:'1 минута', popular:true, keywords:'диван отдых сон ничего отпуск полежать пульт'},
  {id:'banya', category:'rest', title:'Оформление банного дня', description:'Разрешение попариться, выдохнуть и обсудить с веником накопившиеся вопросы. Суету оставьте в предбаннике.', emoji:'🧖', tag:'С лёгким паром', time:'1 минута', keywords:'баня баню бане банька баньку банный день парилка сауна веник попариться париться отдых'},
  {id:'certificate', category:'status', title:'Удостоверение настоящего скуфа', description:'Подтвердите статус. Ваш жизненный опыт заслуживает отдельного документа.', emoji:'🪪', tag:'Документы', time:'2 минуты', popular:true, keywords:'скф скуф документ паспорт тест уровень статус удостоверение'},
  {id:'fishing', category:'fishing', title:'Согласование выезда на рыбалку', description:'Клюёт или не клюёт — уважительная причина уехать на рассвете уже есть.', emoji:'🎣', tag:'За городом', time:'1 минута', popular:true, keywords:'рыбалка рыба удочка озеро река выезд природа'},
  {id:'grill', category:'grill', title:'Открытие шашлычного сезона', description:'Мясо замариновано, экспертное мнение готово. Осталось оформить полномочия.', emoji:'🍖', tag:'По сезону души', time:'1 минута', popular:true, keywords:'мангал шашлыки шашлык угли мясо кухня сезон'},
  {id:'garage', category:'garage', title:'Пропуск в гараж на весь день', description:'Там всегда есть чем заняться. Даже если просто постоять и посмотреть.', emoji:'🧰', tag:'Мужское место силы', time:'1 минута', popular:true, keywords:'гараж авто машина ремонт инструменты пропуск дрель'},
  {id:'battle', category:'games', title:'Продление «ещё одного боя»', description:'Последний. Точно последний. Диванная комиссия всё понимает.', emoji:'🎮', tag:'Безлимитно', time:'30 секунд', popular:true, keywords:'танки игра игры бой танк компьютер гейминг досуг'},
  {id:'nap', category:'rest', title:'Законные «ещё пять минут»', description:'Продлите утренний сон. Отсчёт начинается после последнего напоминания.', emoji:'😴', tag:'Сон — это святое', time:'30 секунд', keywords:'сон спать утро будильник пять минут подушка отдых'},
  {id:'car', category:'garage', title:'Справка «тут что-то стучит»', description:'Зафиксируйте подозрительный звук. Дальнейшая диагностика — покачать головой.', emoji:'🚗', tag:'Автодела', time:'1 минута', keywords:'авто машина ремонт звук стук автомобиль колеса'},
  {id:'dacha', category:'fishing', title:'Дачная амнистия от огорода', description:'Разрешение приехать на дачу и не копать. Помидоры отнесутся с пониманием.', emoji:'🌱', tag:'Дачный вопрос', time:'1 минута', keywords:'дача огород земля помидоры грядки сад отдых'},
  {id:'tea', category:'grill', title:'Перерыв на чай с чем-нибудь', description:'Закрепите право на сладкое после сладкого. Рабочие вопросы подождут.', emoji:'☕', tag:'Положено каждому', time:'30 секунд', keywords:'чай кофе перерыв печенье кухня еда сладкое'},
  {id:'remote', category:'games', title:'Закрепление прав на пульт', description:'Сделайте пульт персональным. Вместе с правом комментировать происходящее.', emoji:'📺', tag:'Домашний досуг', time:'1 минута', keywords:'пульт телевизор футбол новости игры досуг кино'},
  {id:'socks', category:'status', title:'Регистрация носков с сандалиями', description:'Комфортное сочетание теперь с документом. Чужое мнение в комплект не входит.', emoji:'🧦', tag:'Скуфский стиль', time:'1 минута', keywords:'носки сандалии стиль одежда мода статус льготы'},
  {id:'playlist', category:'dating', title:'Справка о совместимости плейлистов', description:'У неё постпанк, у вас «Любэ». Найдите трек, под который комфортно молчать вдвоём.', emoji:'🎧', tag:'Общий вайб', time:'1 минута', keywords:'плейлист совместимость музыка разные вкусы песни постпанк любэ альтушка'},
  {id:'makeover', category:'dating', title:'Перевод из скуфа в загадочного мужчину', description:'Чистая футболка, ухоженная борода и чуть меньше «а вот в мои годы». Харизма уже при вас.', emoji:'🕶️', tag:'Обновление образа', time:'2 минуты', keywords:'понравиться альтушке образ внешность стрижка борода ухоженный загадочный мужчина перевоплощение'},
  {id:'apology', category:'dating', title:'Амнистия после фразы «это просто фаза»', description:'Подайте заявление на искреннее «я был неправ». Её музыкальные вкусы обжалованию не подлежат.', emoji:'🖤', tag:'Работа над ошибками', time:'1 минута', keywords:'извинение извиниться прости ссора помириться обидел фаза просто фаза отношения'}
];
const news = [
  {title:'Скуфквота открыта. Романтика тоже.', date:'29 октября 2026', label:'НОВАЯ СКУФЛЬГОТА', emoji:'💜', description:'На портале появились альтушки и знакомства.', body:'Диванная комиссия запустила мемную программу «Скуф и альтушка»: знакомство, первое свидание, совместный концерт и примирение музыкальных вкусов. Для взрослых 18+. Нужны чувство юмора, взаимная симпатия и уважение к чужому плейлисту.', service:'altushka'},
  {title:'Ваш скуфский стаж — теперь в цифре', date:'25 октября 2026', label:'ЦИФРОВОЙ КОМФОРТ', emoji:'🪪', description:'Удостоверение, которое всегда под рукой.', body:'Пройдите небольшой тест и получите персональное удостоверение. Его можно скачать, показать друзьям или бережно хранить рядом с инструкцией от дрели. Документ действует на всех диванах вашего воображения.', service:'certificate'},
  {title:'Новый норматив: ещё пять минут', date:'22 октября 2026', label:'ВАЖНОЕ УТОЧНЕНИЕ', emoji:'⏰', description:'Теперь с возможностью автоматического продления.', body:'По многочисленным просьбам отдыхающих отсчёт пяти минут начинается после последнего напоминания. Если напоминаний несколько — выбирайте самое позднее. Получить шуточное разрешение можно прямо на портале.', service:'nap'}
];
const quizQuestions = [
  {title:'Идеальный вечер — это…', options:[['Новая выставка и прогулка по городу',0],['Друзья, чай и разговоры',1],['Диван, сериал. И чтобы никто не трогал',2]]},
  {title:'Кто-то тронул ваши инструменты. Вы…', options:[['Не замечу — у меня их нет',0],['Попросите в следующий раз предупредить',1],['Почувствуете это, даже находясь в другой комнате',2]]},
  {title:'Носки с сандалиями — это…', options:[['Интересный модный эксперимент',0],['Пока не пробовал, но не осуждаю',1],['Продуманная система комфорта',2]]},
  {title:'Сколько длится «один последний бой»?', options:[['Ровно один бой',0],['Как повезёт с командой',1],['Вопрос некорректный. Следующий',2]]},
  {title:'Вас зовут куда-то в выходной. Первая мысль?', options:[['Отлично! Где встречаемся?',0],['А кто ещё будет?',1],['А может, ко мне? Дома же лучше',2]]}
];
const storageKey = 'skufuslugi-v1';
let storageAvailable = true;
let state = {name:'', region:'Диванный округ', applications:[], certificate:null};
try {
  const saved = JSON.parse(localStorage.getItem(storageKey) || 'null');
  if(saved && typeof saved === 'object') {
    state.name = typeof saved.name === 'string' ? saved.name.slice(0,40) : '';
    state.region = typeof saved.region === 'string' ? saved.region : state.region;
    state.applications = Array.isArray(saved.applications) ? saved.applications.filter(a => a && typeof a.id === 'string' && services.some(s=>s.id===a.service)).slice(-100) : [];
    state.certificate = saved.certificate && Number.isFinite(saved.certificate.score) ? saved.certificate : null;
  }
} catch { storageAvailable = false; }
function persist() {
  try { localStorage.setItem(storageKey, JSON.stringify(state)); }
  catch { storageAvailable = false; toast('Браузер не разрешил сохранение. Данные доступны до закрытия страницы.'); }
}
let currentCategory = 'all';
let currentFilter = 'popular';
let currentQuery = '';
let quizAnswers = [];
let lastFocusedElement = null;
let toastTimer;
const modal = $('#mainModal');
const body = $('#modalBody');

function icon(name) { return `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[name]}</svg>`; }
function dateLabel(value) { return new Date(value).toLocaleDateString('ru-RU',{day:'numeric',month:'long',year:'numeric'}); }
function toast(message) {
  clearTimeout(toastTimer); const el=$('#toast'); el.textContent=message; el.hidden=false;
  toastTimer=setTimeout(()=>{el.hidden=true;},4200);
}
function openModal(title, html, className='') {
  $('#modalTitle').textContent=title; body.innerHTML=html; modal.className=`modal ${className}`;
  if(!modal.open) { lastFocusedElement=document.activeElement; modal.showModal(); document.body.classList.add('modal-open'); }
  body.scrollTop=0;
  requestAnimationFrame(()=>{ const el=$('[autofocus]',body); if(el) el.focus(); });
}
function closeModal(){modal.close();}
modal.addEventListener('close',()=>{document.body.classList.remove('modal-open');lastFocusedElement?.focus();});
modal.addEventListener('click',(event)=>{if(event.target===modal) {const r=modal.getBoundingClientRect(); if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)closeModal();}});
$('.modal-close').addEventListener('click',closeModal);

function syncProfile() {
  $('#headerUser').textContent=state.name || 'Войти';
  $('#regionLabel').textContent=state.region;
  $('#profileTitle').innerHTML=state.name ? `С возвращением,<br>${escapeHtml(state.name)}!` : 'Свой человек?<br>Заходите.';
  $('#profileDescription').innerHTML=state.name ? `${state.certificate?'Статус скуфа подтверждён.':'Тапочки на месте. Чай почти готов.'}<br>Самое время немного отдохнуть.` : 'Ваши заявления, документы<br>и заслуженные привилегии.';
  $('#profileButton').innerHTML=state.name ? 'Мой диванный кабинет <span aria-hidden="true">→</span>' : 'Войти по-скуфски <span aria-hidden="true">→</span>';
  $('#applicationCount').textContent=state.applications.length;
  $('#applicationCount').hidden=state.applications.length===0;
}
function renderCategories() {
  $('#categoryGrid').innerHTML=categories.map(c=>{const count=services.filter(s=>s.category===c.id).length;const countLabel=`${count} ${count%100>=11&&count%100<=14?'услуг':count%10===1?'услуга':count%10>=2&&count%10<=4?'услуги':'услуг'}`;return c.id==='dating'?`<button class="category-button category-dating ${currentCategory===c.id?'active':''}" data-category="${c.id}" aria-pressed="${currentCategory===c.id}"><span class="category-icon icon-pink">${icon(c.icon)}</span><span class="category-dating-copy"><span class="category-dating-label">СКУФКВОТА ОТКРЫТА</span><span class="category-title">${c.title}</span><span class="category-count">${countLabel} · От знакомства до общего плейлиста</span></span><span class="category-dating-badge">По взаимной симпатии</span><span class="category-dating-arrow" aria-hidden="true">↗</span></button>`:`<button class="category-button ${currentCategory===c.id?'active':''}" data-category="${c.id}" aria-pressed="${currentCategory===c.id}"><span class="category-icon icon-${c.color}">${icon(c.icon)}</span><span class="category-title">${c.title}</span><span class="category-count">${countLabel} <span aria-hidden="true">↗</span></span></button>`;}).join('');
}
function matchingServices(query) {
  const words = query.trim().toLocaleLowerCase('ru').replace(/ё/g,'е').split(/\s+/).filter(Boolean);
  return services.filter(s=>{const text=`${s.title} ${s.description} ${s.keywords}`.toLowerCase().replace(/ё/g,'е'); return words.every(w=>text.includes(w));});
}
function renderServices() {
  let list=matchingServices(currentQuery).filter(s=>currentCategory==='all'||s.category===currentCategory);
  if(currentFilter==='popular') list=list.filter(s=>s.popular);
  const filtered=currentQuery||currentCategory!=='all';
  $('#catalogHeading').textContent=currentQuery ? 'Результаты поиска' : currentCategory!=='all' ? categories.find(c=>c.id===currentCategory).title : currentFilter==='all'?'Все услуги':'Популярные услуги';
  $('#resultsCount').hidden=!filtered;
  $('#resultsCount').innerHTML=`Найдено: ${list.length} <button class="text-link" data-action="reset-search">Сбросить фильтры ×</button>`;
  $$('.filter-tab').forEach(b=>{b.classList.toggle('active',b.dataset.filter===currentFilter);b.setAttribute('aria-pressed',String(b.dataset.filter===currentFilter));});
  $('#servicesGrid').innerHTML=list.length?list.map(s=>`<button class="service-card" data-service="${s.id}"><span class="service-top"><span class="service-tag">${s.tag}</span><span class="service-emoji" aria-hidden="true">${s.emoji}</span></span><h3>${s.title}</h3><span class="service-description">${s.description}</span><span class="service-bottom"><span class="service-time"><svg width="14" height="14" viewBox="0 0 20 20" fill="none" aria-hidden="true"><circle cx="10" cy="10" r="7.2" stroke="currentColor" stroke-width="1.4"/><path d="M10 6v4l2.5 1.5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>${s.time} <span class="time-dot">·</span> Бесплатно</span><span class="service-arrow" aria-hidden="true">↗</span></span></button>`).join(''):`<div class="empty-state"><span aria-hidden="true">🔎</span><h3>Такой услуги пока нет</h3><p>Попробуйте «диван», «гараж» или «рыбалка».<br>Сложные вопросы решаем после чая.</p><button class="button button-outline" data-action="reset-search">Показать все услуги</button></div>`;
}
function renderNews(){ $('#newsGrid').innerHTML=news.map((n,i)=>`<button class="news-card" data-news="${i}"><span class="news-visual news-v${i+1}"><span class="news-visual-label">${n.label}</span><span class="news-illustration" aria-hidden="true">${n.emoji}</span><span class="news-visual-circle" aria-hidden="true"></span></span><span class="news-body"><span class="news-date">${n.date}</span><h3>${n.title}</h3><span>${n.description}</span><span class="news-read">Читать <span aria-hidden="true">→</span></span></span></button>`).join(''); }
function resetSearch(){currentQuery='';currentCategory='all';currentFilter='all';$('#serviceSearch').value='';renderCategories();renderServices();}
function goToCatalog(){closeModal();$('#catalog').scrollIntoView({behavior:'smooth',block:'start'});}
$('#searchForm').addEventListener('submit',(event)=>{event.preventDefault();showChat($('#serviceSearch').value.trim());});

function showProfile() {
  if(!state.name) {
    openModal('Свой человек. Без формальностей.',`<div class="modal-illustration" aria-hidden="true">👋</div><p class="modal-lead">Представьтесь — и располагайтесь. Пароль не нужен, тапочки уже ждут.</p><form id="profileForm"><div class="field"><label for="profileName">Как к вам обращаться?</label><input id="profileName" name="name" placeholder="Например, Сан Саныч" maxlength="40" required autocomplete="nickname" autofocus></div><p class="form-note">Имя и заявления сохраняются только в этом браузере. Можно использовать прозвище.</p><button class="button button-blue button-full" type="submit">Занять свой диван →</button></form>`);
  } else {
    openModal('Ваш диванный кабинет',`<div class="profile-summary"><span class="profile-summary-avatar" aria-hidden="true">🧔</span><div><h3>${escapeHtml(state.name)}</h3><p>${escapeHtml(state.region)} · Свой человек</p></div></div><div class="account-links"><button data-nav="applications"><span>📨 Заявления</span><strong>${state.applications.length} →</strong></button><button data-nav="documents"><span>🪪 Мои документы</span><strong>${state.certificate?'1':'0'} →</strong></button><button data-action="quiz"><span>🛋️ Уровень скуфства</span><strong>${state.certificate?state.certificate.score*10+'%':'Узнать'} →</strong></button></div><form id="profileForm"><div class="field"><label for="profileName">Имя в кабинете</label><input id="profileName" name="name" value="${escapeHtml(state.name)}" maxlength="40" required autocomplete="nickname"></div><button class="button button-outline button-full" type="submit">Сохранить имя</button></form><button class="text-link logout-link" data-action="logout">Выйти из кабинета</button>`);
  }
}
function isDatingService(id){return services.some(s=>s.id===id&&s.category==='dating');}
function applicationStatus(id){return isDatingService(id)?'Принято в реестр романтики':'Одобрено диванной комиссией';}
function showService(id) {
  const service=services.find(s=>s.id===id);if(!service)return;
  if(id==='certificate'){startQuiz();return;}
  const dating=service.category==='dating';
  const options=dating?['Прогулка и кофе','Концерт','Парк и разговоры']:['На весь день','На пару часов','До особого распоряжения'];
  openModal(service.title,`<div class="service-modal-intro"><span class="modal-illustration" aria-hidden="true">${service.emoji}</span><p>${service.description}</p></div><div class="service-facts"><span>◷ ${service.time}</span><span>✓ Бесплатно</span><span>${dating?'💜 Знакомства 18+':'✓ Без очереди'}</span></div><form id="applicationForm" data-id="${service.id}"><div class="field"><label for="appName">Как к вам обращаться?</label><input id="appName" name="name" placeholder="Имя или прозвище" value="${escapeHtml(state.name)}" maxlength="40" required autocomplete="nickname" autofocus></div><div class="field-row"><div class="field"><label for="appDate">${dating?'Желаемая дата':'Когда приступаем?'}</label><input id="appDate" name="date" type="date" required value="${localDate()}" min="${localDate()}"></div><div class="field"><label for="appDuration">${dating?'Формат встречи':'На сколько?'}</label><select id="appDuration" name="duration">${options.map(o=>`<option>${o}</option>`).join('')}</select></div></div><div class="field"><label for="appComment">Особые пожелания <span class="optional">необязательно</span></label><textarea id="appComment" name="comment" rows="2" maxlength="300" placeholder="${dating?'Например: кофе, парк и разговоры о музыке':'Например: не беспокоить до ужина'}"></textarea></div><label class="check-field"><input type="checkbox" required name="confirm"><span>${dating?'Мне есть 18 лет. Знакомство — только по взаимному желанию.':'Подтверждаю: я заслужил немного комфорта'}</span></label><p class="form-note">${dating?'Шуточная заявка на знакомство. Портал не подбирает людей: всё решает взаимная симпатия.':'Шуточное заявление. Сохраняется на вашем устройстве.'}</p><button class="button button-blue button-full" type="submit">Подать заявление →</button></form>`);
}
function localDate(){const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;}
function showApplications() {
  openModal('Мои заявления',state.applications.length?`<p class="modal-lead">Все дела под контролем. Можно спокойно отдыхать.</p><div class="application-list">${[...state.applications].reverse().map(a=>{const s=services.find(s=>s.id===a.service);return `<button class="application-item" data-application="${escapeHtml(a.id)}"><span class="application-emoji" aria-hidden="true">${s.emoji}</span><span class="application-info"><strong>${s.title}</strong><small>№ ${escapeHtml(a.id)} · ${dateLabel(a.created)}</small><span class="application-status status-green">✓ ${applicationStatus(a.service)}</span></span><span aria-hidden="true">→</span></button>`;}).join('')}</div>`:`<div class="empty-state"><span aria-hidden="true">📭</span><h3>Пока никаких забот</h3><p>Самое время оформить что-нибудь приятное.<br>Например, разрешение ничего не делать.</p><button class="button button-blue" data-action="browse">Выбрать услугу →</button></div>`);
}
function showApplication(id){const a=state.applications.find(a=>a.id===id);if(!a)return;const s=services.find(s=>s.id===a.service);const dating=isDatingService(a.service);openModal(dating?'Заявка на знакомство':'Заявление одобрено',`<div class="success-icon" aria-hidden="true">${dating?'♡':'✓'}</div><h3 class="result-title">${s.title}</h3><p class="result-text">${escapeHtml(a.name)}, ${dating?'намерение задокументировано. Остальное — за разговором и взаимной симпатией.':'всё решено. Можете приступать к заслуженному отдыху.'}</p><dl class="application-details"><div><dt>Номер заявления</dt><dd>${escapeHtml(a.id)}</dd></div><div><dt>${dating?'Желаемая дата':'Дата начала'}</dt><dd>${dateLabel(a.date+'T12:00:00')}</dd></div><div><dt>${dating?'Формат встречи':'Срок действия'}</dt><dd>${escapeHtml(a.duration)}</dd></div><div><dt>Подано</dt><dd>${dateLabel(a.created)}</dd></div>${a.comment?`<div><dt>Ваши пожелания</dt><dd>${escapeHtml(a.comment)}</dd></div>`:''}</dl><p class="form-note">${dating?'Шуточная заявка. Знакомство происходит только по взаимному желанию.':'Мемное разрешение. Выдано диванной комиссией без юридической силы.'}</p><button class="button button-outline button-full" data-nav="applications">Все заявления</button>`);}
function startQuiz(){quizAnswers=[];showQuizQuestion();}
function showQuizQuestion(){
  const index=quizAnswers.length;if(index===quizQuestions.length){finishQuiz();return;}
  const q=quizQuestions[index];
  openModal('Подтверждение скуфства',`<div class="quiz-heading"><span class="step-label">ВОПРОС ${index+1} ИЗ ${quizQuestions.length}</span><span>${index*20}%</span></div><div class="progress-track"><div class="progress-fill" style="width:${index*20}%"></div></div><span class="quiz-emoji" aria-hidden="true">${['🛋️','🧰','🧦','🎮','🏡'][index]}</span><h3 class="quiz-question" tabindex="-1">${q.title}</h3><div class="quiz-options">${q.options.map(([text,value],i)=>`<button class="quiz-option" data-answer="${value}" data-option="${i}"><span class="option-letter">${['А','Б','В'][i]}</span>${text}<span aria-hidden="true">→</span></button>`).join('')}</div>${index?'<button class="text-link quiz-back" data-action="quiz-back">← Предыдущий вопрос</button>':''}<p class="form-note">Здесь нет неправильных ответов. Есть ваш уровень комфорта.</p>`);
  requestAnimationFrame(()=>$('.quiz-question')?.focus());
}
function certificateLevel(score){return score>=8?'Заслуженный скуф':score>=5?'Уверенный скуф':'Начинающий скуф';}
function finishQuiz(){
  const score=quizAnswers.reduce((sum,v)=>sum+v,0);state.certificate={score,date:new Date().toISOString(),number:'СК-'+String(Date.now()).slice(-8)};persist();syncProfile();showQuizResult();
}
function showQuizResult(){
  const cert=state.certificate;
  openModal('Скуфство подтверждено',`<div class="result-circle"><span aria-hidden="true">🛋️</span><strong>${cert.score*10}%</strong><span>скуфства</span></div><h3 class="result-title">${certificateLevel(cert.score)}</h3><p class="result-text">${cert.score>=8?'Вы уже всё поняли. Диван гордится вами, а пульт сам находит дорогу в вашу руку.':cert.score>=5?'Баланс найден: дела делами, а комфорт — по расписанию. Диван одобряет ваш подход.':'В душе вы ещё исследователь. Но первый шаг к большому дивану уже сделан.'}</p><div class="result-stats"><span>✓ Статус подтверждён</span><span>∞ Право на отдых</span></div><button class="button button-blue button-full" data-action="download-certificate">Скачать удостоверение ↓</button><button class="button button-outline button-full result-secondary" data-nav="documents">Открыть мои документы →</button><p class="form-note">Шуточный тест. Удостоверение не является официальным документом.</p>`);
}
function showDocuments(){const c=state.certificate;openModal('Мои документы',c?`<p class="modal-lead">Ваш статус подтверждён. Бумажки больше не нужны. Но можно скачать.</p><div class="document-card"><span aria-hidden="true">🪪</span><span class="mini-label">УДОСТОВЕРЕНИЕ СКУФА</span><h3>${certificateLevel(c.score)}</h3><p>${escapeHtml(state.name||'Человек дивана')}</p><div class="document-meta"><span>№ ${escapeHtml(c.number)}</span><span>Уровень: ${c.score*10}%</span></div><small>Выдано ${dateLabel(c.date)} · Бессрочно</small></div><button class="button button-blue button-full" data-action="download-certificate">Скачать удостоверение ↓</button><button class="text-link result-secondary" data-action="quiz">Пройти тест ещё раз</button>`:`<div class="empty-state"><span aria-hidden="true">🪪</span><h3>Сначала немного о себе</h3><p>Пройдите 5 вопросов о комфорте —<br>получите личное удостоверение скуфа.</p><button class="button button-blue" data-action="quiz">Подтвердить скуфство →</button></div>`);}
function downloadCertificate(){
  if(!state.certificate){startQuiz();return;}
  const c=state.certificate, name=escapeHtml(state.name||'Человек дивана');
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="1100" height="700" viewBox="0 0 1100 700"><rect width="1100" height="700" rx="32" fill="#f6f3e9"/><rect x="25" y="25" width="1050" height="650" rx="22" fill="none" stroke="#d5c9a7" stroke-width="2"/><path d="M70 90h40v90H70z" fill="#1259dd"/><path d="M110 90h40v90h-40z" fill="#ee4859"/><g font-family="Arial,sans-serif" fill="#17233f"><text x="180" y="126" font-size="31" font-weight="bold">скуфуслуги</text><text x="180" y="160" font-size="17" fill="#788297">ПОРТАЛ СПОКОЙНОЙ ЖИЗНИ</text><text x="70" y="260" font-size="21" letter-spacing="5">УДОСТОВЕРЕНИЕ СКУФА</text><path d="M70 290h960" stroke="#d5c9a7"/><text x="70" y="370" font-size="46" font-weight="bold">${certificateLevel(c.score)}</text><text x="70" y="436" font-size="32">${name}</text><text x="70" y="500" font-size="22" fill="#69758b">Уровень скуфства: ${c.score*10}% · Право на отдых: бессрочно</text><text x="70" y="575" font-size="18" fill="#69758b">№ ${escapeHtml(c.number)} · Выдано ${dateLabel(c.date)}</text><text x="70" y="630" font-size="16" fill="#8b8b8b">Шуточный документ. Действует на территории хорошего настроения.</text></g><circle cx="938" cy="126" r="55" fill="none" stroke="#1259dd" stroke-width="2"/><path d="m915 126 16 16 30-34" fill="none" stroke="#1259dd" stroke-width="6" stroke-linecap="round"/></svg>`;
  const url=URL.createObjectURL(new Blob([svg],{type:'image/svg+xml;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='udostoverenie-skufa.svg';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),10000);toast('Удостоверение готово. Храните рядом с пультом.');
}
function palychAvatar(){return '<svg viewBox="0 0 64 64" fill="none" aria-hidden="true"><path d="M32 13V7" stroke="#1259dd" stroke-width="3" stroke-linecap="round"/><circle cx="32" cy="6" r="4" fill="#ee4859"/><rect x="7" y="16" width="50" height="40" rx="16" fill="#1259dd"/><rect x="13" y="22" width="38" height="27" rx="10" fill="#e9f3ff"/><rect x="2" y="29" width="5" height="14" rx="2.5" fill="#8bb9ff"/><rect x="57" y="29" width="5" height="14" rx="2.5" fill="#8bb9ff"/><path d="M21 31h6m10 0h6" stroke="#1259dd" stroke-width="3" stroke-linecap="round"/><path d="M32 38c-4-5-7-2-10 2 5 3 8 1 10-1 2 2 5 4 10 1-3-4-6-7-10-2Z" fill="#17233f"/><path d="M26 55v3m12-3v3" stroke="#1259dd" stroke-width="3" stroke-linecap="round"/></svg>';}
let palychConversation=[];
function palychWelcome(){return `<div class="palych-welcome"><div class="palych-welcome-icon">${palychAvatar()}</div><h3>Здорово! Я Палыч.</h3><p>Помогу найти услугу, разобраться с заявлением<br>и оформить заслуженный отдых. Что у вас?</p><div class="palych-welcome-prompts">${[
  ['🛋️','Устал. Хочу полежать','Найти законный повод для отдыха','Устал на работе, хочу полежать'],
  ['🎣','Собираюсь на рыбалку','Оформить выезд без лишних вопросов','Хочу с друзьями рыбу ловить'],
  ['💜','Хочу альтушку','Разобраться со скуфквотой на знакомства','Как получить альтушку?'],
  ['📨','Где моё заявление?','Проверить, что решила комиссия','Где посмотреть мои заявления?']
].map(([emoji,title,caption,query])=>`<button class="palych-prompt" data-chat="${escapeHtml(query)}"><span aria-hidden="true">${emoji}</span><span><strong>${title}</strong><small>${caption}</small></span><span aria-hidden="true">↗</span></button>`).join('')}</div></div>`;}
function palychAction(action){
  const attributes={applications:'data-nav="applications"',documents:'data-nav="documents"',quiz:'data-action="quiz"',catalog:'data-action="browse"',category:`data-category="${escapeHtml(action.category||'rest')}"`};
  return attributes[action.type]?`<button class="button button-outline" ${attributes[action.type]}>${escapeHtml(action.label)} <span aria-hidden="true">→</span></button>`:'';
}
function renderPalychReply(reply){
  const results=(reply.services||[]).map(id=>services.find(s=>s.id===id)).filter(Boolean);
  return `<div class="palych-turn"><div class="chat-message palych-answer"><span class="palych-message-avatar">${palychAvatar()}</span><div class="palych-answer-content"><p>${escapeHtml(reply.text).replace(/\n/g,'<br>')}</p>${results.length?`<div class="palych-service-results">${results.map(s=>`<button class="palych-service-result" data-service="${s.id}"><span class="palych-result-emoji" aria-hidden="true">${s.emoji}</span><span><strong>${s.title}</strong><small>${s.time} · Бесплатно · Без очереди</small></span><span aria-hidden="true">→</span></button>`).join('')}</div>`:''}${reply.actions?.length?`<div class="palych-action-list">${reply.actions.map(palychAction).join('')}</div>`:''}${reply.suggestions?.length?`<div class="palych-reply-suggestions">${reply.suggestions.map(s=>`<button data-chat="${escapeHtml(s)}">${escapeHtml(s)}</button>`).join('')}</div>`:''}</div></div></div>`;
}
function renderPalychConversation(){
  const messages=$('#chatMessages');if(!messages)return;
  messages.innerHTML=palychConversation.length?palychConversation.map(entry=>entry.role==='user'?`<div class="palych-turn"><div class="chat-message user">${escapeHtml(entry.text)}</div></div>`:renderPalychReply(entry)).join(''):palychWelcome();
  requestAnimationFrame(()=>{messages.scrollTop=messages.scrollHeight;});
}
function showChat(query=''){
  openModal('Робот Палыч',`<div class="palych-shell"><div class="palych-toolbar"><span class="palych-avatar">${palychAvatar()}</span><div><strong>Ваш помощник по скуфским делам</strong><small><span class="green-dot"></span> Без очереди и лишних движений</small></div><button class="palych-reset" data-action="palych-reset" aria-label="Начать новый разговор с Палычем">Новый разговор <span aria-hidden="true">↻</span></button></div><div class="chat-messages palych-messages" id="chatMessages" role="log" aria-label="Разговор с Палычем" aria-live="polite" aria-relevant="additions"></div><div class="palych-compose"><form class="chat-form" id="chatForm"><label class="sr-only" for="chatInput">Сообщение Палычу</label><input id="chatInput" placeholder="Расскажите, что хотите порешать" maxlength="300" required autocomplete="off" autofocus><button class="button button-blue" type="submit" aria-label="Отправить сообщение Палычу"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 19V5m-6 6 6-6 6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></button></form><p class="palych-compose-note">Палыч подбирает мемные услуги и помогает с порталом</p></div></div>`,'palych-modal');
  renderPalychConversation();if(query)chatReply(query);
}
function chatReply(query){
  query=String(query).trim().slice(0,300);if(!query)return;
  if(!$('#chatMessages'))showChat();
  const reply=window.PalychEngine.respond(query,{services,categories,history:palychConversation,applicationsCount:state.applications.length,hasCertificate:!!state.certificate});
  palychConversation.push({role:'user',text:query},{role:'assistant',...reply});
  if(palychConversation.length>40)palychConversation=palychConversation.slice(-40);
  const messages=$('#chatMessages');
  $('.palych-welcome',messages)?.remove();
  messages.insertAdjacentHTML('beforeend',`<div class="palych-turn"><div class="chat-message user">${escapeHtml(query)}</div></div>${renderPalychReply(reply)}`);
  requestAnimationFrame(()=>{messages.scrollTop=messages.scrollHeight;});
}

document.addEventListener('submit',(event)=>{
  const form=event.target;
  if(form.id==='profileForm') {event.preventDefault();const name=new FormData(form).get('name').trim();if(!name){$('#profileName').setCustomValidity('Имя не может состоять из пробелов');$('#profileName').reportValidity();return;}state.name=name;persist();syncProfile();closeModal();toast(`Располагайтесь, ${name}. Вы дома.`);}
  if(form.id==='applicationForm') {
    event.preventDefault();const data=new FormData(form);const name=data.get('name').trim();if(!name){$('#appName').setCustomValidity('Укажите имя или прозвище');$('#appName').reportValidity();return;}
    const button=$('button[type="submit"]',form);button.disabled=true;
    const app={id:'СК-'+Date.now().toString(36).toUpperCase(),service:form.dataset.id,name,date:data.get('date'),duration:data.get('duration'),comment:data.get('comment').trim(),created:new Date().toISOString()};
    state.applications.push(app);state.name=name;persist();syncProfile();
    const dating=isDatingService(app.service);
    openModal('Заявление принято',`<div class="success-icon" aria-hidden="true">${dating?'♡':'✓'}</div><h3 class="result-title">${dating?'Заявка принята. Харизма одобрена.':'Одобрено. Можно отдыхать.'}</h3><p class="result-text">${escapeHtml(name)}, ${dating?'заявление внесено в мемный реестр романтики. Следующий шаг — познакомиться и узнать, совпал ли вайб.':'диванная комиссия рассмотрела ваше обращение и не нашла причин вам отказывать.'}</p><div class="application-ticket"><span>Номер заявления</span><strong>${app.id}</strong><span class="application-status status-green">✓ ${applicationStatus(app.service)}</span></div><button class="button button-blue button-full" data-application="${app.id}">Посмотреть заявление →</button><button class="text-link result-secondary" data-action="close">${dating?'Отлично, пойду знакомиться':'Отлично, пойду полежу'}</button>`);
  }
  if(form.id==='chatForm'){event.preventDefault();const input=$('#chatInput');if(input.value.trim())chatReply(input.value.trim());input.value='';input.focus();}
  if(form.id==='regionForm'){event.preventDefault();state.region=new FormData(form).get('region');persist();syncProfile();closeModal();toast('Место спокойствия обновлено.');}
});
document.addEventListener('input',event=>{if(event.target.matches('#profileName, #appName'))event.target.setCustomValidity('');});
document.addEventListener('click',(event)=>{
  const target=event.target.closest('button');if(!target)return;
  if(target.dataset.category){currentCategory=modal.classList.contains('palych-modal')?target.dataset.category:currentCategory===target.dataset.category?'all':target.dataset.category;currentFilter='all';renderCategories();renderServices();goToCatalog();}
  if(target.dataset.filter){currentFilter=target.dataset.filter;renderServices();}
  if(target.dataset.service){const fromPalych=modal.classList.contains('palych-modal');showService(target.dataset.service);if(fromPalych&&target.dataset.service!=='certificate')body.insertAdjacentHTML('afterbegin','<button class="text-link palych-return" data-action="chat">← К разговору с Палычем</button>');}
  if(target.dataset.search){$('#serviceSearch').value=target.dataset.search;showChat(target.dataset.search);}
  if(target.dataset.news!==undefined){const n=news[Number(target.dataset.news)];openModal('Вести с дивана',`<div class="article-emoji" aria-hidden="true">${n.emoji}</div><span class="news-date">${n.date} · Диванная редакция</span><h3 class="article-title">${n.title}</h3><p class="article-text">${n.body}</p><p class="form-note">Новость из мемной вселенной Скуфуслуг.</p><button class="button button-blue button-full" data-service="${n.service}">Перейти к услуге →</button>`);}
  if(target.dataset.application)showApplication(target.dataset.application);
  if(target.dataset.answer!==undefined){quizAnswers.push(Number(target.dataset.answer));showQuizQuestion();}
  if(target.dataset.chat)chatReply(target.dataset.chat);
  if(target.dataset.nav){$('#mainNav').classList.remove('open');$('.mobile-menu').setAttribute('aria-expanded','false');if(target.dataset.nav==='services'){resetSearch();goToCatalog();}if(target.dataset.nav==='documents')showDocuments();if(target.dataset.nav==='applications')showApplications();}
  switch(target.dataset.action){
    case 'profile':showProfile();break;
    case 'quiz':startQuiz();break;
    case 'quiz-back':quizAnswers.pop();showQuizQuestion();break;
    case 'download-certificate':downloadCertificate();break;
    case 'all-services':case 'browse':resetSearch();goToCatalog();break;
    case 'reset-search':resetSearch();break;
    case 'chat':showChat();break;
    case 'palych-reset':palychConversation=[];renderPalychConversation();$('#chatInput').value='';$('#chatInput').focus();break;
    case 'close':closeModal();break;
    case 'menu':{const open=$('#mainNav').classList.toggle('open');target.setAttribute('aria-expanded',String(open));break;}
    case 'logout':state.name='';persist();syncProfile();closeModal();toast('До скорого. Ваш диван будет ждать.');break;
    case 'region':openModal('Где будем отдыхать?',`<p class="modal-lead">Выберите ваше место силы. Прописка и справки от соседей не нужны.</p><form id="regionForm"><div class="field"><label for="regionSelect">Ваш округ</label><select id="regionSelect" name="region">${['Диванный округ','Гаражный район','Дачная область','Рыбацкий край','Мангальная республика'].map(r=>`<option${r===state.region?' selected':''}>${r}</option>`).join('')}</select></div><button class="button button-blue button-full">Здесь и останусь →</button></form>`);break;
    case 'about':openModal('О Скуфуслугах',`<span class="modal-illustration" aria-hidden="true">🛋️</span><h3 class="article-title">Государство души. Территория комфорта.</h3><p class="article-text">Скуфуслуги — добрый мемный портал для тех, кто ценит диван, чай, гараж и право ничего не доказывать. Здесь можно пройти тест, получить шуточное удостоверение и оформить заслуженный отдых.</p><p class="article-text">Скуф — это состояние души. Пол, возраст и наличие усов не имеют значения.</p><p class="form-note">Развлекательный проект. Не связан с Госуслугами, государственными органами или настоящими государственными услугами. Все заявления и документы шуточные.</p>`);break;
    case 'privacy':openModal('Ваши данные — ваши дела',`<h3 class="article-title">Всё остаётся на вашем диване.</h3><p class="article-text">Имя, выбранный округ, результаты теста и заявления хранятся в локальном хранилище этого браузера. Формы не отправляют эти данные на сервер. После очистки данных сайта история исчезнет.</p><p class="article-text">Не указывайте настоящие паспортные данные, пароли и другую личную информацию. Для развлечения достаточно прозвища.</p><p class="article-text">Шрифт загружается с Google Fonts. Как и при посещении любого сайта, хостинг обрабатывает технические данные соединения.</p><button class="button button-outline button-full" data-action="clear-data">Удалить мои данные из браузера</button>`);break;
    case 'clear-data':openModal('Удаление данных',`<p class="modal-lead">Будут удалены имя, история заявлений и удостоверение в этом браузере.</p><button class="button button-blue button-full" data-action="confirm-clear">Да, начать с чистого дивана</button><button class="button button-outline button-full result-secondary" data-action="profile">Сохранить мои данные</button>`);break;
    case 'confirm-clear':state={name:'',region:'Диванный округ',applications:[],certificate:null};palychConversation=[];persist();syncProfile();closeModal();toast('Локальные данные удалены. Можно начать заново.');break;
  }
});
renderCategories();renderServices();renderNews();syncProfile();
$$('[data-palych-avatar]').forEach(el=>{el.innerHTML=palychAvatar();});
