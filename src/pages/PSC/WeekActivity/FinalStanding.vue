<template>
  <q-page padding>
    <div class="q-px-xs fit row justify-around">
      <q-card class="col-3 bg-teal text-center text-white">
        <q-card-section>
          <div class="text-h6">{{$_.capitalize(MaxFTS["101|Contestant"])}}</div>
          <div class="text-subtitle2">First to Solve Champion</div>
        </q-card-section>

        <q-card-section>
          If you do something on the fly, you do it quickly,
          just like {{$_.capitalize(MaxFTS["101|Contestant"])}} finding solutions for problems.
        </q-card-section>
      </q-card>
      <q-card class="col-3 bg-primary text-center text-white">
        <q-card-section>
          <div class="text-h6">{{$_.capitalize(BestSolver["101|Contestant"])}}</div>
          <div class="text-subtitle2">Prodigy of the Contest</div>
        </q-card-section>

        <q-card-section>
          Some consider this contest a challenge, for {{$_.capitalize(BestSolver["101|Contestant"])}} it was a piece of cake, claiming
          greatest number of solved problems with the least time.
        </q-card-section>
      </q-card>
      <q-card class="col-3 bg-info text-center text-white">
        <q-card-section>
          <div class="text-h6">{{$_.capitalize(Fighter["101|Contestant"])}}</div>
          <div class="text-subtitle2">Tough Problem Solver</div>
        </q-card-section>

        <q-card-section>
          Never gave up on a problem, {{$_.capitalize(Fighter["101|Contestant"])}} claimed the answer
          after the most tries in the contest
        </q-card-section>
      </q-card>
    </div>
    <div class="fit q-pa-md">
      <q-table
        :loading="!standingsLoaded"
        :title="!$_.isEmpty(contestToPreview)?'Standings for '+contestToPreview.name:'Loading Table'"
        :data="data"
        :columns="standingsColumns"
        row-key="name"
        dark
        :pagination.sync="pagination"
        color="orange-4"
      >
        <template v-slot:top-right>
          <q-btn flat round size="sm" icon="open_in_new" @click="$goto(contestToPreview.link)">
            <q-tooltip>Open in CodeForces</q-tooltip>
          </q-btn>
        </template>
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td v-for="(col,index) in standingsColumns" :key="index">
              <beautiful-standing
                :isFirstToSolve="props.row['firstToSolve']&&props.row['firstToSolve'].includes(col.name)"
                :cell="[props.row[col.field],col.field]"
              />
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </div>
  </q-page>
</template>

<script>
import _ from "lodash";
import { mapGetters, mapActions } from "vuex";
import BeautifulStanding from "../../../components/WeekActivity/BeautifulStanding";
import Axios from "axios";
export default {
  name: "FinalStandings",
  components: {
    BeautifulStanding
  },
  computed: {
    ...mapGetters({
      allContests: "contestStore/allContestsGetter"
    }),
    standingsColumns() {
      const _ = this.$_;
      if (!_.isEmpty(this.data)) {
        let e = Object.keys(this.data[0]).map(x => {
          if (x === "firstToSolve") {
            return "firstToSolve";
          }
          let v = x.split("|")[1];
          return {
            name: v,
            align: "left",
            label: _.capitalize(v),
            field: x,
            sortable: true
          };
        });

        let lst = e.pop();
        if (lst !== "firstToSolve") {
          e.push(lst);
        }
        return e;
      }
      return [];
    }
  },
  mounted() {
    this.loadAllContests().then(() => {
      this.loadContest();
      this.loadContestStandings();
    });
  },
  methods: {
    ...mapActions({
      loadAllContests: "contestStore/bindContestsRef"
    }),
    loadContest() {
      this.dataLoaded = false;
      this.contestToPreview = this.allContests.filter(
        c => c.contestId === this.$route.params.id
      );
      this.contestToPreview = this.contestToPreview[0];
      this.dataLoaded = true;
    },
    loadContestStandings() {
      this.standingsLoaded = false;
      this.$rtdb
        .ref("finalStandings/" + this.contestToPreview.contestId)
        .once("value", snapshot => {
          this.data = snapshot.val();
        })
        .then(() => {
          this.standingsLoaded = true;
          this.bestStandings();
        });
    },
    bestStandings() {
      let BestSolver = _.maxBy(
          this.data,
          e => 1000 * Number(e["102|Solved"]) - Number(e["103|Penalty"])
        ),
        MaxFTS = _.maxBy(this.data, e => _.size(e["firstToSolve"])),
        problems = Object.keys(this.data[0]).filter(
          v => v.match(/(\d+\|[A-Z])/i) && _.size(v) === 5
        ),
        Fighter = _.maxBy(this.data, e => {
          let s = _.maxBy(problems.map(p => e[p]), sp => this.dn(sp));
          return this.dn(s);
        });

      this.BestSolver = BestSolver;
      this.MaxFTS = MaxFTS;
      this.Fighter = Fighter;
    },
    dn(sp) {
      if (sp === "") {
        return -2;
      }
      let q = sp.split("|")[0];

      if (q === "+") {
        return -1;
      }
      return Number(q);
    }
  },
  data() {
    return {
      pagination: {
        sortBy: "Who",
        descending: false,
        page: 1,
        rowsPerPage: 10
        // rowsNumber: xx if getting data from a server
      },
      contestToPreview: {},
      dataLoaded: false,
      standingsLoaded: false,
      columns: [],
      data: [],
      BestSolver: {},
      MaxFTS: {},
      Fighter: {}
    };
  }
};
</script>

<style scoped>
</style>
