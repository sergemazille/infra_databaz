import { Config } from '@/domain/Config.ts';
import store from '@/store/index.ts';
import { Type as NotificationType } from '@/domain/Notification.ts';
import { formatedNow } from '@/utils/date.ts';

const {
  remote: { app, dialog },
} = window.require('electron');
const path = window.require('path');
const { NodeSSH } = window.require('node-ssh');
const ssh = new NodeSSH();

const getUserHomePath = () => {
  return app.getPath('home');
};

export const browseForSshPrivateKeyPath = () => {
  const home = getUserHomePath();
  const defaultKeyPath = path.join(home, '.ssh');

  const keyPath = dialog.showOpenDialogSync({
    properties: ['openFile', 'showHiddenFiles'],
    defaultPath: defaultKeyPath,
    buttonLabel: 'Choisir',
  });

  return keyPath;
};

const generateSqlFileNameFromDate = () => {
  const now = formatedNow();
  return `${now}.sql`;
};

const downloadDbFile = (remoteDumpPath: string) => {
  const defaultFileName = generateSqlFileNameFromDate();
  const userHomePath = getUserHomePath();

  return new Promise((resolve, reject) => {
    dialog
      .showSaveDialog({
        title: 'Choisir où sauvegarder la base de données',
        defaultPath: path.join(userHomePath, `/${defaultFileName}`),
        buttonLabel: 'Enregistrer',
        filters: [
          {
            name: 'Fichiers SQL',
            extensions: ['sql'],
          },
        ],
      })
      .then(async (file: any) => {
        if (file.canceled) {
          return resolve();
        }

        // copy file
        await ssh.getFile(file.filePath.toString(), `${remoteDumpPath}`);
        return resolve();
      })
      .catch((error: any) => {
        store.dispatch('setNotification', {
          message: `Problème lors de la récupération de la sauvegarde : ${error}`,
          type: NotificationType.ERROR,
        });

        return reject();
      });
  });
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
        store.dispatch('setNotification', {
          message: `Problème de connexion à la base de données : ${error}`,
          type: NotificationType.ERROR,
        });

        return reject();
      });
  });
};

export const saveDb = (config: Config) => {
  const { dbName, dbUsername, dbPassword } = config;
  const dumpName = generateSqlFileNameFromDate();
  const remoteTempPath = app.getPath('temp');
  const remoteDumpPath = `${remoteTempPath}/${dumpName}`;

  connect(config)
    .then(() => {
      // create remote dump
      const dumpCommand = `mysqldump -u ${dbUsername} -p${dbPassword} ${dbName} > ${remoteDumpPath}`;

      return ssh.execCommand(dumpCommand);
    })
    .then(() => {
      // save local file
      return downloadDbFile(remoteDumpPath);
    })
    .then(() => {
      // remove remote dump
      const dumpCommand = `rm ${remoteDumpPath}`;

      return ssh.execCommand(dumpCommand);
    })
    .then(() => {
      store.dispatch('setNotification', {
        message: 'Opération terminée avec succès',
        type: NotificationType.SUCCESS,
      });
    })
    .catch(error => {
      store.dispatch('setNotification', {
        message: `Problème lors de l'opération : ${error}`,
        type: NotificationType.ERROR,
      });
    })
    .finally(() => {
      ssh.dispose();
    });
};

export const restoreDb = (config: Config) => {
  connect(config)
    .then(() => {
      console.log('=== ssh.isConnected() ===>', ssh.isConnected());
    })
    .catch(error => {
      store.dispatch('setNotification', {
        message: `Problème de connexion à la base de données : ${error}`,
        type: NotificationType.ERROR,
      });
    });
};
