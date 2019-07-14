<template>
  <q-item
    :class="['q-mb-md',isknob?'fit':'bg-grey-2']"
    :clickable="!isknob"
    @click="ranking_dialog=!ranking_dialog"
    :style="[isknob?'height:300px':'height:120px']"
  >
    <q-item-section v-if="!isknob" avatar>
      <q-avatar size="5vh" font-size="4vh" class="q-pa-none text-white bg-grey" icon="equalizer" />
    </q-item-section>

    <q-item-section v-if="!isknob">
      <q-item-label class="text-bold q-pb-none text-grey">{{mainProgLang.lang}} Developer</q-item-label>
      <q-item-label class="text-bold text-h6 q-pb-none text-grey">Overall Ranking</q-item-label>
    </q-item-section>

    <q-dialog v-if="!isknob" v-model="ranking_dialog" position="right">
      <q-card style="width: 500px">
        <q-card-section>
          <h5 class="q-mt-none q-mb-none">TEK-PS Ranking</h5>
          <p
            class="text-body-2 text-grey-5"
          >Your Personal progress tracking through the TEK-PS courses, training and contests</p>
        </q-card-section>
        <q-card-section class="row items-center no-wrap">
          <q-inner-loading :showing="dataReady">
            <q-spinner-gears size="50px" color="primary" />
          </q-inner-loading>
          <apexchart width="450" type="radar" :options="optionsSkill" :series="seriesSkills"></apexchart>
        </q-card-section>
      </q-card>
    </q-dialog>
    <div class="fit row items-center justify-around" v-if="isknob&&!$_.isEmpty(this.mySubmissions)">
      <div style="left:-10vh" v-if="isknob&&dataReady" class="col-xs-12 col-md-4 text-center">
        <span
          style="left:5vh!important;top:5vh!important;position:relative;"
          class="text-caption q-mb-none"
        >Your main Five Skills Focus</span>
        <apexchart
          v-if="isknob"
          width="450"
          type="radar"
          :options="optionsSkill"
          :series="seriesSkills"
        ></apexchart>
      </div>

      <div v-if="isknob&&dataReady" class="col-xs-12 col-md-4 row text-primary text-center">
        <span class="text-caption col-12 q-mb-none">Your Main Programming Language</span>
        <h3 class="col-12 q-my-md text-secondary">{{mainProgLang.lang}}</h3>
        <span class="text-caption col-12 q-mb-none">Used to solve</span>
        <number
          class="text-h3 col-12 text-secondary"
          :from="0"
          :to="mainProgLang.problems"
          :duration="2"
          easing="Power4.easeOut"
        />
        <span class="text-caption col-12 q-mb-none">Problems</span>
      </div>

      <q-inner-loading :showing="isknob&&!dataReady">
        <q-spinner-gears size="50px" color="primary" />
      </q-inner-loading>
    </div>
    <div class="fit row items-center justify-around" v-if="isknob&&$_.isEmpty(this.mySubmissions)">
      <h2 class="text-orange-4 full-width text-center">No Data could be retreived...</h2>
      <q-list dense padding class="rounded-borders">
        <q-item title class="q-pb-none">Possible Reasons:</q-item>
        <q-item v-ripple>
          <q-item-section>You forgot to link your CodeForces Handler</q-item-section>
        </q-item>

        <q-item v-ripple>
          <q-item-section>There are no recent submissions</q-item-section>
        </q-item>

        <q-item v-ripple>
          <q-item-section>Some network issues</q-item-section>
        </q-item>
      </q-list>
    </div>
  </q-item>
</template>

<script>
import _ from "lodash";
import { mapGetters } from "vuex";
export default {
  name: "RankingView",
  props: {
    isknob: { type: Boolean, default: () => false }
  },
  computed: {
    ...mapGetters({
      mySubmissions: "progressStore/successfullSubmissionsGetter"
    })
  },
  mounted() {
    this.computeMyData();
  },
  data() {
    return {
      ranking_dialog: false,
      dataReady: false,
      seriesSkills: [],
      mainProgLang: {},
      optionsSkill: {}
    };
  },
  methods: {
    duplicateProblemForTags: function(pb) {
      return pb.problem.tags.map(e => ({
        ...pb,
        problem: { ...pb.problem, tags: e }
      }));
    },
    /**
     * Now this is some DS stuff :D
     * For each submissions we create duplicated copies for the sake
     * of each data, for the sake of having the count for tags
     * in his submissions
     */
    computeMyData() {
      this.dataReady = false;
      if (_.isEmpty(this.mySubmissions)) {
        this.dataReady = true;
        return;
      }
      setTimeout(() => {
        let mainpl = _.sortBy(
          _.groupBy(this.mySubmissions, "programmingLanguage"),
          "length"
        ).reverse()[0];
        this.mainProgLang = {
          lang: mainpl[0].programmingLanguage,
          problems: mainpl.length
        };
        let bee = _.groupBy(
          _.flatMap(this.mySubmissions, this.duplicateProblemForTags),
          pb => pb.problem.tags
        );
        let fore = _.map(_.sortBy(bee, x => x.length), e => ({
          tag: e[0].problem.tags,
          freq: e.length
        }));
        let before = _.reverse(fore).slice(0, 5);
        this.optionsSkill = {
          plotOptions: {
            radar: {
              size: undefined,
              offsetX: 0,
              offsetY: 0,
              polygons: {
                strokeColors: "#e8e8e8",
                connectorColors: "#e8e8e8"
              }
            }
          },
          chart: {
            toolbar: {
              show: false
            }
          },
          responsive: [
            {
              breakpoint: 550,
              options: {
                chart: {
                  width: 350
                }
              }
            }
          ],
          labels: _.map(before, "tag")
        };
        this.seriesSkills = [
          {
            name: "Skillset",
            data: _.map(before, "freq")
          }
        ];

        this.scaleClass = false;
        // this.$refs.numberOfProblems.play();
        this.dataReady = true;
      }, 1500);
    }
  }
};
</script>

<style>
</style>
