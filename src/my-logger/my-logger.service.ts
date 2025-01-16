import { Injectable, ConsoleLogger } from '@nestjs/common';
import { PrismaClientValidationError } from '@prisma/client/runtime/library';
import { promises as fsPromises, existsSync } from 'fs';
import * as path from 'path';

@Injectable()
// export class MyLoggerService extends ConsoleLogger {
//   async logToFile(entry: string, ip?: string) {
//     const formattedEntry = `${Intl.DateTimeFormat('en-Us', {
//       dateStyle: 'short',
//       timeStyle: 'short',
//       timeZone: 'Africa/Nairobi',
//     }).format(new Date())} - IP: ${ip || 'unknown'} - ${entry}\n`;

//     try {
//       if (!existsSync(path.join(__dirname, '..', '..', 'logs'))) {
//         await fsPromises.mkdir(path.join(__dirname, '..', '..', 'logs'));
//       }
//       await fsPromises.appendFile(
//         path.join(__dirname, '..', '..', 'logs', 'myLogFile.log'),
//         formattedEntry,
//       );
//     } catch (e) {
//       if (e instanceof Error) console.error(e.message);
//     }
//   }

//   log(message: string, context?: string, ip?: string) {
//     const entry = context ? `${context} \t${message}` : message;
//     this.logToFile(entry, ip);
//     super.log(message, context);
//   }

//   // error(message: string, stackOrContext?: string, ip?: string) {
//   //   const entry = stackOrContext ? `${stackOrContext} \t${message}` : message;
//   //   this.logToFile(entry, ip);
//   //   super.error(message, stackOrContext);
//   // }
//   // error(
//   //   message: string | Error | PrismaClientValidationError,
//   //   context?: string,
//   //   ip?: string,
//   // ) {
//   //   const errorMessage = message instanceof Error ? message.message : message;
//   //   const entry = `${context ? `[${context}] ` : ''}${errorMessage}`;
//   //   this.logToFile(entry, ip);
//   //   super.error(errorMessage, context);
//   // }

//   warn(message: string, context?: string, ip?: string) {
//     const entry = context ? `${context} \t${message}` : message;
//     this.logToFile(entry, ip);
//     super.warn(message, context);
//   }
// }
export class MyLoggerService extends ConsoleLogger {
  async logToFile(entry: string, ip?: string) {
    const formattedEntry = `${Intl.DateTimeFormat('en-US', {
      dateStyle: 'short',
      timeStyle: 'short',
      timeZone: 'Africa/Nairobi',
    }).format(new Date())} - IP: ${ip || 'unknown'} - ${entry}\n`;

    try {
      const logsPath = path.join(__dirname, '..', '..', 'logs');
      if (!existsSync(logsPath)) {
        await fsPromises.mkdir(logsPath);
      }
      await fsPromises.appendFile(
        path.join(logsPath, 'myLogFile.log'),
        formattedEntry,
      );
    } catch (e) {
      if (e instanceof Error) console.error(e.message);
    }
  }
  error(
    message: string | Error | PrismaClientValidationError,
    context?: string,
    ip?: string,
  ) {
    const errorMessage = message instanceof Error ? message.message : message;
    const entry = `${context ? `[${context}] ` : ''}${errorMessage}`;
    this.logToFile(entry, ip);
    super.error(errorMessage, context);
  }

  log(message: string, context?: string, ip?: string) {
    const entry = `${context ? `[${context}] ` : ''}${message}`;
    this.logToFile(entry, ip);
    super.log(message, context);
  }
  warn(message: string, context?: string, ip?: string) {
    const entry = context ? `${context} \t${message}` : message;
    this.logToFile(entry, ip);
    super.warn(message, context);
  }
}
