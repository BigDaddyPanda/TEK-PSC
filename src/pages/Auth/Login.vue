<template>
  <q-card flat padding>
    <!-- content -->
    <q-card-section v-if="!authStore.user">
      <h5 class="text-center text-bold">SIGN {{isLogin?"IN":"UP"}} AND ENROLL FOR TEK-PS</h5>
      <h6>{{status}}</h6>

      <div class="row q-gutter-xs justify-center">
        <q-input
          class="col-12"
          square
          outlined
          type="email"
          v-model="email"
          label="Email"
          :rules="[(val => isEmail(val) || 'Invalid Email'),val => !!val || 'Field is required']"
        />
        <q-input
          class="col-12"
          square
          outlined
          type="password"
          :rules="[val => !!val || 'Field is required']"
          v-model="password"
          label="Password"
        />
        <q-btn
          size="md"
          color="primary"
          @click="clickAuth()"
          class="col-6 q-mt-md"
          :label="isLogin? 'Login':'Register'"
        />
      </div>
      <p class="text-muted text-center">OR</p>
      <div id="my-auth" />
    </q-card-section>
    <q-card-section class="row q-gutter-xs justify-center" v-else>
      <h5
        class="text-center"
      >Greetings and welcome back, {{authStore.user.displayName||authStore.user.email}}</h5>
      <p class="col-12 text-center">Where to go next?</p>
      <q-btn
        size="md"
        color="primary"
        to="/psc/rules-desclaimer"
        class="col-6 q-mt-md"
        :label="$_.startCase('rules-desclaimer')"
      />
      <q-btn
        size="md"
        color="primary"
        to="/psc/week-activity-sheets"
        class="col-6 q-mt-md"
        :label="$_.startCase('week-activity-sheets')"
      />
      <q-btn
        size="md"
        color="primary"
        to="/psc/profile-overView"
        class="col-6 q-mt-md"
        :label="$_.startCase('profile-overView')"
      />
      <q-btn
        size="md"
        color="primary"
        to="/psc/hall-of-fame"
        class="col-6 q-mt-md"
        :label="$_.startCase('hall-of-fame')"
      />
      <q-btn class="col-6 q-mt-md" @click="signout" label="SignOut" />
    </q-card-section>
  </q-card>
</template>

<script>
import { mapActions, mapState } from "vuex";
export default {
  // name: 'cardName',
  computed: {
    ...mapState({
      authStore: "authStore"
    })
  },
  data() {
    return {
      myUser: null,
      email: "",
      password: "",
      status: ""
    };
  },
  props: {
    isLogin: Boolean
  },
  mounted() {
    var data = null;
    // Hold a reference to the anonymous current user.
    let anonyuser = this.$firebase.auth().currentUser;
    const uiConfig = {
      // signInSuccessUrl: () => this.$router.push("/calendar"),
      // autoUpgradeAnonymousUsers: true,
      signInOptions: [
        // Leave the lines as is for the providers you want to offer your users.
        // this.$firebase.auth.EmailAuthProvider.PROVIDER_ID,
        this.$firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        this.$firebase.auth.FacebookAuthProvider.PROVIDER_ID,
        this.$firebase.auth.GithubAuthProvider.PROVIDER_ID
        // this.$firebaseui.auth.AnonymousAuthProvider.PROVIDER_ID
      ],
      // tosUrl and privacyPolicyUrl accept either url string or a callback
      // function.
      // Terms of service url/callback.
      tosUrl: "https://yesno.wtf/api",
      // Privacy policy url/callback.
      privacyPolicyUrl: "https://youtube.com",
      signInFlow: "popup",
      callbacks: {
        signInSuccessWithAuthResult: (authResult, redirectUrl) => {
          // Process result. This will not trigger on merge conflicts.
          // On success redirect to signInSuccessUrl.
          this.assignUser({
            ...authResult.user
          });
          this.$q.notify({
            message: "successfully logged-in"
          });
          return true;
        },
        // signInFailure callback must be provided to handle merge conflicts which
        // occur when an existing credential is linked to an anonymous user.
        signInFailure: error => {
          console.log("error", error);

          // For merge conflicts, the error.code will be
          // 'firebaseui/anonymous-upgrade-merge-conflict'.
          if (error.code !== "firebaseui/anonymous-upgrade-merge-conflict") {
            return Promise.resolve();
          }
          // The credential the user tried to sign in with.
          var cred = error.credential;
          // If using Firebase Realtime Database. The anonymous user data has to be
          // copied to the non-anonymous user.
          var app = this.$firebase.app();
          // Save anonymous user data first.
          return app
            .database()
            .ref("users/" + this.$firebase.auth().currentUser.uid)
            .once("value")
            .then(snapshot => {
              data = snapshot.val();
              // This will trigger onAuthStateChanged listener which
              // could trigger a redirect to another page.
              // Ensure the upgrade flow is not interrupted by that callback
              // and that this is given enough time to complete before
              // redirection.
              return this.$firebase.auth().signInWithCredential(cred);
            })
            .then(user => {
              // Original Anonymous Auth instance now has the new user.
              return app
                .database()
                .ref("users/" + user.uid)
                .set(data);
            })
            .then(() => {
              // Delete anonymnous user.
              return anonyuser.delete();
            })
            .then(() => {
              // Clear data in case a new user signs in, and the state change
              // triggers.
              data = null;
              // FirebaseUI will reset and the UI cleared when this promise
              // resolves.
              // signInSuccessWithAuthResult will not run. Successful sign-in
              // logic has to be run explicitly.
              this.$router.push("/calendar");
            });
        }
      }
    };
    // Initialize the FirebaseUI Widget using Firebase.
    const ui =
      this.$firebaseui.auth.AuthUI.getInstance() ||
      new this.$firebaseui.auth.AuthUI(this.$firebase.auth());
    // The start method will wait until the DOM is loaded.
    ui.start("#my-auth", uiConfig);
  },
  methods: {
    ...mapActions({
      assignUser: "authStore/assignUser",
      classicSignUp: "authStore/signUserUp",
      classicLogin: "authStore/signUserIn"
    }),
    isEmail(val) {
      // eslint-disable-next-line no-useless-escape
      var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(val);
    },
    clickAuth() {
      console.log(this.email, this.password);
      const payload = {
        email: this.email,
        password: this.password
      };
      if (this.isLogin) {
        this.classicLogin(payload);
      } else {
        this.classicSignUp(payload);
      }
    },
    signout() {
      this.$firebase
        .auth()
        .signOut()
        .then(() => {
          // Sign-out successful.
          this.$router.push("/landing");
        })
        .catch(error => {
          // An error happened.
          this.$q.notify(error.message);
        });
    }
  }
};
</script>

<style>
</style>
