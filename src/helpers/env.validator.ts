import * as Joi from 'joi';

export const envVarsSchema = Joi.object({
  NODE_VERSION: Joi.string().required(),

  PORT: Joi.number().default(6000),

  JWT_SECRET: Joi.string().required(),

  DB_HOST: Joi.string().required(),
  DB_USER: Joi.string().required(),
  DB_NAME: Joi.string().required(),

  // REDIS_HOST: Joi.string().required(),
  // REDIS_PORT: Joi.number().required(),
  // REDIS_USERNAME: Joi.string().optional(),
  // REDIS_PASSWORD: Joi.string().optional(),

  // DEV_MODE: Joi.boolean().optional().default(true),
});
