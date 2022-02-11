import lyric from './lyric';

export default (size: number): string => {
  let newText = '';
  const splitLyric = lyric.split(' ');
  for (let i = 0; i < size; i++) {
    newText = `${newText} ${splitLyric[i % splitLyric.length]}`;
  }
  return newText.trimStart();
};
