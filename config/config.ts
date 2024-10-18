import { defineConfig } from '@umijs/max';
import routes from '../src/routes';

export default defineConfig({
  antd: {},
  access: {},
  model: {},
  initialState: {},
  request: {},
  layout: {
    title: 'Admin Panel',
    locale: false,
  },
  // headScripts: [{ src: '/scripts/loading.js', async: true }],
  routes: routes,
  npmClient: 'yarn',
  locale: {
    default: 'en-US',
    antd: true,
    baseNavigator: false,
  },
  esbuildMinifyIIFE: true,
});
