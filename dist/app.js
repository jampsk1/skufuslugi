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
  badge: '<path d="M5 3h14v13l-7 5-7-5V3Zm7 4 1.2 2.4L16 10l-2 2 .5 2.7-2.5-1.3-2.5 1.3L10 12l-2-2 2.8-.6L12 7Z"/>'
};
const categories = [
  {id:'rest', title:'Диван и отдых', icon:'sofa', color:'blue'},
  {id:'garage', title:'Гараж и авто', icon:'garage', color:'purple'},
  {id:'fishing', title:'Рыбалка и дача', icon:'fish', color:'teal'},
  {id:'grill', title:'Мангал и кухня', icon:'grill', color:'orange'},
  {id:'games', title:'Игры и досуг', icon:'games', color:'violet'},
  {id:'status', title:'Льготы и статус', icon:'badge', color:'red'}
];
const services = [
  {id:'sofa', category:'rest', title:'Разрешение на ничего не делание', description:'Официальное право полежать. Без чувства вины и «ну сделай хоть что-нибудь».', emoji:'🛋️', tag:'Самое нужное', time:'1 минута', popular:true, keywords:'диван отдых сон ничего отпуск полежать пульт'},
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
  {id:'socks', category:'status', title:'Регистрация носков с сандалиями', description:'Комфортное сочетание теперь с документом. Чужое мнение в комплект не входит.', emoji:'🧦', tag:'Скуфский стиль', time:'1 минута', keywords:'носки сандалии стиль одежда мода статус льготы'}
];
const news = [
  {title:'Шашлычный сезон теперь круглый год', date:'28 октября 2026', label:'ХОРОШИЕ НОВОСТИ', emoji:'🍖', description:'Погода больше не считается причиной для отмены.', body:'Диванная комиссия единогласно решила: шашлычный сезон зависит от настроения, а не от календаря. Снег, ветер и советы соседей не являются основанием для отказа. Угли, плед и уверенный вид приветствуются.', service:'grill'},
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
  $('#categoryGrid').innerHTML=categories.map(c=>`<button class="category-button ${currentCategory===c.id?'active':''}" data-category="${c.id}" aria-pressed="${currentCategory===c.id}"><span class="category-icon icon-${c.color}">${icon(c.icon)}</span><span class="category-title">${c.title}</span><span class="category-count">${services.filter(s=>s.category===c.id).length} услуги <span aria-hidden="true">↗</span></span></button>`).join('');
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
$('#searchForm').addEventListener('submit',(event)=>{event.preventDefault();currentQuery=$('#serviceSearch').value;currentFilter='all';renderServices();goToCatalog();});
$('#serviceSearch').addEventListener('input',()=>{currentQuery=$('#serviceSearch').value;currentFilter=currentQuery?'all':currentFilter;renderServices();});

function showProfile() {
  if(!state.name) {
    openModal('Свой человек. Без формальностей.',`<div class="modal-illustration" aria-hidden="true">👋</div><p class="modal-lead">Представьтесь — и располагайтесь. Пароль не нужен, тапочки уже ждут.</p><form id="profileForm"><div class="field"><label for="profileName">Как к вам обращаться?</label><input id="profileName" name="name" placeholder="Например, Сан Саныч" maxlength="40" required autocomplete="nickname" autofocus></div><p class="form-note">Имя и заявления сохраняются только в этом браузере. Можно использовать прозвище.</p><button class="button button-blue button-full" type="submit">Занять свой диван →</button></form>`);
  } else {
    openModal('Ваш диванный кабинет',`<div class="profile-summary"><span class="profile-summary-avatar" aria-hidden="true">🧔</span><div><h3>${escapeHtml(state.name)}</h3><p>${escapeHtml(state.region)} · Свой человек</p></div></div><div class="account-links"><button data-nav="applications"><span>📨 Заявления</span><strong>${state.applications.length} →</strong></button><button data-nav="documents"><span>🪪 Мои документы</span><strong>${state.certificate?'1':'0'} →</strong></button><button data-action="quiz"><span>🛋️ Уровень скуфства</span><strong>${state.certificate?state.certificate.score*10+'%':'Узнать'} →</strong></button></div><form id="profileForm"><div class="field"><label for="profileName">Имя в кабинете</label><input id="profileName" name="name" value="${escapeHtml(state.name)}" maxlength="40" required autocomplete="nickname"></div><button class="button button-outline button-full" type="submit">Сохранить имя</button></form><button class="text-link logout-link" data-action="logout">Выйти из кабинета</button>`);
  }
}
function showService(id) {
  const service=services.find(s=>s.id===id);if(!service)return;
  if(id==='certificate'){startQuiz();return;}
  openModal(service.title,`<div class="service-modal-intro"><span class="modal-illustration" aria-hidden="true">${service.emoji}</span><p>${service.description}</p></div><div class="service-facts"><span>◷ ${service.time}</span><span>✓ Бесплатно</span><span>✓ Без очереди</span></div><form id="applicationForm" data-id="${service.id}"><div class="field"><label for="appName">Как к вам обращаться?</label><input id="appName" name="name" placeholder="Имя или прозвище" value="${escapeHtml(state.name)}" maxlength="40" required autocomplete="nickname" autofocus></div><div class="field-row"><div class="field"><label for="appDate">Когда приступаем?</label><input id="appDate" name="date" type="date" required value="${localDate()}" min="${localDate()}"></div><div class="field"><label for="appDuration">На сколько?</label><select id="appDuration" name="duration"><option>На весь день</option><option>На пару часов</option><option>До особого распоряжения</option></select></div></div><div class="field"><label for="appComment">Особые пожелания <span class="optional">необязательно</span></label><textarea id="appComment" name="comment" rows="2" maxlength="300" placeholder="Например: не беспокоить до ужина"></textarea></div><label class="check-field"><input type="checkbox" required name="confirm"><span>Подтверждаю: я заслужил немного комфорта</span></label><p class="form-note">Шуточное заявление. Сохраняется на вашем устройстве.</p><button class="button button-blue button-full" type="submit">Подать заявление →</button></form>`);
}
function localDate(){const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;}
function showApplications() {
  openModal('Мои заявления',state.applications.length?`<p class="modal-lead">Все дела под контролем. Можно спокойно отдыхать.</p><div class="application-list">${[...state.applications].reverse().map(a=>{const s=services.find(s=>s.id===a.service);return `<button class="application-item" data-application="${escapeHtml(a.id)}"><span class="application-emoji" aria-hidden="true">${s.emoji}</span><span class="application-info"><strong>${s.title}</strong><small>№ ${escapeHtml(a.id)} · ${dateLabel(a.created)}</small><span class="application-status status-green">✓ Одобрено диванной комиссией</span></span><span aria-hidden="true">→</span></button>`;}).join('')}</div>`:`<div class="empty-state"><span aria-hidden="true">📭</span><h3>Пока никаких забот</h3><p>Самое время оформить что-нибудь приятное.<br>Например, разрешение ничего не делать.</p><button class="button button-blue" data-action="browse">Выбрать услугу →</button></div>`);
}
function showApplication(id){const a=state.applications.find(a=>a.id===id);if(!a)return;const s=services.find(s=>s.id===a.service);openModal('Заявление одобрено',`<div class="success-icon" aria-hidden="true">✓</div><h3 class="result-title">${s.title}</h3><p class="result-text">${escapeHtml(a.name)}, всё решено. Можете приступать к заслуженному отдыху.</p><dl class="application-details"><div><dt>Номер заявления</dt><dd>${escapeHtml(a.id)}</dd></div><div><dt>Дата начала</dt><dd>${dateLabel(a.date+'T12:00:00')}</dd></div><div><dt>Срок действия</dt><dd>${escapeHtml(a.duration)}</dd></div><div><dt>Подано</dt><dd>${dateLabel(a.created)}</dd></div>${a.comment?`<div><dt>Ваши пожелания</dt><dd>${escapeHtml(a.comment)}</dd></div>`:''}</dl><p class="form-note">Мемное разрешение. Выдано диванной комиссией без юридической силы.</p><button class="button button-outline button-full" data-nav="applications">Все заявления</button>`);}
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
function showChat(){openModal('Скуфпомощник',`<div class="chat-agent"><span aria-hidden="true">🧔</span><div><strong>Палыч, диванный консультант</strong><small><span class="green-dot"></span> На месте. Чай допивает.</small></div></div><div class="chat-messages" id="chatMessages" aria-live="polite"><div class="chat-message">Здорово! Палыч на связи. Помогу найти услугу, разобраться с заявлением или оформить законный отдых. Что порешаем?</div></div><div class="chat-suggestions"><button data-chat="Хочу отдохнуть">Хочу отдохнуть</button><button data-chat="Мои заявления">Где заявление?</button><button data-chat="Удостоверение">Я точно скуф?</button></div><form class="chat-form" id="chatForm"><label class="sr-only" for="chatInput">Сообщение Палычу</label><input id="chatInput" placeholder="Спрашивайте, не стесняйтесь" maxlength="200" required autocomplete="off"><button class="button button-blue" aria-label="Отправить сообщение">↑</button></form>`,'chat-modal');}
function chatReply(query){
  const messages=$('#chatMessages');if(!messages)return;
  messages.insertAdjacentHTML('beforeend',`<div class="chat-message user">${escapeHtml(query)}</div>`);
  let reply;const q=query.toLowerCase();
  if(/заявлен|статус заявки/.test(q)) reply=`Заявления на месте, ${state.applications.length?'все одобрены. Комиссия сегодня в хорошем настроении.':'пока ни одного. Начните с разрешения на отдых!'} <button class="text-link" data-nav="applications">Открыть заявления →</button>`;
  else if(/привет|здравств|здоров/.test(q)) reply='И вам не хворать! Располагайтесь. Можно спросить про диван, рыбалку, гараж или удостоверение.';
  else if(/спасиб/.test(q)) reply='Обращайтесь! А теперь можно и чайку. Вы заслужили.';
  else if(/отдох|отдых|устал/.test(q)) reply='Для такого случая есть официальное диванное решение. <button class="text-link" data-service="sofa">Разрешение на ничего не делание →</button>';
  else {const list=matchingServices(query);reply=list.length?`Вот что нашёл. Всё бесплатно, без лишних движений: ${list.slice(0,2).map(s=>`<button class="text-link chat-service" data-service="${s.id}">${s.emoji} ${s.title} →</button>`).join('')}`:'Тут надо подумать. Спросите про «диван», «рыбалку», «гараж» или «удостоверение» — по этим вопросам я специалист.';}
  messages.insertAdjacentHTML('beforeend',`<div class="chat-message">${reply}</div>`);messages.scrollTop=messages.scrollHeight;
}

document.addEventListener('submit',(event)=>{
  const form=event.target;
  if(form.id==='profileForm') {event.preventDefault();const name=new FormData(form).get('name').trim();if(!name){$('#profileName').setCustomValidity('Имя не может состоять из пробелов');$('#profileName').reportValidity();return;}state.name=name;persist();syncProfile();closeModal();toast(`Располагайтесь, ${name}. Вы дома.`);}
  if(form.id==='applicationForm') {
    event.preventDefault();const data=new FormData(form);const name=data.get('name').trim();if(!name){$('#appName').setCustomValidity('Укажите имя или прозвище');$('#appName').reportValidity();return;}
    const button=$('button[type="submit"]',form);button.disabled=true;
    const app={id:'СК-'+Date.now().toString(36).toUpperCase(),service:form.dataset.id,name,date:data.get('date'),duration:data.get('duration'),comment:data.get('comment').trim(),created:new Date().toISOString()};
    state.applications.push(app);state.name=name;persist();syncProfile();
    openModal('Заявление принято',`<div class="success-icon" aria-hidden="true">✓</div><h3 class="result-title">Одобрено. Можно отдыхать.</h3><p class="result-text">${escapeHtml(name)}, диванная комиссия рассмотрела ваше обращение и не нашла причин вам отказывать.</p><div class="application-ticket"><span>Номер заявления</span><strong>${app.id}</strong><span class="application-status status-green">✓ Одобрено диванной комиссией</span></div><button class="button button-blue button-full" data-application="${app.id}">Посмотреть заявление →</button><button class="text-link result-secondary" data-action="close">Отлично, пойду полежу</button>`);
  }
  if(form.id==='chatForm'){event.preventDefault();const input=$('#chatInput');if(input.value.trim())chatReply(input.value.trim());input.value='';input.focus();}
  if(form.id==='regionForm'){event.preventDefault();state.region=new FormData(form).get('region');persist();syncProfile();closeModal();toast('Место спокойствия обновлено.');}
});
document.addEventListener('input',event=>{if(event.target.matches('#profileName, #appName'))event.target.setCustomValidity('');});
document.addEventListener('click',(event)=>{
  const target=event.target.closest('button');if(!target)return;
  if(target.dataset.category){currentCategory=currentCategory===target.dataset.category?'all':target.dataset.category;currentFilter='all';renderCategories();renderServices();goToCatalog();}
  if(target.dataset.filter){currentFilter=target.dataset.filter;renderServices();}
  if(target.dataset.service){showService(target.dataset.service);}
  if(target.dataset.search){$('#serviceSearch').value=target.dataset.search;currentQuery=target.dataset.search;currentCategory='all';currentFilter='all';renderCategories();renderServices();goToCatalog();}
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
    case 'close':closeModal();break;
    case 'menu':{const open=$('#mainNav').classList.toggle('open');target.setAttribute('aria-expanded',String(open));break;}
    case 'logout':state.name='';persist();syncProfile();closeModal();toast('До скорого. Ваш диван будет ждать.');break;
    case 'region':openModal('Где будем отдыхать?',`<p class="modal-lead">Выберите ваше место силы. Прописка и справки от соседей не нужны.</p><form id="regionForm"><div class="field"><label for="regionSelect">Ваш округ</label><select id="regionSelect" name="region">${['Диванный округ','Гаражный район','Дачная область','Рыбацкий край','Мангальная республика'].map(r=>`<option${r===state.region?' selected':''}>${r}</option>`).join('')}</select></div><button class="button button-blue button-full">Здесь и останусь →</button></form>`);break;
    case 'about':openModal('О Скуфуслугах',`<span class="modal-illustration" aria-hidden="true">🛋️</span><h3 class="article-title">Государство души. Территория комфорта.</h3><p class="article-text">Скуфуслуги — добрый мемный портал для тех, кто ценит диван, чай, гараж и право ничего не доказывать. Здесь можно пройти тест, получить шуточное удостоверение и оформить заслуженный отдых.</p><p class="article-text">Скуф — это состояние души. Пол, возраст и наличие усов не имеют значения.</p><p class="form-note">Развлекательный проект. Не связан с Госуслугами, государственными органами или настоящими государственными услугами. Все заявления и документы шуточные.</p>`);break;
    case 'privacy':openModal('Ваши данные — ваши дела',`<h3 class="article-title">Всё остаётся на вашем диване.</h3><p class="article-text">Имя, выбранный округ, результаты теста и заявления хранятся в локальном хранилище этого браузера. Формы не отправляют эти данные на сервер. После очистки данных сайта история исчезнет.</p><p class="article-text">Не указывайте настоящие паспортные данные, пароли и другую личную информацию. Для развлечения достаточно прозвища.</p><p class="article-text">Шрифт загружается с Google Fonts. Как и при посещении любого сайта, хостинг обрабатывает технические данные соединения.</p><button class="button button-outline button-full" data-action="clear-data">Удалить мои данные из браузера</button>`);break;
    case 'clear-data':openModal('Удаление данных',`<p class="modal-lead">Будут удалены имя, история заявлений и удостоверение в этом браузере.</p><button class="button button-blue button-full" data-action="confirm-clear">Да, начать с чистого дивана</button><button class="button button-outline button-full result-secondary" data-action="profile">Сохранить мои данные</button>`);break;
    case 'confirm-clear':state={name:'',region:'Диванный округ',applications:[],certificate:null};persist();syncProfile();closeModal();toast('Локальные данные удалены. Можно начать заново.');break;
  }
});
renderCategories();renderServices();renderNews();syncProfile();
