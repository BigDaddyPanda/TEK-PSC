<template>
  <div class="fit">
    <div class="row">
      <div class="q-pa-md fit row">
        <div class="q-pa-md col-12">Sheet Details</div>
        <q-input
          dense
          class="col-xs-12 col-md-6 q-pl-xs q-pr-xs"
          filled
          v-model="sheetModel.name"
          label="Name"
          lazy-rules
          :rules="[ val => val && val.length > 0 || 'Please type something']"
        />
        <q-input
          dense
          class="col-xs-12 col-md-6 q-pl-xs q-pr-xs"
          filled
          v-model="sheetModel.description"
          label="Description"
          lazy-rules
          :rules="[ val => val && val.length > 0 || 'Please type something']"
        />
        <q-input
          dense
          class="col-xs-12 col-md-6 q-pl-xs q-pr-xs"
          filled
          v-model="sheetModel.author"
          label="Author"
          lazy-rules
          :rules="[ val => val && val.length > 0 || 'Please type something']"
        />

        <q-input
          dense
          class="col-xs-12 col-md-6 q-pl-xs q-pr-xs"
          filled
          v-model="sheetModel.level"
          label="Level"
          lazy-rules
          :rules="[ val => val && val.length > 0 || 'Please type something']"
        />
        <q-input
          class="col-xs-12 col-md-6 q-pl-xs q-pr-xs"
          dense
          label="Added Date"
          filled
          v-model="sheetModel.addedDate"
          mask="date"
          :rules="[ val => val && val.length > 0 || 'Please type something']"
        >
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                <q-date v-model="sheetModel.addedDate" @input="() => $refs.qDateProxy.hide()" />
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>

        <q-select
          filled
          dense
          v-model="sheetModel.tags"
          multiple
          :options="tags"
          use-chips
          label="Sheet Tags"
          class="col-xs-12 col-md-6 q-pl-xs q-pr-xs q-mb-lg"
        />
        <q-input
          dense
          class="col-xs-12 col-md-6 q-pl-xs q-pr-xs"
          filled
          v-model="sheetModel.coverPhoto"
          label="Cover Photo"
          lazy-rules
          :rules="[ val => val && val.length > 0 || 'Please type something']"
        />

        <q-input
          v-if="sheetModel.fromCodeForces"
          dense
          class="col-xs-12 col-md-6 q-pl-xs q-pr-xs"
          filled
          v-model="sheetModel.link"
          label="Link"
          lazy-rules
          :rules="[ val => val && val.length > 0 || 'Please type something']"
        />
        <q-toggle
          v-model="sheetModel.fromCodeForces"
          class="full-width"
          :label="sheetModel.fromCodeForces?'Sheet hosted at CodeForces':'Sheet Problems On the Plateform'"
        />
        <div v-if="!sheetModel.fromCodeForces" class="col-12">
          <q-list dense bordered separator>
            <q-item v-ripple>
              <q-item-section>
                <q-input
                  dense
                  v-model="newProblemLink"
                  label="Problem link"
                  hint="Press enter to add it"
                  @keyup.enter="addNewProblem()"
                />
              </q-item-section>
            </q-item>
            <q-item v-for="(problemLink, i) in sheetModel.includedProblems" :key="i" v-ripple>
              <q-item-section>{{problemLink}}</q-item-section>
              <q-item-section side>
                <q-btn
                  color="blue"
                  round
                  dense
                  size="sm"
                  icon="delete"
                  @click="sheetModel.includedProblems.splice(i,1)"
                />
              </q-item-section>
            </q-item>
          </q-list>
        </div>
      </div>
    </div>
    <q-card-actions align="right" class="text-primary">
      <q-btn flat label="Cancel" v-close-popup />
      <q-btn
        flat
        :label="(sheetModel.sheet==null?'Add':'Update')+ ' Sheet'"
        @click="save()"
        v-close-popup
      />
    </q-card-actions>
  </div>
</template>

<script>
import tags from "../../utils/tags.json";
import _ from "lodash";
import { mapActions } from "vuex";
export default {
  name: "SheetEditor",
  props: {
    dismissModal: Function,
    sheet: {
      type: Object,
      default: () => ({
        sheetId: null,
        name: "",
        description: "",
        author: "",
        link: "",
        level: "",
        addedDate: "",
        tags: "",
        coverPhoto: "",
        fromCodeForces: true,
        includedProblems: []
      })
    }
  },
  computed: {
    fromCodeForces() {
      return this.sheetModel.fromCodeForces;
    }
  },
  watch: {
    fromCodeForces(newVal) {
      if (!newVal) {
        this.sheetModel.includedProblems = [];
      }
    }
  },
  data() {
    return {
      sheetModel: _.cloneDeep(this.sheet),
      newProblemLink: "",
      tags
    };
  },
  methods: {
    ...mapActions({
      saveSheet: "sheetStore/saveSheet",
      updateSheet: "sheetStore/updateSheet"
    }),
    addNewProblem() {
      if (_.isEmpty(this.sheetModel.includedProblems)) {
        this.sheetModel.includedProblems = [];
      }
      this.sheetModel.includedProblems.push(this.newProblemLink.trim());
      this.newProblemLink = "";
    },
    save() {
      if (this.sheetModel.sheetId) {
        this.updateSheet(this.sheetModel);
        this.$q.notify("Successfully Updated Sheed");
      } else {
        this.saveSheet(this.sheetModel);
        this.$q.notify("Successfully Saved the new Sheed");
      }
      this.dismissModal();
    }
  }
};
</script>
<style>
</style>
