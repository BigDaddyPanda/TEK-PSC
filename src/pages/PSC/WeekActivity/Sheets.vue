<template>
  <q-page padding>
    <!-- content -->
    <!-- <q-list bordered dense class="col-2">
      <q-item-label header>Filter Training Sheets</q-item-label>
      <q-option-group
        dense
        class="q-ml-md"
        v-model="checkedTags"
        :options="Tags"
        color="green"
        type="checkbox"
      />
    </q-list>-->
    <div class="fit q-pa-md row justify-center">
      <div class="col-xs-12 col-lg-9 q-pa-md row">
        <q-input dense debounce="500" v-model="filterName" label="Sheet Name" class="q-pr-md col-3">
          <template v-if="filterName!=''" v-slot:append>
            <q-icon name="close" @click="filterName = ''" class="cursor-pointer" />
          </template>
        </q-input>
        <q-space />
        <q-select
          filled
          dense
          v-model="checkedTags"
          multiple
          :options="Tags"
          use-chips
          label="Filter Tags"
          class="col-3 q-pr-md no-wrap"
        />
      </div>
      <q-list class="col-xs-12 col-lg-9">
        <q-separator class="col-12" />
        <q-item v-for="(item, index) in shownSheets" :key="index" clickable @click="go(item)">
          <q-item-section thumbnail>
            <img :src="item.coverPhoto||'statics/covers/online_rounds.png'" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{item.name}}</q-item-label>
            <q-item-label caption lines="2">{{item.description}}</q-item-label>
          </q-item-section>

          <q-item-section side top>
            <q-item-label caption>
              <q-badge
                v-for="(tg, i) in item.tags"
                :key="i"
                color="teal"
                class="q-ml-xs"
                :label="tg.label"
              />
            </q-item-label>
            <q-icon name="star" color="yellow" />
          </q-item-section>
        </q-item>
      </q-list>
    </div>
  </q-page>
</template>

<script>
import Tags from "../../../utils/tags.json";
import { mapActions, mapGetters } from "vuex";
export default {
  name: "Sheets",
  computed: {
    ...mapGetters({
      getAll: "sheetStore/getAllSheets"
    }),
    allSheets() {
      return this.getAll.filter(e => e.isPublic);
    }
  },
  mounted() {
    this.loadSheets().then(() => {
      this.shownSheets = this.allSheets;
    });
  },
  watch: {
    filterName: function(newVal) {
      if (newVal !== "") {
        this.shownSheets = this.shownSheets.filter(e =>
          e.name.toLowerCase().includes(newVal.toLowerCase())
        );
      } else {
        if (this.$_.isEmpty(this.allSheets)) {
          this.shownSheets = [];
        } else {
          this.shownSheets = this.allSheets;
        }
      }
    },
    checkedTags: function(v) {
      if (v.length) {
        let newVal = v.map(e => e.value);
        this.shownSheets = this.shownSheets.filter(e => {
          let p = e.tags.map(q => q.value);
          if (newVal.every(val => p.includes(val))) return e;
        });
      } else {
        if (this.$_.isEmpty(this.allSheets)) {
          this.shownSheets = [];
        } else {
          this.shownSheets = this.allSheets;
        }
      }
    }
  },
  methods: {
    ...mapActions({
      loadSheets: "sheetStore/bindSheetsRef"
    }),
    go(mylink) {
      // if (mylink.fromCodeForces) {
      //   window.open(mylink.link, "_blank");
      // } else {
      //   this.$router.replace("/psc/round/"+mylink.link);
      // }
      this.$router.replace("/psc/round/" + mylink.sheetId);
    }
  },
  data: function() {
    return {
      checkedTags: [],
      filterName: "",
      shownSheets: [],
      Tags
    };
  }
};
</script>

<style>
</style>
