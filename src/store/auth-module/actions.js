import firebase from "firebase/app";
import { db } from "boot/firebase";

export function checkAdminRole({ commit }) {
  const user = firebase.auth().currentUser;
  if (user) {
    db.collection("admins")
      .doc(user.email)
      .get()
      .then(doc => {
        commit("setRole", doc.exists);
      });
  } else {
    commit("setRole", false);
  }
}
export function refreshUserCredentials({ commit }) {
  const user = firebase.auth().currentUser;
  if (user) {
    let myCred = {
      displayName: user.displayName,
      email: user.email,
      emailVerified: user.emailVerified,
      phoneNumber: user.phoneNumber,
      photoURL: user.photoURL,
      providerData: user.providerData,
      uid: user.uid
    };
    commit("setUser", myCred);
  }
}
export function assignUser({ commit }, payload) {
  commit("setLoading", false);
  commit("setUser", payload);
  checkAdminRole({ commit });
}
export function signUserUp({ commit }, payload) {
  commit("setLoading", true);
  commit("clearError");
  firebase
    .auth()
    .createUserWithEmailAndPassword(payload.email, payload.password)
    .then(user => {
      commit("setLoading", false);
      commit("setUser", user);
      checkAdminRole({ commit });
    })
    .catch(error => {
      commit("setLoading", false);
      commit("setError", error);
      // console.log(error);
    });
}
export function signUserIn({ commit }, payload) {
  commit("setLoading", true);
  commit("clearError");
  firebase
    .auth()
    .signInWithEmailAndPassword(payload.email, payload.password)
    .then(user => {
      commit("setLoading", false);
      commit("setUser", user);
      checkAdminRole({ commit });
    })
    .catch(error => {
      commit("setLoading", false);
      commit("setError", error);
      // console.log(error);
    });
}
export function clearError({ commit }) {
  commit("clearError");
}
