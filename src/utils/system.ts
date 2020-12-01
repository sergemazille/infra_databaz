import { Config } from '@/domain/Config.ts';

const os = window.require('os');
const {
  remote,
  remote: { app },
} = window.require('electron');
const path = window.require('path');
const { NodeSSH } = window.require('node-ssh');
const ssh = new NodeSSH();

export const getUsername = () => {
  return os.userInfo().username;
};

export const browseForSshPrivateKeyPath = () => {
  const dialog = remote.dialog;
  const home = app.getPath('home');
  const defaultKeyPath = path.join(home, '.ssh');

  const [keyPath] = dialog.showOpenDialogSync({
    properties: ['openFile', 'showHiddenFiles'],
    defaultPath: defaultKeyPath,
    buttonLabel: 'Choisir',
  });

  return keyPath;
};

const connect = (config: Config) => {
  const { serverIp, serverSshPort, serverUsername, serverPassword, sshPrivateKeyPath } = config;

  return new Promise((resolve, reject) => {
    ssh
      .connect({
        host: serverIp,
        port: serverSshPort,
        username: serverUsername,
        password: serverPassword,
        privateKey: sshPrivateKeyPath,
      })
      .then(() => {
        return resolve(ssh);
      })
      .catch((error: any) => {
        return reject(error);
      });
  });
};

export const saveDb = (config: Config) => {
  connect(config)
    .then(() => {
      console.log('=== ssh.isConnected() ===>', ssh.isConnected());
    })
    .catch(console.log);
};
