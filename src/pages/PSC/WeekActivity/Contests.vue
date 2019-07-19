<template>
  <q-page padding class="row justify-center">
    <!-- content -->
    <div style="min-width: 75vw">
      <h2>Standings for Weekly Sheets, Contests and Rounds</h2>
      <q-list>
        <q-expansion-item
          v-for="(group, index) in Object.keys(allContests)"
          :key="index"
          group="somegroup"
          icon="group"
          :label="group"
          :default-opened="index==0"
          header-class="bg-purple-9 text-white"
          expand-icon-class="text-white"
          class="items-center content-center"
        >
          <q-list class="bg-teal-2">
            <q-item
              clickable
              :class="['q-py-md',contest.name.match(/round/ig)?'bg-teal-6':'',contest.name.match(/sheet/ig)?'bg-teal-5':'',contest.name.match(/sheet/ig)?'bg-light-green-3':'']"
              v-for="contest in allContests[group]"
              :key="contest.contestId"
              :to="'/psc/contest/'+contest.contestId"
            >{{contest.name}}</q-item>
          </q-list>
        </q-expansion-item>
      </q-list>
    </div>
  </q-page>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "ContestView",
  components: {},
  computed: {
    ...mapGetters({
      allContests: "contestStore/getContestGroupList",
      isAdmin: "authStore/isAdmin"
    })
  }
};
</script>

<style>
</style>
