const showNotification = (message, isError = false) => {
  const notification = document.createElement('div');
  notification.textContent = message;
  notification.style.position = 'fixed';
  notification.style.bottom = '20px';
  notification.style.right = '20px';
  notification.style.padding = '10px 20px';
  notification.style.background = isError ? 'rgba(255, 0, 0, 0.9)' : 'rgba(0, 123, 255, 0.9)';
  notification.style.borderRadius = '4px';
  notification.style.zIndex = '1000';
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.remove();
  }, 2000);
};

export default showNotification;