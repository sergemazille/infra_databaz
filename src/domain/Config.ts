export interface Config {
  uuid: string;
  serverIp: string;
  username: string;
  sshPrivateKeyPath: string;
  dbPort: string;
  dbName: string;
  dbUsername: string;
  dbPassword: string;
}

export type Configs = Config[];
