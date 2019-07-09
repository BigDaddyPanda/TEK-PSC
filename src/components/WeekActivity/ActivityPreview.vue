<template>
  <q-card
    dark
    @click="$router.push('/psc/lesson/'+lesson.lessonId)"
    :class="['cursor-pointer bg-grey-9',(isPreview?'activity-preview':'weekly-preview')]"
  >
    <q-img
      @mouseenter="showLayer=true"
      @mouseleave="showLayer=false"
      :src="lesson.coverPhoto"
      :class="[isPreview?'img-preview':'weekly-img-preview']"
    >
      <transition name="fade">
        <div v-if="showLayer" class="absolute-full">
          <div class="q-ma-md content-end absolute-full text-body2 flex flex-end">
            <span class="full-width text-h6 q-mb-none text-bold">{{lesson.name}}</span>
            <span class="full-width q-mb-none text-orange">
              <q-avatar
                size="18px"
                text-color="white"
                class="text-center text-bold"
                color="orange"
              >XP</q-avatar>+50 XP
            </span>
            <span class="full-width q-mb-none">Completed by {{$_.random(10,30)}} other TEK-UPpers</span>
            <div class="full-width q-mb-none" style="position:relative;">
              <q-linear-progress
                style="height: 20px;"
                :value="0.5"
                color="green"
                class="q-mt-none"
              />
              <div class="text-white text-bold set-position">50/100</div>
            </div>
          </div>
        </div>
      </transition>
    </q-img>
    <q-card-section class="q-p-none" style="height:25%">
      <div class="text-bold text-secondary q-pb-none">
        <span
          v-for="(tag,i) in lesson.tags"
          :key="i"
        >{{ tag.label }} {{1+i==lesson.tags.length?"":', '}}</span>
      </div>
      <div>Added on: {{$moment(lesson.addedDate).format("MMM Do YY")}}</div>
    </q-card-section>
  </q-card>
</template>

<script>
// import moment from "moment";
export default {
  props: {
    isPreview: {
      type: Boolean,
      default: () => false
    },
    lesson: Object
  },
  data() {
    return {
      stars: 3,
      showLayer: false
    };
  }
};
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
.activity-preview {
  height: 35vh !important;
}
.weekly-preview {
  height: 55vh !important;
}
.img-preview {
  height: 75%;
}
.weekly-img-preview {
  height: 80%;
}
</style>
