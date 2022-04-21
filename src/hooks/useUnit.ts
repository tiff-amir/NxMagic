import { getVariableNumber } from '@utils/styles';

const useUnit = (() => {
  let cacheUnit = 0;
  return () => {
    if (cacheUnit) return cacheUnit;
    cacheUnit = getVariableNumber('--unit');
    return cacheUnit;
  };
})();

export default useUnit;