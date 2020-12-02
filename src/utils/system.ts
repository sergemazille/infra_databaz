import { Config } from '@/domain/Config.ts';
import store from '@/store/index.ts';
import { Type as NotificationType } from '@/domain/Notification.ts';
import { formatedNow } from '@/utils/date.ts';

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
  const { dbName, dbUsername, dbPassword } = config;

  connect(config)
    .then(() => {
      const tempPath = app.getPath('temp');
      const dumpName = `${formatedNow()}.sql`;
      const dumpCommand = `mysqldump -u ${dbUsername} -p${dbPassword} ${dbName} > ${tempPath}/${dumpName}`;

      return ssh.execCommand(dumpCommand);
    })
    .then(() => {
      // saveFile();
    })
    .then(() => {
      // remove dump;
    })
    .then(() => {
      const notification = {
        message: 'Opération terminée avec succès',
        type: NotificationType.SUCCESS,
      };
      store.dispatch('setNotification', notification);
    })
    .catch(error => {
      const notification = {
        message: `Problème de connexion à la base de données : ${error}`,
        type: NotificationType.ERROR,
      };
      store.dispatch('setNotification', notification);
    });
};

export const restoreDb = (config: Config) => {
  connect(config)
    .then(() => {
      console.log('=== ssh.isConnected() ===>', ssh.isConnected());
    })
    .catch(error => {
      const notification = {
        message: `Problème de connexion à la base de données : ${error}`,
        type: NotificationType.ERROR,
      };
      store.dispatch('setNotification', notification);
    });
};
