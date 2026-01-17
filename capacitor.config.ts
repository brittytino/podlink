import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.podlink.app',
  appName: 'podlink',
  webDir: 'out',
  server: {
    androidScheme: 'https',
    allowNavigation: [
      'podlink.tinobritty.me',
      'podlink-chi.vercel.app'
    ]
    // url: 'https://your-podlink-deployment.vercel.app', // Un-comment and set your production URL here
    // cleartext: true 
  }
};

export default config;
