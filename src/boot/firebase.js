import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/database";
import "firebase/storage";
import * as firebaseui from "firebaseui";

import firebaseConfig from "../secrets/fire.json";
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const rtdb = firebase.database();

export default async ({ Vue }) => {
  Vue.prototype.$firebase = firebase;
  Vue.prototype.$firebaseui = firebaseui;
  Vue.prototype.$db = db;
  Vue.prototype.$rtdb = rtdb;
  Vue.prototype.$storage = firebase.storage();
};
export { firebase, db, rtdb };
