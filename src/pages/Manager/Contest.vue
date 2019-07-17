<template>
  <q-page class="row justify-center text-weight-regular">
    <q-list v-if="!$_.isEmpty(retrievedContests)" padding style="width:80vw">
      <h6 class="col-12 text-center">Contest Manager</h6>
      <q-item
        v-for="contest in retrievedContests"
        :key="contest.contestId"
        class="bg-grey-3 text-primary"
        clickable
      >
        <q-item-section top thumbnail class="q-pl-xs">
          <img :src="contest.coverPhoto||'statics/brand-logo.png'" />
        </q-item-section>

        <q-item-section>
          <q-item-label>
            {{contest.name}}
            <span class="text-weight-light">[{{contest.groupName}}]</span>
          </q-item-label>
          <q-item-label>
            <span class="text-weight-light">[{{contest.addedDate}}]</span>
            {{contest.author}}
          </q-item-label>
        </q-item-section>

        <q-item-section side top>
          <q-item-label>
            <q-btn
              size="sm"
              round
              class="q-mx-xs"
              icon="web"
              color="blue-8"
              @click="$goto(contest.link)"
            />
            <q-btn
              size="sm"
              round
              class="q-mx-xs"
              icon="visibility"
              color="blue-8"
              @click="$router.push('/psc/contest/' + contest.contestId)"
            />
            <q-btn
              size="sm"
              round
              class="q-mx-xs"
              icon="settings"
              color="blue-8"
              @click="edit(contest)"
            />
            <q-btn
              size="sm"
              round
              class="q-mx-xs"
              icon="delete"
              color="red-6"
              @click="setToDelete(contest)"
            />
          </q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
    <h3 v-else>
      <span>fetching data</span>
    </h3>
    <q-dialog v-model="confirmDelete" persistent>
      <q-card class="bg-negative text-white" style="width:350px">
        <q-card-section class="row items-center">
          <q-avatar icon="report_problem" text-color="white" />
          <span class="q-ml-sm">Are you sure you want to delete {{selectedContest.name}}?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn flat label="Delete" @click="assumeDelete()" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="viewContest">
      <contest-editor :contest="selectedContest" :dismiss="dismiss" />
    </q-dialog>
    <!-- <contest-editor v-if="viewContest" :contest="selectedContest" :dismiss="dismiss" /> -->
    <q-page-sticky position="bottom-left" :offset="[18, 18]">
      <q-btn round color="accent" @click="addNewContest()" icon="add" />
    </q-page-sticky>
  </q-page>
</template>

<script>
import ContestEditor from "../../components/Manager/ContestEditor";
import { mapGetters, mapActions } from "vuex";
import defaultState from "../../store/contest-module/state";

export default {
  name: "ContestManager",
  components: {
    ContestEditor
  },
  mounted() {
    this.loadContests();
  },
  computed: {
    ...mapGetters({
      retrievedContests: "contestStore/allContestsGetter"
    })
  },
  methods: {
    ...mapActions({
      loadContests: "contestStore/bindContestsRef",
      removeContest: "contestStore/removeContest"
    }),
    setToDelete: async function(contest) {
      this.selectedContest = this.$_.cloneDeep(contest);
      setTimeout(() => {
        this.confirmDelete = true;
      }, 500);
    },
    assumeDelete() {
      this.removeContest(this.selectedContest).then(() => {
        this.$nextTick(this.loadContests);
        setTimeout(() => {
          this.confirmDelete = false;
        }, 500);
      });
    },
    addNewContest() {
      this.selectedContest = defaultState.contestSchema;
      setTimeout(() => {
        this.viewContest = true;
      }, 500);
    },
    dismiss() {
      this.selectedContest = defaultState.contestSchema;
      this.viewContest = false;
    },
    edit(contest) {
      this.selectedContest = this.$_.cloneDeep(contest);
      setTimeout(() => {
        this.viewContest = true;
      }, 500);
    }
  },
  data() {
    return {
      viewContest: false,
      selectedContest: {},
      confirmDelete: false
    };
  }
};
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
