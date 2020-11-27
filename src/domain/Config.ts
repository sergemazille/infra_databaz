export interface Config {
  uuid: string;
  name: string;
  serverIp: string;
  username: string;
  sshPrivateKeyPath: string;
  dbPort: string;
  dbName: string;
  dbUsername: string;
  dbPassword: string;
}

export type Configs = Config[];
