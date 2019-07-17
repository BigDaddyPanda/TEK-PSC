<template>
  <div class="fit">
    <div v-if="loaded" class="row justify-center">
      <q-parallax :src="lessonModel.coverPhoto"></q-parallax>
      <q-page class="bg-grey-3" style="width:75%;top:-25vh;" padding>
        <div class="q-pt-md row">
          <h3 class="q-mb-xs col-12">{{lessonModel.name}}</h3>
          <h5 class="q-mb-xs col-12">Content</h5>
          <div class="col-12" v-html="lessonModel.content"></div>
          <div class="col-12" v-if="!$_.isEmpty(lessonModel.quiz)">
            <fire-works style="z-index:10;height:100%;width:100%;" v-if="fullyCorrect" />
            <h5 class="q-mb-xs">Quizz</h5>
            <div class="row" v-for="(qz, k) in lessonModel.quiz" :key="k">
              <div class="col-12" v-html="qz.question"></div>
              <q-option-group
                v-model="userAnswers[k]"
                type="checkbox"
                :disable="userSubmitted"
                :options="qz.answers.map((e,ii)=>({label:e,value:ii}))"
                :color="userSubmitted?(partiallyCorrect(k)?'green':'red'):'grey'"
              ></q-option-group>
              <q-inner-loading :showing="visibleReload">
                <q-spinner-gears size="50px" color="primary" />
              </q-inner-loading>
            </div>
            <div class="full-width row justify-center">
              <div
                class="col-12 text-center text-orange"
                v-if="(userSubmitted&&!fullyCorrect)"
              >Oh no :( there are some wrong answers!</div>
              <q-btn
                v-if="!userSubmitted"
                @click="checkAnswers()"
                color="positive"
                label="Check my answers"
              />
              <q-btn
                v-if="userSubmitted&&!fullyCorrect"
                @click="retry()"
                color="warning"
                label="try again"
              />
            </div>
          </div>
          <div
            v-else
            class="full-width q-mb-xs text-secondary"
          >This lesson does not contain any Quiz.</div>
          <div
            class="col-12 text-center q-mt-xl q-pa-md"
            v-if="fullyCorrect||$_.isEmpty(lessonModel.quiz)"
          >
            <div
              class="full-width q-mb-xs text-secondary"
              v-if="fullyCorrect"
            >Congrats, You have successfully Completed {{lessonModel.name}} Topic.</div>
            <div
              v-if="!$_.isEmpty(lessonModel.nextLesson)"
              class="full-width q-mb-xs text-secondary"
            >You can Move on now to the next Lesson</div>
            <q-btn
              v-if="!$_.isEmpty(lessonModel.nextLesson)"
              no-caps
              color="secondary"
              text-color="black"
              style="z-index:100;"
              :to="'/psc/lesson/'+lessonModel.nextLesson.value"
              replace
              :label="`Learn ${lessonModel.nextLesson.label}`"
            />
            <div
              v-else
              class="full-width q-mb-xs text-secondary"
            >A part of the journey is the end, no next Topic</div>
          </div>
        </div>
      </q-page>
    </div>
    <div v-else></div>
  </div>
</template>

<script>
import { db } from "boot/firebase";
import FireWorks from "components/FireWorks.vue";
import lessonModel from "../../../utils/lesson.json";
import _ from "lodash";
import { mapActions } from "vuex";
export default {
  name: "LessonPreview",
  components: {
    FireWorks
  },
  methods: {
    retry() {
      this.userSubmitted = false;
      this.fullyCorrect = false;
      this.visibleReload = true;
      setTimeout(() => {
        this.visibleReload = false;
        this.userAnswers = Array(this.lessonModel.quiz.length).fill([]);
      }, 500);
    },
    checkAnswers() {
      this.userSubmitted = true;
      if (_.isEmpty(this.lessonModel) || _.isEmpty(this.lessonModel.quiz)) {
        this.fullyCorrect = false;
        return;
      }
      let fullness = _.every(
        this.lessonModel.quiz.map((q, e) => this.partiallyCorrect(e))
      );
      if (fullness) {
        let lessonSchema = {
          lessonId: this.lessonModel.lessonId,
          lessonName: this.lessonModel.name,
          lessonTags: this.lessonModel.tags,
          gainedXP: Number(this.lessonModel.xp)
        };
        this.submitUnlockingNewLesson(lessonSchema);
      }
      this.fullyCorrect = fullness;
    },
    ...mapActions({
      submitUnlockingNewLesson: "progressStore/submitUnlockingNewLesson"
    }),
    reload() {
      this.loaded = false;
      this.$q.loading.show({
        message: this.$lessonJoke()
      });
      setTimeout(() => {
        let lessonId = this.$route.params.id;
        db.collection("lessons")
          .where("lessonId", "==", lessonId)
          .get()
          .then(snapshot =>
            snapshot.forEach(doc => {
              this.lessonModel = doc.data();
              this.userAnswers = Array(this.lessonModel.quiz.length).fill([]);
              this.loaded = true;
              this.$q.loading.hide();
              this.userSubmitted = false;
              this.fullyCorrect = false;
            })
          )
          .catch(error => {
            this.loaded = false;
            this.$q.notify(error.toString());
          });
      }, 1500);
    },
    partiallyCorrect(k) {
      if (_.isEmpty(this.userAnswers[k])) {
        return false;
      }

      return _.isEqual(
        _.sortBy(this.lessonModel.quiz[k].correct),
        _.sortBy(this.userAnswers[k])
      );
    }
  },
  mounted() {
    this.reload();
  },
  watch: {
    myLessonId: function(newVal) {
      this.reload();
    }
  },
  computed: {
    myLessonId: function() {
      return this.$route.params.id;
    }
  },
  data() {
    return {
      loaded: false,
      userSubmitted: false,
      visibleReload: false,
      fullyCorrect: false,
      userAnswers: [],
      lessonModel: {}
    };
  }
};
</script>

<style>
</style>
