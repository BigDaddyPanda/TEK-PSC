<template>
  <div class="row justify-center">
    <fire-works style="z-index:10" v-if="fullyCorrect" />
    <q-parallax :src="lessonModel.coverPhoto"></q-parallax>
    <q-page class="bg-grey-3" style="width:75%;top:-25vh;" padding>
      <div class="q-pt-md row">
        <h3 class="q-mb-xs col-12">{{lessonModel.name}}</h3>
        <h5 class="q-mb-xs col-12">Content</h5>
        <div class="col-12" v-html="lessonModel.content"></div>
        <div class="col-12" v-if="lessonModel.quiz">
          <h5 class="q-mb-xs">Quizz</h5>
          <div class="row" v-for="(qz, k) in lessonModel.quiz" :key="k">
            <div class="col-12">{{qz.question}}</div>
            <q-option-group
              v-model="userAnswers[k]"
              type="checkbox"
              :disable="partiallyCorrect(k)"
              :options="qz.answers.map((e,ii)=>({label:e,value:ii}))"
              :color="partiallyCorrect(k)?'green':'pink'"
            />
          </div>
        </div>
        <div v-else></div>
        <div class="col-12 text-center q-mt-xl q-pa-md" v-if="fullyCorrect">
          <div class="full-width q-mb-xs">
            Congrats, You have successfully Completed {{lessonModel.name}} Topic.
            <br />We can Move on now to the next Lesson
          </div>
          <q-btn
            no-caps
            color="secondary"
            text-color="black"
            style="z-index:100;"
            :to="'/psc/lesson/'+lessonModel.nextLesson.value"
            replace
            :label="`Learn ${lessonModel.nextLesson.label}`"
          />
        </div>
      </div>
    </q-page>
  </div>
</template>

<script>
import { db } from "boot/firebase";
import FireWorks from "components/FireWorks.vue";
import lessonModel from "../../../utils/lesson.json";
import _ from "lodash";
export default {
  name: "LessonPreview",
  components: {
    FireWorks
  },
  methods: {
    reload() {
      let lessonId = this.$route.params.id;
      db.collection("lessons")
        .where("lessonId", "==", lessonId)
        .get()
        .then(snapshot =>
          snapshot.forEach(doc => {
            this.lessonModel = doc.data();
            this.userAnswers = Array(this.lessonModel.quiz.length).fill([]);
          })
        );
    },
    partiallyCorrect(k) {
      if (_.isEmpty(this.userAnswers[k])) {
        return false;
      }
      if (
        this.lessonModel.quiz[k].correct.every(val =>
          this.userAnswers[k].includes(val)
        )
      ) {
        return true;
      }
      return false;
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
    },
    fullyCorrect: function() {
      if (_.isEmpty(this.lessonModel.quiz)) return false;
      return _.every(
        this.lessonModel.quiz.map((q, e) => this.partiallyCorrect(e))
      );
    }
  },
  data() {
    return {
      userAnswers: [],
      lessonModel: {}
    };
  }
};
</script>

<style>
</style>
