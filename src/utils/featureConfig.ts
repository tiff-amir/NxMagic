import featureConfig from 'featureConfig.json';

export const feature = (featureName: string): boolean => featureConfig[featureName];
