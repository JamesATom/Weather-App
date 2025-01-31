import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class UserLogger extends Logger {
    error(message: string, trace: string) {
        super.error(message, trace);
    }

    warn(message: string) {
        super.warn(message);
    }

    log(message: string) {
        super.log(message);
    }
}