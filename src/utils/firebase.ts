import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: 'AIzaSyD6XR1lXXhHBZaKRIC1MjmL1YXQMWjE3NI',
  authDomain: 'cmic-diplom.firebaseapp.com',
  projectId: 'cmic-diplom',
  storageBucket: 'cmic-diplom.appspot.com',
  messagingSenderId: '391859708799',
  appId: '1:391859708799:web:1120f03f48bb760438704a',
};
const app = initializeApp(firebaseConfig);
getAuth(app);
getStorage(app);
getDatabase(app);
