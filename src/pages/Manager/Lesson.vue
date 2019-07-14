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
    <draggable
      :disabled="!toggleOrdrer"
      :list="allOfLessons"
      class="list-group fit row"
      ghost-class="bg-red"
    >
      <div
        class="col-md-4 col-xs-12 col-lg-3 q-pa-xs"
        v-for="(lesson, ind) in allOfLessons"
        :key="ind"
        style="height:33vh;"
      >
        <q-card class="fit">
          <q-img style="height: 80% !important;" :src="lesson.coverPhoto">
            <div class="absolute-bottom">
              <div class="text-h6">{{lesson.name}}</div>
              <div class="text-subtitle2">by {{lesson.editor}}</div>
              <div
                v-if="!$_.isEmpty(lesson.nextLesson)"
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
    </draggable>
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
    <q-page-sticky v-if="toggleOrdrer" position="top-right" :offset="[18, 18]">
      <q-btn
        round
        color="green-6"
        @click="confirmResort()"
        :loading="loadingOrderSubmission"
        icon="gavel"
      />
    </q-page-sticky>
    <q-page-sticky position="top-left" :offset="[18, 18]">
      <q-btn
        round
        color="accent"
        @click="toggleOrdrer=!toggleOrdrer"
        :icon="toggleOrdrer?'close':'view_carousel'"
      />
    </q-page-sticky>
  </div>
</template>
<script>
import LessonEditor from "../../components/Manager/LessonEditor";
import draggable from "vuedraggable";
import { mapActions, mapState, mapGetters } from "vuex";
import { db } from "boot/firebase";

export default {
  name: "LessonManager",
  computed: {
    ...mapGetters({
      LessonsGetter: "lessonStore/LessonsGetter"
    }),
    allOfLessonsKeyIndex() {
      return this.$_.times(this.allOfLessons.length, i => i);
    }
  },
  components: {
    LessonEditor,
    draggable
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
    confirmResort() {
      const _ = this.$_;
      this.loadingOrderSubmission = true;
      let newUpdatedOrder = _.map(this.allOfLessons, (e, i) => ({
        ...e,
        order: i
      }));
      _.differenceBy(newUpdatedOrder, this.LessonsGetter, "order").forEach(
        element => {
          db.collection("lessons")
            .where("lessonId", "==", element.lessonId)
            .get()
            .then(snapshot => {
              snapshot.forEach(doc => {
                db.collection("lessons")
                  .doc(doc.id)
                  .update({
                    order: element.order
                  });
              });
            })
            .then(() => {
              this.toggleOrdrer = false;
              this.loadingOrderSubmission = false;
            });
        }
      );
    },
    loadLessons: function() {
      this.bindLessonsRef().then(() => {
        this.allOfLessons = this.$_.cloneDeep(this.LessonsGetter);
      });
    },
    ...mapActions({
      addNewLesson: "lessonStore/addNewLesson",
      dismissLesson: "lessonStore/dismissLesson",
      openLesson: "lessonStore/openLesson",
      bindLessonsRef: "lessonStore/bindLessonsRef",
      delLesson: "lessonStore/removeLesson",
      locmarkAsWeekActivity: "lessonStore/markAsWeekActivity"
    }),
    removeLesson: function(params) {
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
      allOfLessons: [],
      loadingOrderSubmission: false,
      toggleOrdrer: false,
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
