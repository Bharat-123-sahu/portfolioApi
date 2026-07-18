export class LoggerUserData {
  id: number;
  phone?: number;
  roleId: string;
  email?: string;

  constructor(res?: any) {
    this.id = res?.id || undefined;
    this.phone = res?.phone || undefined;
    this.roleId = res?.roleId || undefined;
    this.email = res?.email || undefined;
  }
}
export interface ILogger {
  request?: any;
  response?: any;
  data?: any;
  endPoint?: string;
  error?: any;
  userData?: any;
  message?: string;
}
