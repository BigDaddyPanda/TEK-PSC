<template>
  <div id="q-app">
    <q-pull-to-refresh @refresh="checkFBAuthState">
      <router-view />
    </q-pull-to-refresh>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from "vuex";
import _ from "lodash";
export default {
  name: "App",
  computed: {
    ...mapState({
      authStore: "authStore",
      progressStore: "progressStore"
    })
  },
  watch: {
    progressStore: {
      handler: function(newQuestion, oldQuestion) {
        this.updateMyAchievements();
      },
      deep: true
    }
  },
  methods: {
    ...mapActions({
      assignUser: "authStore/assignUser",
      loadSheets: "sheetStore/bindSheetsRef",
      loadLessons: "lessonStore/bindLessonsRef",
      loadProgress: "progressStore/loadProgress",
      getSuccessSubmissions: "progressStore/getSuccessSubmissions",
      updateMyAchievements: "progressStore/updateMyAchievements"
    }),
    checkFBAuthState(done = null) {
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
            this.loadProgress();
            const handlePayloadl = {
              uid: user.uid,
              codeforcesHandle: "BigDaddyPanda"
            };
            this.getSuccessSubmissions(handlePayloadl);
            if (done) {
              done();
            }
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
  },
  mounted() {
    this.checkFBAuthState();
  }
};
</script>

<style>
</style>
