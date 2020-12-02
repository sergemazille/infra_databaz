export const formatedNow = () => {
  const now = new Date();
  const date = now
    .toLocaleDateString('fr-FR')
    .split('/')
    .join('-');
  const hour = now.getHours();
  const min = now.getMinutes();
  const sec = now.getSeconds();

  return `${date}_${hour}${min}${sec}`;
};
