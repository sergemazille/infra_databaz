import { Config } from '@/domain/Config.ts';
import store from '@/store/index.ts';
import { Type as NotificationType } from '@/domain/Notification.ts';
import { formatedNow } from '@/utils/date.ts';
import { Ssh } from '@/utils/ssh.ts';

const {
  remote: { app, dialog },
} = window.require('electron');
const path = window.require('path');

const ssh = new Ssh();

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
        await ssh.getFile(remoteDumpPath, file.filePath.toString());
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

export const saveDb = (config: Config) => {
  const { dbName, dbUsername, dbPassword } = config;
  const dumpName = generateSqlFileNameFromDate();
  const remoteTempPath = app.getPath('temp');
  const remoteDumpPath = `${remoteTempPath}/${dumpName}`;

  // try connection
  // ssh.checkConnection()

  // create remote dump
  const dumpCommand = `mysqldump -u ${dbUsername} -p${dbPassword} ${dbName} > ${remoteDumpPath}`;
  return ssh.execCommand(dumpCommand);

  // save local file
  return downloadDbFile(remoteDumpPath);

  // remove remote dump
  const dumpCommand = `rm ${remoteDumpPath}`;
  return ssh.execCommand(dumpCommand);

  // success notification
  store.dispatch('setNotification', {
    message: 'Opération terminée avec succès',
    type: NotificationType.SUCCESS,
  });

  // catch error & error notification
  store.dispatch('setNotification', {
    message: `Problème lors de l'opération : ${error}`,
    type: NotificationType.ERROR,
  });
};

export const restoreDb = (config: Config) => {
  config;
};
