'use strict';

const joi = require('joi');

/**
 * Generate a validation schema using joi to check the type of your environment variables
 */
const envSchema = joi
  .object({
    DB_USER: joi
      .string()
      .optional()
      .empty(''),
    DB_PASSWORD: joi
      .string()
      .optional()
      .empty(''),
    DB_URI: joi.string(),
  })
  .unknown()
  .required();

/**
 * Validate the env variables using joi.validate()
 */
const { error, value: envVars } = joi.validate(process.env, envSchema);
if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const config = {
  database: {
    user: envVars.DB_USER,
    password: envVars.DB_PASSWORD,
    uri: envVars.DB_URI,
  },
};

module.exports = config;
