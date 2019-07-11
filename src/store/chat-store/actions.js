/*
export function someAction (context) {
}
*/
import { firebaseAction } from "vuexfire";

import { firebase, rtdb } from "boot/firebase";
export const bindGeneralChat = firebaseAction(({ bindFirebaseRef }) => {
  // return the promise returned by `bindFirebaseRef`
  return bindFirebaseRef("generalChat", rtdb.ref("generalChat"));
});

/**
 *
 * @param {*} context vuex context
 * @param {*} text content of the message
 */
export function sendChat(context, text) {
  const user = firebase.auth().currentUser;
  if (!user) {
    return;
  }
  let name = user.displayName || user.email;

  return rtdb.ref("generalChat").push({
    name,
    text,
    time: new Date().valueOf()
  });
}
