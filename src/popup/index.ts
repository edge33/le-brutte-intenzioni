import './../style.css';
import layout from './layout/layout.html';
import textarea from './components/textarea.html';
import getPlaceholderText from './utils/getPlaceholderText';

const run = async () => {
  const tabs = await browser.tabs.query({ active: true, currentWindow: true });
  const tabId = tabs[0].id as number;
  const connectionPort = chrome.tabs.connect(tabId, { name: 'connection' });
  const root = document.getElementById('root') as HTMLElement;
  root.innerHTML = layout;

  const container = document.querySelector('.container') as HTMLElement;
  container.innerHTML = textarea;

  const textAreaElement = document.querySelector('#textarea') as HTMLTextAreaElement;
  const updateTextArea = (size: number) => {
    const placeHolderText = getPlaceholderText(size);
    textAreaElement.value = placeHolderText;
    textAreaElement.scrollTop = textAreaElement.scrollHeight;
    navigator.clipboard.writeText(placeHolderText);
    if (connectionPort) {
      connectionPort.postMessage(placeHolderText);
    }
  };
  updateTextArea(59);

  const wordsLengthHandler = document.querySelector('#length') as HTMLInputElement;
  const buttons = document.querySelectorAll('.lengthButton');
  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      const value = (button as HTMLButtonElement).value;
      updateTextArea(+value);
      wordsLengthHandler.value = value;
    });
  });

  wordsLengthHandler.addEventListener('change', (event: Event) => {
    const newValue = parseInt((event.target as HTMLInputElement).value) || 10;
    updateTextArea(newValue);
  });
};

run();
