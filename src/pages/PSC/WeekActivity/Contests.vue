<template>
  <q-page padding class="row justify-center">
    <!-- content -->
    <div style="min-width: 75vw">
      <h2>Standings for Weekly Sheets, Contests and Rounds</h2>
      <q-card v-if="ready">
        <q-tabs
          v-model="tab"
          class="text-grey"
          active-color="primary"
          indicator-color="primary"
          align="justify"
          narrow-indicator
        >
          <q-tab name="Local Contest" label="Local Contests" />
          <q-tab name="Online Round" label="Online Rounds" />
          <q-tab name="Daily Sheet" label="Daily Sheets" />
        </q-tabs>

        <q-separator />
        <q-tab-panels v-model="tab" animated>
          <q-tab-panel
            v-for="(contestType,ctindex) in ['Online Round','Daily Sheet','Local Contest']"
            :key="ctindex"
            :name="contestType"
          >
            <div class="text-h5">{{contestType}}</div>
            <div v-for="(lc,id) in $_.keys(groupedStandings[contestType])" :key="id">
              <div v-if="!$_.isEmpty(groupedStandings[contestType])" class="fit">
                <div class="text-h6" v-html="lc"></div>
                <q-list v-if="!$_.isEmpty(groupedStandings[contestType][lc])">
                  <q-item
                    clickable
                    :to="'/psc/contest/'+contest.contestId"
                    v-for="(contest, index) in groupedStandings[contestType][lc]"
                    :key="index"
                  >
                    <q-item-section>
                      <q-item-label>{{contest.name}}</q-item-label>
                      <q-item-label
                        caption
                        lines="2"
                        class="text-grey cursor-pointer"
                        @click="$goto(contest.link)"
                      >{{contest.link}}</q-item-label>
                    </q-item-section>

                    <q-item-section side top>
                      <q-item-label caption>{{contest.addedDate}}</q-item-label>
                      <q-icon name="star" color="yellow">
                        <q-tooltip>Standings are ready</q-tooltip>
                      </q-icon>
                    </q-item-section>
                  </q-item>
                </q-list>
              </div>
            </div>
          </q-tab-panel>
        </q-tab-panels>
      </q-card>
    </div>
    <q-inner-loading :showing="!ready" />
  </q-page>
</template>

<script>
import { mapGetters } from "vuex";
import _ from "lodash";
import { setTimeout } from "timers";
export default {
  name: "ContestView",
  components: {},

  methods: {
    m(contest) {
      return [
        contest.name.match(/round/gi) ? "bg-teal-1" : "",
        contest.name.match(/sheet/gi) ? "bg-teal-4" : "",
        contest.name.match(/contest/gi) ? "bg-teal-3" : ""
      ];
    }
  },
  data() {
    return {
      tab: "Local Contest",
      filterName: ""
    };
  },
  computed: {
    ...mapGetters({
      groupedStandings: "contestStore/getGroupedStandings",
      isAdmin: "authStore/isAdmin"
    }),
    ready() {
      return this.$_.every(
        this.$_.map(this.groupedStandings, o => !this.$_.isEmpty(o))
      );
    }
  }
};
</script>

<style>
</style>
