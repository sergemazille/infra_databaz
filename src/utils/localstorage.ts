import { Config, Configs } from '@/domain/Config.ts';
import { v4 as uuid } from 'uuid';

export const fetchConfigs = () => {
  return localStorage.getItem('configs') || '';
};

export const saveConfig = (configToSave: Config): Promise<void> => {
  return new Promise(resolve => {
    const rawConfigs = fetchConfigs();
    const configs = rawConfigs ? (JSON.parse(rawConfigs) as Configs) : ([] as Configs);

    configToSave.uuid = configToSave.uuid ?? uuid();
    configs.push(configToSave as Config);

    localStorage.setItem('configs', JSON.stringify(configs));
    return resolve();
  });
};

export const recoverConfigByUuid = (configUuid: string): Config | void => {
  if (!fetchConfigs()) {
    return;
  }

  const rawConfigs = fetchConfigs();
  const configs = JSON.parse(rawConfigs) as Configs;

  return configs.find(config => config.uuid === configUuid);
};

export const recoverConfigs = (): Promise<Configs> => {
  return new Promise(resolve => {
    const rawConfigs = fetchConfigs();
    const configs = rawConfigs ? (JSON.parse(rawConfigs) as Configs) : ([] as Configs);

    return resolve(configs);
  });
};
