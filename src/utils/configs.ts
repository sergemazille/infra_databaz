import { Config } from '@/domain/Config';
import { v4 as uuidv4 } from 'uuid';

export const createEmptyConfig = () => {
  const uuid = uuidv4();

  return {
    uuid,
    name: 'Nouvelle config',
    serverIp: '',
    serverSshPort: '',
    serverUsername: '',
    serverPassword: '',
    sshPrivateKeyPath: '',
    dbPort: '',
    dbName: '',
    dbUsername: '',
    dbPassword: '',
  };
};

export const createFixtureConfig = (properties?: Partial<Config>): Config => {
  const uuid = uuidv4();
  const name = uuid.split('-')[0];

  return {
    uuid,
    name,
    serverIp: '0.0.0.0',
    serverSshPort: '22',
    serverUsername: 'john',
    serverPassword: 'password',
    sshPrivateKeyPath: '/home/john/.ssh/id_rsa',
    dbPort: '3306',
    dbName: 'superbase',
    dbUsername: 'db_admin',
    dbPassword: 'password',
    ...properties,
  };
};

export const refFixtureConfig = createFixtureConfig({
  uuid: '987654321',
  name: 'refConfig',
});
