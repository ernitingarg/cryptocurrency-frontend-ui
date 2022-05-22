import firebase from 'firebase/app';
import 'firebase/auth'; // If you need it
import 'firebase/firestore'; // If you need it

const FIREBASE_ENV = process.env.FIREBASE_ENV as 'develop' | 'production' | undefined;

const createConfig = (env: 'develop' | 'production' | undefined) => {
  switch (env) {
    case 'develop':
      return {
        apiKey: 'AIzaSyAX2ujh9F6p73muFbGIkgGOf6MXL1yVtJU',
        authDomain: 'black-stream-292507.firebaseapp.com',
        databaseURL: 'https://black-stream-292507.firebaseio.com',
        projectId: 'black-stream-292507',
        storageBucket: 'black-stream-292507.appspot.com',
        messagingSenderId: '167835541928',
        appId: '1:167835541928:web:d01aaa50f1826468787d9d',
      };
    case 'production':
      return {
        apiKey: 'AIzaSyAmlpcGu3v_NXcRXseSXaC_lZuqTAmnkg4',
        authDomain: 'soteria-production.firebaseapp.com',
        projectId: 'soteria-production',
        storageBucket: 'soteria-production.appspot.com',
        messagingSenderId: '924562074308',
        appId: '1:924562074308:web:6fe485b1b573230ab63791',
        measurementId: 'G-LQ477W4GMB',
      };
    default:
      throw new Error('invalid firebase project');
  }
};

const firebaseConfig = createConfig(FIREBASE_ENV);

const firebaseApp = !firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app();

export default firebaseApp;
