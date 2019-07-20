<template>
  <q-page padding>
    <div class="q-pa-md">
      <div v-if="loadingFailed">
        <h1
          class="q-pa-md"
          style="color: rgb(85, 85, 85); font-family: Helvetica, Arial, sans-serif; line-height: 1.2; font-size: 3em; background-color: rgb(245, 245, 245);"
        >Could not load Data from local server</h1>
        <div class="highlight" style="margin-bottom: 8px; background-color: rgb(245, 245, 245);">
          <pre
            style="border-radius: 2px; background-color: rgb(238, 238, 238); overflow: auto; padding: 8px 10px; text-shadow: rgb(255, 255, 255) 0px 1px 0px; margin-top: 0px; margin-bottom: 0px;"
          ><span style="font-size: 15px;">
failed to load Functions data, perhaps you forget to launch it?
to do so:</span></pre>
          <pre
            style="border-radius: 2px; background-color: rgb(238, 238, 238); overflow: auto; padding: 8px 10px; text-shadow: rgb(255, 255, 255) 0px 1px 0px; margin-top: 0px; margin-bottom: 0px;"
          ><div
  style="color: rgb(214, 222, 235); background-color: rgb(1, 22, 39); font-family: Hack, Consolas, &quot;Courier New&quot;, monospace; line-height: 19px; white-space: pre;"
><div><span style="color: #7fdbca;"> &gt;</span> <span style="color: #addb67;">cd</span> [path/to/project/directory]/fb.functions</div><div><span style="color: #7fdbca;"> &gt;</span> firebase serve</div></div></pre>
        </div>
        <div>
          <strong>
            <br />
          </strong>
        </div>
        <div
          class="highlight"
          style="margin-bottom: 8px; color: rgb(85, 85, 85); font-family: Helvetica, Arial, Verdana, sans-serif; font-size: 15px; background-color: rgb(245, 245, 245);"
        ></div>
      </div>

      <div class="row justify-center q-ma-md">
        <q-space />
        <q-btn
          label="Set Standings Public"
          v-if="standingsLoaded"
          :loading="savingData"
          color="primary"
          @click="publishResults()"
        />
      </div>
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
import BeautifulStanding from "../../components/WeekActivity/BeautifulStanding";
export default {
  name: "FinalStandingsMaker",
  components: {
    BeautifulStanding
  },
  computed: {
    ...mapGetters({
      allContests: "contestStore/allContestsGetter"
    }),
    standingsColumns() {
      const _ = this.$_;
      if (!_.isEmpty(this.unChangedData)) {
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

      this.loadingFailed = false;

      this.$axios(
        this.$genRes("scrapStandings?link=" + this.contestToPreview.link)
      )
        .then(resp => {
          this.data = resp.data;
          this.unChangedData = this.$_.cloneDeep(resp.data);
        })
        .then(() => {
          this.standingsLoaded = true;
        })

        .catch(err => {
          this.$q.notify({
            color: "negative",
            message: err.toString()
          });
          this.loadingFailed = true;
          this.standingsLoaded = true;
        });
    },
    publishResults() {
      this.savingData = true;
      this.$rtdb
        .ref("finalStandings/" + this.contestToPreview.contestId)
        .set({
          ...this.unChangedData
        })
        .then(async () => {
          let PROM = [];
          let qw = await this.unChangedData.map(async e => {
            let contestRank = {
              contestLink: this.contestToPreview.link,
              contestName: this.contestToPreview.name,
              ...e
            };
            // console.log("Posting", contestRank);

            let c = await this.$db
              .collection("progress")
              .where("progress.codeforcesHandle", "==", e["101|Contestant"])
              .get()
              .then(async snaps => {
                let aw = await snaps.forEach(async doc => {
                  // console.log("adding standings to", doc.id);

                  let dw = await this.$db
                    .collection("progress")
                    .doc(doc.id)
                    .update({
                      "progress.contestStandings": this.$firebase.firestore.FieldValue.arrayUnion(
                        contestRank
                      )
                    });
                  PROM.push(dw);
                });
                PROM.push(aw);
              });
            PROM.push(c);
          });
          PROM.push(qw);
          return Promise.all(PROM);
        })
        .then(e => {
          this.$faxios("scrapStatus?link=" + this.contestToPreview.link).then(
            rep => {
              // console.log(rep);
              this.savingData = false;
              this.$q.notify({
                color: "positive",
                message: "Results are published and Submission are saved"
              });
            }
          );
        });
    },
    publishStatus() {}
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
      standingsLoaded: false,
      contestToPreview: {},
      dataLoaded: false,
      loadingFailed: false,
      savingData: false,
      columns: [],
      data: [],
      unChangedData: []
    };
  }
};
</script>

<style>
</style>
