<template>
  <q-layout view="hHh lpR fff">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar class="specialheader">
        <q-toolbar-title>
          <q-img src="statics/brand-modern-alt-w.png" spinner-color="white" style="width:142px"/>
        </q-toolbar-title>

        <q-space></q-space>
        <div v-if="authStore.loggedIn" class="text-right" style="flex-basis: 310px;">
          {{authStore.user.email}}
          <q-btn flat round dense>
            <q-icon name="more_vert"/>
            <q-menu>
              <div class="row no-wrap q-pa-md">
                <div class="column">
                  <div class="text-h6 q-mb-md">Settings</div>
                  <q-toggle v-model="mobileData" label="Use Mobile Data"/>
                  <q-toggle v-model="bluetooth" label="Bluetooth"/>
                </div>

                <q-separator vertical inset class="q-mx-lg"/>

                <div class="column items-center">
                  <q-avatar size="72px" color="primary">
                    <img :src="authStore.user.photoURL||'statics/white.png'">
                  </q-avatar>

                  <div
                    class="text-subtitle1 q-mt-md q-mb-xs"
                  >{{authStore.user.displayName||authStore.user.email}}</div>

                  <q-btn
                    color="primary"
                    label="Logout"
                    @click="signout()"
                    push
                    size="sm"
                    v-close-popup
                  />
                </div>
              </div>
            </q-menu>
          </q-btn>
        </div>
        <div v-else class="row q-gutter-xs" style="flex-basis: 310px;">
          <q-btn
            class="col justify-between"
            @click="setModal('login')"
            unelevated
            style="background-color: #c4cbff29;"
          >Login</q-btn>
          <q-btn
            class="col justify-between"
            @click="setModal('register')"
            unelevated
            color="secondary"
          >Register</q-btn>
        </div>
      </q-toolbar>
    </q-header>
    <q-dialog v-model="showModal">
      <q-card>
        <q-card-section>
          <login :isLogin="isLogin"/>
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-page-container>
      <router-view/>
    </q-page-container>

    <q-footer elevated>
      <q-toolbar class="bg-primary text-white">
        <div>{{release}}</div>
        <q-space/>
        <div>ACM TEK-UP</div>
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>

<script>
import Login from "../pages/Auth/Login";
import { mapState } from "vuex";
export default {
  computed: {
    ...mapState({
      authStore: "authStore"
    })
  },
  components: {
    Login
  },
  methods: {
    setModal: function(e) {
      this.showModal = true;
      this.isLogin = e === "login";
    },
    signout() {
      this.$firebase
        .auth()
        .signOut()
        .then(() => {
          // Sign-out successful.
          this.$router.push("/landing");
          window.location.reload();
        })
        .catch(error => {
          // An error happened.
          this.$q.notify(error.message);
        });
    }
  },
  data() {
    return {
      mobileData: false,
      bluetooth: false,
      showModal: false,
      isLogin: false,
      release:
        this.$_.startCase(process.env.NODE_ENV + " release") +
        " - " +
        this.$moment().year()
    };
  }
};
</script>
