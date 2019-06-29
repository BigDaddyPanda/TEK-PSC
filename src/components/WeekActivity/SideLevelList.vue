<template>
  <q-card style="width: 500px">
    <q-card-section>
      <h5 class="q-mt-none q-mb-none">TEK-PS Levels</h5>
      <p class="text-body-2 text-grey-5">Quick Overview of the levels, each new level is achieved by experience gained through participating in contests</p>
    </q-card-section>
    <q-card-section class="row items-center no-wrap">
      <q-list bordered padding>
        <div v-for="level in Levels" :key="level.id">
          <q-item style="height:70px">
            <q-item-section top avatar>
              <q-avatar rounded text-color="white">
                <q-img :src="level.icon"/>
              </q-avatar>
            </q-item-section>

            <q-item-section>
              <q-item-label :class="'text-'+level.color">{{level.label}}</q-item-label>
              <q-item-label caption lines="2">{{level.description}}</q-item-label>
            </q-item-section>

            <q-item-section side top>
              <q-icon name="star" color="grey"/>
            </q-item-section>
          </q-item>
          <q-separator spaced inset="item"/>
        </div>
      </q-list>
    </q-card-section>
  </q-card>
</template>

<script>
import Levels from "./levels.json";
export default {
  mounted() {
    console.log(Levels);
  },
  data() {
    return {
      Levels
    };
  }
};
</script>

<style>
</style>
