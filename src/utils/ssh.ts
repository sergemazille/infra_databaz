import { Config } from '@/domain/Config.ts';

const { NodeSSH } = window.require('node-ssh');
const ssh = new NodeSSH();

export class Ssh {
  config: Config;

  constructor(config: Config) {
    this.config = config;
  }

  public exec(command: string) {
    return new Promise((resolve, reject) => {
      ssh
        .connect(this.getConnectionConfig())
        .then(() => {
          ssh.execCommand(command);
          return resolve();
        })
        .catch((error: any) => {
          return reject(error);
        });
    });
  }

  public downloadFile(sourcePath: string, destinationPath: string) {
    return new Promise((resolve, reject) => {
      ssh
        .connect(this.getConnectionConfig())
        .then(() => {
          // ! params order is not intuitive
          ssh.getFile(destinationPath, sourcePath);
          return resolve();
        })
        .catch((error: any) => {
          return reject(error);
        });
    });
  }

  public uploadFile(sourcePath: string, destinationPath: string) {
    return new Promise((resolve, reject) => {
      ssh
        .connect(this.getConnectionConfig())
        .then(() => {
          ssh.putFile(sourcePath, destinationPath);
          return resolve();
        })
        .catch((error: any) => {
          return reject(error);
        });
    });
  }

  private validateConfig() {
    // @todo
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
