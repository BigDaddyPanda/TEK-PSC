<template>
  <q-page padding class="row">
    <!-- content -->
    <q-list bordered dense class="col-2">
      <q-item-label header>Filter Training Sheets</q-item-label>
      <q-option-group
        dense
        class="q-ml-md"
        v-model="checkedTags"
        :options="Tags"
        color="green"
        type="checkbox"
      />
    </q-list>
    <div class="q-pa-md col-9">
      <q-scroll-area style="height: 100vh;">
        <q-infinite-scroll @load="onLoad" :offset="250">
          <q-list>
            <q-item
              v-for="(item, index) in shownSheets"
              :key="item.name"
              clickable
              @click="go(item.link)"
            >
              <q-item-section thumbnail>
                <img :src="'http://lorempixel.com/150/150/sports/'+index" />
              </q-item-section>
              <q-item-section>
                <q-item-label>July {{item.name}}</q-item-label>
                <q-item-label
                  caption
                  lines="2"
                >Secondary line text. Lorem ipsum dolor sit amet, consectetur adipiscit elit.</q-item-label>
              </q-item-section>

              <q-item-section side top>
                <q-item-label caption>
                  <q-badge
                    v-for="(tg, i) in item.tags"
                    :key="i"
                    color="teal"
                    class="q-ml-xs"
                    :label="tg"
                  />
                </q-item-label>
                <q-icon name="star" color="yellow" />
              </q-item-section>
            </q-item>
          </q-list>

          <template v-slot:loading>
            <div class="row justify-center q-my-md">
              <q-spinner-dots color="primary" size="40px" />
            </div>
          </template>
        </q-infinite-scroll>
      </q-scroll-area>
    </div>
  </q-page>
</template>

<script>
import Tags from "../../../utils/tags.json";
export default {
  name: "Sheets",
  mounted() {
    this.Sheets = this.$_.times(30, function(i) {
      let q = ["dp", "implementation", "graph", "geometry"].slice(
        -Math.floor((Math.random() * 100) % 3)
      );
      return {
        name: "Sheet #" + i,
        link: "http://codeforces.com/group/Bm8uz7ooRI/contest/247184",
        tags: q
      };
    });
    this.shownSheets = this.Sheets.slice(-5);
  },
  watch: {
    checkedTags: function(newVal) {
      if (newVal.length) {
        this.shownSheets = this.Sheets.filter(e =>
          newVal.every(val => e.tags.includes(val))
        );
      } else {
        this.shownSheets = this.Sheets.slice(-10);
      }
    }
  },
  methods: {
    go(mylink) {
      window.open(mylink, "_blank");
    },
    onLoad(index, done) {
      if (this.shownSheets.length === this.Sheets.length) done();
      else {
        setTimeout(() => {
          this.shownSheets = this.Sheets.slice(-(this.shownSheets.length + 5));
          done();
        }, 1000);
      }
    }
  },
  data: function() {
    return {
      checkedTags: [],
      check1: false,
      check2: false,
      check3: false,
      shownSheets: [],
      Sheets: [],
      Tags
    };
  }
};
</script>

<style>
</style>
