<template>
  <div class="row justify-center">
    <q-inner-loading :showing="fetchingData" />
    <q-img
      v-if="dataReady"
      @mouseenter="showLayer=true"
      @mouseleave="showLayer=false"
      :src="'statics/brand-modern-alt-w-b-bg.png'"
    ></q-img>
    <div
      v-if="dataReady&&!$_.isEmpty(profile)&&!$_.isEmpty(progress)"
      style="top:-25vh;position:relative;min-height:50vh"
      class="fit row bg-grey-1 q-mx-xl"
    >
      <div class="col-xs-12 col-md-8 q-pa-md row">
        <q-list class="rounded-borders col-6">
          <q-expansion-item
            expand-icon=" "
            expand-separator
            default-opened
            :label="`${handle} has reached level ${myLevel.level_state.id}`"
            :caption="`click for more details`"
          >
            <q-item v-ripple>
              <q-item-section avatar>
                <q-avatar>
                  <q-img :src="myLevel.level_state.icon" />
                </q-avatar>
              </q-item-section>

              <q-item-section>
                <q-item-label>
                  {{myLevel.level_state.label}}
                  <span class="text-caption">{{ myLevel.curr}}XP</span>
                </q-item-label>
                <q-item-label caption>
                  <span class="full-width row q-my-none">
                    {{myLevel.prev}}
                    <q-space />
                    {{myLevel.next}}
                  </span>
                  <q-linear-progress
                    :value="(myLevel.prev-myLevel.curr)/(myLevel.prev-myLevel.next)"
                  />
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-expansion-item>
          <q-expansion-item
            expand-icon=" "
            default-opened
            expand-separator
            label="Achievements"
            :caption="`${handle} has aquired ${$_.size(progress.achievements)} achievement(s)`"
          >
            <q-item v-for="(item, index) in progress.achievements" :key="index" clickable v-ripple>
              <q-item-section avatar>
                <q-avatar>
                  <q-img :src="item.icon" />
                </q-avatar>
              </q-item-section>

              <q-item-section>
                <q-item-label>{{item.label}}</q-item-label>
                <q-item-label caption>
                  <q-badge
                    v-for=" (qitem, qindex) in item.required"
                    :key="qindex"
                    class="q-pl-xs"
                    :label="qitem.goal+'x'+qitem.target"
                  ></q-badge>
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-expansion-item>
        </q-list>
        <div class="col-6 row justify-center text-center">
          <div class="col-12 row justify-center">
            <span class="text-h3 col-6 text-center text-secondary">{{mastery.v}} {{mastery.m}}</span>
            <span
              class="text-body-2 col-12 text-secondary"
            >Solved {{progress.mp.problems}} problems using {{mastery.v}}</span>
          </div>
          <div class="col-12 row justify-center bg-grey-2 q-pa-md">
            <span class="text-h5 col-12 text-secondary" style="height:20%">Successful Submissions</span>
            <span class="text-h4 col-6 text-secondary" style="height:20%">Personal</span>
            <span class="text-h4 col-6 text-secondary" style="height:20%">Contests</span>

            <number
              class="text-h3 col-6 text-secondary"
              :from="0"
              :to="progress.successfullSubmissions"
              :duration="2"
              easing="Power4.easeOut"
            />
            <number
              class="text-h3 col-6 text-secondary"
              :from="0"
              :to="progress.contestSubmissions"
              :duration="2"
              easing="Power4.easeOut"
            />
          </div>
        </div>
      </div>
      <div class="col-xs-12 col-md-4 q-pa-md row">
        <div class="col-12 row justify-center">
          <q-avatar size="10rem">
            <q-img :src="profile.photoURL||'statics/padded-app-icon.png'" />
          </q-avatar>
        </div>
        <div class="col-12 row text-center q-pa-lg">
          <span
            class="col-12 cursor-pointer"
            @click="$goto('http://codeforces.com/profile/'+handle)"
          >
            <q-avatar size="2rem">
              <q-img src="statics/social/codeforces.png" />
            </q-avatar>
            {{handle||'UserName'}}
          </span>
          <span class="col-12 text-h4">{{profile.displayName||'UserName'}}</span>
          <span
            class="col-12 q-my-none q-py-none"
          >Member since {{$moment(profile.creationTime).format("MMM DD YYYY")}}</span>
        </div>
      </div>
    </div>
    <h3 v-if="errorRetrieving">No Profile Associated with this Handle</h3>
  </div>
</template>

<script>
import { db } from "boot/firebase";
import levelZ from "../../utils/levels";
export default {
  name: "ProfileVisitor",
  mounted() {
    this.loadProgress();
  },
  data() {
    return {
      handle: "No CF",
      profile: {},
      progress: {},
      fetchingData: false,
      dataReady: false,
      errorRetrieving: false
    };
  },
  computed: {
    myLevel() {
      // console.log(levelZ.calculateLevel(this.progress.totalXP || 0));
      return levelZ.calculateLevel(this.progress.totalXP || 0);
    },
    mastery() {
      let v = "C";
      let m = "artisan";
      if (this.progress.mp) {
        v = this.progress.mp.lang;
        if (v.includes("GNU")) {
          v = "C++";
        }
        if (this.progress.mp.problems >= 5) {
          m = "pupil";
        }
        if (this.progress.mp.problems >= 10) {
          m = "specialist";
        }
        if (this.progress.mp.problems >= 20) {
          m = "engineer";
        }
        if (this.progress.mp.problems >= 50) {
          m = "architect";
        }
        if (this.progress.mp.problems >= 100) {
          m = "legend";
        }
      }
      return { v, m };
    }
  },
  methods: {
    async loadProgress() {
      this.fetchingData = true;
      this.dataReady = false;
      let { handle } = this.$route.params;
      this.handle = handle;
      if (handle) {
        this.profile = await this.$axios
          .get(
            // "http://localhost:5000/tek-up-psc/us-central1/fetchSomeUser?handle=" +
            "https://us-central1-tek-up-psc.cloudfunctions.net/fetchSomeUser?handle=" +
              handle
          )
          .then(r => {
            this.dataReady = true;
            return r.data;
          })
          .catch(err => {
            this.$negative("No Such account");
            this.errorRetrieving = true;
            this.dataReady = false;
            return { err };
          });
        this.progress = this.profile.progress;
        this.profile = this.profile.profile;

        this.fetchingData = false;
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
