<template>
  <div class="fit">
    <span v-if="gtt(t)=='Rank'">
      <q-badge :label="c" />
    </span>
    <div class="cursor-pointer" v-else-if="gtt(t)=='Contestant'">
      <q-btn flat no-caps :to="'/psc/visit/'+c" :label="c" />
    </div>
    <div v-else-if="gtt(t)=='Penalty'">{{c}}</div>
    <div v-else-if="gtt(t)=='Solved'">{{c}}</div>
    <div v-else class="fit">
      <q-icon
        color="green-13"
        style="margin-left: -8%;"
        size="2rem"
        name="whatshot"
        v-if="isFirstToSolve&&gtc(c).sol!='No Try'&&gtc(c).sol!='No Successful Try'"
      />
      <q-badge class="q-mt-sm" :color="gtc(c).col" v-else :label="gtc(c).txt"></q-badge>
      <q-tooltip>
        {{gtc(c).sol}}
        <div v-if="gtc(c).txt!='-'&&gtc(c).col!='grey'">{{gtc(c).sec}}"</div>
        <div v-if="isFirstToSolve">First to Solve</div>
      </q-tooltip>
    </div>
  </div>
</template>

<script>
const mycolors = ["green", "teal-8", "teal-5", "teal-2"];
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
    gtt(t) {
      return t.split("|")[1];
    },
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
              col = "red-7";
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
