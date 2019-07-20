<template>
  <q-page padding>
    <!-- content -->
    <div class="row justify-center q-pa-lg">
      <div class="col-xs-12 col-md-6 q-pl-md q-pr-md q-mb-lg">
        <div class="full-width text-center">
          <p
            class="text-bold text-grey-8 text-uppercase text-subtitle1 q-mb-none q- q-pl-none"
          >Week Activity</p>
          <p
            class="text-italic text-grey-6 text-subtitle2 q-mb-sm q-pl-none"
          >Lessons that will take place during {{$moment().startOf('week').format("DD MMMM")}} - {{$moment().endOf('week').format("DD MMMM")}}</p>
        </div>
        <activity-preview :lesson="weekLesson" />
      </div>
      <div class="full-width row justify-start">
        <div class="col-12 q-pr-md q-pl-md q-pr-md">
          <p
            class="text-bold text-grey-8 text-uppercase text-subtitle1 q-mb-none q- q-pl-none"
          >All Lessons</p>
          <p
            class="text-italic text-grey-6 text-subtitle2 q-mb-sm q- q-pl-none"
          >Definition, guidelines and source codes for major Algorithms.</p>
        </div>
        <div v-for="lesson in allLessons" :key="lesson.order" class="col-md-3 col-xs-12 q-pa-md">
          <activity-preview :isPreview="true" :lesson="lesson" />
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import ActivityPreview from "components/WeekActivity/ActivityPreview";
import _ from "lodash";
import { mapGetters } from "vuex";
export default {
  name: "Lessons",
  computed: {
    ...mapGetters({
      LessonsGetter: "lessonStore/LessonsGetter"
    })
  },
  methods: {
    getOne(order, lesInd) {
      // console.log(order, lesInd);
      if (order) return order;
      return lesInd;
    }
  },
  components: {
    ActivityPreview
  },
  mounted() {
    this.weekLesson = this.LessonsGetter.filter(e => e.isWeekActivity)[0] || {};
    this.allLessons = _.sortBy(this.LessonsGetter, "order") || [];
    this.loaded = true;
  },
  data() {
    return {
      weekLesson: {},
      allLessons: [],
      loaded: false
    };
  }
};
</script>

<style>
</style>
