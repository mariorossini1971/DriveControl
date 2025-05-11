import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'DriveCOntrol',
  webDir: 'www',
  plugins: {
    StatusBar: {
      style: 'default',
      overlaysWebView: true
    },
    // SplashScreen: {
    //   launchShowDuration: 3000, // Tiempo en milisegundos (3 segundos)
    //   launchAutoHide: true,
    //  // backgroundColor: '#005BBB', // Color de fondo
    //   //androidScaleType: 'CENTER_CROP',
    //   androidScaleType: 'FIT_XY',
    //   iosSpinnerStyle: 'large',
    //   showSpinner: true
    // }
  }
};
export default config;
