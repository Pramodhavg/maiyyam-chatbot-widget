(function() {
  // 1. INJECT STYLES
  const style = document.createElement('style');
  style.innerHTML = `
    :root { --brand:#d9346d; --text:#e5e7eb; --muted:#1f2937; --bg:#0b0f14; --panel:#ffffff; --radius:16px; --shadow:0 18px 50px rgba(0,0,0,.18); --w:400px; --w-m:calc(100vw - 32px); --h:60vh; --bubblew:82%; --font:"Inter","Poppins","Helvetica Neue",Arial,sans-serif; }
    #maiyyam-widget-container { font-family:var(--font); z-index: 99999; position: fixed; bottom: 0; right: 0; }
    #maiyyam-widget-container * { box-sizing: border-box; }
    
    .chat-launcher{ position:fixed; right:22px; bottom:22px; width:60px;height:60px;border-radius:50%; background:var(--brand); box-shadow:var(--shadow); display:grid; place-items:center; cursor:pointer; color:#fff; border:none; z-index:2147483647; }
    .chat-launcher svg{ width:28px;height:28px; display:block; }
    .chat-launcher[aria-expanded="true"] .icon-open{ display:none; }
    .chat-launcher[aria-expanded="false"] .icon-close{ display:none; }
    
    .hint{ position:fixed; bottom:92px; z-index:2147483646; right: 22px; background:#0f172a; color:#fff; font-size:14px; padding:10px 30px 10px 12px; border-radius:12px; box-shadow:var(--shadow); display:none; max-width:calc(100vw - 120px); white-space:nowrap; }
    .hint.show{ display:block; animation:fadein .22s ease-out; }
    .hint::after{ content:""; position:absolute; right: 20px; bottom:-8px; border-left:8px solid transparent; border-right:8px solid transparent; border-top:8px solid #0f172a; }
    .hint button{ position:absolute; right:6px; top:4px; width:20px; height:20px; border-radius:50%; background:#111827; color:#fff; border:1px solid #374151; font-size:14px; line-height:18px; cursor:pointer; }
    @keyframes fadein{ from{opacity:0; transform:translateY(4px);} to{opacity:1; transform:translateY(0);} }

    .chat-panel{ position:fixed; right:22px; bottom:92px; width:var(--w); max-width:var(--w); background:var(--panel); border-radius:var(--radius); box-shadow:var(--shadow); overflow:hidden; display:none; flex-direction:column; contain:content; z-index:2147483646; border:1px solid #f1f5f9; }
    .chat-panel.open{ display:flex; }
    @media (max-width:520px){ .chat-panel{ width:var(--w-m); max-width:var(--w-m); right:16px; left:16px; } }

    .chat-header{ background:var(--brand); color:#fff; height:72px; padding:8px 16px; display:flex; align-items:center; flex-shrink: 0; }
    .chat-header img{ height:38px; object-fit:contain; }
    .spacer{ flex:1; }
    .kebab{ width:34px; height:34px; border-radius:8px; border:none; color:#fff; background:rgba(255,255,255,.16); cursor:pointer; display:grid; place-items:center; }
    .kebab svg{ width:18px; height:18px; }
    
    /* MENU ADJUSTMENTS */
    .menu{ position:absolute; right:16px; top:72px; background:#1f2937; color:#e5e7eb; border-radius:12px; padding:6px; box-shadow:var(--shadow); display:none; z-index:2147483648; width:260px; }
    .menu.open{ display:block; }
    
    /* UPDATED: Increased font-size to 16px and added font-weight */
    .menu-item{ display:flex; gap:12px; align-items:center; padding:12px; border-radius:8px; cursor:pointer; font-size: 16px; font-weight: 500; }
    .menu-item:hover{ background:#374151; }
    .menu-hr{ height:1px; background:#374151; margin:4px 6px; }

    .chat-body{ height:var(--h); max-height:var(--h); overflow:auto; padding:16px; background:var(--bg); color:#fff; }
    .row{ display:flex; gap:10px; margin:12px 0; }
    .row.bot{ justify-content:flex-start; }
    .row.user{ justify-content:flex-end; }
    .avatar{ width:30px;height:30px; border-radius:50%; overflow:hidden; flex:0 0 auto; display:none; background:#fff; border:1px solid #e5e7eb; }
    .row.bot .avatar{ display:block; }
    .avatar img{ width:100%; height:100%; object-fit:contain; padding:2px; }
    .content{ max-width:var(--bubblew); }
    .name{ font-size:12px; font-weight:700; color:#9ca3af; margin:0 0 4px 6px; }
    .bubble{ padding:12px 14px; border-radius:14px; line-height:1.45; font-size:14px; box-shadow:0 1px 0 rgba(0,0,0,.25); word-wrap:break-word; white-space:pre-wrap; }
    .bot .bubble{ background:#111f2c; color:#dbeafe; border-top-left-radius:8px; }
    .user .bubble{ background:var(--brand); color:#fff; border-top-right-radius:8px; }
    
    .typing{ display:inline-flex; gap:4px; align-items:center; }
    .dot{ width:6px; height:6px; border-radius:50%; background:#9ca3af; opacity:.4; animation:blink 1s infinite; }
    .dot:nth-child(2){ animation-delay:.15s; } .dot:nth-child(3){ animation-delay:.3s; }
    @keyframes blink{ 0%,100%{opacity:.2} 50%{opacity:1} }
    
    .chat-input{ display:flex; gap:8px; padding:12px; border-top:1px solid #111827; background:#0b0f14; }
    .chat-input input{ flex:1; padding:12px 14px; border:2px solid var(--brand); border-radius:12px; font-size:14px; font-family:var(--font); background:#0f172a; color:#fff; }
    .chat-input input::placeholder{ color:#cbd5e1; }
    .chat-input input:disabled{ opacity:.6; cursor:not-allowed; }
    .chat-input button{ background:var(--brand); color:#fff; border:none; padding:0 16px; border-radius:12px; cursor:pointer; font-weight:700; display:grid; place-items:center; }
    .chat-input button[disabled]{ opacity:.6; cursor:not-allowed; }
    .chat-input button svg{ width:18px; height:18px; display:block; }
    .spinner{ width:18px; height:18px; border:2px solid rgba(255,255,255,.5); border-top-color:#fff; border-radius:50%; animation:spin 0.8s linear infinite; }
    @keyframes spin{ to{ transform:rotate(360deg);} }

    .modal{ position:fixed; inset:0; background:rgba(0,0,0,.5); display:none; align-items:center; justify-content:center; z-index:2147483649; }
    .modal.open{ display:flex; }
    .modal-card{ width:min(520px, 92vw); background:#111827; color:#e5e7eb; border-radius:14px; box-shadow:var(--shadow); padding:14px; }
    .modal-h{ font-weight:800; margin:4px 0 10px 2px; }
    .list{ max-height:50vh; overflow:auto; margin-top:8px; }
    .conv{ display:flex; justify-content:space-between; align-items:center; padding:10px; border-radius:10px; }
    .conv:nth-child(odd){ background:#1f2937; }
    .conv .left{ display:flex; flex-direction:column; gap:6px; }
    .conv .title{ font-weight:700; }
    .conv .meta{ font-size:12px; color:#9ca3af; }
    .conv .actions{ display:flex; gap:8px; }
    .btn{ background:#374151; color:#e5e7eb; border:none; padding:6px 10px; border-radius:8px; cursor:pointer; }
    .btn:hover{ background:#4b5563; }
    
    .poll{ background:#0b1220; border:1px solid #1f2a44; border-radius:14px; padding:14px; margin-top:6px; }
    .poll-title{ font-weight:700; margin:4px 6px 10px; color:#cfe3ff; }
    .poll-btn{ width:100%; text-align:left; background:#122034; color:#e5edff; border:1px solid #20324f; border-radius:12px; padding:12px 14px; margin:10px 0; cursor:pointer; font:inherit; }
    .poll-btn:hover{ background:#162742; }
  `;
  document.head.appendChild(style);

  // 2. CREATE HTML STRUCTURE
  const container = document.createElement('div');
  container.id = 'maiyyam-widget-container';
  container.innerHTML = `
    <button class="chat-launcher" id="launcher" aria-label="Open chat" aria-expanded="false">
      <svg class="icon-open" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-width="2" d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v8z"/></svg>
      <svg class="icon-close" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-width="2" d="M6 6l12 12M18 6l-12 12"/></svg>
    </button>
    <div class="hint" id="hint">Hi there! Need clarity? <button id="hintClose" aria-label="Hide">×</button></div>
    <div class="chat-panel" id="panel" aria-live="polite">
      <div class="chat-header">
        <img src="https://dme2wmiz2suov.cloudfront.net/Institution(3815)/Logo/2642439-Group_21.png" alt="Maiyyam logo" />
        <div class="spacer"></div>
        <button class="kebab" id="kebab" aria-label="Menu"><svg viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/></svg></button>
        <div class="menu" id="menu">
          <div class="menu-item" id="newConv">➕ New Conversation</div>
          <div class="menu-hr"></div>
          <div class="menu-item" id="openPrev">💬 Previous Conversations</div>
        </div>
      </div>
      <div class="chat-body" id="body"></div>
      <form class="chat-input" id="form">
        <input id="input" placeholder="Type your message..." autocomplete="off" />
        <button type="submit" id="sendBtn" aria-label="Send message">
          <svg id="sendIcon" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-width="2" d="M22 2L11 13" /><path stroke-width="2" d="M22 2l-7 20-4-9-9-4 20-7z" /></svg>
        </button>
      </form>
    </div>
    <div class="modal" id="prevModal" role="dialog" aria-modal="true">
      <div class="modal-card">
        <div class="modal-h">Previous Conversations</div>
        <div class="list" id="convList"></div>
        <div style="display:flex; justify-content:flex-end; gap:8px; margin-top:10px;">
          <button class="btn" id="clearAll">Clear All</button>
          <button class="btn" id="closeModal">Close</button>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(container);

  // 3. LOGIC
  const WEBHOOK_URL = 'https://aiagent61999.app.n8n.cloud/webhook/de779a9c-9554-41ca-b95b-446b396b8846';
  const LOGO = 'https://dme2wmiz2suov.cloudfront.net/Institution(3815)/Logo/2642439-Group_21.png';
  const PERSIST_ACROSS_RELOADS = true;
  const STORE_KEY = 'maiyyam_conversations_v1';
  const CONFIRM_RE = /(your counselling appointment is confirmed|your appointment has been rescheduled|we look forward to seeing you at maiyyam edtech|appointment (?:has been )?(?:confirmed|booked|scheduled))/i;
  const HANDOFF_DELAY_MS = 1500;

  // Select elements from the CONTAINER
  const panel = container.querySelector('#panel');
  const launcher = container.querySelector('#launcher');
  const hint = container.querySelector('#hint');
  const hintClose = container.querySelector('#hintClose');
  const body = container.querySelector('#body');
  const form = container.querySelector('#form');
  const input = container.querySelector('#input');
  const sendBtn = container.querySelector('#sendBtn');
  const sendIcon = container.querySelector('#sendIcon');
  const kebab = container.querySelector('#kebab');
  const menu = container.querySelector('#menu');
  const newConvBtn = container.querySelector('#newConv');
  const openPrevBtn = container.querySelector('#openPrev');
  const prevModal = container.querySelector('#prevModal');
  const convList = container.querySelector('#convList');
  const clearAllBtn = container.querySelector('#clearAll');
  const closeModalBtn = container.querySelector('#closeModal');

  let conversations = loadConversations();
  let currentId = startOrResumeConversation();
  let sessionId = makeSessionId();
  let waiting = false;
  let suppressedUntilReopen = false;
  let hintTimer = null;
  let awaitingProceed = false;
  let lastUserAffirmedProceed = false;
  let followupUsed = false;
  let handoffScheduled = false;

  function makeSessionId(){ return (globalThis.crypto?.randomUUID?.() ?? String(Date.now())) + '-' + Math.random().toString(36).slice(2,7); }

  function rewriteNumericDateTimeToSlotPick(input) {
    const s = String(input || "");
    const re = /\b(\d{1,2})[\/\-](\d{1,2})(?:[\/\-](\d{2,4}))?\b(?:.*?\b(?:at|by|around)\b)?\s*([0-2]?\d)(?:[.:](\d{2}))?\s*(a\.?m?\.?|p\.?m?\.?|am|pm)?\b/i;
    const m = s.match(re); if (!m) return input;
    let [, dd, mm, yyyy, hh, min, ap] = m;
    const now = new Date();
    let Y = yyyy ? (yyyy.length === 2 ? 2000 + +yyyy : +yyyy) : now.getFullYear();
    let H = +hh, M = +mm, D = +dd, MIN = min ? +min : 0;
    if (ap){ const apu = ap.replace(/\./g,"").toLowerCase(); if (apu==="pm"&&H<12)H+=12; if (apu==="am"&&H===12)H=0; }
    else { if (H>=1 && H<=8) H+=12; }
    const pad = n=>String(n).padStart(2,"0");
    return `SLOT_PICK:${Y}-${pad(M)}-${pad(D)}T${pad(H)}:${pad(MIN)}:00+05:30`;
  }

  function showHintDelayed(){
    if (suppressedUntilReopen || panel.classList.contains('open')) return;
    clearTimeout(hintTimer);
    hintTimer = setTimeout(()=>{ hint.classList.add('show'); }, 2000);
  }
  function hideHint(){ hint.classList.remove('show'); clearTimeout(hintTimer); }
  hintClose.addEventListener('click', ()=>{ suppressedUntilReopen = true; hideHint(); });
  showHintDelayed();

  function loadConversations(){ if (!PERSIST_ACROSS_RELOADS) return {}; try{ return JSON.parse(localStorage.getItem(STORE_KEY) || '{}'); } catch{ return {}; } }
  function saveConversations(){ if (!PERSIST_ACROSS_RELOADS) return; localStorage.setItem(STORE_KEY, JSON.stringify(conversations)); }
  function startOrResumeConversation(){
    const ids = Object.keys(conversations);
    if (ids.length) return ids[ids.length-1];
    const id = String(Date.now());
    conversations[id] = { id, title:'Conversation', createdAt:Date.now(), messages:[{role:'bot',text:'Welcome to Maiyyam. How can we help you?',t:Date.now()}] };
    saveConversations(); return id;
  }
  function startNewConversation(){
    const id = String(Date.now());
    conversations[id] = { id, title:'Conversation', createdAt:Date.now(), messages:[{role:'bot',text:'Welcome to Maiyyam. How can we help you?',t:Date.now()}] };
    saveConversations();
    currentId = id; sessionId = makeSessionId();
    awaitingProceed = false; followupUsed = false; handoffScheduled = false;
    renderMessages(true);
  }
  function pushMessage(role, text){ conversations[currentId].messages.push({ role, text, t: Date.now() }); saveConversations(); }
  function renderMessages(isFresh=false){
    body.innerHTML = '';
    const msgs = conversations[currentId]?.messages || [];
    for (const m of msgs){ (m.role==='user') ? addUser(m.text,false) : addBot(m.text,false); }
    if (!msgs.length && isFresh === false) addBot("Welcome to Maiyyam. How can we help you?", true, false);
    body.scrollTop = body.scrollHeight;
  }
  function addBot(text, store=true, scroll=true){
    const row = document.createElement('div'); row.className = 'row bot';
    row.innerHTML = `<div class="avatar"><img src="${LOGO}" alt="Maiyyam Assistant" /></div><div class="content"><div class="name">Maiyyam Assistant</div><div class="bubble">${text}</div></div>`;
    body.appendChild(row);
    if (scroll) body.scrollTop = body.scrollHeight;
    if (store) pushMessage('bot', text);
    if (/shall\s+i\s+proceed\??/i.test(text)) { awaitingProceed = true; followupUsed = false; }
    if (CONFIRM_RE.test(text)) scheduleHandoff();
  }
  function addUser(text, store=true){
    const row = document.createElement('div'); row.className = 'row user';
    row.innerHTML = `<div class="content"><div class="bubble">${text}</div></div>`;
    body.appendChild(row);
    body.scrollTop = body.scrollHeight;
    if (store) pushMessage('user', text);
  }
  function addTyping(){
    const row = document.createElement('div'); row.className = 'row bot';
    row.innerHTML = `<div class="avatar"><img src="${LOGO}" alt="" /></div><div class="content"><div class="name" style="visibility:hidden;">.</div><div class="bubble"><span class="typing"><span class="dot"></span><span class="dot"></span><span class="dot"></span></span></div></div>`;
    body.appendChild(row); body.scrollTop = body.scrollHeight;
    return () => row.remove();
  }
  function addInfo(text){
    const row = document.createElement('div'); row.className = 'row bot';
    row.innerHTML = `<div class="avatar"><img src="${LOGO}" alt="" /></div><div class="content"><div class="name" style="visibility:hidden;">.</div><div class="bubble">${text}</div></div>`;
    body.appendChild(row); body.scrollTop = body.scrollHeight;
  }
  function addSlotPoll(slots){
    const row = document.createElement('div'); row.className = 'row bot';
    const buttons = slots.map(s => {
      const label = s.readable || s.start_local || s.start_rfc3339 || '';
      return `<button class="poll-btn" data-slot="${encodeURIComponent(label)}">${label}</button>`;
    }).join('');
    row.innerHTML = `<div class="avatar"><img src="${LOGO}" alt="" /></div><div class="content" style="max-width:100%;"><div class="poll"><div class="poll-title">Select any of these</div>${buttons}<button class="poll-btn" data-propose="1">Propose different date and time</button></div></div>`;
    body.appendChild(row); body.scrollTop = body.scrollHeight;
    row.addEventListener('click', (e)=>{
      const btn = e.target.closest('button.poll-btn'); if(!btn) return;
      if (btn.dataset.propose){ sendDirect("Propose different date and time"); row.querySelectorAll('button').forEach(b=>b.disabled=true); return; }
      const label = decodeURIComponent(btn.dataset.slot || ''); sendDirect(label); row.querySelectorAll('button').forEach(b=>b.disabled=true);
    });
  }
  function setWaiting(state){
    waiting = state; input.disabled = state; sendBtn.disabled = state;
    if (state){ sendIcon.style.display = 'none'; const sp = document.createElement('div'); sp.className='spinner'; sp.id='spinner'; sendBtn.appendChild(sp); }
    else { container.querySelector('#spinner')?.remove(); sendIcon.style.display = ''; input.focus(); }
  }
  function togglePanel(open){
    const isOpen = (open !== undefined) ? open : !panel.classList.contains('open');
    panel.classList.toggle('open', isOpen);
    launcher.setAttribute('aria-expanded', String(isOpen));
    menu.classList.remove('open');
    if (isOpen){ hideHint(); suppressedUntilReopen = true; renderMessages(true); input.focus(); }
    else { suppressedUntilReopen = false; showHintDelayed(); }
  }
  launcher.addEventListener('click', ()=> togglePanel());
  document.addEventListener('keydown', (e)=>{ if (e.key === 'Escape' && panel.classList.contains('open')) togglePanel(false); });
  kebab.addEventListener('click', (e)=>{ e.stopPropagation(); menu.classList.toggle('open'); });
  document.addEventListener('click', ()=> menu.classList.remove('open'));
  newConvBtn.addEventListener('click', ()=>{ startNewConversation(); menu.classList.remove('open'); input.focus(); });
  openPrevBtn.addEventListener('click', ()=>{ menu.classList.remove('open'); openPrevModal(); });
  input.addEventListener('keydown', (e)=>{ if (waiting && (e.key === 'Enter' || e.key.length === 1)) e.preventDefault(); });
  function openPrevModal(){
    convList.innerHTML = '';
    const ids = Object.keys(conversations);
    if (!ids.length){ convList.innerHTML = '<div class="meta" style="padding:10px;">No conversations yet.</div>'; }
    else {
      for (const id of ids){
        const c = conversations[id];
        const first = c.messages.find(m=>m.text)?.text ?? '';
        const date = new Date(c.createdAt).toLocaleString();
        const el = document.createElement('div'); el.className = 'conv';
        el.innerHTML = `<div class="left"><div class="title">${c.title}</div><div class="meta">${date}${first ? ' — ' + first.slice(0,40)+'…' : ''}</div></div><div class="actions"><button class="btn" data-act="load" data-id="${id}">Open</button><button class="btn" data-act="del" data-id="${id}">Delete</button></div>`;
        convList.appendChild(el);
      }
    }
    prevModal.classList.add('open');
  }
  convList.addEventListener('click', (e)=>{
    const btn = e.target.closest('button'); if(!btn) return;
    const id = btn.dataset.id, act = btn.dataset.act;
    if (act === 'load'){ currentId = id; renderMessages(true); prevModal.classList.remove('open'); togglePanel(true); }
    else if (act === 'del'){ delete conversations[id]; saveConversations(); openPrevModal(); if (id === currentId){ const ids = Object.keys(conversations); currentId = ids[ids.length-1] || startOrResumeConversation(); renderMessages(true); } }
  });
  clearAllBtn.addEventListener('click', ()=>{ conversations = {}; saveConversations(); currentId = startOrResumeConversation(); renderMessages(true); openPrevModal(); });
  closeModalBtn.addEventListener('click', ()=> prevModal.classList.remove('open'));
  function extractSlots(data){
    let slots = data?.suggested_slots ?? data?.slots ?? data?.meta?.suggested_slots;
    if (typeof slots === 'string'){ try { slots = JSON.parse(slots); } catch {} }
    return Array.isArray(slots) ? slots : [];
  }
  function scheduleHandoff(){
    if (handoffScheduled) return;
    handoffScheduled = true;
    conversations[currentId].title = 'Completed booking';
    saveConversations();
    setTimeout(()=>{ startNewConversation(); }, HANDOFF_DELAY_MS);
  }
  async function postJSON(url, payload, {timeoutMs=20000} = {}){
    const controller = new AbortController();
    const t = setTimeout(()=>controller.abort(), timeoutMs);
    try{
      const res = await fetch(url, { method:'POST', headers:{ 'Content-Type':'application/json' }, body: JSON.stringify(payload), signal: controller.signal });
      const ct = res.headers.get('content-type') || '';
      if (ct.includes('application/json')) return await res.json();
      const txt = await res.text();
      return txt ? { reply: txt } : {};
    } finally { clearTimeout(t); }
  }
  async function sendDirect(userText){
    if (!userText) return;
    addUser(userText);
    lastUserAffirmedProceed = awaitingProceed && /^\s*(yes|yeah|yep|ya|ok|okay|confirm|confirmed|proceed|go ahead)\b/i.test(userText);
    setWaiting(true);
    const stopTyping = addTyping();
    const outgoing1 = rewriteNumericDateTimeToSlotPick(userText);
    const payload = { sessionId, key: `web:${sessionId}`, message: outgoing1 };
    let data = null;
    try{ data = await postJSON(WEBHOOK_URL, payload); }catch{ try{ data = await postJSON(WEBHOOK_URL, { sessionId, key: `web:${sessionId}`, message: userText }, {timeoutMs: 20000}); }catch{ stopTyping(); addBot('Sorry—connection hiccup. Please send that once more.'); setWaiting(false); return; } }
    stopTyping();
    if (data?.end_conversation === true){ if (data.reply) addBot(data.reply); scheduleHandoff(); setWaiting(false); awaitingProceed = false; followupUsed = false; return; }
    const slots = extractSlots(data);
    if (slots.length){ addSlotPoll(slots); setWaiting(false); awaitingProceed = false; followupUsed = false; return; }
    let replyText = '';
    if (typeof data === 'string') replyText = data;
    else if (typeof data?.reply === 'string' && data.reply.trim()) replyText = data.reply;
    else if (typeof data?.message === 'string' && data.message.trim()) replyText = data.message;
    else if (typeof data?.text === 'string' && data.text.trim()) replyText = data.text;
    else replyText = 'I couldn’t parse a reply, but I’m here if you try again.';
    addBot(replyText);
    if (CONFIRM_RE.test(replyText) || CONFIRM_RE.test(String(data?.message || '')) || CONFIRM_RE.test(String(data?.text || '')) || (/success/i.test(String(data?.status || '')) && /appoint/i.test(String(data?.message || data?.reply || replyText || '')))) { scheduleHandoff(); }
    if (lastUserAffirmedProceed && !data?.end_conversation && !slots.length && !followupUsed && /^\s*ok(ay)?\.?\s*$/i.test(replyText || '')){
      followupUsed = true; const stop2 = addTyping(); addInfo('Scheduling your appointment…');
      try{
        const data2 = await postJSON(WEBHOOK_URL, { sessionId, key: `web:${sessionId}`, message: 'Confirm the booking' });
        stop2();
        if (data2?.end_conversation === true){ if (data2.reply) addBot(data2.reply); scheduleHandoff(); setWaiting(false); awaitingProceed = false; return; }
        const slots2 = extractSlots(data2); if (slots2.length){ addSlotPoll(slots2); setWaiting(false); return; }
        let reply2 = (typeof data2 === 'string') ? data2 : (typeof data2?.reply === 'string' && data2.reply.trim() ? data2.reply : (typeof data2?.message === 'string' && data2.message.trim() ? data2.message : (typeof data2?.text === 'string' && data2.text.trim() ? data2.text : '')));
        if (reply2) { addBot(reply2); if (CONFIRM_RE.test(reply2) || (/success/i.test(String(data2?.status || '')) && /appoint/i.test(String(data2?.message || reply2 || '')))) scheduleHandoff(); }
      }catch{ stop2(); }
    }
    if (!/shall\s+i\s+proceed\??/i.test(replyText)) { awaitingProceed = false; }
    setWaiting(false);
  }
  form.addEventListener('submit', async (e)=>{ e.preventDefault(); if (waiting) return; const text = input.value.trim(); if(!text) return; input.value = ''; await sendDirect(text); });
  // Final init
  renderMessages(false);
})();
