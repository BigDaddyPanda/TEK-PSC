<template>
  <q-card class="text-primary" style="min-width:75vw">
    <q-card-section>
      <div class="text-h6 full-width">Contest Details</div>
      <div class="row">
        <q-input
          class="col-xs-6 col-md-3 q-pa-md"
          dense
          label="Name"
          filled
          v-model="contestModel.name"
        />
        <q-input
          class="col-xs-6 col-md-3 q-pa-md"
          dense
          label="Designated Group"
          filled
          v-model="contestModel.groupName"
        />
        <my-uploader
          photoCollection="contest"
          :coverPhoto="contestModel.coverPhoto"
          @input="v=>contestModel.coverPhoto=v"
        />

        <q-space />
        <q-input
          class="col-xs-6 col-md-3 q-pa-md"
          dense
          label="Added Date"
          filled
          v-model="contestModel.addedDate"
          mask="date"
        >
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                <q-date v-model="contestModel.addedDate" @input="() => $refs.qDateProxy.hide()" />
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </div>
      <div class="row">
        <q-select
          filled
          dense
          v-model="contestModel.nature"
          :options="['Online Round','Daily Sheet','Local Contest']"
          use-chips
          label="Type"
          class="col-xs-6 col-md-3 q-pa-md"
        />
        <div
          class="col-xs-12 col-md-4 row text-center q-pa-md text-primary justify-center content-center"
        >
          <div class="flex-xs-block col-10 text-primary justify-center content-center">
            <div class="self-center" style="position:relative;top:25%">
              Contest Information to be parsed from the served link
              <div v-if="parsed_groupId&&parsed_codeForcesContestId">
                <br />Parsed Informations:
                <br />
                <span v-if="parsed_groupId">Group ID: {{parsed_groupId}}</span>
                <br />
                <span v-if="parsed_codeForcesContestId">CF ContestID: {{parsed_codeForcesContestId}}</span>
              </div>
            </div>
          </div>
        </div>

        <q-input
          v-if="parseLink"
          class="col-xs-12 col-md-5 q-pa-md"
          dense
          label="Contest Link"
          filled
          :rules="[v=>isGroupContestLink(v)||'Could not match a valid group link']"
          v-model="contestModel.link"
        />
      </div>
    </q-card-section>
    <q-separator />

    <q-card-actions>
      <q-space />
      <q-btn flat outline @click="dismiss()">Cancel</q-btn>
      <q-btn
        flat
        outline
        v-if="$_.isEmpty(contestModel.contestId)"
        class="bg-primary text-white"
        @click="save()"
      >Save</q-btn>
      <q-btn flat outline v-else @click="update()" class="bg-primary text-white">Update</q-btn>
    </q-card-actions>
  </q-card>
</template>

<script>
import MyUploader from "../Utils/MyUploader";

import defaultState from "../../store/contest-module/state";
import { mapActions } from "vuex";
export default {
  name: "ContestEditorComponent",
  props: {
    contest: {
      type: Object,
      default: () => {
        return defaultState.contestSchema;
      }
    },
    dismiss: Function
  },
  computed: {
    contestLinkToParse() {
      return this.contestModel.link;
    }
  },
  components: {
    MyUploader
  },
  watch: {
    contestLinkToParse: function(linkToParse) {
      if (linkToParse) {
        let link = this.contestModel.link.match(/group\/.+\/contest\/\w+\/?/);
        if (!link) {
          this.parsed_groupId = "";
          this.parsed_codeForcesContestId = "";
          return;
        }
        link = link[0];
        this.parsed_groupId = link.split("/")[1];
        this.parsed_codeForcesContestId = link.split("/")[3];
      }
    }
  },
  data() {
    return {
      parsed_groupId: "",
      parsed_codeForcesContestId: "",
      contestModel: this.$_.cloneDeep(this.contest),
      parseLink: true,
      linkedParsing: false,
      allContestsOption: []
    };
  },
  methods: {
    isGroupContestLink(link = "") {
      return !!link.match(/\/group\/.+\/contest\/\w+\/?/);
    },
    ...mapActions({
      saveContest: "contestStore/saveContest",
      loadContests: "contestStore/bindContestsRef",
      updateContest: "contestStore/updateContest"
    }),
    save() {
      this.saveContest(this.contestModel).then(() => {
        this.$nextTick(this.loadContests);
        this.dismiss();
      });
    },
    update() {
      this.updateContest(this.contestModel).then(() => {
        this.$nextTick(this.loadContests);
        this.dismiss();
      });
    }
  }
};
</script>

<style>
</style>
