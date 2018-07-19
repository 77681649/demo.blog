import baseConfig from "./config.base";
import developmentConfig from "./config.development";
import productionConfig from "./config.production";

interface MongoDBConfig {
  connectionString: string;
}

export interface Config {
  isDev: boolean;
  isProd: boolean;
  env: string;
  mongodb: MongoDBConfig;
}

export enum Environment {
  dev = "development",
  prod = "production"
}

const env: Environment = <Environment>process.env.NODE_ENV || Environment.dev;

const config: Config = Object.assign(
  {
    isDev: env !== Environment.prod,
    isProd: env === Environment.prod,
    env: env
  },
  baseConfig,
  env === Environment.prod ? productionConfig : developmentConfig
);

export default config;
