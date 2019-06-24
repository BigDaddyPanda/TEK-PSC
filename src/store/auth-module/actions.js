import firebase from 'firebase/app'
export function assignUser({ commit }, payload) {
  commit('setLoading', false)
  commit('setUser', payload)
};
export function signUserUp({ commit }, payload) {
  commit('setLoading', true)
  commit('clearError')
  firebase.auth().createUserWithEmailAndPassword(payload.email, payload.password)
    .then(
      user => {
        commit('setLoading', false)
        commit('setUser', user)
      }
    )
    .catch(
      error => {
        commit('setLoading', false)
        commit('setError', error)
        console.log(error)
      }
    )
}
export function signUserIn({ commit }, payload) {
  commit('setLoading', true)
  commit('clearError')
  firebase.auth().signInWithEmailAndPassword(payload.email, payload.password)
    .then(
      user => {
        commit('setLoading', false)
        commit('setUser', user)
      }
    )
    .catch(
      error => {
        commit('setLoading', false)
        commit('setError', error)
        console.log(error)
      }
    )
}
export function clearError({ commit }) {
  commit('clearError')
}
