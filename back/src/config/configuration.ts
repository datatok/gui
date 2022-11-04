import { readYamlEnvSync } from 'yaml-env-defaults';

export default () => {
  return readYamlEnvSync(process.env.GUI_CONFIG_FILE) as Record<string, any>;
};
