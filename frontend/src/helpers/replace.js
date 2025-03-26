export const replaceVariables = (str, arr) => {
  // TODO: refactor bellow code to quit eslint-disable
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < arr.length; i++) {
    const regex = /({{\d}})/g;
    // Reemplazar la variable con el valor correspondiente
    str = str.replace(regex, (_i) => arr[_i.replace(/{{/, '').replace(/}}/, '') - 1]);
  }

  return str;
};

export const replaceBoldText = (inStr) => inStr.replace(/\*(.*?)\*/g, '<strong>$1</strong>');

export const replaceItalicText = (inStr) => inStr.replace(/_(.*?)_/g, '<i>$1</i>');

export const replaceDeletedText = (inStr) => inStr.replace(/~(.*?)~/g, '<del>$1</del>');
