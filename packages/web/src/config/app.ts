type Config = {
  [key: string]: string;
};

const config: Config = {
  env: process.env.NODE_ENV as string,
  baseUrl: process.env.REACT_APP_BASE_URL as string,
  graphqlUrl: process.env.REACT_APP_GRAPHQL_URL as string,
  notificationsUrl: process.env.REACT_APP_NOTIFICATIONS_URL as string,
  docsUrl: process.env.REACT_APP_DOCS_URL as string,
  chatwootBaseUrl: 'https://app.chatwoot.com',
  supportEmailAddress: 'support@automatisch.io'
};

export default config;
