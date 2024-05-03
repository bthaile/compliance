import { initializeApp } from 'firebase/app';
import 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.FIREBASE_APIKEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.FIREBASE_DB_URL,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MSG_SENDER_ID,
};

const firebaseDevConfig = {
  apiKey: 'AIzaSyBAeSmGhAdCqrzRS1nE0r9v0Cohcpvud54',
  authDomain: 'dev-terravalue.firebaseapp.com',
  databaseURL: 'https://dev-terravalue.firebaseio.com',
  projectId: 'dev-terravalue',
  storageBucket: 'dev-terravalue.appspot.com',
  messagingSenderId: '945182396351',
};

const firebase = initializeApp(
  process.env.NODE_ENV === 'development' ? firebaseDevConfig : firebaseDevConfig,
);

export default firebase;
