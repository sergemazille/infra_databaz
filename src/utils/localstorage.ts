import { Config, Configs } from '@/domain/Config.ts';

export const fetchConfigs = () => {
  const rawConfigs = localStorage.getItem('configs') || '[]';
  return JSON.parse(rawConfigs) as Configs;
};

export const storeConfig = (configToSave: Config) => {
  const configs = fetchConfigs();
  const existingConfigIndex = configs.findIndex(config => config?.uuid === configToSave.uuid);

  if (existingConfigIndex >= 0) {
    configs.splice(existingConfigIndex, 1, configToSave);
  } else {
    configs.push(configToSave as Config);
  }

  localStorage.setItem('configs', JSON.stringify(configs));
};

export const recoverConfigByUuid = (configUuid: string) => {
  const configs = fetchConfigs();

  return configs.find(config => config.uuid === configUuid);
};

export const unstoreConfig = (configUuid: string) => {
  const configs = fetchConfigs();
  const configIndex = configs.findIndex(config => config?.uuid === configUuid);
  configs.splice(configIndex, 1);

  localStorage.setItem('configs', JSON.stringify(configs));
};
