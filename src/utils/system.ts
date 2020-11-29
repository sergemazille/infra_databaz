const os = window.require('os');
const {
  remote,
  remote: { app },
} = window.require('electron');
const path = window.require('path');

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
