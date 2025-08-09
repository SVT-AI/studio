(function(){
  const $ = (s,root=document)=>root.querySelector(s);
  const $$ = (s,root=document)=>Array.from(root.querySelectorAll(s));

  // Theme
  const html = document.documentElement;
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) html.setAttribute('data-theme', savedTheme);
  $('#themeToggle')?.addEventListener('click', ()=>{
    const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  });

  // Print
  $('#printBtn')?.addEventListener('click', ()=> window.print());

  // Year
  $('#year').textContent = new Date().getFullYear();

  // Normalize
  const normalize = (s)=> (s||'').toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g,'')
    .replace(/[^a-z0-9\s-]/g,'');

  // Recipes data
  const RECIPES = [
    // Przekąski (5)
    {cat:'przekaski', title:'Bruschetta z pomidorami', img:'https://images.unsplash.com/photo-1551183053-bf91a1d81141?q=80&w=1600&auto=format&fit=crop', tags:'przekaski szybkie', desc:'Chrupiąca bagietka z pomidorami i bazylią.'},
    {cat:'przekaski', title:'Tosty caprese', img:'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1600&auto=format&fit=crop', tags:'przekaski wegetarianskie', desc:'Mozzarella, pomidor, bazylia.'},
    {cat:'przekaski', title:'Hummus z warzywami', img:'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=1600&auto=format&fit=crop', tags:'przekaski wegetarianskie szybkie', desc:'Kremowy hummus + chrupiące słupki.'},
    {cat:'przekaski', title:'Grzanki z awokado', img:'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?q=80&w=1600&auto=format&fit=crop', tags:'przekaski wegetarianskie', desc:'Awokado, cytryna, chili.'},
    {cat:'przekaski', title:'Roladki z cukinii', img:'https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?q=80&w=1600&auto=format&fit=crop', tags:'przekaski bezglutenowe', desc:'Grillowana cukinia z serkiem.'},

    // Dania (5)
    {cat:'dania', title:'Makaron z pomidorami', img:'https://images.unsplash.com/photo-1495546968767-f0573cca821e?q=80&w=1600&auto=format&fit=crop', tags:'dania szybkie wegetarianskie', desc:'Sos czosnek + bazylia.'},
    {cat:'dania', title:'Kurczak pieczony z ziołami', img:'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1600&auto=format&fit=crop', tags:'dania bezglutenowe', desc:'Soczysty kurczak z rozmarynem.'},
    {cat:'dania', title:'Szakszuka', img:'https://images.unsplash.com/photo-1512058564366-18510be2db19?q=80&w=1600&auto=format&fit=crop', tags:'dania wegetarianskie szybkie', desc:'Jajka w sosie pomidorowym.'},
    {cat:'dania', title:'Risotto z grzybami', img:'https://images.unsplash.com/photo-1604908177076-8a623be9b33b?q=80&w=1600&auto=format&fit=crop', tags:'dania', desc:'Kremowe risotto z leśnymi grzybami.'},
    {cat:'dania', title:'Łosoś z piekarnika', img:'https://images.unsplash.com/photo-1498654896293-37aacf113fd9?q=80&w=1600&auto=format&fit=crop', tags:'dania bezglutenowe', desc:'Zioła, cytryna, oliwa.'},

    // Desery (5)
    {cat:'desery', title:'Tiramisu w pucharkach', img:'https://images.unsplash.com/photo-1505250469679-203ad9ced0cb?q=80&w=1600&auto=format&fit=crop', tags:'desery bezglutenowe', desc:'Klasyczny deser w lekkiej wersji.'},
    {cat:'desery', title:'Brownie czekoladowe', img:'https://images.unsplash.com/photo-1601972599720-b6eec9b11a1d?q=80&w=1600&auto=format&fit=crop', tags:'desery', desc:'Mokre, intensywnie czekoladowe.'},
    {cat:'desery', title:'Sernik nowojorski', img:'https://images.unsplash.com/photo-1562004760-aceed7bb0981?q=80&w=1600&auto=format&fit=crop', tags:'desery', desc:'Gładki, kremowy, klasyk.'},
    {cat:'desery', title:'Panna cotta z malinami', img:'https://images.unsplash.com/photo-1521389508051-d7ffb5dc8bbf?q=80&w=1600&auto=format&fit=crop', tags:'desery bezglutenowe', desc:'Delikatny deser z musem malinowym.'},
    {cat:'desery', title:'Owocowa sałatka', img:'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?q=80&w=1600&auto=format&fit=crop', tags:'desery wegetarianskie szybkie', desc:'Kolorowe owoce w cytrusowym dressingu.'},
  ];

  // Render cards
  function cardHTML(r, idx){
    return `
      <article class="card" data-tags="${r.tags}">
        <img class="cover lightbox" src="${r.img}" alt="${r.title}" loading="lazy" />
        <h3>${r.title}</h3>
        <p>${r.desc}</p>
        <div class="meta">
          ${r.tags.split(' ').map(t=>`<span class="chip">${t}</span>`).join('')}
        </div>
        <a class="btn" href="#" data-action="favorite">Zobacz przepis</a>
        <a class="btn secondary" href="#" data-action="details">Szczegóły</a>
      </article>`;
  }

  const grids = {
    przekaski: $('#grid-przekaski'),
    dania: $('#grid-dania'),
    desery: $('#grid-desery')
  };

  Object.keys(grids).forEach(cat=>{
    const items = RECIPES.filter(r=>r.cat===cat);
    grids[cat].innerHTML = items.map(cardHTML).join('');
  });

  // After render: favorites + details handlers
  function initCards(){
    $$('.card').forEach((card, idx)=>{
      const favKey = 'fav-' + idx;
      const favBtn = card.querySelector('[data-action="favorite"]');
      const detBtn = card.querySelector('[data-action="details"]');
      const setFav = (on)=>{
        favBtn.textContent = on ? '★ Ulubione' : 'Zobacz przepis';
        favBtn.setAttribute('aria-pressed', on);
      };
      setFav(localStorage.getItem(favKey) === '1');
      favBtn?.addEventListener('click', (e)=>{
        e.preventDefault();
        const on = !(localStorage.getItem(favKey) === '1');
        localStorage.setItem(favKey, on ? '1' : '0'); setFav(on);
      });
      detBtn?.addEventListener('click', (e)=>{
        e.preventDefault();
        alert('Szczegóły przepisu: ' + (card.querySelector('h3')?.textContent || '') + '\nSkładniki, czas, poziom…');
      });
    });
  }
  initCards();

  // Search + Tag filtering across all grids
  const search = $('#search');
  const tagBar = $('#tagBar');
  const activeTags = new Set();

  function applyFilters(){
    const q = normalize(search?.value || '');
    let totalVisible = 0;
    Object.values(grids).forEach(grid => {
      const cards = $$('.card', grid);
      let visible = 0;
      cards.forEach(card => {
        const tags = card.dataset.tags || '';
        const title = card.querySelector('h3')?.textContent || '';
        const haystack = normalize(title + ' ' + tags);
        const matchesText = !q || haystack.includes(q);
        const matchesTags = activeTags.size === 0 || [...activeTags].every(t => tags.includes(t));
        const show = (matchesText && matchesTags);
        card.style.display = show ? 'flex' : 'none';
        if (show) visible++;
      });
      const counter = grid.previousElementSibling?.querySelector?.('.count');
      if (counter) counter.textContent = visible + ' wyników';
      totalVisible += visible;
    });
  }

  search?.addEventListener('input', applyFilters);
  tagBar?.addEventListener('click', (e)=>{
    const btn = e.target.closest('.tag');
    if(!btn) return;
    const key = (btn.dataset.tag || '').toLowerCase();
    if(activeTags.has(key)){ activeTags.delete(key); btn.classList.remove('active'); }
    else { activeTags.add(key); btn.classList.add('active'); }
    applyFilters();
  });

  // Lightbox
  const modal = $('#modal');
  const modalImg = $('#modalImg');
  document.addEventListener('click', (e)=>{
    const img = e.target.closest('.lightbox');
    if(img){ modalImg.src = img.src; modal.classList.add('open'); }
  });
  modal?.addEventListener('click', ()=> modal.classList.remove('open'));

  // --- Calorie calculator ---
  const PRODUCTS = {
    "makaron": 350, "ryż": 360, "kurczak": 165, "łosoś": 208,
    "oliwa": 884, "masło": 717, "cukier": 387, "jajko": 155,
    "pomidor": 18, "cebula": 40, "czosnek": 149, "bazylia": 23,
    "mozzarella": 280, "mascarpone": 430, "kakao": 228,
    "jogurt naturalny": 60, "marchew": 41, "bagietka": 270,
    "mleko": 64, "mąka pszenna": 364
  }; // kcal / 100g

  const calSelect = $('#cal-product');
  const calGrams = $('#cal-grams');
  const calAdd = $('#cal-add');
  const calBody = $('#cal-body');
  const calTotal = $('#cal-total');
  const dishName = $('#dish-name');
  const dishSave = $('#dish-save');
  const dishClear = $('#dish-clear');
  const savedDishes = $('#saved-dishes');

  // Populate products
  calSelect.innerHTML = Object.keys(PRODUCTS).sort().map(p=>`<option value="${p}">${p} (${PRODUCTS[p]} kcal/100g)</option>`).join('');

  function rowHTML(name, grams, kcal){
    return `<tr>
      <td>${name}</td>
      <td>${grams}</td>
      <td>${kcal}</td>
      <td><button class="btn secondary cal-del">Usuń</button></td>
    </tr>`;
  }

  function recalc(){
    let sum = 0;
    $$('#cal-body tr').forEach(tr=>{
      const v = parseFloat(tr.children[2].textContent||'0') || 0;
      sum += v;
    });
    calTotal.textContent = Math.round(sum);
  }

  calAdd.addEventListener('click', ()=>{
    const name = calSelect.value;
    const grams = Math.max(1, parseInt(calGrams.value||'0',10));
    const per100 = PRODUCTS[name] || 0;
    const kcal = per100 * grams / 100;
    calBody.insertAdjacentHTML('beforeend', rowHTML(name, grams, Math.round(kcal)));
    recalc();
  });

  calBody.addEventListener('click', (e)=>{
    if (e.target.closest('.cal-del')){
      e.target.closest('tr').remove();
      recalc();
    }
  });

  dishSave.addEventListener('click', ()=>{
    const name = (dishName.value || 'Moja potrawa').trim();
    const total = parseInt(calTotal.textContent||'0',10);
    if (!$('#cal-body tr')) return;
    const items = $$('#cal-body tr').map(tr=>({
      product: tr.children[0].textContent,
      grams: parseInt(tr.children[1].textContent,10),
      kcal: parseInt(tr.children[2].textContent,10)
    }));
    const saved = JSON.parse(localStorage.getItem('saved-dishes') || '[]');
    saved.push({name, total, items, ts: Date.now()});
    localStorage.setItem('saved-dishes', JSON.stringify(saved));
    renderSaved();
    dishName.value='';
  });

  dishClear.addEventListener('click', ()=>{
    calBody.innerHTML='';
    recalc();
  });

  function renderSaved(){
    const saved = JSON.parse(localStorage.getItem('saved-dishes') || '[]');
    if (!saved.length){ savedDishes.textContent = 'Brak zapisanych potraw.'; return; }
    savedDishes.innerHTML = '<h3>Twoje zapisane potrawy</h3>' + saved.map(d=>`<div>• <strong>${d.name}</strong> – ${d.total} kcal</div>`).join('');
  }
  renderSaved();

  // Initial filters
  applyFilters();
})();