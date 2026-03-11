import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.mercapp.app',
  appName: 'MercApp',
  webDir: 'www',
  plugins: {
    Camera: {
      presentationStyle: 'fullscreen'
    }
  }
};

export default config;