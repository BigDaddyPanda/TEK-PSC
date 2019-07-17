<template>
  <div class="fit justify-center items-center content-center text-center">
    <span v-if="t=='#'">
      <q-badge :label="c" />
    </span>
    <div v-else-if="t=='Who'">{{c}}</div>
    <div v-else-if="t=='Penalty'">{{c}}</div>
    <div v-else-if="t=='='">{{c}}</div>
    <div v-else class="fit">
      <q-icon color="secondary" size="2rem" name="star" v-if="isFirstToSolve" />
      <q-badge class="q-mt-sm self-center" :color="gtc(c).col" v-else :label="gtc(c).txt"></q-badge>
      <q-tooltip>
        {{gtc(c).sol}}
        <div v-if="gtc(c).txt!='-'&&gtc(c).col!='grey'">{{gtc(c).sec}}"</div>
        <div v-if="isFirstToSolve">First to Solve</div>
      </q-tooltip>
    </div>
  </div>
</template>

<script>
const mycolors = ["green", "light-blue-7", "deep-orange", "red-6"];
export default {
  name: "BeautifulStanding",
  props: {
    cell: { type: Array, default: () => [] },
    isFirstToSolve: { type: Boolean, default: () => false }
  },
  computed: {
    c() {
      return this.cell[0];
    },
    t() {
      return this.cell[1];
    }
  },
  methods: {
    gtc(v) {
      let col = "black";
      let sol = "No Try";
      let c = "-";
      let sec = "-";
      if (v) {
        c = v.split("|")[0];
        sec = v.split("|")[1];
        if (c === "+") {
          col = mycolors[0];
          sol = "Solved At First try";
        } else {
          if (c !== "") {
            if (c[0] === "-") {
              col = "grey";
              sol = "No Successful Try";
            } else {
              let d = Number(c.slice(1)) || 3;
              col = mycolors[d > 3 ? 3 : d];
              sol = `Solved after ${d} tr${d > 1 ? "ies" : "y"}`;
            }
          }
        }
      }
      return { col, sol, txt: c, sec };
    }
  }
};
</script>

<style>
</style>
