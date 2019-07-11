<template>
  <q-card style="width: 500px">
    <q-card-section>
      <h5 class="q-mt-none q-mb-none">TEK-PS Achievements</h5>
      <p
        class="text-body-2 text-grey-5"
      >Quick Overview of the Achievements, each new achievement is achieved by experience gained through participating in contests</p>
    </q-card-section>
    <q-card-section class="row items-center no-wrap">
      <q-list bordered class="full-width">
        <div v-for="(achievement,i) in Achievements" :key="achievement.id">
          <q-item style="height:70px">
            <q-item-section top avatar>
              <q-avatar rounded text-color="white">
                <q-tooltip anchor="center middle" self="center middle">
                  <div v-for="(item,i) in achievement.required" :key="i">
                    <q-badge color="positive">{{ item.goal }}</q-badge>
                    <q-badge color="primary">{{ item.target }}</q-badge>
                  </div>
                </q-tooltip>
                <q-img :src="achievement.icon" :class="i>3?'grayscale':''" />
              </q-avatar>
            </q-item-section>

            <q-item-section>
              <q-item-label :class="'text-'+(i>3?'grey':achievement.color)">{{achievement.label}}</q-item-label>
              <q-item-label v-html="achievement.description" caption></q-item-label>
            </q-item-section>

            <q-item-section side top>
              <q-icon name="star" :color="i>3?'grey':'yellow'">
                <q-tooltip anchor="center left" self="center left">Claimed</q-tooltip>
              </q-icon>
            </q-item-section>
          </q-item>
          <q-separator v-if="i!=(Achievements.length-1)" spaced inset="item" />
        </div>
      </q-list>
    </q-card-section>
  </q-card>
</template>
<script>
import Achievements from "../../utils/achievements.json";
export default {
  mounted() {
    console.log(Achievements);
  },
  methods: {},
  data() {
    return {
      Achievements
    };
  }
};
</script>

<style>
</style>
