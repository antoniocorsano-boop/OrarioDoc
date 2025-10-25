// OrarioDoc - storage e tema
const STORAGE_KEY = 'orariodoc:v1';
const THEME_KEY = 'orariodoc:theme';
const COLORS_KEY = 'orariodoc:colors';

// Storage helpers
function loadData(){
  try{ return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); }catch(e){ return []; }
}
function saveData(data){ localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); }

// Theme & color helpers
function applyTheme(name){
  const root = document.documentElement;
  if(!name || name === 'auto'){
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    root.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
    root.removeAttribute('data-user-theme');
  } else {
    root.setAttribute('data-theme', name);
    root.setAttribute('data-user-theme', name);
  }
  // After applying theme, re-apply user colors (they override tokens)
  const colors = JSON.parse(localStorage.getItem(COLORS_KEY) || '{}');
  applyColors(colors);
}

function saveTheme(name){ localStorage.setItem(THEME_KEY, name || 'auto'); }

function applyColors(colors){
  const root = document.documentElement;
  if(colors && colors.primary) root.style.setProperty('--md-sys-color-primary', colors.primary);
  if(colors && colors.secondary) root.style.setProperty('--md-sys-color-secondary', colors.secondary);
  // update accent shorthand
  const primary = colors && colors.primary ? colors.primary : getComputedStyle(root).getPropertyValue('--md-sys-color-primary');
  root.style.setProperty('--accent', primary);
}

function saveColors(colors){ localStorage.setItem(COLORS_KEY, JSON.stringify(colors || {})); }

function resetColors(){
  localStorage.removeItem(COLORS_KEY);
  // re-apply theme defaults
  const userTheme = localStorage.getItem(THEME_KEY) || 'auto';
  applyTheme(userTheme);
}

// Initialize theme and colors from storage
function initTheme(){
  const saved = localStorage.getItem(THEME_KEY) || 'auto';
  if(saved === 'auto') applyTheme('auto'); else applyTheme(saved);
  // Apply persisted colors if any and set inputs
  const colors = JSON.parse(localStorage.getItem(COLORS_KEY) || '{}');
  const primaryColorEl = document.getElementById('primaryColor');
  const secondaryColorEl = document.getElementById('secondaryColor');
  if(primaryColorEl && colors.primary) primaryColorEl.value = colors.primary;
  if(secondaryColorEl && colors.secondary) secondaryColorEl.value = colors.secondary;
}

// DOM refs - will be initialized in init()
let listEl, formEl, addBtn, saveBtn, cancelBtn;
let settingsBtn, settingsMenu, primaryInput, secondaryInput, saveColorsBtn, resetColorsBtn;

let editIndex = -1;

function render(){
  const items = loadData();
  listEl.innerHTML = '';
  if(items.length === 0){
    listEl.innerHTML = '<div class="card">Nessuna voce. Clicca "Aggiungi" per crearne una.</div>';
    return;
  }
  items.forEach((it, idx) => {
    const el = document.createElement('div');
    el.className = 'card';
    el.innerHTML = `\n      <strong>${escapeHtml(it.name)}</strong>\n      <small>${escapeHtml(it.day)} • ${escapeHtml(it.time)}</small>\n      <div style="margin-top:8px">\n        <button data-action="edit" data-index="${idx}">Modifica</button>\n        <button data-action="delete" data-index="${idx}" style="background:${getStyle('--md-sys-color-secondary')};margin-left:8px">Elimina</button>\n      </div>\n    `;
    listEl.appendChild(el);
  });
}

function escapeHtml(s){ return (s||'').replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]); }
function getStyle(varName){ return getComputedStyle(document.documentElement).getPropertyValue(varName) || '#c0392b'; }

// Show form for new or edit
function openFormForNew(){ editIndex = -1; formEl.classList.remove('hidden'); formEl.setAttribute('aria-hidden','false'); listEl.classList.add('hidden'); document.getElementById('ev-name').value = ''; document.getElementById('ev-day').value = ''; document.getElementById('ev-time').value = ''; document.getElementById('ev-name').focus(); }
function openFormForEdit(item, idx){ editIndex = idx; formEl.classList.remove('hidden'); formEl.setAttribute('aria-hidden','false'); listEl.classList.add('hidden'); document.getElementById('ev-name').value = item.name || ''; document.getElementById('ev-day').value = item.day || ''; document.getElementById('ev-time').value = item.time || ''; }
function closeForm(){ formEl.classList.add('hidden'); formEl.setAttribute('aria-hidden','true'); listEl.classList.remove('hidden'); editIndex = -1; }

// small helper to update settings button label
function refreshThemeLabel(){
  const saved = localStorage.getItem(THEME_KEY) || 'auto';
  if(!settingsBtn) return;
  settingsBtn.textContent = saved === 'auto' ? 'Impostazioni' : ('Impostazioni — ' + (saved[0].toUpperCase() + saved.slice(1)));
}

// Initialize function - called on DOMContentLoaded
function init(){
  console.log('OrarioDoc init');
  
  // Get DOM refs
  listEl = document.getElementById('list');
  formEl = document.getElementById('form');
  addBtn = document.getElementById('addBtn');
  saveBtn = document.getElementById('saveBtn');
  cancelBtn = document.getElementById('cancelBtn');
  settingsBtn = document.getElementById('settingsBtn');
  settingsMenu = document.getElementById('settingsMenu');
  primaryInput = document.getElementById('primaryColor');
  secondaryInput = document.getElementById('secondaryColor');
  saveColorsBtn = document.getElementById('saveColors');
  resetColorsBtn = document.getElementById('resetColors');
  
  // Add event listeners with null checks
  if(addBtn){
    addBtn.addEventListener('click', () => { openFormForNew(); });
  }
  
  if(cancelBtn){
    cancelBtn.addEventListener('click', () => { closeForm(); });
  }
  
  if(saveBtn){
    saveBtn.addEventListener('click', () => {
      const name = document.getElementById('ev-name').value.trim();
      const day = document.getElementById('ev-day').value.trim();
      const time = document.getElementById('ev-time').value.trim();
      if(!name){ alert('Inserisci il nome'); return; }
      const items = loadData();
      const entry = {name, day, time, updatedAt: new Date().toISOString()};
      if(editIndex >= 0){ items[editIndex] = entry; editIndex = -1; } else { items.push(entry); }
      saveData(items);
      closeForm(); render();
    });
  }
  
  if(listEl){
    listEl.addEventListener('click', (e) => {
      const btn = e.target.closest('button'); if(!btn) return;
      const action = btn.dataset.action; const idx = Number(btn.dataset.index); const items = loadData();
      if(action === 'delete'){ if(confirm('Eliminare questa voce?')){ items.splice(idx,1); saveData(items); render(); } }
      else if(action === 'edit'){ const it = items[idx]; openFormForEdit(it, idx); }
    });
  }
  
  if(settingsBtn && settingsMenu){
    settingsBtn.addEventListener('click', () => { 
      const hidden = settingsMenu.classList.toggle('hidden'); 
      settingsMenu.setAttribute('aria-hidden', hidden ? 'true' : 'false'); 
    });
  }
  
  // Theme change delegation
  if(settingsMenu){
    settingsMenu.addEventListener('click', (e) => {
      const btn = e.target.closest('button[data-theme]'); if(!btn) return;
      const t = btn.dataset.theme; saveTheme(t); applyTheme(t); refreshThemeLabel();
    });
  }
  
  if(saveColorsBtn && primaryInput && secondaryInput){
    saveColorsBtn.addEventListener('click', () => {
      const colors = { primary: primaryInput.value, secondary: secondaryInput.value };
      saveColors(colors); applyColors(colors);
      alert('Colori salvati');
    });
  }
  
  if(resetColorsBtn && primaryInput && secondaryInput){
    resetColorsBtn.addEventListener('click', () => { 
      if(confirm('Ripristinare colori di default?')){ 
        resetColors(); 
        primaryInput.value = getComputedStyle(document.documentElement).getPropertyValue('--md-sys-color-primary').trim() || '#2b7cff'; 
        secondaryInput.value = getComputedStyle(document.documentElement).getPropertyValue('--md-sys-color-secondary').trim() || '#ff7043'; 
        alert('Colori ripristinati'); 
      } 
    });
  }
  
  // Accessibility: close settings when clicking outside
  document.addEventListener('click', (e) => {
    if(settingsMenu && settingsBtn && !settingsMenu.contains(e.target) && !settingsBtn.contains(e.target)){
      if(!settingsMenu.classList.contains('hidden')){ 
        settingsMenu.classList.add('hidden'); 
        settingsMenu.setAttribute('aria-hidden','true'); 
      }
    }
  });
  
  // listen to system theme changes when auto
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    const saved = localStorage.getItem(THEME_KEY) || 'auto'; 
    if(saved === 'auto') applyTheme('auto');
  });
  
  // Initialize theme and render
  initTheme();
  render();
  refreshThemeLabel();
}

// Run init when DOM is ready
document.addEventListener('DOMContentLoaded', init);
