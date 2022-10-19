import { readFileSync } from 'fs';
import * as yaml from 'js-yaml';

export default () => {
  return yaml.load(readFileSync(process.env.GUI_CONFIG_FILE, 'utf8')) as Record<
    string,
    any
  >;
};
