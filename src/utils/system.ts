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

const displaySuccessNotification = () => {
  store.dispatch('setNotification', {
    message: 'Opération terminée avec succès',
    type: NotificationType.SUCCESS,
  });
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
  try {
    await connection.exec(dumpDatabase);
  } catch (error) {
    return store.dispatch('setNotification', {
      message: `Erreur lors de la connexion à la base de données: ${error}`,
      type: NotificationType.ERROR,
    });
  }

  // download the database
  try {
    await connection.downloadFile(remoteCopyPath, destination);
  } catch (error) {
    return store.dispatch('setNotification', {
      message: `Erreur lors de la récupération de la base de données: ${error}`,
      type: NotificationType.ERROR,
    });
  }

  // remove remote dump
  const removeDump = `rm ${remoteCopyPath}`;
  try {
    await connection.exec(removeDump);
  } catch (error) {
    return store.dispatch('setNotification', {
      message: `Erreur lors du nettoyage du dump généré : ${error}`,
      type: NotificationType.ERROR,
    });
  }

  // notify
  displaySuccessNotification();
};

export const restoreDb = async (config: Config) => {
  const { dbName, dbUsername, dbPassword } = config;
  const tempCopyName = generateSqlFileNameFromDate();
  const safetyDumpName = 'safetyDump.sql';
  const remoteTempPath = '/tmp';
  const remoteSafetyDumpPath = `${remoteTempPath}/${safetyDumpName}`;
  const remoteCopyPath = `${remoteTempPath}/${tempCopyName}`;

  const connection = new Ssh(config);

  // ask for saved database destination
  const dbToRestore = browseForDbToRestore();

  if (!dbToRestore) {
    return store.dispatch('setNotification', {
      message: 'Opération annulée',
      type: NotificationType.INFO,
    });
  }

  // upload the database to restore
  try {
    await connection.uploadFile(dbToRestore[0], remoteCopyPath);
  } catch (error) {
    return store.dispatch('setNotification', {
      message: `Erreur lors de l'upload du fichier' : ${error}`,
      type: NotificationType.ERROR,
    });
  }

  // create a safety dump on remote
  const dumpDatabase = `mysqldump -u ${dbUsername} -p${dbPassword} ${dbName} > ${remoteSafetyDumpPath}`;
  try {
    await connection.exec(dumpDatabase);
  } catch (error) {
    return store.dispatch('setNotification', {
      message: `Erreur lors de la connexion à la base de données: ${error}`,
      type: NotificationType.ERROR,
    });
  }

  // retore database
  const retoreDatabase = `mysql -u ${dbUsername} -p${dbPassword} ${dbName} < ${remoteCopyPath}`;
  try {
    await connection.exec(retoreDatabase);
  } catch (error) {
    return store.dispatch('setNotification', {
      message: `Erreur lors de la restauration de la base de données: ${error}`,
      type: NotificationType.ERROR,
    });
  }

  // remove temporary remote copy
  const removeDump = `rm ${remoteCopyPath}`;
  try {
    connection.exec(removeDump);
  } catch (error) {
    return store.dispatch('setNotification', {
      message: `Erreur lors du nettoyage du fichier uploadé sur le serveur : ${error}`,
      type: NotificationType.ERROR,
    });
  }

  // notify
  displaySuccessNotification();
};

export const rollback = async (config: Config) => {
  const { dbName, dbUsername, dbPassword } = config;
  const safetyDumpName = 'safetyDump.sql';
  const remoteTempPath = '/tmp';
  const remoteSafetyDumpPath = `${remoteTempPath}/${safetyDumpName}`;

  const connection = new Ssh(config);

  // retore database with safety dump
  const retoreDatabase = `mysql -u ${dbUsername} -p${dbPassword} ${dbName} < ${remoteSafetyDumpPath}`;
  try {
    await connection.exec(retoreDatabase);
  } catch (error) {
    return store.dispatch('setNotification', {
      message: `Erreur lors du rollback de la base de données: ${error}`,
      type: NotificationType.ERROR,
    });
  }

  // notify
  displaySuccessNotification();
};
