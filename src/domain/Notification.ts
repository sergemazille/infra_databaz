export enum Type {
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}

export interface Notification {
  message: string;
  type: Type;
}
