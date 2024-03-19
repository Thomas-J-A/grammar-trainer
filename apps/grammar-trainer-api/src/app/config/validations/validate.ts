import { InternalServerErrorException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { EnvironmentVariables } from './environment.validation';
import { HttpVariables } from './http.validation';
import { SessionVariables } from './session.validation';

/**
 * Validates the loaded environment variables.
 * @param {Record<string, unknown>} config The process.env object.
 * @returns {Record<string, unknown>} An object populated by the validated environment variables.
 */
export const validate = (config: Record<string, unknown>) => {
  // NOTE: plainToInstance method only transforms properties that are explicitly defined in the target class.
  const environmentVars = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const httpVars = plainToInstance(HttpVariables, config, {
    enableImplicitConversion: true,
  });

  const sessionVars = plainToInstance(SessionVariables, config, {
    enableImplicitConversion: true,
  });

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
  ];

  if (errors.length > 0) {
    throw new InternalServerErrorException(errors.toString());
  }

  return {
    ...environmentVars,
    ...httpVars,
    ...sessionVars,
  };
};
