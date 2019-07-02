<template>
  <div class="q-pa-md">
    <q-table
      title="Lessons"
      :data="data"
      :columns="columns"
      row-key="name"
      selection="multiple"
      :selected.sync="selected"
      :filter="filter"
      grid
      hide-header
    >
      <template v-slot:top-right>
        <q-input borderless dense debounce="300" v-model="filter" placeholder="Search">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>

      <template v-slot:item="Lessons[0]">
        <div
          class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3 grid-style-transition"
          :style="Lessons[0].selected ? 'transform: scale(0.95);' : ''"
        >
          <q-card :class="Lessons[0].selected ? 'bg-grey-2' : ''">
            <q-card-section>
              <q-checkbox dense v-model="Lessons[0].selected" :label="Lessons[0].row.name" />
            </q-card-section>
            <q-separator />
            <q-list dense>
              <q-item
                v-for="col in Lessons[0].cols.filter(col => col.name !== 'desc')"
                :key="col.name"
              >
                <q-item-section>
                  <q-item-label>{{ col.label }}</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-item-label caption>{{ col.value }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card>
        </div>
      </template>
    </q-table>
    <div class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3 grid-style-transition">
      <!-- <q-card>
        <q-separator />
        <q-list dense>
          <q-item v-for="col in Lessons[0].cols.filter(col => col.name !== 'desc')" :key="col.name">
            <q-item-section>
              <q-item-label>{{ col.label }}</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-item-label caption>{{ col.value }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card> -->
    </div>
  </div>
</template>
<script>
import Lessons from "../../utils/lessons.json";
export default {
  data() {
    return {
      filter: "",
      selected: [],
      columns: [
        {
          name: "desc",
          required: true,
          label: "Dessert (100g serving)",
          align: "left",
          field: "row => row.name",
          format: val => `${val}`,
          sortable: true
        },
        {
          name: "calories",
          align: "center",
          label: "Calories",
          field: "calories",
          sortable: true
        },
        {
          name: "fat",
          label: "Fat (g)",
          field: "fat",
          sortable: true
        },
        {
          name: "carbs",
          label: "Carbs (g)",
          field: "carbs"
        },
        {
          name: "protein",
          label: "Protein (g)",
          field: "protein"
        },
        {
          name: "sodium",
          label: "Sodium (mg)",
          field: "sodium"
        },
        {
          name: "calcium",
          label: "Calcium (%)",
          field: "calcium",
          sortable: true,
          sort: (a, b) => parseInt(a, 10) - parseInt(b, 10)
        },
        {
          name: "iron",
          label: "Iron (%)",
          field: "iron",
          sortable: true,
          sort: (a, b) => parseInt(a, 10) - parseInt(b, 10)
        }
      ],
      ...Lessons
    };
  }
};
</script>
<style lang="stylus">
.grid-style-transition {
  transition: transform 0.28s, background-color 0.28s;
}
</style>
