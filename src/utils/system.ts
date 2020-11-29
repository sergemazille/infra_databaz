const os = window.require('os');

export const getUsername = () => {
  return os.userInfo().username;
};
