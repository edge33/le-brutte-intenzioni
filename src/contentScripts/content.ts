let focusedElement: HTMLInputElement | HTMLTextAreaElement | undefined;
document.addEventListener('click', (event) => {
  const element = event.target as HTMLElement;
  if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
    focusedElement = element;
  } else {
    focusedElement = undefined;
  }
});
browser.runtime.onConnect.addListener((port) => {
  console.assert(port.name === 'connection');
  port.onMessage.addListener((msg) => {
    if (focusedElement) {
      focusedElement.value = msg as unknown as string;
    }
  });
});
