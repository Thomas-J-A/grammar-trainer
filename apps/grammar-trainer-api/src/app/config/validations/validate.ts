import { InternalServerErrorException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { EnvironmentVariables } from './environment.validation';
import { HttpVariables } from './http.validation';
import { SessionVariables } from './session.validation';
import { CacheVariables } from './cache.validation';
import { DatabaseVariables } from './database.validation';
import { MailVariables } from './mail.validation';

/**
 * Validates the loaded environment variables.
 *
 * @param {Record<string, unknown>} config - The process.env object.
 * @returns {Record<string, unknown>} An object populated by the validated environment variables.
 */
export const validate = (config: Record<string, unknown>) => {
  const environmentVars = plainToInstance(EnvironmentVariables, config, {
    excludeExtraneousValues: true, // Only use properties defined in class
    enableImplicitConversion: true, // Coerce config's string values into appropriate types
  });

  const httpVars = plainToInstance(HttpVariables, config, {
    excludeExtraneousValues: true,
    enableImplicitConversion: true,
  });

  const sessionVars = plainToInstance(SessionVariables, config, {
    excludeExtraneousValues: true,
    enableImplicitConversion: true,
  });

  const cacheVars = plainToInstance(CacheVariables, config, {
    excludeExtraneousValues: true,
    enableImplicitConversion: true,
  });

  const databaseVars = plainToInstance(DatabaseVariables, config, {
    excludeExtraneousValues: true,
    enableImplicitConversion: true,
  });

  const mailVars = plainToInstance(MailVariables, config, {
    excludeExtraneousValues: true,
    enableImplicitConversion: true,
  });

  // Validate all envs
  const errors = [
    ...validateSync(environmentVars, {
      skipMissingProperties: false,
      stopAtFirstError: true,
    }),
    ...validateSync(httpVars, {
      skipMissingProperties: false,
      stopAtFirstError: true,
    }),
    ...validateSync(sessionVars, {
      skipMissingProperties: false,
      stopAtFirstError: true,
    }),
    ...validateSync(cacheVars, {
      skipMissingProperties: false,
      stopAtFirstError: true,
    }),
    ...validateSync(databaseVars, {
      skipMissingProperties: false,
      stopAtFirstError: true,
    }),
    ...validateSync(mailVars, {
      skipMissingProperties: false,
      stopAtFirstError: true,
    }),
  ];

  if (errors.length > 0) {
    throw new InternalServerErrorException(errors.toString());
  }

  // Return a new config object with correct typings
  const allVars = {
    ...environmentVars,
    ...httpVars,
    ...sessionVars,
    ...cacheVars,
    ...databaseVars,
    ...mailVars,
  };

  return allVars;
};
