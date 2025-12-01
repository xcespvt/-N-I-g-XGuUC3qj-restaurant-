import { CapacitorConfig } from '@capacitor/cli';
import dotenv from 'dotenv';

dotenv.config();

const config: CapacitorConfig = {
  appId: process.env.NEXT_PUBLIC_APP_ID || 'com.xces.partner.app',
  appName: process.env.NEXT_PUBLIC_APP_NAME || 'crevings restauranthub',
  webDir: 'out',
  server: {
    androidScheme: 'https',
    // Allow the app to send requests/navigate to your backend
    allowNavigation: [
      'backend.crevings.com', 
      '*.crevings.com' // Wildcard covers subdomains
    ]
  }
};

export default config;