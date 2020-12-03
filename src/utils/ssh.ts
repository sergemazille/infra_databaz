interface ConnectionConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  privateKey: string;
}

export class Ssh {
  checkConnection(config: ConnectionConfig) {
    config;
  }

  getFile(remoteSourcePath: string, localDestinationPath: string) {
    remoteSourcePath;
    localDestinationPath;
  }

  putFile(localSourcePath: string, remoteDestinationPath: string) {
    localSourcePath;
    remoteDestinationPath;
  }

  execCommand(command: string) {
    command;
  }
}
