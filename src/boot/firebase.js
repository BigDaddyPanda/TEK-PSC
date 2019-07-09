import firebase from "firebase/app";
import "firebase/firestore";
import * as firebaseui from "firebaseui";
// import { firestorePlugin } from "vuexfire";

import firebaseConfig from "../secrets/fire.json";
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

export default async ({ Vue }) => {
  Vue.prototype.$firebase = firebase;
  Vue.prototype.$firebaseui = firebaseui;
  Vue.prototype.$db = db;
};
export { firebase, db };
