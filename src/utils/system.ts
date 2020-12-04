import { Config } from '@/domain/Config.ts';
import { Type as NotificationType } from '@/domain/Notification.ts';
import { Ssh } from '@/utils/ssh.ts';
import { formatedNow } from '@/utils/date.ts';
import store from '@/store/index.ts';

const {
  remote: { app, dialog },
} = window.require('electron');
const path = window.require('path');

const userHomePath = app.getPath('home');

const generateSqlFileNameFromDate = () => {
  const now = formatedNow();
  return `${now}.sql`;
};

export const browseForSshPrivateKey = () => {
  const defaultPath = path.join(userHomePath, '.ssh');

  const keyPath = dialog.showOpenDialogSync({
    properties: ['openFile', 'showHiddenFiles'],
    defaultPath,
    buttonLabel: 'Choisir',
  });

  return keyPath;
};

export const browseForDbDestination = () => {
  const defaultPath = path.join(userHomePath, generateSqlFileNameFromDate());

  const savePath = dialog.showSaveDialogSync({
    title: 'Choisir où sauvegarder la base de données',
    defaultPath,
    buttonLabel: 'Enregistrer',
    filters: [
      {
        name: 'Fichiers SQL',
        extensions: ['sql'],
      },
    ],
  });

  return savePath;
};

export const browseForDbToRestore = () => {
  const dbToRestorePath = dialog.showOpenDialogSync({
    title: 'Choisir la base de données à restaurer',
    defaultPath: userHomePath,
    buttonLabel: 'Choisir',
  });

  return dbToRestorePath;
};

export const saveDb = async (config: Config) => {
  const { dbName, dbUsername, dbPassword } = config;
  const dumpName = generateSqlFileNameFromDate();
  const remoteTempPath = '/tmp';
  const remoteCopyPath = `${remoteTempPath}/${dumpName}`;

  const connection = new Ssh(config);
  if (!connection) {
    store.dispatch('setNotification', {
      message: `Problème de connexion à la base de données`,
      type: NotificationType.ERROR,
    });
    return;
  }

  // ask for saved database destination
  const destination = browseForDbDestination();

  if (!destination) {
    return store.dispatch('setNotification', {
      message: 'Opération annulée',
      type: NotificationType.INFO,
    });
  }

  // create a dump on remote
  const dumpDatabase = `mysqldump -u ${dbUsername} -p${dbPassword} ${dbName} > ${remoteCopyPath}`;
  await connection.exec(dumpDatabase);

  // download the database
  await connection.downloadFile(remoteCopyPath, destination);

  // remove remote dump
  const removeDump = `rm ${remoteCopyPath}`;
  connection.exec(removeDump);

  // success notification
  store.dispatch('setNotification', {
    message: 'Opération terminée avec succès',
    type: NotificationType.SUCCESS,
  });
};

export const restoreDb = async (config: Config) => {
  const { dbName, dbUsername, dbPassword } = config;
  const tempCopyName = generateSqlFileNameFromDate();
  const safetyDumpName = 'safetyDump.sql';
  const remoteTempPath = '/tmp';
  const remoteSafetyDumpPath = `${remoteTempPath}/${safetyDumpName}`;
  const remoteCopyPath = `${remoteTempPath}/${tempCopyName}`;

  const connection = new Ssh(config);
  if (!connection) {
    store.dispatch('setNotification', {
      message: `Problème de connexion à la base de données`,
      type: NotificationType.ERROR,
    });
    return;
  }

  // ask for saved database destination
  const dbToRestore = browseForDbToRestore();

  if (!dbToRestore) {
    return store.dispatch('setNotification', {
      message: 'Opération annulée',
      type: NotificationType.INFO,
    });
  }

  // upload the database to restore
  await connection.uploadFile(dbToRestore[0], remoteCopyPath);

  // create a safety dump on remote
  const dumpDatabase = `mysqldump -u ${dbUsername} -p${dbPassword} ${dbName} > ${remoteSafetyDumpPath}`;
  await connection.exec(dumpDatabase);

  // retore database
  const retoreDatabase = `mysql -u ${dbUsername} -p${dbPassword} ${dbName} < ${remoteCopyPath}`;
  await connection.exec(retoreDatabase);

  // remove temporary remote copy
  const removeDump = `rm ${remoteCopyPath}`;
  connection.exec(removeDump);

  // success notification
  store.dispatch('setNotification', {
    message: 'Opération terminée avec succès',
    type: NotificationType.SUCCESS,
  });
};
