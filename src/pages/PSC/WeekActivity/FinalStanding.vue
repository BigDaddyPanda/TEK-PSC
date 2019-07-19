<template>
  <q-page padding>
    <div class="q-pa-md">
      <q-table
        :loading="!standingsLoaded"
        :title="'Standings for '+contestToPreview.name"
        :data="data"
        :columns="standingsColumns"
        row-key="name"
        dark
        :pagination.sync="pagination"
        color="orange-4"
      >
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
import { mapGetters } from "vuex";
import BeautifulStanding from "../../../components/WeekActivity/BeautifulStanding";
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
    this.loadContest().then(() => {
      this.loadContestStandings();
    });
  },
  methods: {
    async loadContest() {
      this.dataLoaded = false;
      this.contestToPreview = await this.allContests.filter(
        c => c.contestId === this.$route.params.id
      );
      this.contestToPreview = this.contestToPreview[0];
      this.dataLoaded = true;
    },
    async loadContestStandings() {
      this.standingsLoaded = false;
      this.$rtdb
        .ref("finalStandings/" + this.contestToPreview.contestId)
        .once("value", snapshot => {
          this.data = snapshot.val();
        })
        .then(() => {
          this.standingsLoaded = true;
        });
    },
    generateStandings() {
      let _ = this.$_;
      let { standings } = this.contestToPreview;
      _.groupBy(standings, "who");
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
      data: []
    };
  }
};
</script>

<style>
</style>
