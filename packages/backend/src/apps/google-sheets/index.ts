import defineApp from '../../helpers/define-app';
import addAuthHeader from './common/add-auth-header';
import auth from './auth';
import triggers from './triggers';
import dynamicData from './dynamic-data';

export default defineApp({
  name: 'Google Sheets',
  key: 'google-sheets',
  baseUrl: 'https://docs.google.com/spreadsheets',
  apiBaseUrl: 'https://sheets.googleapis.com',
  iconUrl: '{BASE_URL}/apps/google-sheets/assets/favicon.svg',
  authDocUrl: '{DOCS_URL}/apps/google-sheets/connection',
  primaryColor: '0F9D58',
  supportsConnections: true,
  beforeRequest: [addAuthHeader],
  auth,
  triggers,
  dynamicData,
});
