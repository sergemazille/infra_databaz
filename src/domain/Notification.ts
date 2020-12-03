export enum Type {
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
  INFO = 'INFO',
}

export const displayDurationInMs = 5000;

export interface Notification {
  message: string;
  type: Type;
}
