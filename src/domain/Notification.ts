export enum Type {
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}

export const displayDurationInMs = 5000;

export interface Notification {
  message: string;
  type: Type;
}
