<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from "vuex";
export default {
  name: "App",
  computed: {
    ...mapState({
      authStore: "authStore"
    })
  },
  methods: {
    ...mapActions({
      assignUser: "authStore/assignUser",
      loadSheets: "sheetStore/bindSheetsRef",
      loadLessons: "lessonStore/bindLessonsRef",
      getSuccessSubmissions: "progressStore/getSuccessSubmissions"
    })
  },
  mounted() {
    this.$firebase.auth().onAuthStateChanged(
      user => {
        if (user) {
          this.assignUser({
            displayName: user.displayName,
            email: user.email,
            emailVerified: user.emailVerified,
            photoURL: user.photoURL,
            uid: user.uid,
            phoneNumber: user.phoneNumber,
            providerData: user.providerData
          });
          if (this.$route.path.includes("landing") && this.authStore.user) {
            this.$router.push("/psc");
            this.$q.notify({
              message: `Welcome Back ${user.displayName || user.email}`
            });
          }
          this.loadLessons();
          this.loadSheets();
          const handlePayloadl = {
            uid: user.uid,
            codeforcesHandler: "BigDaddyPanda"
          };
          this.getSuccessSubmissions(handlePayloadl);
        } else {
          // User is signed out.
          this.assignUser(null);
          this.$q.notify({
            message: `Welcome to TEK-PS`
          });
        }
      },
      error => {
        console.log(error);
        this.$q.notify({ message: "Error Retrieving data" });
      }
    );
  }
};
</script>

<style>
</style>
