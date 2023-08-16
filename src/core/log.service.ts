import { Logger } from '@nestjs/common';

export class LogService {
  log(obj: any) {
    // Logger.log(JSON.stringify(obj, null, 2));
    Logger.log(obj);
  }
}