export function openLogin({ provider = 'github', onSuccess }) {
  const loginUrl = provider === 'github' ? '/auth/github' : '/auth/login';
  const popup = window.open(loginUrl, 'cloud-ide-auth', 'width=500,height=700');
  const listener = (event) => {
    if (event.data?.type === 'cloud-ide-auth') {
      onSuccess?.(event.data.user);
      window.removeEventListener('message', listener);
      popup?.close();
    }
  };
  window.addEventListener('message', listener);
  return popup;
}
