/* eslint-disable @typescript-eslint/naming-convention */
declare module "bun" {
  interface Env {
    PORT: number;
    DOMAIN: string;
    DB_PATH: string;
    JWT_SECRET: string;
    JWT_EXPIRATION_TIME: number;
    API_KEY: string;
  }
}

export const PORT = process.env.PORT;

export const DOMAIN = process.env.DOMAIN;

export const DB_PATH = process.env.DB_PATH;

export const JWT_SECRET = process.env.JWT_SECRET;
export const JWT_EXPIRATION_TIME = process.env.JWT_EXPIRATION_TIME; // seconds

export const API_KEY = process.env.API_KEY;
