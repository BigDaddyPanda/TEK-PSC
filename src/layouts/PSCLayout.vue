 <template>
  <q-layout :view="isAdmin?'hHh lpR fFf':'hHh lpR fff'">
    <!-- Be sure to play with the Layout demo on docs -->

    <!-- (Optional) The Header -->
    <q-header elevated>
      <q-toolbar class="specialheader">
        <q-btn stretch class="q-mr-sm gt-xs inline" flat to="/landing">
          <q-img src="statics/brand-modern-alt-w.png" spinner-color="white" style="width:112px" />
        </q-btn>
        <q-btn round class="q-mr-sm lt-sm inline" flat to="/landing">
          <q-avatar size="42px">
            <q-img src="statics/white.png" spinner-color="white" />
          </q-avatar>
        </q-btn>
        <q-btn class="lt-md" flat>
          <q-icon name="book" />
          <q-menu>
            <div class="fit row">
              <q-btn
                v-if="authStore.loggedIn"
                stretch
                flat
                to="/psc/week-activity-overview"
                :class="'col-12 bg-primary text-'+getActive('/psc/week-activity-overview')"
                label="Week Activity"
              />
              <q-btn
                v-if="authStore.loggedIn"
                stretch
                flat
                to="/psc/week-activity-lessons"
                :class="'col-12 bg-primary text-'+getActive('/psc/week-activity-lessons')"
                label="Lessons"
              />
            </div>
          </q-menu>
        </q-btn>
        <q-btn class="lt-md" flat>
          <q-icon name="table_chart" />
          <q-menu class="q-pa-md">
            <div class="fit row">
              <q-btn
                v-if="authStore.loggedIn"
                stretch
                flat
                to="/psc/week-activity-sheets"
                :class="'col-12 bg-primary text-'+getActive('/psc/week-activity-sheets')"
                label="Training"
              />
              <q-btn
                v-if="authStore.loggedIn"
                stretch
                flat
                to="/psc/contests"
                :class="'col-12 bg-primary text-'+getActive('/psc/contests')"
                label="Standings"
              />
            </div>
          </q-menu>
        </q-btn>

        <q-btn
          v-if="authStore.loggedIn"
          stretch
          flat
          to="/psc/week-activity-overview"
          :class="'gt-sm text-'+getActive('/psc/week-activity-overview')"
          label="Week Activity"
        />
        <q-btn
          v-if="authStore.loggedIn"
          stretch
          flat
          to="/psc/week-activity-lessons"
          :class="'gt-sm text-'+getActive('/psc/week-activity-lessons')"
          label="Lessons"
        />
        <q-btn
          v-if="authStore.loggedIn"
          stretch
          flat
          to="/psc/week-activity-sheets"
          :class="'gt-sm text-'+getActive('/psc/week-activity-sheets')"
          label="Training"
        />
        <q-btn
          v-if="authStore.loggedIn"
          stretch
          flat
          to="/psc/contests"
          :class="'gt-sm text-'+getActive('/psc/contests')"
          label="Standings"
        />

        <q-space></q-space>
        <div v-if="authStore.loggedIn" class="text-right" style="flex-basis: 310px;">
          <q-btn
            flat
            :label="authStore.user.displayName||authStore.user.email"
            push
            to="/psc/profile"
            class="gt-sm inline"
          />
          <q-btn flat round dense>
            <q-icon name="more_vert" />
            <q-menu>
              <div class="row no-wrap q-pa-md">
                <div class="column q-pa-md content-center items-center">
                  <q-avatar size="72px" color="primary">
                    <img :src="authStore.user.photoURL||'statics/white.png'" />
                  </q-avatar>

                  <div
                    class="text-subtitle1 justify-center text-center q-ma-md q-mb-none"
                  >{{authStore.user.displayName||authStore.user.email}}</div>

                  <q-btn
                    color="primary"
                    class="full-width q-mb-xs"
                    label="Profile"
                    push
                    to="/psc/profile"
                    size="sm"
                    v-close-popup
                  />
                  <q-btn
                    color="primary"
                    class="full-width q-mb-xs"
                    label="About"
                    to="/about-us"
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
          <q-btn to="/about-us" icon="info" round flat style="background-color: #c4cbff29;"></q-btn>
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
        <!-- <q-btn flat round dense icon="menu" @click="rightDrawer = !rightDrawer" /> -->
        <q-toolbar-title class="text-caption text-weight-light no-wrap">&#0169;TEK-UP</q-toolbar-title>
        <q-space />
        <template v-if="isAdmin">
          <q-btn
            stretch
            flat
            to="/manager/profile"
            :class="'text-'+getActive('/manager/profile')"
            :label="$q.screen.lt.md?'':'Manage profile'"
            :icon="$q.screen.lt.md?'group':''"
          />
          <q-btn
            stretch
            flat
            to="/manager/lesson"
            :class="'text-'+getActive('/manager/lesson')"
            :label="$q.screen.lt.md?'':'Manage lesson'"
            :icon="$q.screen.lt.md?'school':''"
          />
          <q-btn
            stretch
            flat
            to="/manager/contest"
            :class="'text-'+getActive('/manager/contest')"
            :label="$q.screen.lt.md?'':'Manage contest'"
            :icon="$q.screen.lt.md?'whatshot':''"
          />
          <q-btn
            stretch
            flat
            to="/manager/sheet"
            :class="'text-'+getActive('/manager/sheet')"
            :label="$q.screen.lt.md?'':'Manage sheet'"
            :icon="$q.screen.lt.md?'ballot':''"
          />
        </template>
      </q-toolbar>
    </q-footer>

    <!-- (Optional) A Drawer; you can add one more with side="right" or change this one's side -->
    <q-drawer v-model="rightDrawer" side="right" bordered content-class="bg-grey-2">
      <!-- QScrollArea is optional -->
      <q-scroll-area class="fit q-pa-sm">
        <chat-rooms />
      </q-scroll-area>
    </q-drawer>

    <q-dialog v-model="showModal">
      <q-card>
        <q-card-section>
          <login :isLogin="isLogin" />
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-page-container>
      <!-- This is where pages get injected -->
      <router-view />
      <q-page-sticky v-if="authStore.loggedIn" position="bottom-right" :offset="[18, 18]">
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
import Login from "../pages/Auth/Login";
import { mapState, mapGetters } from "vuex";
export default {
  computed: {
    ...mapState({
      authStore: "authStore"
    }),
    ...mapGetters({
      isAdmin: "authStore/isAdmin"
    })
  },
  components: {
    Login,
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
