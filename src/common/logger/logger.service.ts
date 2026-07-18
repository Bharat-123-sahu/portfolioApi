import { ConsoleLogger } from '@nestjs/common';
import * as fs from 'fs';
import { ILogger } from './logger.interface';

export class Logger extends ConsoleLogger {
  log(opts: ILogger, taskType?: string) {
    const displayMessage = this.customLoggerHelper(opts, taskType);
    super.log(displayMessage);
  }

  error(opts: ILogger) {
    if (opts?.error) {
      console.error(opts.error);
    }
    const displayMessage = this.customLoggerHelper(opts, 'ERROR');
    super.error(displayMessage);
  }

  verbose(opts, taskType?: string) {
    const displayMessage = this.customLoggerHelper(opts, taskType);
    super.verbose(displayMessage);
  }

  customLoggerHelper(opts: ILogger, taskType?: string) {
    if (process.env.NODE_ENV == 'LOCAL') {
      if (opts.error) {
        console.error(opts.error);
        const logStream = fs.createWriteStream('logs', { flags: 'a' });
        logStream.end(JSON.stringify(opts));
      }
    }

    let displayMessage = taskType ? 'EVENT:\n' + taskType : '';

    if (opts.endPoint) {
      displayMessage = displayMessage == '' ? '' : displayMessage + ', ';
      displayMessage += 'ROUTE:\n' + opts.endPoint;
    }

    if (opts.userData) {
      displayMessage = displayMessage == '' ? '' : displayMessage + ', ';
      // opts.userData = new LoggerUserData(opts.userData);
      displayMessage += 'USER DATA:\n' + JSON.stringify(opts.userData);
    }

    if (opts.data) {
      displayMessage = displayMessage == '' ? '' : displayMessage + ', ';
      delete opts.data.userData;
      delete opts.data.user;
      displayMessage += 'DATA:\n' + JSON.stringify(opts.data);
    }
    if (opts.error) {
      displayMessage = displayMessage == '' ? '' : displayMessage + ', ';
      displayMessage += 'Error:\n' + JSON.stringify(opts.error);
    }
    if (opts.request) {
      displayMessage = displayMessage == '' ? '' : displayMessage + ', ';
      displayMessage += 'REQUEST:\n' + JSON.stringify(opts.request);
    }

    if (opts.response) {
      displayMessage = displayMessage == '' ? '' : displayMessage + ', ';
      displayMessage += 'RESPONSE:\n' + JSON.stringify(opts.response);
    }
    displayMessage = opts.message
      ? `MESSAGE: ${opts.message}, ${displayMessage}`
      : displayMessage;
    return displayMessage;
  }
}
