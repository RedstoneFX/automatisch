import defineApp from '../../helpers/define-app';
import actions from './actions';

export default defineApp({
  name: 'Filter',
  key: 'filter',
  iconUrl: '{BASE_URL}/apps/filter/assets/favicon.svg',
  authDocUrl: '{DOCS_URL}/apps/filter/connection',
  supportsConnections: false,
  baseUrl: '',
  apiBaseUrl: '',
  primaryColor: '001F52',
  actions,
});
