<template>
  <q-layout view="hHh lpR fff">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar class="specialheader">
        <q-toolbar-title>
          <q-img src="statics/brand-modern-alt-w.png" spinner-color="white" style="width:142px"/>
        </q-toolbar-title>

        <q-space></q-space>
        <div
          v-if="authStore.loggedIn"
          class="text-right"
          style="flex-basis: 310px;"
        >{{authStore.user.email}}</div>
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
