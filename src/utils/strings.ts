export const truncate = (str: string, length = 8): string => (str.length > length
  ? `${str.substr(0, length)}...` : str);

export const getRandom = (length = 40): string => {
  const result = [];
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i += 1) {
    result.push(characters.charAt(Math.floor(Math.random() * charactersLength)));
  }
  return result.join('');
};

export const numberToString = (val: number): string => {
  const [int, decimals] = val.toString(10).split('.');
  let result = '';
  for (let i = int.length - 1; i >= 0; i -= 1) {
    result = `${i && !(i % 3) ? ' ' : ''}${int[i]}${result}`;
  }
  return decimals ? `${result}.${decimals}` : result;
};
