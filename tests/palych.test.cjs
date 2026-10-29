const test = require('node:test');
const assert = require('node:assert/strict');
const engine = require('../dist/palych.js');
const fs = require('node:fs');
const vm = require('node:vm');
const app = fs.readFileSync(require('node:path').join(__dirname,'../dist/app.js'),'utf8');
const catalogueSource = app.slice(app.indexOf('const services = ['),app.indexOf('\nconst news = ['));
const services = vm.runInNewContext(`${catalogueSource}\nservices`);
const ask = (q,options={}) => engine.respond(q,{services,...options});

test('natural Russian phrases find each intended service', () => {
  const cases = [
    ['Устал на работе, хочу отдохнуть', 'sofa'],
    ['Жена зовёт копать грядки, а я не хочу', 'dacha'],
    ['Хочу с друзьями рыбу ловить', 'fishing'],
    ['Угли готовы, хочу пожарить шашлыки', 'grill'],
    ['В машине что-то стучит', 'car'],
    ['Хочу надеть носки с сандалиями', 'socks'],
    ['Хочу в танчики ещё катку', 'battle'],
    ['Не хочу ничего делать', 'sofa'],
    ['Хочу ещё пять минут поспать', 'nap'],
    ['Куда оформить пропуск в гараж?', 'garage'],
    ['Нужен перерыв на чаёк с печеньем', 'tea'],
    ['Кто забрал пульт от телевизора?', 'remote']
  ];
  for(const [query,id] of cases) assert.equal(ask(query).services[0],id,query);
});
test('explicit rejection does not win over requested activity', () => {
  const result=ask('Не хочу на рыбалку, хочу отдыхать на диване');
  assert.equal(result.services[0],'sofa');
  assert.ok(!result.services.includes('fishing'));
});
test('cost, requirements and duration follow service context', () => {
  const history=[{role:'user',text:'Рыбалка'},{role:'assistant',...ask('Рыбалка')}];
  assert.match(ask('А сколько стоит?',{history}).text,/бесплат/);
  assert.equal(ask('А сколько стоит?',{history}).services[0],'fishing');
  assert.match(ask('Какие документы нужны?',{history}).text,/имени или прозвища/);
  assert.match(ask('Как оформить?',{history}).text,/Согласование выезда на рыбалку/);
  assert.match(ask('А на сколько?',{history}).text,/На весь день/);
});
test('ordinal picks the second option from previous recommendations',()=>{
  const first=ask('На рыбалку или на дачу?');
  assert.deepEqual(first.services,['fishing','dacha']);
  const second=ask('Второй вариант',{history:[{role:'assistant',...first}]});
  assert.deepEqual(second.services,['dacha']);
});
test('documents and application answers use actual local state',()=>{
  assert.equal(ask('Потерял документ',{hasCertificate:true}).actions[0].type,'documents');
  assert.equal(ask('Где удостоверение?',{hasCertificate:false}).actions[0].type,'quiz');
  assert.match(ask('Где мои заявления?',{applicationsCount:3}).text,/3/);
  assert.match(ask('Где мои заявления?',{applicationsCount:0}).text,/пока нет/);
});
test('unknown questions and yes/no remain bounded and do not invent services',()=>{
  const fallback=ask('Как устроена квантовая гравитация?');
  assert.deepEqual(fallback.services,[]);
  assert.equal(fallback.suggestions.length,3);
  assert.match(fallback.text,/пока нет услуги/);
  const yes=ask('Да',{history:[{role:'assistant',services:['fishing']}]});
  assert.match(yes.text,/Уточним/);
  assert.ok(yes.suggestions.length);
});
test('answers are plain text and reference only supplied catalogue services',()=>{
  for(const q of ['<script>alert(1)</script>','Хочу на рыбалку','Где документы?','Хочу отдыхать','А сколько стоит?']) {
    const result=ask(q);
    assert.ok(!/[<>]/.test(result.text));
    assert.ok(result.services.every(id=>services.some(service=>service.id===id)));
  }
  assert.deepEqual(engine.respond('Рыбалка',{services:[]}).services,[]);
});
