<template>
  <div class="q-pa-md">
    <!-- <div class="full-width row q-gutter-md">
      <q-space />
      <q-input square dense debounce="300" color="primary" v-model="filter">
        <template v-slot:append>
          <q-icon name="search" />
        </template>
      </q-input>
    </div>-->
    <div class="fit row">
      <div
        class="col-md-4 col-xs-12 col-lg-3 q-pa-xs"
        v-for="(lesson, ind) in LessonsGetter"
        :key="ind"
        style="height:33vh;"
      >
        <q-card class="fit">
          <q-img style="height: 80% !important;" :src="lesson.coverPhoto">
            <div class="absolute-bottom">
              <div class="text-h6">{{lesson.name}}</div>
              <div class="text-subtitle2">by {{lesson.editor}}</div>
              <div
                class="text-subtitle2"
              >Designated Next Lesson: {{$_.startCase(lesson.nextLesson.label)}}</div>
            </div>
          </q-img>

          <q-card-actions>
            <q-space />
            <q-btn
              flat
              :icon="lesson.isWeekActivity?'star':'star_outline'"
              round
              @click="markAsWeekActivity(lesson)"
            >
              <q-tooltip>Mark as week Activity</q-tooltip>
            </q-btn>
            <q-btn flat @click="openModal(lesson)">Edit</q-btn>
            <q-btn flat @click="removeLesson(lesson.lessonId)">Delete</q-btn>
          </q-card-actions>
        </q-card>
      </div>
    </div>
    <q-dialog
      v-model="dialog"
      persistent
      :maximized="maximizedToggle"
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <lesson-editor
        :maximizedToggle="maximizedToggle"
        :toggleMaximizedToggle="toggleMaximizedToggle"
        :dismissModal="dismissModal"
      />
    </q-dialog>
    <q-page-sticky position="bottom-left" :offset="[18, 18]">
      <q-btn round color="accent" @click="openModal()" icon="add" />
    </q-page-sticky>
  </div>
</template>
<script>
import LessonEditor from "../../components/Manager/LessonEditor";
import { mapActions, mapState, mapGetters } from "vuex";
export default {
  name: "LessonManager",
  computed: {
    ...mapGetters({
      LessonsGetter: "lessonStore/LessonsGetter"
    })
  },
  components: {
    LessonEditor
  },
  watch: {
    includesQuiz: function(value) {
      if (value) {
        this.addQuizz();
      } else this.newLesson.quiz = [];
    }
  },
  mounted() {
    this.loadLessons();
  },
  methods: {
    toggleMaximizedToggle: function() {
      this.maximizedToggle = !this.maximizedToggle;
    },
    ...mapActions({
      addNewLesson: "lessonStore/addNewLesson",
      dismissLesson: "lessonStore/dismissLesson",
      openLesson: "lessonStore/openLesson",
      loadLessons: "lessonStore/bindLessonsRef",
      delLesson: "lessonStore/removeLesson",
      locmarkAsWeekActivity: "lessonStore/markAsWeekActivity"
    }),
    removeLesson: function(params) {
      console.log(params);

      this.delLesson(params).then(() => {
        this.$nextTick(this.loadLessons);
      });
    },
    markAsWeekActivity(lesson) {
      this.locmarkAsWeekActivity(lesson).then(() => {
        this.$nextTick(this.loadLessons);
      });
    },
    openModal(lessson) {
      if (lessson) {
        this.openLesson(lessson);
      } else {
        this.addNewLesson();
      }
      this.dialog = true;
    },
    dismissModal() {
      this.dismissLesson();
      this.dialog = false;
    }
  },
  data() {
    return {
      filter: "",
      maximizedToggle: true,
      selected: [],
      dialog: false
    };
  }
};
</script>
<style lang="stylus">
.grid-style-transition {
  transition: transform 0.28s, background-color 0.28s;
}

.my-card {
}
</style>
