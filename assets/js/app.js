(() => {
  const PAGE = document.body.dataset.page;
  const DATA = {};
  const DATA_FILES = ['plan','temas','tecnicas','problemas','videos','repasos','biblioteca'];
  const STORAGE_KEY = 'cuadernoOposicionProgressV1';
  const $ = (s, root=document) => root.querySelector(s);
  const $$ = (s, root=document) => [...root.querySelectorAll(s)];
  const esc = (v='') => String(v ?? '').replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  const norm = (v='') => String(v).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
  const slugStatus = v => String(v||'pendiente').replaceAll('_',' ');
  async function loadData(){
    await Promise.all(DATA_FILES.map(async n => { const r = await fetch(`data/${n}.json`); if(!r.ok) throw new Error(`No se pudo cargar ${n}`); DATA[n] = await r.json(); }));
  }
  function getProgress(){ try{return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {problems:{},reviews:{},videos:{},program:{},notes:''}}catch{return {problems:{},reviews:{},videos:{},program:{},notes:''}} }
  function setProgress(p){localStorage.setItem(STORAGE_KEY, JSON.stringify(p));}
  function ensureProgress(){const p=getProgress();p.problems ||= {};p.reviews ||= {};p.videos ||= {};p.program ||= {};p.notes ||= '';return p}
  function activateNav(){ const a=$(`[data-nav="${PAGE}"]`); if(a)a.classList.add('active'); $('#menuButton')?.addEventListener('click',()=>$('#sidebar').classList.toggle('open')); $$('.main-nav a').forEach(x=>x.addEventListener('click',()=>$('#sidebar').classList.remove('open'))); }
  function tag(t){return `<span class="tag">${esc(t)}</span>`}
  function themeUrl(t){return `tema.html?id=${encodeURIComponent(t.id)}`}
  function getTheme(id){return DATA.temas.temas.find(t=>t.id===id)}
  function renderDashboard(){
    const ts=DATA.temas.temas; const p=ensureProgress();
    const stats=[
      [ts.filter(t=>t.estado==='dominado').length,'Temas dominados'],
      [ts.filter(t=>t.estado==='elaborado').length,'Temas elaborados'],
      [DATA.problemas.problemas.length,'Problemas núcleo T04'],
      [Object.values(p.problems).filter(x=>Number(x.mastery)>=3).length,'Problemas con nivel ≥ 3']
    ];
    $('#dashboardStats').innerHTML=stats.map(x=>`<article class="stat-card"><b>${x[0]}</b><span>${x[1]}</span></article>`).join('');
    const actions=[
      ['P1','Escritura cronometrada del T04','Usar la versión esencial y completar el simulacro de 90 minutos.'],
      ['P2','Diagnóstico de los ocho problemas','Registrar nivel, tiempo y primer error no natural.'],
      ['P3','Programación didáctica','Decidir curso y arquitectura de situaciones de aprendizaje.']
    ];
    $('#priorityActions').innerHTML=actions.map(a=>`<div class="action-item"><span>${a[0]}</span><div><b>${a[1]}</b><p>${a[2]}</p></div></div>`).join('');
    const t=getTheme('T04');
    $('#activeTheme').innerHTML=`<article class="theme-feature"><div><span class="eyebrow">${esc(t.area)} · ${esc(slugStatus(t.estado))}</span><h2>${t.id} · ${esc(t.titulo)}</h2><p>${esc(t.resumen)}</p><a class="button-link" href="${themeUrl(t)}">Abrir espacio de trabajo</a></div><div class="metrics"><div><b>${t.conteos.problemas_banco}</b><span>Banco</span></div><div><b>${t.conteos.problemas_nucleo}</b><span>Núcleo</span></div><div><b>${t.conteos.tecnicas}</b><span>Técnicas</span></div><div><b>${t.conteos.videos}</b><span>Vídeos</span></div></div></article>`;
    const go=()=>{const q=$('#dashboardSearch').value.trim();location.href=`explorar.html?q=${encodeURIComponent(q)}`};
    $('#dashboardSearchButton').addEventListener('click',go);$('#dashboardSearch').addEventListener('keydown',e=>{if(e.key==='Enter')go()});
  }
  function renderPlan(){
    const pr=DATA.plan.ruta_personal.entregas[0];
    $('#personalRoute').innerHTML=`<article class="personal-route"><span class="eyebrow">Ruta personal</span><h2>${pr.tema} · entrega piloto elaborada</h2><p>${esc(pr.nota)}</p><a class="button-link" href="tema.html?id=${pr.tema}">Abrir tema</a></article>`;
    $('#planMonths').innerHTML=DATA.plan.meses.map((m,i)=>`<details class="month-card" ${i===0?'open':''}><summary><span class="month-number">MES ${String(m.mes).padStart(2,'0')}</span><span class="month-title">${esc(m.objetivo)}</span><span class="month-objective">4 semanas + opcional + cierre</span></summary><div class="month-content"><div class="week-grid">${m.semanas.map(w=>`<article class="week-card"><span class="week">SEMANA ${w.semana} · ${esc(w.area)}</span><b><a href="tema.html?id=${w.tema}">${w.tema} · ${esc(w.titulo)}</a></b><p>${esc(w.problemas)}</p></article>`).join('')}</div><div class="month-footer"><span>Opcional: ${m.opcional.tema} · ${esc(m.opcional.titulo)}</span>${m.cierre.map(c=>`<span>${esc(c)}</span>`).join('')}</div></div></details>`).join('');
  }
  function renderThemes(){
    const data=DATA.temas.temas; const areas=[...new Set(data.map(t=>t.area))].sort(); const statuses=[...new Set(data.map(t=>t.estado))].sort();
    $('#themeArea').innerHTML+=[...areas].map(x=>`<option>${esc(x)}</option>`).join('');
    $('#themeStatus').innerHTML+=statuses.map(x=>`<option value="${x}">${esc(slugStatus(x))}</option>`).join('');
    $('#themeMonth').innerHTML+=DATA.plan.meses.map(m=>`<option value="${m.mes}">Mes ${m.mes}</option>`).join('');
    const draw=()=>{const q=norm($('#themeQuery').value),a=$('#themeArea').value,s=$('#themeStatus').value,m=$('#themeMonth').value,o=$('#themeOptional').checked;const rows=data.filter(t=>(!q||norm(`${t.id} ${t.titulo}`).includes(q))&&(!a||t.area===a)&&(!s||t.estado===s)&&(!m||t.posiciones.some(p=>String(p.mes)===m))&&(!o||t.opcional));$('#themeCount').textContent=`${rows.length} temas mostrados`;$('#themeGrid').innerHTML=rows.map(t=>`<article class="theme-card"><header><span class="theme-id">${t.id}</span><span class="status-badge ${t.estado}">${esc(slugStatus(t.estado))}</span></header><h3>${esc(t.titulo)}</h3><p>${esc(t.area)}${t.opcional?' · opcional':''}</p><div class="theme-meta">${t.posiciones.map(p=>tag(`M${p.mes}${p.semana?` · S${p.semana}`:''}`)).join('')}</div><a href="${themeUrl(t)}">Abrir ficha →</a></article>`).join('')||'<div class="empty-state">No hay temas con esos filtros.</div>'};
    ['themeQuery','themeArea','themeStatus','themeMonth','themeOptional'].forEach(id=>$('#'+id).addEventListener('input',draw));draw();
  }
  function renderTheme(){
    const id=new URLSearchParams(location.search).get('id')||'T04'; const t=getTheme(id);
    if(!t){$('#themeHeader').innerHTML='<div class="empty-state">Tema no encontrado.</div>';return}
    $('#themeHeader').innerHTML=`<header class="topic-header"><span class="eyebrow">${esc(t.area)} · ${esc(slugStatus(t.estado))}</span><h1>${t.id} · ${esc(t.titulo)}</h1><p>${esc(t.resumen||'Ficha de posición dentro del itinerario. Todavía no hay materiales incorporados a la web.')}</p><div class="theme-meta">${t.posiciones.map(p=>tag(`Plan: mes ${p.mes}${p.semana?`, semana ${p.semana}`:''}`)).join('')}${t.ruta_personal?tag(`Ruta personal: mes ${t.ruta_personal.mes}, semana ${t.ruta_personal.semana}`):''}</div><div class="topic-actions">${t.id==='T04'?'<a class="button-link" href="t04.html">Lectura extensa</a><a class="button-link secondary" href="documentos/T04/tema-examen-esencial-v5.pdf">Versión esencial</a>':''}</div></header>`;
    const tabs=$$('#themeTabs button'); const content=$('#themeTabContent');
    const draw=tab=>{tabs.forEach(b=>b.classList.toggle('active',b.dataset.tab===tab));if(t.id!=='T04'){content.innerHTML=`<div class="empty-state"><h2>${t.id} está en el mapa del plan</h2><p>No se han incorporado materiales públicos de este tema. Su presencia no implica que esté elaborado.</p></div>`;return}
      const p=ensureProgress();
      const blocks={
        resumen:`<div class="info-grid"><article class="info-card"><span class="eyebrow">Estado</span><h3>Elaborado</h3><p>Sin evidencia suficiente para marcarlo dominado.</p></article><article class="info-card"><span class="eyebrow">Próximo objetivo</span><h3>90 minutos</h3><p>${esc(t.proximo_objetivo)}</p></article><article class="info-card"><span class="eyebrow">Sistema</span><h3>3 niveles</h3><p>Manual, fichas y matriz conectada.</p></article></div><div class="notice"><b>Regla de cierre:</b> no declarar dominado hasta completar recuperación, escritura en tiempo, corrección y transferencia a problemas nuevos.</div>`,
        examen:`<div class="resource-list"><a class="resource-row" href="documentos/T04/tema-examen-modular-v4.pdf"><span class="type">PDF</span><div><b>Tema de examen modular v4</b><br><small>Versión adaptable y de alto rendimiento.</small></div><span>abrir →</span></a><a class="resource-row" href="documentos/T04/tema-examen-esencial-v5.pdf"><span class="type">PDF</span><div><b>Tema de examen esencial v5</b><br><small>Versión de escritura cronometrada.</small></div><span>abrir →</span></a><a class="resource-row" href="documentos/T04/simulacro-90min.pdf"><span class="type">PDF</span><div><b>Simulacro de 90 minutos</b><br><small>Hoja de evidencia y control.</small></div><span>abrir →</span></a></div>`,
        problemas:`<div class="section-heading"><div><span class="eyebrow">Selección semanal</span><h2>Ocho problemas núcleo</h2></div><a href="problemas.html">Abrir explorador →</a></div><div class="problem-list">${DATA.problemas.problemas.map(x=>`<article class="problem-card"><header><div><span class="source">${x.id} · ${esc(x.fuente)}</span><h2>${esc(x.tecnica_principal)}</h2></div><span class="tag">${esc(x.tiempo_objetivo)}</span></header><p class="problem-summary">${esc(x.enunciado_resumido)}</p></article>`).join('')}</div>`,
        tecnicas:`<div class="technique-grid">${DATA.tecnicas.tecnicas.map(x=>`<article class="technique-card"><span class="tag">Nivel ${esc(x.nivel)} · ${esc(x.bloque)}</span><h3>${esc(x.tecnica)}</h3><p>${esc(x.senales)}</p><dl><dt>Hipótesis</dt><dd>${esc(x.hipotesis)}</dd><dt>Procedimiento</dt><dd>${esc(x.procedimiento)}</dd><dt>Repaso</dt><dd>${esc(x.repaso)}</dd></dl></article>`).join('')}</div>`,
        videos:`<div class="notice"><b>Protocolo:</b> intentar → localizar bloqueo → consultar → cerrar → reconstruir → resolver de nuevo.</div><div class="video-grid">${DATA.videos.videos.map(v=>`<article class="video-card"><span class="tag">${v.id} · ${esc(v.prioridad)}</span><h3>${esc(v.titulo)}</h3><p><b>${esc(v.canal)}</b> · ${esc(v.concepto)}</p><p>${esc(v.uso)}</p><label><input type="checkbox" data-video-seen="${v.id}" ${p.videos[v.id]?.seen?'checked':''}> Visto</label> <label><input type="checkbox" data-video-applied="${v.id}" ${p.videos[v.id]?.applied?'checked':''}> Aplicado sin ayuda</label><br><a href="${esc(v.url)}" target="_blank" rel="noopener">Abrir vídeo →</a></article>`).join('')}</div>`,
        archivos:`<div class="resource-list">${t.recursos.map(r=>`<a class="resource-row" href="${esc(r.url)}"><span class="type">${esc(r.tipo)}</span><div><b>${esc(r.titulo)}</b><br><small>${esc(r.nota||'Material incorporado')}</small></div><span>abrir →</span></a>`).join('')}</div>`,
        evidencias:`<div class="info-grid"><article class="info-card"><span class="eyebrow">Recuperación</span><h3>Pendiente</h3><p>Registrar reconstrucción sin apoyo.</p></article><article class="info-card"><span class="eyebrow">Escritura</span><h3>Pendiente</h3><p>Completar la versión esencial en 75-90 minutos.</p></article><article class="info-card"><span class="eyebrow">Problemas</span><h3>${Object.values(p.problems).filter(x=>x.solved).length}/8</h3><p>Problemas marcados como resueltos en este navegador.</p></article></div><p><a class="button-link" href="seguimiento.html">Abrir seguimiento completo</a></p>`
      };content.innerHTML=blocks[tab]||blocks.resumen; bindVideoControls();};
    tabs.forEach(b=>b.addEventListener('click',()=>draw(b.dataset.tab)));draw('resumen');
  }
  function bindVideoControls(){
    $$('[data-video-seen],[data-video-applied]').forEach(el=>el.addEventListener('change',()=>{const p=ensureProgress();const id=el.dataset.videoSeen||el.dataset.videoApplied;p.videos[id]||={};if(el.dataset.videoSeen)p.videos[id].seen=el.checked;if(el.dataset.videoApplied)p.videos[id].applied=el.checked;setProgress(p)}));
  }
  function renderProblems(){
    const data=DATA.problemas.problemas; const techniques=[...new Set(data.map(x=>x.tecnica_principal))].sort(); $('#problemTechnique').innerHTML+=techniques.map(x=>`<option>${esc(x)}</option>`).join('');
    const draw=()=>{const p=ensureProgress(),q=norm($('#problemQuery').value),tech=$('#problemTechnique').value,mastery=$('#problemMastery').value;const rows=data.filter(x=>(!q||norm(JSON.stringify(x)).includes(q))&&(!tech||x.tecnica_principal===tech)&&(!mastery||String(p.problems[x.id]?.mastery??0)===mastery));$('#problemCount').textContent=`${rows.length} problemas mostrados`;$('#problemList').innerHTML=rows.map(x=>{const state=p.problems[x.id]||{};return `<article class="problem-card"><header><div><span class="source">${x.id} · ${esc(x.fuente)}</span><h2>${esc(x.tecnica_principal)}</h2></div><span class="tag">${esc(x.tiempo_objetivo)}</span></header><p class="problem-summary">${esc(x.enunciado_resumido)}</p><div class="problem-details"><div><b>Teoría previa</b><p>${esc(x.teoria_previa)}</p></div><div><b>Ruta de ataque</b><p>${esc(x.ruta)}</p></div><div><b>Error frecuente</b><p>${esc(x.error_frecuente)}</p></div></div><div class="theme-meta">${x.videos.map(v=>tag(v)).join('')}${tag(`Cap. ${x.capitulos}`)}</div><div class="progress-controls"><label>Nivel <select data-problem-mastery="${x.id}">${[0,1,2,3,4,5].map(n=>`<option value="${n}" ${Number(state.mastery||0)===n?'selected':''}>${n}</option>`).join('')}</select></label><label><input type="checkbox" data-problem-solved="${x.id}" ${state.solved?'checked':''}> Resuelto autónomamente</label><label>Tiempo real <input type="text" size="7" data-problem-time="${x.id}" value="${esc(state.time||'')}" placeholder="min"></label></div></article>`}).join('')||'<div class="empty-state">No hay problemas con esos filtros.</div>';bindProblemControls()};
    ['problemQuery','problemTechnique','problemMastery'].forEach(id=>$('#'+id).addEventListener('input',draw));draw();
  }
  function bindProblemControls(){
    $$('[data-problem-mastery],[data-problem-solved],[data-problem-time]').forEach(el=>el.addEventListener('change',()=>{const p=ensureProgress();const id=el.dataset.problemMastery||el.dataset.problemSolved||el.dataset.problemTime;p.problems[id]||={};if(el.dataset.problemMastery)p.problems[id].mastery=Number(el.value);if(el.dataset.problemSolved)p.problems[id].solved=el.checked;if(el.dataset.problemTime)p.problems[id].time=el.value;setProgress(p)}));
  }
  function renderTracking(){
    const p=ensureProgress();
    $('#reviewTimeline').innerHTML=DATA.repasos.repasos.map(r=>{const s=p.reviews[r.id]||{};return `<article class="timeline-item"><span class="moment">${esc(r.momento)}</span><div><b>${esc(r.duracion)}</b><p>${esc(r.criterio)}</p></div><div><b>${esc(r.recuperacion)}</b><p>${esc(r.problemas)}</p></div><div class="timeline-control"><label><input type="checkbox" data-review-done="${r.id}" ${s.done?'checked':''}> Realizado</label><input type="date" data-review-date="${r.id}" value="${esc(s.date||'')}"></div></article>`}).join('');
    const counts=[0,1,2,3,4,5].map(n=>[n,DATA.problemas.problemas.filter(x=>Number(p.problems[x.id]?.mastery||0)===n).length]);const max=Math.max(1,...counts.map(x=>x[1]));$('#masterySummary').innerHTML=`<div class="mastery-bars">${counts.map(([n,c])=>`<div class="mastery-row"><b>N${n}</b><div class="mastery-bar"><span style="width:${c/max*100}%"></span></div><span>${c}</span></div>`).join('')}</div>`;
    $('#globalNotes').value=p.notes||'';let timer;$('#globalNotes').addEventListener('input',()=>{clearTimeout(timer);timer=setTimeout(()=>{const q=ensureProgress();q.notes=$('#globalNotes').value;setProgress(q);$('#notesStatus').textContent='Guardado localmente';setTimeout(()=>$('#notesStatus').textContent='',1200)},350)});
    $$('[data-review-done],[data-review-date]').forEach(el=>el.addEventListener('change',()=>{const q=ensureProgress();const id=el.dataset.reviewDone||el.dataset.reviewDate;q.reviews[id]||={};if(el.dataset.reviewDone)q.reviews[id].done=el.checked;if(el.dataset.reviewDate)q.reviews[id].date=el.value;setProgress(q)}));
    $('#exportProgress').addEventListener('click',()=>{const blob=new Blob([JSON.stringify(ensureProgress(),null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='progreso-oposiciones.json';a.click();URL.revokeObjectURL(a.href)});
    $('#importProgress').addEventListener('change',async e=>{const f=e.target.files[0];if(!f)return;try{const obj=JSON.parse(await f.text());setProgress(obj);location.reload()}catch{alert('El archivo no contiene un JSON válido.')}});
    $('#resetProgress').addEventListener('click',()=>{if(confirm('¿Borrar todo el progreso guardado en este navegador?')){localStorage.removeItem(STORAGE_KEY);location.reload()}});
  }
  function renderLibrary(){
    const data=DATA.biblioteca.recursos;const cats=[...new Set(data.map(x=>x.categoria))].sort();$('#libraryCategory').innerHTML+=cats.map(x=>`<option>${esc(x)}</option>`).join('');const draw=()=>{const q=norm($('#libraryQuery').value),cat=$('#libraryCategory').value;const rows=data.filter(x=>(!q||norm(JSON.stringify(x)).includes(q))&&(!cat||x.categoria===cat));$('#libraryCount').textContent=`${rows.length} recursos`;$('#libraryGrid').innerHTML=rows.map(x=>`<a class="library-card" href="${esc(x.url)}" ${x.url.startsWith('http')?'target="_blank" rel="noopener"':''}><span class="file-type">${esc(x.categoria)} · ${esc(x.tipo)}</span><h3>${esc(x.titulo)}</h3><p>${esc(x.descripcion)}</p></a>`).join('')};['libraryQuery','libraryCategory'].forEach(id=>$('#'+id).addEventListener('input',draw));draw();
  }
  function renderExplore(){
    let type='todos';const input=$('#globalSearch');input.value=new URLSearchParams(location.search).get('q')||'';
    const index=[];
    DATA.temas.temas.forEach(x=>index.push({kind:'tema',title:`${x.id} · ${x.titulo}`,desc:`${x.area} · ${slugStatus(x.estado)}`,url:themeUrl(x),text:JSON.stringify(x)}));
    DATA.tecnicas.tecnicas.forEach(x=>index.push({kind:'tecnica',title:`${x.id} · ${x.tecnica}`,desc:`${x.bloque} · nivel ${x.nivel} · ${x.procedimiento}`,url:'tema.html?id=T04',text:JSON.stringify(x)}));
    DATA.problemas.problemas.forEach(x=>index.push({kind:'problema',title:`${x.id} · ${x.tecnica_principal}`,desc:`${x.enunciado_resumido} · ${x.fuente}`,url:'problemas.html',text:JSON.stringify(x)}));
    DATA.videos.videos.forEach(x=>index.push({kind:'video',title:`${x.id} · ${x.titulo}`,desc:`${x.canal} · ${x.concepto}`,url:x.url,text:JSON.stringify(x),external:true}));
    DATA.biblioteca.recursos.forEach(x=>index.push({kind:'recurso',title:x.titulo,desc:`${x.categoria} · ${x.tipo} · ${x.descripcion}`,url:x.url,text:JSON.stringify(x),external:x.url.startsWith('http')}));
    const draw=()=>{const q=norm(input.value);const rows=index.filter(x=>(type==='todos'||x.kind===type)&&(!q||norm(x.text).includes(q))).slice(0,80);$('#globalSearchSummary').textContent=q?`${rows.length} resultados para “${input.value}”`:`${rows.length} elementos disponibles`;$('#globalSearchResults').innerHTML=rows.map(x=>`<a class="search-result" href="${esc(x.url)}" ${x.external?'target="_blank" rel="noopener"':''}><span class="kind">${esc(x.kind)}</span><div><h3>${esc(x.title)}</h3><p>${esc(x.desc)}</p></div><span>→</span></a>`).join('')||'<div class="empty-state">No se han encontrado coincidencias.</div>'};
    input.addEventListener('input',draw);$('#clearGlobalSearch').addEventListener('click',()=>{input.value='';draw()});$$('[data-search-type]').forEach(b=>b.addEventListener('click',()=>{type=b.dataset.searchType;$$('[data-search-type]').forEach(x=>x.classList.toggle('active',x===b));draw()}));draw();
  }
  function renderProgram(){const p=ensureProgress();$$('[data-program]').forEach(el=>{el.checked=!!p.program[el.dataset.program];el.addEventListener('change',()=>{const q=ensureProgress();q.program[el.dataset.program]=el.checked;setProgress(q)})})}
  async function init(){activateNav();try{await loadData();({dashboard:renderDashboard,explorar:renderExplore,plan:renderPlan,temas:renderThemes,tema:renderTheme,problemas:renderProblems,seguimiento:renderTracking,biblioteca:renderLibrary,programacion:renderProgram}[PAGE]||(()=>{}))()}catch(err){console.error(err);$('.page-content').insertAdjacentHTML('afterbegin',`<div class="notice warning"><b>Error de carga:</b> ${esc(err.message)}. Abre el sitio mediante GitHub Pages o un servidor local, no directamente como archivo.</div>`)} }
  init();
})();
