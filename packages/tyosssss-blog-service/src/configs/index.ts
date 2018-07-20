import baseConfig from "./config.base";
import developmentConfig from "./config.development";
import productionConfig from "./config.production";
import { blog } from "../../typings/tyosssss-blog";
 
type Environment = blog.common.Environment
const {
  dev,
  prod
} = blog.common.Environment

const env: Environment = <Environment>process.env.NODE_ENV || dev;

const config: blog.config.Config = Object.assign(
  {
    isDev: env !== prod,
    isProd: env === prod,
    env: env
  },
  baseConfig,
  env === prod ? productionConfig : developmentConfig
);

export default config;
