const { CATS, MODELS, thumb, P3D, keyColorClasses } = window.LIZEMOR_CATALOG;

const WHATSAPP = '5598985812722';
const NAMES = {b58:'Broche 58MM (Grande)', b32:'Broche 32MM (Médio)', b25:'Broche 25MM (Pequeno)'};
const SIZE_CHOICES = [
  {id:'b25', label:'P · 25 mm', price:2.5},
  {id:'b32', label:'M · 32 mm', price:4.5},
  {id:'b58', label:'G · 58 mm', price:8}
];
const priceFor = (sizeId, finish) => SIZE_CHOICES.find(size => size.id === sizeId).price + (sizeId === 'b58' && finish === 'Com brilho' ? 2 : 0);
const cartItemName = item => NAMES[item.sizeId] + (item.custom ? ' (Personalizado)' : '') + (item.sizeId === 'b58' && item.finish === 'Com brilho' ? ' – Com brilho' : '');
const cartItemKey = item => `${item.sizeId}-${item.custom ? 'personalizado' : 'pronto'}-${item.model?.code || 'sem-modelo'}-${item.sizeId === 'b58' ? item.finish || 'Normal' : 'normal'}`;
const money = n => 'R$ ' + n.toFixed(2).replace('.', ',');
let cart = []; // {key, name, price, qty}

const $ = id => document.getElementById(id);
document.querySelectorAll('form').forEach(form => form.addEventListener('submit', e => e.preventDefault()));
function updateSizeFab() { $('sizeFab').hidden = !(mode === 'pronto' && selModels.size > 0 && !$('broochContent').hidden); }
function animateHidden(el, show, duration = 280) {
  if (!el) return;
  if (el._disclosureTarget === show) return;
  if (!el._disclosureAnimation && (show ? !el.hidden : el.hidden)) return;
  const wasHidden=el.hidden, currentHeight=el.getBoundingClientRect().height;
  el._disclosureAnimation?.cancel();
  el._disclosureTarget=show;
  if (show) el.hidden = false;
  const fromHeight = show && wasHidden ? 0 : currentHeight;
  const toHeight = show ? el.scrollHeight : 0;
  el.style.overflow = 'hidden';
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const animation = el.animate([
    {height:`${fromHeight}px`,backgroundColor:show?'rgba(246,218,218,.7)':'rgba(255,255,255,0)'},
    {height:`${toHeight}px`,backgroundColor:'rgba(255,255,255,0)'}
  ],{duration:reduce?1:duration,easing:'cubic-bezier(.2,.75,.25,1)'});
  el._disclosureAnimation = animation;
  animation.onfinish = () => {
    if (el._disclosureAnimation !== animation) return;
    el.hidden = !show;
    el.style.removeProperty('height'); el.style.removeProperty('overflow');
    el.style.removeProperty('opacity');
    el._disclosureAnimation = null; el._disclosureTarget = null;
  };
}
function animateContentSwap(el, update) {
  el._contentSwapAnimation?.cancel();
  update();
  requestAnimationFrame(()=>animateGridItems(el));
}
function animateGridItems(root,startIndex=0) {
  const items=root.matches?.('.model,.card,.p3')?[root]:root.querySelectorAll?.('.model,.card,.p3');
  if(!items?.length) return;
  const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  items.forEach((item,index)=>{
    if(index<startIndex||item.closest('[hidden]'))return;
    item._gridReveal?.cancel();
    const endBackground=getComputedStyle(item).backgroundColor;
    const animation=item.animate([
      {opacity:0,backgroundColor:'rgba(246,218,218,.72)'},
      {opacity:1,backgroundColor:endBackground}
    ],{duration:reduce?1:230,delay:reduce?0:Math.min((index-startIndex)*6,90),easing:'ease-out'});
    item._gridReveal=animation;
    animation.onfinish=()=>{if(item._gridReveal===animation)item._gridReveal=null};
  });
}
function animateCopy(root) {
  const nodes=root.querySelectorAll?.('h1,h2,.brooch-intro p,.hint,.s3-sub,.s3-note,.form-heading h3,.form-heading p,.p3-options h4,.p3-options label');
  if(!nodes?.length) return;
  const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  nodes.forEach((node,index)=>{
    if(node.closest('[hidden]'))return;
    node._copyReveal?.cancel();
    const endColor=getComputedStyle(node).color;
    const animation=node.animate([
      {opacity:0,color:'#D98A8A'},
      {opacity:1,color:endColor}
    ],{duration:reduce?1:230,delay:reduce?0:Math.min(index*14,70),easing:'ease-out'});
    node._copyReveal=animation;
    animation.onfinish=()=>{if(node._copyReveal===animation)node._copyReveal=null};
  });
}



let mode = 'pronto';
let selCat = CATS[0].id, selModels = new Set();
const MODEL_PAGE_SIZE = 18;
let visibleModelCount = MODEL_PAGE_SIZE;
function renderChips() {
  const all = `<button class="chip" data-c="all" aria-pressed="${selCat === 'all'}">Todos os modelos</button>`;
  $('chips').innerHTML = all + CATS.map(c =>
    `<button class="chip" data-c="${c.id}" aria-pressed="${c.id === selCat}">${c.name}</button>`).join('');
}
function modelsForCategory() { return MODELS.filter(m => selCat === 'all' || m.cat === selCat); }
function modelCardMarkup(m) {
  return `<button class="model" data-code="${m.code}" aria-pressed="${selModels.has(m.code)}">
    <span class="pin-photo model-pin"><img src="${thumb(m)}" alt="${m.name}" loading="lazy" decoding="async"></span><span class="model-name">${m.name}</span><small>${m.code}</small></button>`;
}
function updateModelMore(total) {
  const remaining = Math.max(0, total - visibleModelCount), button = $('modelMore');
  button.hidden = remaining === 0;
  if (remaining) button.textContent = 'Mostrar mais modelos';
}
function renderModels(resetPage = false) {
  if (resetPage) visibleModelCount = MODEL_PAGE_SIZE;
  const models = modelsForCategory();
  visibleModelCount = Math.min(visibleModelCount, models.length);
  $('models').innerHTML = models.slice(0, visibleModelCount).map(modelCardMarkup).join('');
  updateModelMore(models.length);
}
function loadMoreModels() {
  const models = modelsForCategory(), nextCount = Math.min(visibleModelCount + MODEL_PAGE_SIZE, models.length);
  if (nextCount <= visibleModelCount) return;
  const startIndex=$('models').children.length;
  $('models').insertAdjacentHTML('beforeend', models.slice(visibleModelCount, nextCount).map(modelCardMarkup).join(''));
  animateGridItems($('models'),startIndex);
  visibleModelCount = nextCount;
  updateModelMore(models.length);
}
$('modelMore').addEventListener('click', loadMoreModels);
function renderPicked(msg, kind) {
  const selected = MODELS.filter(m => selModels.has(m.code)), box = $('picked');
  const wasOpen = box.querySelector('.picked-toggle')?.getAttribute('aria-expanded') === 'true';
  box.classList.toggle('warn', kind === 'warn');
  box.innerHTML = msg ? msg
    : selected.length ? `<div class="picked-expander"><button class="picked-toggle" type="button" aria-expanded="${wasOpen}" aria-controls="pickedList"><span class="picked-count">${selected.length} ${selected.length === 1 ? 'modelo selecionado' : 'modelos selecionados'}</span><span class="picked-action"><span class="picked-action-label">${wasOpen ? 'Ocultar lista' : 'Ver seleção'}</span><span class="picked-chevron" aria-hidden="true"></span></span></button><ul class="picked-list" id="pickedList" ${wasOpen ? '' : 'hidden'}>${selected.map(m => `<li><span>${m.name}</span><small>${m.code}</small></li>`).join('')}</ul></div>`
        : 'Nenhum modelo escolhido';
  animateHidden(box, Boolean(msg || selected.length));
}
$('picked').addEventListener('click', e => {
  const toggle = e.target.closest('.picked-toggle'); if (!toggle) return;
  const open = toggle.getAttribute('aria-expanded') !== 'true';
  toggle.setAttribute('aria-expanded', String(open));
  toggle.querySelector('.picked-action-label').textContent = open ? 'Ocultar lista' : 'Ver seleção';
  const list = $('pickedList'); if (list) animateHidden(list, open);
});
function updateHeroPins() {
  document.querySelectorAll('.hero-pin[data-model-code]').forEach(pin => {
    const model = MODELS.find(item => item.code === pin.dataset.modelCode);
    if (model) pin.querySelector('img').src = thumb(model);
  });
}
function playSquish(pin) {
  if (!pin || typeof pin.animate !== 'function') return;
  pin._squishAnimation?.cancel();
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const animation = pin.animate([
    {scale:'1 1',offset:0},
    {scale:'1.16 .8',offset:.24},
    {scale:'.91 1.1',offset:.48},
    {scale:'1.04 .97',offset:.7},
    {scale:'1 1',offset:1}
  ], {duration:reducedMotion?160:580,easing:'cubic-bezier(.2,.8,.2,1)',fill:'none'});
  pin._squishAnimation = animation;
  animation.onfinish = () => {
    if (pin._squishAnimation === animation) {
      animation.cancel();
      pin._squishAnimation = null;
    }
  };
}
$('chips').addEventListener('click', e => {
  const b = e.target.closest('.chip'); if (!b) return;
  selCat = b.dataset.c;
  renderChips(); renderPicked();
  animateContentSwap($('models'), () => renderModels(true));
  playSquish($('chips').querySelector(`.chip[data-c="${selCat}"]`));
  const showSizes=mode !== 'pronto' || selModels.size > 0, wasSizeHidden=$('sizeStep').hidden;
  animateHidden($('sizeStep'), showSizes);
  if(wasSizeHidden&&showSizes){animateGridItems($('grid'));animateCopy($('sizeStep'))}
});
$('sizeFab').addEventListener('click', () => {
  $('sizeStep').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});
  $('sizeStep').setAttribute('tabindex','-1'); $('sizeStep').focus({preventScroll:true});
});
$('models').addEventListener('click', e => {
  const b = e.target.closest('.model'); if (!b) return;
  const code = b.dataset.code;
  if (selModels.has(b.dataset.code)) selModels.delete(b.dataset.code);
  else selModels.add(b.dataset.code);
  b.setAttribute('aria-pressed', String(selModels.has(code)));
  renderPicked();
  playSquish(b.querySelector('.model-pin'));
  if (selModels.size === 0) selectSize(null);
  else { const addButton = document.querySelector('#grid .card.is-selected .add'); if (addButton) addButton.textContent = `Adicionar ${selModels.size} ${selModels.size === 1 ? 'broche' : 'broches'}`; }
  const showSizes=mode !== 'pronto' || selModels.size > 0, wasSizeHidden=$('sizeStep').hidden;
  animateHidden($('sizeStep'), showSizes);
  if(wasSizeHidden&&showSizes){animateGridItems($('grid'));animateCopy($('sizeStep'))}
  updateSizeFab();
});
renderChips(); renderModels(true); renderPicked(); updateHeroPins();
animateGridItems($('models')); animateCopy($('broochContent'));
$('heroScene').addEventListener('click', e => playSquish(e.target.closest('.hero-pin[data-model-code]')));

function selectSize(card) {
  document.querySelectorAll('#grid .card').forEach(item => {
    const selected = !!card && item === card;
    item.classList.toggle('is-selected', selected);
    item.setAttribute('aria-expanded', String(selected));
  });
  document.querySelectorAll('#grid .card').forEach(item => {
    const selected = item === card;
    const choose = item.querySelector('.size-choose'), add = item.querySelector('.add'), opts = item.querySelector('.opts');
    if (choose) { choose.hidden = false; choose.textContent = selected ? 'Tamanho selecionado' : 'Selecionar tamanho'; choose.setAttribute('aria-pressed', String(selected)); }
    if (add) {
      animateHidden(add, selected);
      add.textContent = mode === 'personalizado' ? 'Adicionar broche personalizado' : `Adicionar ${selModels.size} ${selModels.size === 1 ? 'broche' : 'broches'}`;
    }
    if (opts) animateHidden(opts, selected);
  });
  if (card) playSquish(card.querySelector('.pin-broche'));
}
$('grid').addEventListener('click', e => {
  const choose = e.target.closest('.size-choose');
  if (choose) { selectSize(choose.closest('.card')); return; }
  const card = e.target.closest('.card');
  if (card && !e.target.closest('button')) selectSize(card);
});
$('grid').addEventListener('keydown', e => {
  const card = e.target.closest('.card');
  if (card && e.target === card && (e.key === 'Enter' || e.key === ' ')) {
    e.preventDefault(); selectSize(card);
  }
});

// Filtros (abas): todos os tamanhos e preços valem para os dois tipos
document.querySelectorAll('.tab').forEach(tab => tab.addEventListener('click', () => {
  document.querySelectorAll('.tab').forEach(t => t.setAttribute('aria-selected', t === tab));
  mode = tab.dataset.filter;
  const showIntro=mode !== 'personalizado', showPicker=mode !== 'personalizado', showSizes=mode === 'personalizado';
  const introWasHidden=$('readyIntro').hidden, pickerWasHidden=$('picker').hidden, sizeWasHidden=$('sizeStep').hidden;
  animateHidden($('customFeedback'), false);
  animateHidden($('readyIntro'), showIntro);
  selModels.clear();
  animateHidden($('picker'), showPicker);
  animateHidden($('sizeStep'), showSizes);
  if(showIntro&&introWasHidden)animateCopy($('readyIntro'));
  if(showPicker&&pickerWasHidden){animateGridItems($('models'));animateCopy($('picker'))}
  if(showSizes&&sizeWasHidden){animateGridItems($('grid'));animateCopy($('sizeStep'))}
  document.querySelectorAll('#grid .card').forEach(card => { card.classList.remove('is-selected'); card.setAttribute('aria-expanded','false'); });
  selectSize(null);
  renderModels(true); renderPicked();
  document.querySelectorAll('.card img').forEach(img => {
    img.src = mode === 'personalizado' ? img.dataset.custom : img.dataset.ready;
  });
  updateHeroPins();
  updateSizeFab();
}));

// Preço dinâmico do card 58mm
document.querySelectorAll('input[name=o58]').forEach(r => r.addEventListener('change', () => {
  r.closest('.card').querySelector('[data-price]').textContent = money(parseFloat(r.value));
}));

// Adicionar ao pedido
function addToCart(card, btn) {
  const id = card.dataset.id;
  const sel = card.querySelector('input[type=radio]:checked');
  const custom = mode === 'personalizado';
  const finish = sel?.dataset.label || null;
  const selectedModels = custom ? [null] : MODELS.filter(model => selModels.has(model.code));
  if (!custom && !selectedModels.length) {
    renderPicked('Selecione um ou mais modelos antes de adicionar.', 'warn');
    $('picker').scrollIntoView({behavior:'smooth', block:'start'});
    return;
  }
  selectedModels.forEach(model => {
    const item = {sizeId:id, custom, finish, price:priceFor(id, finish), qty:1, model};
    item.name = cartItemName(item);
    item.key = cartItemKey(item);
    const found = cart.find(existing => existing.key === item.key);
    if (found) found.qty++; else cart.push(item);
  });
  render();
  const old = btn.textContent; btn.textContent = 'Adicionado'; btn.classList.add('is-added');
  setTimeout(() => { btn.textContent = old; btn.classList.remove('is-added'); }, 1000);
  if (!custom) {
    const addedCount = selectedModels.length;
    selModels.clear(); renderModels();
    renderPicked(`${addedCount} ${addedCount === 1 ? 'broche adicionado' : 'broches adicionados'} ao pedido. Selecione outros modelos para continuar.`);
    selectSize(null);
    animateHidden($('sizeStep'), false);
    updateSizeFab();
    $('picker').scrollIntoView({behavior:'smooth', block:'start'});
  } else { $('customFeedback').textContent = 'Broche personalizado adicionado ao pedido.'; animateHidden($('customFeedback'), true); }
}
document.querySelectorAll('.add').forEach(btn => btn.addEventListener('click', () => {
  const card = btn.closest('.card');
  selectSize(card);
  addToCart(card, btn);
}));

function render() {
  const box = $('items');
  if (!cart.length) box.innerHTML = '<p class="empty"><strong>Seu pedido está vazio.</strong><span>Explore os produtos e adicione seus favoritos para começar.</span></p>';
  else box.innerHTML = cart.map((i, idx) => `
    <div class="item">
      <div class="item-head">
        <div class="item-copy"><strong>${i.name}</strong>${i.model ? `<div class="mdl"><img src="${thumb(i.model)}" alt="">${i.model.name} · ${i.model.code}</div>` : ''}</div>
        <span class="sub">${money(i.price * i.qty)}${i.qty > 1 ? `<small>${money(i.price)} cada</small>` : ''}</span>
      </div>
      <div class="item-controls">
        ${i.p3d?`<div class="item-size">${i.detail}</div>`:`<label class="item-size">Tamanho<select data-size-i="${idx}" aria-label="Alterar tamanho de ${i.model ? i.model.name : i.name}">${SIZE_CHOICES.map(size => `<option value="${size.id}" ${size.id === i.sizeId ? 'selected' : ''}>${size.label}</option>`).join('')}</select></label>`}
        <div class="qty" aria-label="Quantidade">
          <button data-d="-1" data-i="${idx}" aria-label="Diminuir ${i.name}">−</button>
          <span>${i.qty}</span>
          <button data-d="1" data-i="${idx}" aria-label="Aumentar ${i.name}">+</button>
        </div>
      </div>
    </div>`).join('');
  const quantity = cart.reduce((s, i) => s + i.qty, 0);
  $('count').textContent = quantity;
  $('itemsCount').textContent = `${quantity} ${quantity === 1 ? 'item' : 'itens'}`;
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  $('total').textContent = money(total);
  $('fabTotal').textContent = money(total);
  $('fabTotal').hidden = quantity === 0;
  $('fab').classList.toggle('is-empty', quantity === 0);
  if (quantity) $('count').animate?.([{scale:1},{scale:1.18},{scale:1}], {duration:230,easing:'ease-out'});
}
$('items').addEventListener('click', e => {
  const b = e.target.closest('button[data-i]'); if (!b) return;
  const it = cart[+b.dataset.i]; it.qty += +b.dataset.d;
  if (it.qty <= 0) cart.splice(+b.dataset.i, 1);
  render();
});
$('items').addEventListener('change', e => {
  const select = e.target.closest('select[data-size-i]'); if (!select) return;
  const item = cart[+select.dataset.sizeI];
  item.sizeId = select.value;
  item.price = priceFor(item.sizeId, item.finish);
  item.name = cartItemName(item);
  item.key = cartItemKey(item);
  render();
});

// Abrir/fechar carrinho
function toggle(open) {
  $('cart').classList.toggle('open', open);
  $('overlay').classList.toggle('open', open);
  $('cart').setAttribute('aria-hidden', !open);
  $('fab').setAttribute('aria-expanded', String(open));
  document.body.classList.toggle('cart-open', open);
  if (open) requestAnimationFrame(() => $('close').focus());
}
$('fab').onclick = () => toggle(true);
$('close').onclick = $('overlay').onclick = () => { toggle(false); $('fab').focus(); };
document.addEventListener('keydown', e => { if (e.key === 'Escape') { toggle(false); $('fab').focus(); } });

// Enviar para o WhatsApp
$('send').onclick = () => {
  const name = $('name').value.trim(), addr = $('addr').value.trim(), notes = $('notes').value.trim();
  ['name', 'addr'].forEach(id => $(id).classList.remove('bad'));
  if (!cart.length) { $('err').textContent = 'Adicione pelo menos um item ao pedido.'; return; }
  if (!name || !addr) {
    if (!name) $('name').classList.add('bad');
    if (!addr) $('addr').classList.add('bad');
    $('err').textContent = 'Preencha seu nome e o endereço de entrega.'; (!name ? $('name') : $('addr')).focus(); return;
  }
  $('err').textContent = '';
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const lines = cart.map(i => {
    let t = `• ${i.qty}x ${i.name} - ${money(i.price * i.qty)}`;
    if (i.detail) t += `\n   ${i.detail}`;
    if (i.model && !i.p3d) {
      t += `\n   Modelo: ${i.model.name} (cód. ${i.model.code})`;
      if (/^https?:/.test(i.model.img)) t += `\n   Imagem do modelo: ${i.model.img}`;
    }
    return t;
  }).join('\n');
  const msg = `NOVO PEDIDO - LIZEMOR\n\n` +
    `Nome: ${name}\nEndereço: ${addr}\nObservações: ${notes || 'Nenhuma'}\n\n` +
    `Itens:\n${lines}\n\nTotal: ${money(total)}\n\nFrete e entrega a combinar para sua região.`;
  window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`, '_blank');
};

// ===== Impressão 3D =====
const SOON = e => 'data:image/svg+xml,'+encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 640 480'><rect width='640' height='480' fill='#F6DADA'/><text x='320' y='250' font-size='130' text-anchor='middle'>${e}</text><text x='320' y='330' font-size='26' text-anchor='middle' fill='#D14242' font-family='sans-serif' font-weight='bold'>foto em breve</text></svg>`);
// Para trocar uma foto, substitua o valor de img por um caminho/link, ex.: 'fotos/sapo.jpg'.

function colorChoices(p) {
  return p.colors.map((color, i) => {
    const swatch = p.nameField ? keyColorClasses[i] : color === 'Azul' ? 'blue' : 'black';
    return `<label class="color-choice"><input class="p3col" type="radio" name="p3-color-${p.id}" value="${color}" ${i === 0 ? 'checked' : ''}><span class="color-swatch ${swatch}" aria-hidden="true"></span><span>${color}</span></label>`;
  }).join('');
}
const p3card = p => `<article class="p3" data-p3="${p.id}">
  <div class="p3-photo${p.sq ? ' sq' : ''}"><img src="${p.img}" alt="${p.name}" loading="lazy" decoding="async"></div>
  <div class="p3-main"><h3>${p.name}</h3><p>${p.desc}</p><div class="price">${money(p.price)}</div>
    <button class="p3-toggle" type="button" aria-expanded="false" aria-controls="p3-options-${p.id}">Escolher opções</button></div>
  <div class="p3-options" id="p3-options-${p.id}" hidden><h4>Personalize sua peça</h4>
    ${p.nameField ? '<label class="f">Qual nome deseja colocar?<input type="text" class="p3name" maxlength="30" placeholder="Digite o nome" required><small>Até 30 caracteres.</small></label>' : ''}
    ${p.extra ? `<fieldset class="p3-choices"><legend>${p.extra.label}</legend>${p.extra.options.map((option,i) => `<label class="segment-choice"><input type="radio" class="p3ext" name="p3-extra-${p.id}" value="${option}" required><span>${option}</span></label>`).join('')}</fieldset>` : ''}
    <fieldset class="p3-choices"><legend>${p.nameField ? 'Escolha as cores' : 'Cor'}</legend><div class="color-options">${colorChoices(p)}</div></fieldset>
    <div class="p3err" role="alert"></div><button class="add3" type="button">Adicionar ao pedido</button></div></article>`;
$('p3grid').innerHTML = P3D.filter(p => !p.custom).map(p3card).join('');
$('p3grid2').innerHTML = P3D.filter(p => p.custom).map(p3card).join('');
function show3(v) {
  const panels = {pronto:$('v3pronto'),custom:$('v3custom'),sob:$('v3sob')};
  document.querySelectorAll('.tab3').forEach(t => t.setAttribute('aria-selected', String(t.dataset.v3 === v)));
  Object.entries(panels).forEach(([key,panel]) => {
    const entering=key===v&&panel.hidden;
    animateHidden(panel,key===v);
    if(entering){animateGridItems(panel);animateCopy(panel)}
  });
}
document.querySelectorAll('.tab3').forEach(t => t.addEventListener('click', () => show3(t.dataset.v3)));
document.addEventListener('click', e => {
  const a = e.target.closest('a[href="#orcamento"]'); if (!a) return;
  e.preventDefault(); show3('sob');
  requestAnimationFrame(() => $('orcamento').scrollIntoView({behavior:'smooth'}));
});
$('studio').addEventListener('click', e => {
  const toggleBtn = e.target.closest('.p3-toggle');
  if (toggleBtn) {
    const box = toggleBtn.closest('.p3'), options = box.querySelector('.p3-options'), open = options.hidden;
    document.querySelectorAll('.p3-options').forEach(panel => { if(panel!==options) animateHidden(panel,false); panel.closest('.p3').classList.remove('is-open'); panel.closest('.p3').querySelector('.p3-toggle').setAttribute('aria-expanded','false'); });
    animateHidden(options,open); if(open)animateCopy(options); box.classList.toggle('is-open', open); toggleBtn.setAttribute('aria-expanded', String(open));
    if (open) requestAnimationFrame(() => box.scrollIntoView({behavior:'smooth',block:'nearest'}));
    return;
  }
  const btn = e.target.closest('.add3'); if (!btn) return;
  const box = btn.closest('.p3'), p = P3D.find(x => x.id === box.dataset.p3);
  const nameIn = box.querySelector('.p3name'), nm = nameIn ? nameIn.value.trim() : '', col = box.querySelector('.p3col:checked')?.value, err = box.querySelector('.p3err');
  if (p.nameField && !nm) { err.textContent = 'Digite o nome que aparecerá no chaveiro.'; nameIn.classList.add('bad'); nameIn.focus(); return; }
  err.textContent = ''; nameIn?.classList.remove('bad');
  const extInput = box.querySelector('.p3ext:checked');
  if (p.extra && !extInput) { err.textContent = 'Escolha a espessura do celular com capinha.'; box.querySelector('.p3ext')?.focus(); return; }
  const ext = extInput?.value || '';
  const detail = (p.nameField ? `Nome: ${nm} · Cores: ${col}` : `Cor: ${col}`) + (ext ? ` · ${ext}` : '');
  const key = `3d-${p.id}-${detail.toLowerCase()}`, found = cart.find(c => c.key === key);
  if (found) found.qty++; else cart.push({key, p3d:true, name:p.name + ' (Impressão 3D)', price:p.price, qty:1, detail, model:{img:p.img, name:'Impressão 3D', code:p.id.toUpperCase()}});
  render();
  const options = box.querySelector('.p3-options'), toggleControl = box.querySelector('.p3-toggle');
  animateHidden(options,false); box.classList.remove('is-open'); toggleControl.setAttribute('aria-expanded','false'); toggleControl.textContent = 'Adicionado ao pedido';
  setTimeout(() => { toggleControl.textContent = 'Escolher opções'; }, 1200);
});

let viewTransitionToken = 0;
function setSection(is3d) {
  $('modeBroches').setAttribute('aria-selected', String(!is3d));
  $('mode3d').setAttribute('aria-selected', String(is3d));
  const nav=document.querySelector('nav'), main=document.querySelector('main'), studio=$('studio');
  const outgoing=is3d?main:studio, incoming=is3d?studio:main, token=++viewTransitionToken;
  const cta = document.querySelector('.hero-cta');
  cta.href = is3d ? '#studio' : '#broochContent';
  cta.innerHTML = 'Explorar produtos <span aria-hidden="true">↓</span>';
  const reveal = () => {
    if(token!==viewTransitionToken) return;
    nav.hidden=is3d; outgoing.hidden=true; incoming.hidden=false;
    incoming.animate([{backgroundColor:'rgba(246,218,218,.66)'},{backgroundColor:'rgba(255,255,255,0)'}],{duration:matchMedia('(prefers-reduced-motion: reduce)').matches?1:300,easing:'cubic-bezier(.2,.75,.25,1)'});
    animateGridItems(incoming); animateCopy(incoming);
    updateSizeFab();
    window.scrollTo({top:0,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});
  };
  if(outgoing.hidden){ reveal(); return; }
  const anim=outgoing.animate([{opacity:1,backgroundColor:'rgba(255,255,255,0)'},{opacity:0,backgroundColor:'rgba(246,218,218,.58)'}],{duration:matchMedia('(prefers-reduced-motion: reduce)').matches?1:170,easing:'ease-in'});
  anim.onfinish=reveal;
}
$('modeBroches').onclick = () => setSection(false);
$('mode3d').onclick = () => setSection(true);

$('qSend').onclick = () => {
  const v = id => $(id).value.trim(), name = v('qName'), desc = v('qDesc');
  ['qName','qDesc'].forEach(id => $(id).classList.remove('bad'));
  if (!name || !desc) {
    if (!name) $('qName').classList.add('bad');
    if (!desc) $('qDesc').classList.add('bad');
    $('qErr').textContent = 'Preencha seu nome e descreva o que quer imprimir.'; (!name ? $('qName') : $('qDesc')).focus(); return;
  }
  $('qErr').textContent = '';
  const msg = `PEDIDO DE ORÇAMENTO - IMPRESSÃO 3D (LIZEMOR)\n\nNome: ${name}\nO que imprimir: ${desc}\n` +
    `Tamanho: ${v('qSize') || 'a combinar'}\nQuantidade: ${v('qQty') || 'a combinar'}\nCor: ${v('qColor') || 'a combinar'}\n\n` +
    `Vou enviar o modelo (arquivo, link ou foto) aqui na conversa.`;
  window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`, '_blank');
};

render();
