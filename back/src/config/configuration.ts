import { UrlGeneratorModuleOptions } from 'nestjs-url-generator';
import { readYamlEnvSync } from 'yaml-env-defaults';

export function getAppSecret(): string {
  return process.env.GUI_SECRET || '$$verylongsecretdefault9347923$#';
}

export function getAppURL(): string {
  return process.env.GUI_PUBLIC_URL || 'http://localhost:3001';
}

export function urlGeneratorModuleConfig(): UrlGeneratorModuleOptions {
  return {
    secret: getAppSecret(),
    appUrl: getAppURL(),
  };
}

export default () => {
  return readYamlEnvSync(process.env.GUI_CONFIG_FILE) as Record<string, any>;
};
