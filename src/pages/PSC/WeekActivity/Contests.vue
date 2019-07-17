<template>
  <q-page padding class="row justify-center">
    <!-- content -->
    <div v-if="isAdmin" style="min-width: 75vw">
      <h2>Standings for Weekly Round</h2>
      <q-list>
        <q-expansion-item
          v-for="(group, index) in Object.keys(allContests)"
          :key="index"
          group="somegroup"
          icon="group"
          :label="group"
          header-class="bg-teal text-white"
          expand-icon-class="text-white"
          class="items-center content-center"
        >
          <q-list class="bg-teal-2">
            <q-item
              clickable
              class="q-py-md"
              v-for="contest in allContests[group]"
              :key="contest.contestId"
              :to="'/psc/contest/'+contest.contestId"
            >{{contest.name}}</q-item>
          </q-list>
        </q-expansion-item>
      </q-list>
    </div>
    <div v-else>
      <maintenance />
    </div>
  </q-page>
</template>

<script>
import Maintenance from "../../Maintenance";
import { mapGetters } from "vuex";
export default {
  name: "ContestView",
  components: {
    Maintenance
  },
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
