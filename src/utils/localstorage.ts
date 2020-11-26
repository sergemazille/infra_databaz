import { Config, Configs } from '@/domain/Config.ts';
import { v4 as uuid } from 'uuid';

export const fetchConfigs = () => {
  return localStorage.getItem('configs');
};

export const saveConfig = (configToSave: Config): Promise<void> => {
  return new Promise(resolve => {
    const rawConfigs = fetchConfigs() || '';
    const configs = JSON.parse(rawConfigs) as Configs;

    configToSave.uuid = uuid();
    configs.push(configToSave as Config);

    localStorage.setItem('configs', JSON.stringify(configs));
    return resolve();
  });
};

export const recoverConfig = (uuid: string): Promise<Config> => {
  return new Promise(resolve => {
    const rawConfigs = fetchConfigs() || '';
    const configs = JSON.parse(rawConfigs) as Configs;
    const config = configs.find(item => item.uuid === uuid);

    return resolve(config);
  });
};
