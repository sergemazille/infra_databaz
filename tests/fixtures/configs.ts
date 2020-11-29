import { Config } from '@/domain/Config';
import { v4 as uuidv4 } from 'uuid';

export const createConfig = (properties?: Partial<Config>): Config => {
  const uuid = uuidv4();
  const name = uuid.split('-')[0];

  return {
    uuid,
    name,
    serverIp: '0.0.0.0',
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
