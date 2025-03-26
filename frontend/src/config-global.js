import { PATH_DASHBOARD } from 'src/routes/paths';

import packageJson from '../package.json';

// ----------------------------------------------------------------------

export const CONFIG = {
  site: {
    name: 'Voicebot Business',
    serverUrl: import.meta.env.VITE_SERVER_URL ?? '',
    assetURL: import.meta.env.VITE_ASSET_URL ?? '',
    basePath: import.meta.env.VITE_BASE_PATH ?? '',
    version: packageJson.version,
    campaign: import.meta.env.VITE_CAMPAIGN ?? '',
    enableCrypto: import.meta.env.VITE_ENABLE_CRYPTO || false,
  },
  /**
   * Auth
   * @method jwt
   */
  auth: {
    method: 'jwt',
    skip: false,
    redirectPath: PATH_DASHBOARD.qaAnalysis.root,
  },
};
