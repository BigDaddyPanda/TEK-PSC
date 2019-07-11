<template>
  <div class="row justify-center">
    <q-parallax :src="sheetModel.coverPhoto"></q-parallax>
    <q-page class="bg-grey-3" style="width:75%;top:-25vh;" padding>
      <div class="q-pt-md row">
        <h3 class="q-mb-xs col-12">{{sheetModel.name}}</h3>
        <span class="q-mb-xs col-12 row text-caption">
          <div class="col-9">{{sheetModel.name}}</div>
          <div class="col-3">
            Tags:
            <q-badge
              v-for="(tg, i) in sheetModel.tags"
              :key="i"
              color="teal"
              class="q-ml-xs"
              :label="tg.label"
            />
          </div>
        </span>
        <h5 class="q-mb-xs col-12">Sheet Content</h5>
        <div class="q-mb-xs col-12 text-center" v-if="sheetModel.fromCodeForces">
          This Contest is Hosted on Codef Forces, here is the link
          <br />
          <a :href="sheetModel.link" target="_blank">
            <q-btn flat outline label="GO" />
          </a>
        </div>

        <q-list class="q-mb-xs col-12" v-else>
          <q-item
            v-for="(problem,pindex) in sheetModel.includedProblems"
            :key="pindex"
            class="q-mb-sm"
            clickable
            v-ripple
            @click="goTo(problem.problem.link)"
          >
            <q-item-section avatar>
              <q-avatar color="teal-7" text-color="white">{{ (problem.problem.index) }}</q-avatar>
            </q-item-section>

            <q-item-section>
              <q-item-label>{{ problem.problem.name }}</q-item-label>
              <q-item-label caption>
                <q-badge class="q-mr-xs" v-for="tag in problem.problem.tags" :key="tag.id">{{ tag }}</q-badge>
              </q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-badge :label="problem.xp+' XP'" />
            </q-item-section>
          </q-item>
        </q-list>
      </div>
    </q-page>
  </div>
</template>

<script>
import { db } from "boot/firebase";
import _ from "lodash";
//  "contestId": 77,
//  "index": "B",
//  "name": "Falling Anvils",
//  "type": "PROGRAMMING",
//  "points": 1000,
//  "rating": 1800,
//  "tags": [
//      "math",
//      "probabilities"
//  ]
export default {
  name: "SheetRound",
  methods: {
    goTo(prb) {
      window.open(prb, "_blank");
    },
    reload() {
      let sheetId = this.$route.params.id;
      db.collection("sheets")
        .where("sheetId", "==", sheetId)
        .get()
        .then(snapshot =>
          snapshot.forEach(doc => {
            this.sheetModel = doc.data();
          })
        );
    }
  },
  mounted() {
    this.reload();
  },
  watch: {
    mySheetId: function(newVal) {
      this.reload();
    }
  },
  data() {
    return {
      sheetModel: {}
    };
  },
  computed: {
    mySheetId: function() {
      return this.$route.params.id;
    }
  }
};
</script>

<style>
</style>
