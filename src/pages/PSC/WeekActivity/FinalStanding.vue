<template>
  <q-page padding>
    <div class="q-pa-md">
      <q-table
        title="Standings"
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
                :isFirstToSolve="props.row['firstToSolve']&&props.row['firstToSolve'].includes(col.field)"
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
import { async } from "q";
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
      let v = Object.keys(this.data[0]).map(e => {
        let v = "";
        switch (e) {
          case "Who":
            v = "Contestant";
            break;
          case "=":
            v = "Solved";
            break;
          case "#":
            v = "Rank";
            break;

          default:
            v = e;
            break;
        }
        return {
          name: this.$_.capitalize(v),
          align: e === "Who" ? "left" : "center",
          label: this.$_.capitalize(v),
          field: e,
          sortable: true
        };
      });
      v.pop();
      return v;
    }
  },
  mounted() {
    this.loadStandings();
  },
  methods: {
    async loadStandings() {
      this.dataLoaded = false;
      this.contestToPreview = await this.allContests.filter(
        c => c.contestId === this.$route.params.id
      );
      this.contestToPreview = this.contestToPreview[0];
      this.dataLoaded = true;
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
      columns: [],
      data: [
        {
          "#": "1",
          Who: "Heythemos",
          "=": "14",
          Penalty: "2999",
          A: "+|00:47",
          B: "+|01:50",
          C: "+|02:04",
          D: "+|03:11",
          E: "+2|00:35",
          F: "+1|03:32",
          G: "+|03:43",
          H: "+4|06:05",
          I: "+|03:59",
          J: "+|04:03",
          K: "+|04:47",
          L: "+|04:11",
          M: "+|04:18",
          N: "+|04:34",
          firstToSolve: ["B", "C", "D", "G", "I", "J", "K", "L", "M", "N"]
        },
        {
          "#": "2",
          Who: "saadouni",
          "=": "14",
          Penalty: "4872",
          A: "+|04:15",
          B: "+2|04:22",
          C: "+|04:29",
          D: "+|04:32",
          E: "+1|04:41",
          F: "+|06:46",
          G: "+1|04:58",
          H: "+|05:49",
          I: "+1|06:13",
          J: "+2|06:22",
          K: "+|06:27",
          L: "+|06:34",
          M: "+|06:40",
          N: "+|06:44",
          firstToSolve: ["F", "H"]
        },
        {
          "#": "3",
          Who: "orewa",
          "=": "8",
          Penalty: "5999",
          A: "+|05:36",
          B: "+|06:53",
          C: "+|06:29",
          D: "+|10:43",
          E: "+|01:52",
          F: "",
          G: "+|23:31",
          H: "",
          I: "+|21:10",
          J: "+|23:45",
          K: "",
          L: "",
          M: "",
          N: "",
          firstToSolve: ["E"]
        },
        {
          "#": "4",
          Who: "ghanem94",
          "=": "8",
          Penalty: "8401",
          A: "+|00:36",
          B: "+|01:51",
          C: "+|05:02",
          D: "+|05:22",
          E: "+|05:42",
          F: "+|23:11",
          G: "+|2:01:30",
          H: "",
          I: "",
          J: "",
          K: "",
          L: "",
          M: "",
          N: "+|2:00:47"
        },
        {
          "#": "5",
          Who: "takami",
          "=": "8",
          Penalty: "10191",
          A: "+|00:20",
          B: "+|03:07",
          C: "+|03:20",
          D: "+|1:10:30",
          E: "+|05:52",
          F: "+|1:01:56",
          G: "+1|1:22:53",
          H: "",
          I: "",
          J: "",
          K: "",
          L: "",
          M: "",
          N: "+2|2:00:53",
          firstToSolve: ["A"]
        },
        {
          "#": "6",
          Who: "yelou",
          "=": "4",
          Penalty: "8120",
          A: "",
          B: "",
          C: "",
          D: "",
          E: "+|02:05",
          F: "+1|1:10:01",
          G: "+1|2:01:42",
          H: "",
          I: "",
          J: "",
          K: "",
          L: "",
          M: "",
          N: "+|2:00:52"
        },
        {
          "#": "7",
          Who: "Uguemubwem",
          "=": "2",
          Penalty: "5752",
          A: "",
          B: "",
          C: "",
          D: "",
          E: "",
          F: "-1",
          G: "",
          H: "",
          I: "",
          J: "",
          K: "",
          L: "+|2:00:00",
          M: "+|1:23:52",
          N: ""
        },
        {
          "#": "8",
          Who: "ilyes007",
          "=": "1",
          Penalty: "675",
          A: "+2|10:35",
          B: "-1",
          C: "",
          D: "",
          E: "",
          F: "",
          G: "",
          H: "",
          I: "",
          J: "",
          K: "",
          L: "",
          M: "",
          N: ""
        }
      ]
    };
  }
};
</script>

<style>
</style>
