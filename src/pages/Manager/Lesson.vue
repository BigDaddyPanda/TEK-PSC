<template>
  <div class="q-pa-md">
    <div class="full-width row q-gutter-md">
      <q-space />
      <q-input square dense debounce="300" color="primary" v-model="filter">
        <template v-slot:append>
          <q-icon name="search" />
        </template>
      </q-input>
    </div>
    <div class="fit row">
      <q-card
        v-for="(lesson, ind) in Lessons"
        :key="ind"
        class="my-card col-md-4 col-xs-6 col-lg-3 q-ma-xs"
      >
        <q-img src="https://cdn.quasar.dev/img/parallax2.jpg">
          <div class="absolute-bottom">
            <div class="text-h6">{{lesson.name}}</div>
            <div class="text-subtitle2">by {{lesson.editor}}</div>
            <div
              class="text-subtitle2"
            >Designated Next Lesson: {{$_.startCase(lesson.nextLessonName)}}</div>
          </div>
        </q-img>

        <q-card-actions>
          <q-space />
          <q-btn flat>Is Overview</q-btn>
          <q-btn flat>Edit</q-btn>
          <q-btn flat>Delete</q-btn>
        </q-card-actions>
      </q-card>
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
import Lessons from "../../utils/lessons.json";
import { mapActions, mapState, mapGetters } from "vuex";
export default {
  name: "LessonManager",
  computed: {
    ...mapGetters({
      dialogStore: "lessonStore/dialog"
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
  methods: {
    toggleMaximizedToggle: function() {
      this.maximizedToggle = !this.maximizedToggle;
    },
    ...mapActions({
      addNewLesson: "lessonStore/addNewLesson",
      dismissLesson: "lessonStore/dismissLesson",
      openLesson: "lessonStore/openLesson"
    }),
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
      dialog: false,
      Lessons
    };
  }
};
</script>
<style lang="stylus">
.grid-style-transition {
  transition: transform 0.28s, background-color 0.28s;
}
</style>
