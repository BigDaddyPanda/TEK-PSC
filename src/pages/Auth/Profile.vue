<template>
  <div class="row justify-center">
    <q-img
      @mouseenter="showLayer=true"
      @mouseleave="showLayer=false"
      :src="userCredentials.coverPhoto||'statics/brand-modern-alt-w-b-bg.png'"
    ></q-img>
    <div style="top:-25vh;position:relative" class="fit row q-mr-xl q-ml-xl">
      <q-space />
      <q-btn
        v-if="changingData"
        @click="changingPassword=!changingPassword"
        color="secondary"
        :label="(changingPassword?'Dismiss Changing':'Change')+' Password'"
        icon="vpn_key"
      />
      <q-btn
        v-if="!changingData"
        @click="changingData=true"
        color="secondary"
        label="Edit Profile"
        icon="settings"
      />
      <q-btn v-else color="positive" @click="saveChanges" label="Save changes" />
    </div>
    <div style="top:-25vh;position:relative" class="fit row bg-grey-1 q-mx-xl q-px-xl">
      <div class="col-xs-12 col-sm-6 col-md-2 q-py-md q-pr-md">
        <q-avatar size="150px">
          <q-img :src="userCredentials.photoURL||'statics/transparent-bg.png'">
            <div v-if="changingData" class="absolute-full text-subtitle2 flex flex-center">
              <input type="file" ref="file" style="display: none" @change="uploadFile" />
              <q-btn @click="$refs.file.click()" label="upload" flat />
            </div>
          </q-img>
        </q-avatar>
      </div>
      <div class="col-xs-12 col-sm-6 col-md-10 row">
        <q-input
          :borderless="!changingData"
          class="col-md-4 col-xs-12 q-px-md"
          v-model="userCredentials.displayName"
          :readonly="!changingData"
          label="Display Name"
        />
        <q-input
          :borderless="!changingData"
          class="col-md-4 col-xs-12 q-px-md"
          v-model="userCredentials.email"
          :readonly="!changingData"
          label="Email"
        />
        <!-- <q-input
          v-if="changingData"
          class="col-6 q-px-md"
          v-model="codeforcesHandle"
          label="Display Name"
        />-->
        <q-input
          :borderless="!changingData"
          class="col-md-4 col-xs-12 q-px-md"
          v-model="codeforcesHandle"
          debounce="1000"
          @input="linkWithCodeForces"
          :readonly="!changingData"
          label="CodeForces Handler"
        />
        <q-input
          v-if="changingData&&changingPassword"
          class="col-6 q-px-md"
          v-model="password"
          label="Password"
          :rules="[ val => !!val || 'New Password is required']"
        />
        <q-input
          v-if="changingData&&changingPassword"
          class="col-6 q-px-md"
          v-model="confirmPassword"
          label="Confirm Password"
          :rules="[(val => (val===password) || 'Password do not match'),val => !!val || 'Field is required']"
        />
      </div>
    </div>
    <div
      style="top:-25vh;position:relative"
      class="fit row rounded-borders bg-grey-1 q-mx-xl q-pa-xl"
    >
      <div class="full-width text-h3">Profile</div>
      <div v-if="!userCredentials.emailVerified" class="col-12 row justify-center q-gutter-md">
        <q-btn
          @click="confirmMyEmail()"
          color="warning"
          label="Please consider Confirming your Email"
        />
      </div>
      <div v-if="changingData" class="col-12 row justify-center q-gutter-md">
        <q-btn
          label="Link With Facebook"
          color="blue-7"
          icon="fab fa-facebook-f"
          @click="authentificateWithPlatform('facebook')"
        />
        <q-btn
          label="Link With GitHub"
          color="grey-7"
          icon="fab fa-github"
          @click="authentificateWithPlatform('github')"
        />
        <q-btn
          label="Link With Google"
          color="red-7"
          icon="fab fa-google"
          @click="authentificateWithPlatform('google')"
        />
      </div>

      <div class="q-pa-md row justify-around flex flex-center full-width">
        <div class="col-4">
          <h5 class="q-my-none text-center">My Level</h5>
          <level-summuary isknob />
        </div>
        <achievement-summuary class="col-4" isknob />
      </div>
      <div class="full-width text-h3 row">
        <span>History</span>
        <q-space />
        <q-btn
          icon="refresh"
          :loading="refreshing"
          round
          size="lg"
          flat
          outline
          @click="refresh(()=>{})"
        />
      </div>
      <div class="full-width row justify-center">
        <div
          class="q-pa-md col-xs-12 col-md-9 justify-center scroll bg-grey-3"
          style="min-height:40vh"
        >
          <q-pull-to-refresh @refresh="refresh" class="full-height">
            <q-list
              v-if="!$_.isEmpty(successfullSubmissionsGetter)"
              padding
              class="rounded-borders"
            >
              <q-item
                v-for="(submission, index) in successfullSubmissionsGetter"
                :key="index"
                clickable
                @click="goTo(submission.problemLink)"
                v-ripple
              >
                <q-item-section>
                  <q-item-label
                    class="text-italic text-capitalize text-bold"
                  >{{submission.problem.name}}</q-item-label>
                  <q-item-label caption>
                    tags:
                    <q-badge
                      v-for="(tgSb,key) in submission.problem.tags"
                      :key="key"
                      :label="tgSb"
                      class="q-ml-xs"
                      color="teal-7"
                    />
                  </q-item-label>
                </q-item-section>
                <q-item-section side top>
                  <q-item-label caption>
                    <q-badge :label="submission.programmingLanguage" />
                  </q-item-label>
                  <q-item-label caption>
                    <q-icon name="check_circle" color="yellow-8" />
                    {{$moment(submission.creationTimeSeconds).fromNow()}}
                  </q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
            <div v-else class="text-center text-bold text-secondary text-h5 row">
              <span class="full-width">No recent Submissions</span>
              <span
                class="full-width disable-selection"
                v-if="!codeforcesHandle"
              >Please consider assigning your codeforces handler</span>
            </div>
          </q-pull-to-refresh>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import LevelSummuary from "components/WeekActivity/LevelSummuary";
import AchievementSummuary from "components/WeekActivity/AchievementSummuary";
import { db } from "boot/firebase";
import axios from "axios";
import nanoid from "nanoid";
import { mapGetters, mapActions } from "vuex";
export default {
  name: "ProfileEditor",
  components: {
    LevelSummuary,
    AchievementSummuary
  },
  mounted() {
    this.loadData();
    this.linkWithCodeForces();
    this.codeforcesHandle = this.progressGetter.codeforcesHandle || "";
  },
  data() {
    return {
      refreshing: false,
      showLayer: false,
      changingData: false,
      changingPassword: false,
      userCredentials: {},
      codeforcesHandle: "",
      password: "",
      confirmPassword: "",
      resp: false,
      value1: 19,
      value2: 49,
      value3: 69
    };
  },
  computed: {
    ...mapGetters({
      progressGetter: "progressStore/progressGetter",
      successfullSubmissionsGetter: "progressStore/successfullSubmissionsGetter"
    }),
    safeToSubmit() {
      return (
        ((this.changingPassword && !!this.password && !!this.confirmPassword) ||
          !this.changingPassword) &&
        (!!this.userCredentials.displayName && !!this.userCredentials.email)
      );
    }
  },
  methods: {
    ...mapActions({
      updateMySuccessfulSubmissions:
        "progressStore/updateMySuccessfulSubmissions",
      loadProgress: "progressStore/loadProgress",
      refreshUserCredentials: "authStore/refreshUserCredentials"
    }),
    uploadFile(e) {
      var user = this.$firebase.auth().currentUser;
      const file = e.target.files[0];
      this.$storage
        .ref("profiles/" + user.email + "-" + nanoid(3))
        .put(file)
        .then(response => {
          response.ref
            .getDownloadURL()
            .then(downloadURL => {
              user
                .updateProfile({
                  photoURL: downloadURL
                })
                .then(() => {
                  // Update successful.
                  this.$q.notify("Successfully updated your Profile Photo");
                  this.userCredentials.photoURL = downloadURL;
                  this.$nextTick(this.refreshUserCredentials);
                })
                .catch(error => {
                  // An error happened.
                  this.$q.notify({
                    color: "negative",
                    messag: error.toString()
                  });
                });
            })
            .catch(err => console.log(err));
        });
    },

    goTo(link) {
      window.open(link, "_blank");
    },
    refresh(done) {
      var user = this.$firebase.auth().currentUser;
      this.refreshing = true;
      let myProfile = {
        codeforcesHandle: this.codeforcesHandle,
        uid: user.uid
      };
      setTimeout(() => {
        this.updateMySuccessfulSubmissions(myProfile);
        this.refreshing = false;
        done();
      }, 1000);
    },
    saveChanges() {
      var user = this.$firebase.auth().currentUser;
      if (this.safeToSubmit) {
        if (this.changingPassword) {
          user
            .updatePassword(this.password)
            .then(() => {
              // Update successful.
              this.$q.notify("Successfully Updated Password");
            })
            .catch(error => {
              // An error happened.
              this.$q.notify({ color: "negative", message: error.toString() });
            });
        }
        if (user.email !== this.userCredentials.email) {
          user
            .updateEmail(this.userCredentials.email)
            .then(() => {
              // Update successful.
              this.$q.notify("Successfully updated your Email");
            })
            .catch(error => {
              // An error happened.
              this.$q.notify({
                color: "negative",
                messag: error.toString()
              });
            });
        }
        if (user.displayName !== this.userCredentials.displayName) {
          user
            .updateProfile({
              displayName: this.userCredentials.displayName
            })
            .then(() => {
              // Update successful.
              this.$q.notify("Successfully updated your Display Name");
            })
            .catch(error => {
              // An error happened.
              this.$q.notify({
                color: "negative",
                messag: error.toString()
              });
            });
        }
        if (this.codeforcesHandle !== this.progressGetter.codeforcesHandle) {
          db.collection("progress")
            .doc(user.uid)
            .update({
              "progress.codeforcesHandle": this.codeforcesHandle,
              "progress.userId": user.uid
            })
            .then(() => {
              let myProfile = {
                codeforcesHandle: this.codeforcesHandle,
                uid: user.uid
              };
              this.updateMySuccessfulSubmissions(myProfile);
            })
            .then(() => {
              this.loadProgress();
            });
        }
        this.$nextTick(this.refreshUserCredentials);
        this.changingData = false;
      } else {
        this.$q.notify({
          color: "warning",
          message: "Invalid entries"
        });
      }
    },
    confirmMyEmail() {
      var user = this.$firebase.auth().currentUser;

      user
        .sendEmailVerification()
        .then(() => {
          // Email sent.
          this.$q.notify("Verification email is sent");
        })
        .catch(error => {
          // An error happened.
          this.$q.notify({
            message: error.toString(),
            color: "negative"
          });
        });
    },
    isEmail(val) {
      // eslint-disable-next-line no-useless-escape
      var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(val);
    },
    loadData() {
      var user = this.$firebase.auth().currentUser;
      // https://firebase.google.com/docs/auth/web/manage-users
      if (user !== null) {
        this.userCredentials = {
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          emailVerified: user.emailVerified,
          codeforcesHandle: user.codeforcesHandle,
          providerData: user.providerData.map(profile => ({
            providerId: profile.providerID,
            Name: profile.displayName,
            Email: profile.email,
            "Photo URL": profile.photoURL
          }))
        };
      }
    },
    authentificateWithPlatform(platform) {
      var provider = new this.$firebase.auth.FacebookAuthProvider();
      switch (platform) {
        case "facebook":
          provider = new this.$firebase.auth.FacebookAuthProvider();
          break;
        case "github":
          provider = new this.$firebase.auth.GithubAuthProvider();
          break;
        case "google":
          provider = new this.$firebase.auth.GoogleAuthProvider();
          break;
        default:
          this.$q.notify({ color: "negative", message: "Error" });
          return;
      }
      // You can add additional scopes to the provider:
      provider.addScope("email");
      provider.addScope("profile");
      // Link with popup:
      this.$firebase
        .auth()
        .currentUser.linkWithPopup(provider)
        .then(
          result => {
            // The firebase.User instance:
            var user = result.user;
            // The Facebook firebase.auth.AuthCredential containing the Facebook
            // access token:
            var credential = result.credential;
            this.$firebase
              .auth()
              .currentUser.reauthenticateWithCredential(credential)
              .then(e => {
                this.$q.notify(
                  "Successfully assigned with " + this.$_.startCase(platform)
                );
              });
          },
          error => {
            // An error happened.
            this.$q.notify(error.toString());
          }
        );
    },
    linkWithCodeForces: async function() {
      if (!this.$_.isEmpty(this.codeforcesHandle)) {
        await axios
          .get(
            "https://codeforces.com/api/user.info?handles=" +
              this.codeforcesHandle
          )
          .then(r => {
            this.resp = r.data.status === "OK";
            if (this.resp) {
              this.$q.notify({
                message: "CodeForces handler matched",
                color: "positive"
              });
            }
          })
          .catch(err => {
            this.$q.notify({
              message: "error while fetching that Codeforces",
              color: "negative"
            });
            this.resp = !err;
          });
      }
    }
  }
};
</script>

<style>
.disable-selection {
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* Internet Explorer */
  -khtml-user-select: none; /* KHTML browsers (e.g. Konqueror) */
  -webkit-user-select: none; /* Chrome, Safari, and Opera */
  -webkit-touch-callout: none; /* Disable Android and iOS callouts*/
}
</style>
