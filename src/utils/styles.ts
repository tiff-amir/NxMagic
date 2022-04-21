const style = typeof window !== 'undefined' ? getComputedStyle(document.body) : undefined;

export const getVariableValue = (name: string): string => {
  return style?.getPropertyValue(name) || '';
};

export const getVariableNumber = (name: string): number => {
  return Number((style?.getPropertyValue(name) || '0').replace('px', ''));
};
