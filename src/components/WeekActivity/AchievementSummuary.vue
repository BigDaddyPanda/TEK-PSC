<template>
  <q-item
    :class="['bg-grey-2 q-mb-md',isknob?'items-center justify-center':'']"
    clickable
    @click="achiev_dialog=!achiev_dialog"
    :style="[isknob?'':'height:120px']"
  >
    <q-item-section v-if="!isknob" avatar>
      <q-avatar font-size="35px" class="q-pa-none bg-grey text-white" icon="done_outline" />
    </q-item-section>

    <q-item-section v-if="!isknob">
      <q-item-label class="text-bold text-h5 q-pb-none text-grey">{{achiev}}</q-item-label>
      <q-item-label class="text-bold text-h6 q-pb-none text-grey">Achievements</q-item-label>
    </q-item-section>
    <q-knob
      v-if="isknob"
      readonly
      v-model="achiev"
      show-value
      size="25vh"
      :thickness="0.22"
      color="orange"
      track-color="grey-3"
      class="text-orange q-ma-md"
    >
      <q-avatar size="20vh">
        <q-img ratio="1" :src="getAchievementLogo(3)" />
      </q-avatar>
    </q-knob>
    <q-dialog v-model="achiev_dialog" position="right">
      <q-card style="width: 500px">
        <q-card-section>
          <h5 class="q-mt-none q-mb-none">TEK-PS Achievements</h5>
          <p
            class="text-body-2 text-grey-5"
          >Quick Overview of the Achievements, each new achievement is achieved by experience gained through participating in contests</p>
        </q-card-section>
        <q-card-section class="row items-center no-wrap">
          <q-list bordered class="full-width">
            <div v-for="(achievement,i) in achievementsList" :key="achievement.id">
              <q-item style="height:70px">
                <q-item-section top avatar>
                  <q-avatar rounded text-color="white">
                    <q-tooltip anchor="center middle" self="center middle">
                      <div v-for="(item,i) in achievement.required" :key="i">
                        <q-badge color="positive">{{ item.goal }}</q-badge>
                        <q-badge color="primary">{{ item.target }}</q-badge>
                      </div>
                    </q-tooltip>
                    <q-img
                      :src="achievement.icon"
                      :class="isClaimed(achievement.name)?'':'grayscale'"
                    />
                  </q-avatar>
                </q-item-section>

                <q-item-section>
                  <q-item-label
                    :class="['text-'+(isClaimed(achievement.name)?achievement.color:'grey-5')]"
                  >{{achievement.label}}</q-item-label>
                  <q-item-label
                    v-if="isClaimed(achievement.name)"
                    v-html="achievement.description"
                    caption
                  ></q-item-label>
                  <q-item-label
                    v-else
                    caption
                  >Not yet unlocked, hover over the icon to discover the milestone requirements</q-item-label>
                </q-item-section>

                <q-item-section side top>
                  <q-icon name="star" :color="isClaimed(achievement.name)?'yellow':'grey'">
                    <q-tooltip anchor="center left" self="center left">Claimed</q-tooltip>
                  </q-icon>
                </q-item-section>
              </q-item>
              <q-separator v-if="i!=(achievementsList.length-1)" spaced inset="item" />
            </div>
          </q-list>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-item>
</template>
<script>
import Achievements from "../../utils/achievements";
import { mapGetters } from "vuex";
export default {
  name: "AchievementPreview",
  props: {
    isknob: { type: Boolean, default: () => false }
  },
  computed: {
    ...mapGetters({
      achievementsGetter: "progressStore/achievementsGetter"
    }),
    achiev() {
      return `${this.achievementsGetter.length} / ${this.achievementsList.length}`;
    }
  },
  mounted() {},
  methods: {
    isClaimed(achName) {
      let _ = this.$_;
      return !_.isEmpty(_.find(this.achievementsGetter, ["name", achName]));
    },
    getAchievementLogo(a) {
      return Achievements.getAchievementLogo(a);
    }
  },
  data() {
    return {
      achievementsList: Achievements.achievementsList,
      achiev_dialog: false
    };
  }
};
</script>

<style>
</style>
