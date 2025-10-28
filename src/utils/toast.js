// toast.js - Toast notification system for user feedback
(function(){
  let toastContainer = null;
  
  function init(){
    // Create toast container if it doesn't exist or was removed
    if(!toastContainer || !document.body.contains(toastContainer)){
      toastContainer = document.createElement('div');
      toastContainer.id = 'toast-container';
      toastContainer.className = 'toast-container';
      toastContainer.setAttribute('aria-live', 'polite');
      toastContainer.setAttribute('aria-atomic', 'true');
      document.body.appendChild(toastContainer);
    }
  }
  
  function showToast(message, type = 'info', duration = 3000){
    init();
    
    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;
    toast.setAttribute('role', 'status');
    
    const icon = getIconForType(type);
    toast.innerHTML = `
      <span class="toast-icon" aria-hidden="true">${icon}</span>
      <span class="toast-message">${escapeHtml(message)}</span>
    `;
    
    toastContainer.appendChild(toast);
    
    // Trigger animation
    setTimeout(()=> toast.classList.add('toast--visible'), 10);
    
    // Auto-remove after duration
    setTimeout(()=>{
      toast.classList.remove('toast--visible');
      setTimeout(()=> toast.remove(), 300);
    }, duration);
  }
  
  function getIconForType(type){
    const icons = {
      success: '✓',
      error: '✕',
      warning: '⚠',
      info: 'ℹ'
    };
    return icons[type] || icons.info;
  }
  
  function escapeHtml(s){
    return (s||'').replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]);
  }
  
  window.Toast = { showToast };
})();
