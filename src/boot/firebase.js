import firebase from "firebase/app";
import "firebase/firestore";
import * as firebaseui from "firebaseui";
// import { firestorePlugin } from "vuexfire";

const firebaseConfig = {
  apiKey: "AIzaSyCgQCbDmfyugCpXtqfsqcfcXPjAbAZ-4AQ",
  authDomain: "tek-up-psc.firebaseapp.com",
  databaseURL: "https://tek-up-psc.firebaseio.com",
  projectId: "tek-up-psc",
  storageBucket: "tek-up-psc.appspot.com",
  messagingSenderId: "211256771637",
  appId: "1:211256771637:web:e26c90cd2d4b5fb1"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

export default async ({ Vue }) => {
  Vue.prototype.$firebase = firebase;
  Vue.prototype.$firebaseui = firebaseui;
  Vue.prototype.$db = db;
};
export { firebase, db };
