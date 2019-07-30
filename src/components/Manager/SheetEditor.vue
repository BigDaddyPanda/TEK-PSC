<template>
  <div class="fit">
    <div class="row">
      <div class="q-pa-md fit row">
        <div class="q-pa-md col-12">Sheet Details</div>
        <q-input
          dense
          class="col-xs-12 col-md-4 q-pl-xs q-pr-xs"
          filled
          v-model="sheetModel.name"
          label="Name"
          lazy-rules
          :rules="[ val => val && val.length > 0 || 'Please type something']"
        />
        <q-input
          dense
          class="col-xs-12 col-md-4 q-pl-xs q-pr-xs"
          filled
          autogrow
          v-model="sheetModel.description"
          label="Description"
          lazy-rules
          :rules="[ val => val && val.length > 0 || 'Please type something']"
        />
        <q-input
          dense
          class="col-xs-12 col-md-4 q-pl-xs q-pr-xs"
          filled
          v-model="sheetModel.author"
          label="Author"
          lazy-rules
          :rules="[ val => val && val.length > 0 || 'Please type something']"
        />

        <q-input
          dense
          class="col-xs-12 col-md-4 q-pl-xs q-pr-xs"
          filled
          v-model="sheetModel.level"
          label="Level"
          lazy-rules
          :rules="[ val => val && val.length > 0 || 'Please type something']"
        />
        <q-input
          class="col-xs-12 col-md-4 q-pl-xs q-pr-xs"
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
          class="col-xs-12 col-md-4 q-pl-xs q-pr-xs q-mb-lg"
        />
        <my-uploader
          photoCollection="sheets"
          :className="['col-xs-6 col-md-4 q-pa-md row']"
          :coverPhoto="sheetModel.coverPhoto"
          @input="v=>sheetModel.coverPhoto=v"
        />
        <q-select
          filled
          dense
          v-model="sheetModel.nature"
          :options="['Online Round','Daily Sheet','Local Contest']"
          use-chips
          label="Type"
          class="col-xs-12 col-md-4 q-pl-xs q-pr-xs q-mb-lg"
        />
        <q-input
          v-if="sheetModel.fromCodeForces"
          dense
          class="col-xs-12 col-md-4 q-pl-xs q-pr-xs"
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
            <q-item>
              <q-item-section>
                <q-select
                  filled
                  dense
                  use-input
                  new-value-mode="add"
                  hide-selected
                  label="Problem"
                  fill-input
                  input-debounce="0"
                  :options="options"
                  :option-value="o=>o"
                  :option-label="opt => opt === null ? '- Null -' : opt.name"
                  clearable
                  v-model="newProblemObject"
                  @filter="filterFn"
                  @new-value="createNewProblem"
                  hint="Start typing Problem index, contest, name or tags. ie: greedy "
                >
                  <template v-slot:option="scope">
                    <q-item v-bind="scope.itemProps" v-on="scope.itemEvents">
                      <q-item-section>
                        <q-item-label
                          v-html="scope.opt.contestId+'/'+scope.opt.index+': '+scope.opt.name"
                        />
                        <q-item-label caption>
                          <q-badge
                            :label="problemTag"
                            v-for="(problemTag, index) in scope.opt.tags"
                            :key="index"
                          />
                        </q-item-label>
                      </q-item-section>
                    </q-item>
                  </template>
                  <template v-slot:no-option>
                    <q-item>
                      <q-item-section
                        class="text-grey"
                      >No results, if it is a link for a non-codeforces problem, press enter to add it</q-item-section>
                    </q-item>
                  </template>
                </q-select>
              </q-item-section>
              <q-item-section side top>
                <q-knob
                  dense
                  v-model="newProblemXP"
                  show-value
                  type="number"
                  label="XP"
                  class="text-blue"
                  track-color="grey-4"
                >
                  {{5*newProblemXP}}XP
                  <q-tooltip>0-500 XP</q-tooltip>
                </q-knob>
                <q-btn round color="primary" flat icon="add" size="md" @click="addNewProblem()" />
              </q-item-section>
            </q-item>
            <q-item v-for="(pb, i) in sheetModel.includedProblems" :key="i" v-ripple>
              <q-item-section>
                <span>
                  <span class="text-bold">{{pb.problem.name}} -</span>
                  {{pb.problem.link}}-
                  <span class="text-bold">[ {{pb.xp}}XP ]</span>
                </span>
              </q-item-section>
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
        <div v-else class="col-12 row">
          <q-space />
          <q-btn
            label="Parse Problems"
            :loading="isParsing"
            color="primary"
            @click="parseProblemsFromCodeforces()"
          />
          <q-space />
          <div v-if="!$_.isEmpty(sheetModel.includedProblems)" class="col-12">
            <q-scroll-area style="height:35vh">
              <q-list dense bordered separator>
                <q-item v-for="(pb, i) in sheetModel.includedProblems" :key="i" v-ripple>
                  <q-item-section>
                    <span>
                      <span class="text-bold">{{pb.name}} -</span>
                      <q-space />
                      <span class="text-caption text-weight-light">{{pb.link}}</span>
                    </span>
                  </q-item-section>
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
            </q-scroll-area>
          </div>
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
import MyUploader from "../Utils/MyUploader";
import tags from "../../utils/tags.json";
import problemSet from "../../utils/problems.json";
import _ from "lodash";
import { mapActions } from "vuex";
import { type } from "os";
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
  components: {
    MyUploader
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
      newProblemObject: {},
      newProblemXP: 10,
      problemSet,
      isParsing: false,
      options: [],
      tags
    };
  },
  methods: {
    ...mapActions({
      saveSheet: "sheetStore/saveSheet",
      updateSheet: "sheetStore/updateSheet"
    }),
    createNewProblem(val, done = null) {
      let model = {},
        value = "";
      if (typeof val === "string") {
        if (val.match(/\/\/\S+/gi)) {
          value = val.match(/\/\/\S+/gi).slice(2);
        } else {
          value = val;
        }
        model = {
          contestId: val,
          index: val,
          name: val,
          type: "PROGRAMMING",
          points: 1000,
          rating: 1000,
          tags: []
        };
      } else {
        value = `https://codeforces.com/problemset/problem/${val.contestId}/${val.index}`;
        model = val;
      }
      model.link = value;
      this.newProblemObject = model;
      // console.log(model);
      if (done) {
        done(model);
      }
    },
    addNewProblem() {
      if (_.isEmpty(this.sheetModel.includedProblems)) {
        this.sheetModel.includedProblems = [];
      }
      if (_.isEmpty(this.newProblemObject)) {
        return;
      }
      this.newProblemObject.link = `https://codeforces.com/problemset/problem/${this.newProblemObject.contestId}/${this.newProblemObject.index}`;
      this.sheetModel.includedProblems.push({
        problem: this.newProblemObject,
        xp: 5 * this.newProblemXP
      });
      this.newProblemObject = {};
      this.newProblemXP = 10;
    },
    filterFn(val, update, abort) {
      if (!val.length) {
        abort();
        return;
      }
      if (val.length === 1) {
        update(() => {
          const needle = val.toLowerCase().trim();
          this.options = problemSet.filter(
            v => v.index.toLowerCase() === needle
          );
        });
        return;
      }
      update(() => {
        const needle = val.toLowerCase().trim();
        this.options = problemSet.filter(
          v =>
            `http://codeforces.com/problemset/problem/${v.contestId}/${v.index}`
              .toLowerCase()
              .includes(needle) ||
            `https://codeforces.com/problemset/problem/${v.contestId}/${v.index}`
              .toLowerCase()
              .includes(needle) ||
            v.tags.includes(needle) ||
            v.name.toLowerCase().includes(needle)
        );
      });
    },

    parseProblemsFromCodeforces() {
      this.isParsing = true;
      if (_.isEmpty(this.sheetModel.link)) {
        this.$negative("Could not parse such link");
        this.isParsing = false;
      } else {
        let link = this.sheetModel.link.match(/group\/.+\/contest\/\w+\/?/);
        if (!link) {
          this.$negative("Could not parse such link");
          this.isParsing = false;
        } else {
          this.$faxios("/scrapProblems?link=" + this.sheetModel.link)
            .then(r => {
              this.sheetModel.includedProblems = r.data;
              this.$positive(`Successfully parsed ${r.data.length} Problem(s)`);
              this.isParsing = false;
              // console.log(this.sheetModel.includedProblems);
            })
            .catch(err => {
              this.$negative(err.toString());
              this.isParsing = false;
            });
        }
      }
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
