<template>
  <q-page padding>
    <div class="q-pa-lg q-gutter-lg">
      <div class="row content-start">
        <div class="col-12">
          <p
            class="text-bold text-grey-8 text-uppercase text-subtitle1 q-mb-sm q- q-pl-none"
          >CHECK OUT THIS WEEK TOPIC</p>
          <q-parallax src="statics/covers/binary - Copy.png">
            <template v-slot:content="scope">
              <div class="full-width full-height q-pa-xl">
                <br />
                <br />
                <h1 class="q-mb-sm text-secondary text-bold">Binary Search</h1>
                <q-btn color="secondary text-black" size="lg" label="Get Started" />
              </div>
            </template>
          </q-parallax>
        </div>
        <div class="q-pt-md col-xs-12 col-md-2">
          <p
            class="text-bold text-grey-8 text-uppercase text-subtitle1 q-mb-sm q- q-pl-none"
          >Progress</p>
          <q-item
            class="bg-grey-2 q-mb-md"
            clickable
            @click="level_dialog=!level_dialog"
            style="height:120px"
          >
            <q-item-section avatar>
              <q-avatar
                font-size="35px"
                rounded
                class="q-pa-none bg-green text-white"
                icon="clear_all"
              />
            </q-item-section>

            <q-item-section>
              <q-item-label class="text-green text-h6 q-pb-none q-mb-none text-green">Level 1</q-item-label>
              <q-item-label caption>
                <div style="position:relative;">
                  <q-linear-progress
                    style="height: 20px;"
                    :value="progress"
                    color="green"
                    class="q-mt-none"
                  />
                  <div class="text-white text-bold set-position">7/100</div>
                </div>
              </q-item-label>
            </q-item-section>
          </q-item>

          <q-item
            class="bg-grey-2 q-mb-md"
            clickable
            @click="achiev_dialog=!achiev_dialog"
            style="height:120px"
          >
            <q-item-section avatar>
              <q-avatar font-size="35px" class="q-pa-none bg-grey text-white" icon="done_outline" />
            </q-item-section>

            <q-item-section>
              <q-item-label class="text-bold text-h5 q-pb-none text-grey">3 / 7</q-item-label>
              <q-item-label class="text-bold text-h6 q-pb-none text-grey">Achievements</q-item-label>
            </q-item-section>
          </q-item>
          <q-item
            class="bg-grey-2 q-mb-md"
            clickable
            @click="ranking_dialog=!ranking_dialog"
            style="height:120px"
          >
            <q-item-section avatar>
              <q-avatar font-size="35px" class="q-pa-none text-white bg-grey" icon="equalizer" />
            </q-item-section>

            <q-item-section>
              <q-item-label class="text-bold text-h5 q-pb-none text-grey">10th</q-item-label>
              <q-item-label class="text-bold text-h6 q-pb-none text-grey">Overall Ranking</q-item-label>
            </q-item-section>
          </q-item>
        </div>
        <div class="q-pt-md col-xs-12 col-md-10 q-pl-lg">
          <div
            class="q-pl-md text-bold text-grey-8 text-uppercase text-subtitle1 q-mb-sm"
          >Recent Activity</div>
          <div class="row">
            <div class="col-4 q-mt-none q-pl-md">
              <activity-preview />
            </div>
            <div class="col-4 q-pl-md">
              <activity-preview />
            </div>
            <div class="col-4 q-pl-md">
              <activity-preview />
            </div>
          </div>
        </div>
      </div>
    </div>
    <q-dialog v-model="level_dialog" position="right">
      <side-level-list />
    </q-dialog>
    <q-dialog v-model="achiev_dialog" position="right">
      <side-achievement-list />
    </q-dialog>
    <q-dialog v-model="ranking_dialog" position="right">
      <side-ranking-view />
    </q-dialog>
  </q-page>
</template>

<script>
import SideLevelList from "components/WeekActivity/SideLevelList";
import SideAchievementList from "components/WeekActivity/SideAchievementList";
import SideRankingView from "components/WeekActivity/SideRankingView";
import ActivityPreview from "components/WeekActivity/ActivityPreview";
export default {
  // name: 'PageName',
  components: {
    SideLevelList,
    SideAchievementList,
    SideRankingView,
    ActivityPreview
  },
  data() {
    return {
      progress: 0.15,
      level_dialog: false,
      ranking_dialog: false,
      achiev_dialog: false
    };
  },
  methods: {}
};
</script>

<style>
</style>
