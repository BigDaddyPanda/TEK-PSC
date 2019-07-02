<template>
  <q-card dark @click="$router.push('/psc/lesson/lessonId')" class="cursor-pointer bg-grey-9">
    <q-img
      @mouseenter="showLayer=true"
      @mouseleave="showLayer=false"
      src="statics/covers/introduction.png"
    >
      <transition name="fade">
        <div v-if="showLayer" class="absolute-full">
          <div class="q-ma-md content-end absolute-full text-body2 flex flex-end">
            <span class="full-width text-h6 q-mb-none text-bold">Lesson Name</span>
            <span class="full-width q-mb-none text-orange">
              <q-avatar
                size="18px"
                text-color="white"
                class="text-center text-bold"
                color="orange"
              >XP</q-avatar>+50 XP
            </span>
            <span class="full-width q-mb-none">Completed by 87 other TEK-UPpers</span>
            <div class="full-width q-mb-none" style="position:relative;">
              <q-linear-progress
                style="height: 20px;"
                :value="0.5"
                color="green"
                class="q-mt-none"
              />
              <div class="text-white text-bold set-position">7/100</div>
            </div>
          </div>
        </div>
      </transition>
    </q-img>
    <q-card-section class="q-p-none">
      <div class="text-bold text-secondary q-pb-none">Implementation, Dynamic Programming</div>
      <q-rating icon="star" size="20px" color="grey" readonly v-model="stars" :max="5" />
    </q-card-section>
  </q-card>
</template>

<script>
export default {
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
</style>
