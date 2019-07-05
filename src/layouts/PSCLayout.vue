 <template>
  <q-layout view="hHh lpR fff">
    <!-- Be sure to play with the Layout demo on docs -->

    <!-- (Optional) The Header -->
    <q-header elevated>
      <q-toolbar class="specialheader">
        <q-img
          src="statics/brand-modern-alt-w.png"
          class="q-mr-sm"
          spinner-color="white"
          style="width:112px"
        />
        <q-btn
          stretch
          flat
          to="/psc/week-activity-overview"
          :class="'text-'+getActive('/psc/week-activity-overview')"
          label="Week Activity"
        />
        <q-btn
          stretch
          flat
          to="/psc/week-activity-lessons"
          :class="'text-'+getActive('/psc/week-activity-lessons')"
          label="Lessons"
        />
        <q-btn
          stretch
          flat
          to="/psc/week-activity-sheets"
          :class="'text-'+getActive('/psc/week-activity-sheets')"
          label="Training"
        />

        <q-space></q-space>
        <div v-if="authStore.loggedIn" class="text-right" style="flex-basis: 310px;">
          {{authStore.user.email}}
          <q-btn flat round dense>
            <q-icon name="more_vert" />
            <q-menu>
              <div class="row no-wrap q-pa-md">
                <div class="column q-pa-md content-center items-center">
                  <q-avatar size="72px" color="primary">
                    <img :src="authStore.user.photoURL||'statics/white.png'" />
                  </q-avatar>

                  <div
                    class="text-subtitle1 q-ma-md q-mb-xs"
                  >{{authStore.user.displayName||authStore.user.email}}</div>

                  <q-btn
                    color="primary"
                    class="full-width q-mb-xs"
                    label="Settings"
                    push
                    size="sm"
                    v-close-popup
                  />
                  <q-btn
                    color="primary"
                    class="full-width q-mb-xs"
                    label="About"
                    push
                    size="sm"
                    v-close-popup
                  />
                  <q-btn
                    color="negative"
                    class="full-width q-mb-xs"
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

    <!-- (Optional) The Footer -->
    <q-footer>
      <q-toolbar>
        <q-btn flat round dense icon="menu" @click="rightDrawer = !rightDrawer" />
        <q-toolbar-title>Footer</q-toolbar-title>
        <q-space />
        <q-btn
          stretch
          flat
          to="/manager/lesson"
          :class="'text-'+getActive('/manager/lesson')"
          label="Manage lesson"
        />
        <q-btn
          stretch
          flat
          to="/manager/contest"
          :class="'text-'+getActive('/manager/contest')"
          label="Manage contest"
        />
        <q-btn
          stretch
          flat
          to="/manager/sheet"
          :class="'text-'+getActive('/manager/sheet')"
          label="Manage sheet"
        />
      </q-toolbar>
    </q-footer>

    <!-- (Optional) A Drawer; you can add one more with side="right" or change this one's side -->
    <q-drawer v-model="rightDrawer" side="right" bordered content-class="bg-grey-2">
      <!-- QScrollArea is optional -->
      <q-scroll-area class="fit q-pa-sm">
        <chat-rooms />
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <!-- This is where pages get injected -->
      <router-view />
      <q-page-sticky position="bottom-right" :offset="[18, 18]">
        <q-btn
          size="md"
          round
          :icon="rightDrawer?'close':'question_answer'"
          @click="rightDrawer = !rightDrawer"
          color="accent"
        />
      </q-page-sticky>
    </q-page-container>
  </q-layout>
</template>

<script>
import ChatRooms from "../components/ChatRooms";
// import Login from "../pages/Auth/Login";
import { mapState } from "vuex";
export default {
  computed: {
    ...mapState({
      authStore: "authStore"
    })
  },
  components: {
    // Login,
    ChatRooms
  },
  methods: {
    getActive: function(e) {
      return this.$route.path.includes(e) ? "secondary" : "white";
    },
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
      rightDrawer: false,
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
