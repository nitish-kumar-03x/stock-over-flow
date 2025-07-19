(function () {
  if (!document.getElementById('toast')) {
    const toastDiv = document.createElement('div');
    toastDiv.id = 'toast';
    toastDiv.style.display = 'none';
    toastDiv.style.position = 'fixed';
    toastDiv.style.top = '32px';
    toastDiv.style.left = '50%';
    toastDiv.style.transform = 'translateX(-50%)';
    toastDiv.style.zIndex = '9999';
    toastDiv.style.background = '#ffb22c';
    toastDiv.style.color = '#854836';
    toastDiv.style.padding = '1.1rem 2.2rem';
    toastDiv.style.borderRadius = '8px';
    toastDiv.style.fontWeight = '600';
    toastDiv.style.boxShadow = '0 2px 12px rgba(133, 72, 54, 0.15)';
    toastDiv.style.fontSize = '1.1rem';
    toastDiv.style.opacity = '0';
    toastDiv.style.pointerEvents = 'none';
    toastDiv.style.transition =
      'opacity 0.4s cubic-bezier(0.4,0,0.2,1), transform 0.4s cubic-bezier(0.4,0,0.2,1)';
    toastDiv.style.transform += ' translateY(-20px)';
    toastDiv.style.backdropFilter = 'blur(8px)';
    toastDiv.style.background = 'rgba(255, 178, 44, 0.85)'; // semi-transparent
    document.body.appendChild(toastDiv);
  }

  let toastTimeout, toastHideTimeout;
  window.showToast = function (message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.style.background =
      type === 'error' ? 'rgba(211,47,47,0.92)' : 'rgba(255,178,44,0.85)';
    toast.style.color = type === 'error' ? '#fff' : '#854836';
    toast.style.display = 'block';
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-50%) translateY(-20px)';
    // Animate in
    setTimeout(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateX(-50%) translateY(0)';
    }, 10);
    if (toastTimeout) clearTimeout(toastTimeout);
    if (toastHideTimeout) clearTimeout(toastHideTimeout);
    toastTimeout = setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(-50%) translateY(-20px)';
      toastHideTimeout = setTimeout(() => {
        toast.style.display = 'none';
      }, 400);
    }, 1800);
  };
})();
