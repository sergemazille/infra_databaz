import { Config } from '@/domain/Config.ts';

const { NodeSSH } = window.require('node-ssh');
const ssh = new NodeSSH();

export class Ssh {
  config: Config;

  constructor(config: Config) {
    this.config = config;
  }

  public exec(command: string) {
    return ssh.connect(this.getConnectionConfig()).then(() => ssh.execCommand(command));
  }

  public downloadFile(sourcePath: string, destinationPath: string) {
    return ssh.connect(this.getConnectionConfig()).then(() => ssh.getFile(destinationPath, sourcePath));
  }

  public uploadFile(sourcePath: string, destinationPath: string) {
    return ssh.connect(this.getConnectionConfig()).then(() => ssh.putFile(sourcePath, destinationPath));
  }

  private getConnectionConfig() {
    const { serverIp, serverSshPort, serverUsername, serverPassword, sshPrivateKeyPath } = this.config;

    return {
      host: serverIp,
      port: serverSshPort,
      username: serverUsername,
      password: serverPassword,
      privateKey: sshPrivateKeyPath.toString(),
    };
  }
}
