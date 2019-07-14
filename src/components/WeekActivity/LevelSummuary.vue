<template>
  <q-item
    :class="['bg-grey-2 q-mb-md',isknob?'items-center justify-center':'']"
    clickable
    @click="level_dialog=!level_dialog"
    :style="[isknob?'height:300px':'height:120px']"
  >
    <q-item-section v-if="!isknob" avatar>
      <q-avatar size="5vh" rounded class="text-white">
        <q-img :src="levelGetter.level_state.icon" />
      </q-avatar>
    </q-item-section>

    <q-item-section v-if="!isknob">
      <q-item-label
        :class="['text-h6 q-pb-none q-mb-none','text-'+levelGetter.level_state.id]"
      >Level {{levelGetter.level_state.id}}</q-item-label>
      <q-item-label caption>
        <div style="position:relative;">
          <q-linear-progress
            style="height: 20px;"
            :value="progressRatio"
            color="green"
            class="q-mt-none"
          />
          <div class="text-white text-bold set-position">
            {{levelGetter.curr}}
            <span v-if="levelGetter.curr<levelGetter.next">/{{levelGetter.next}}</span>
            xp
          </div>
        </div>
      </q-item-label>
    </q-item-section>
    <q-knob
      v-if="isknob"
      readonly
      :value="progressRatio*100"
      show-value
      size="25vh"
      :thickness="0.22"
      color="orange"
      track-color="grey-3"
      class="text-orange q-ma-md"
    >
      <q-avatar size="15vh">
        <img :src="levelGetter.level_state.icon" />
      </q-avatar>
    </q-knob>
    <q-dialog v-model="level_dialog" position="right">
      <q-card style="width: 500px">
        <q-card-section>
          <h5 class="q-mt-none q-mb-none">TEK-PS Levels</h5>
          <p
            class="text-body-2 text-grey-5"
          >Quick Overview of the levels, each new level is achieved by experience gained through participating in contests</p>
        </q-card-section>
        <q-card-section class="full-width row items-center no-wrap">
          <q-list class="full-width" bordered padding>
            <div v-for="level in Levels.levelsSet" :key="level.id">
              <q-item style="height:70px">
                <q-item-section top avatar>
                  <q-avatar rounded text-color="white">
                    <q-img :class="[trespassed(level)?'':'locked-img']" :src="level.icon" />
                  </q-avatar>
                </q-item-section>

                <q-item-section>
                  <q-item-label
                    :class="[trespassed(level)?'text-'+level.color:'grey']"
                  >{{level.label}}</q-item-label>
                  <q-item-label caption lines="2" v-if="trespassed(level)">{{level.description}}</q-item-label>
                  <q-item-label
                    caption
                    lines="2"
                    v-else-if="level.id == levelGetter.level_state.id"
                  >On going, gain {{level.maximum_xp}} experience by unlocking courses to tresspass this level.</q-item-label>
                  <q-item-label caption lines="2" v-else>Not yet unlocked</q-item-label>
                </q-item-section>

                <q-item-section side top>
                  <q-icon name="star" :color="trespassed(level)?'yellow':'grey'" />
                </q-item-section>
              </q-item>
              <q-separator spaced inset="item" />
            </div>
          </q-list>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-item>
</template>

<script>
import Levels from "../../utils/levels";
import { mapGetters } from "vuex";

export default {
  props: {
    isknob: { type: Boolean, default: () => false }
  },
  computed: {
    ...mapGetters({
      levelGetter: "progressStore/levelGetter"
    }),
    progressRatio() {
      if (this.levelGetter) {
        let { curr, next, prev } = this.levelGetter;
        return (curr - prev) / (next - prev);
      }
      return 0;
    }
  },
  methods: {
    trespassed(level) {
      let res =
        level.id < this.levelGetter.level_state.id ||
        this.levelGetter.curr >= level.maximum_xp;
      return res;
    }
  },
  data() {
    return {
      Levels,
      progress: 0,
      level_dialog: false
    };
  }
};
</script>

<style>
.locked-img {
  -webkit-filter: grayscale(100%); /* Safari 6.0 - 9.0 */
  filter: grayscale(100%);
}
</style>
