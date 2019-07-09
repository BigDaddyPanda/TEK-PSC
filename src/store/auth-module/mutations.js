import { Notify } from "quasar";

export function setRole(state, payload) {
  state.isAdmin = payload;
}
export function setUser(state, payload) {
  state.user = payload;
  state.loggedIn = Boolean(payload);
}
export function setLoading(state, payload) {
  state.loading = payload;
}
export function setError(state, payload) {
  state.error = payload;
  Notify.create({
    message: payload
  });
}
export function clearError(state) {
  state.error = null;
}
