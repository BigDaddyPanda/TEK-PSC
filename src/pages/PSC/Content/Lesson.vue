<template>
  <div class="row justify-center">
    <q-parallax src="statics/covers/binary - Copy.png"></q-parallax>
    <q-page class="bg-grey-3" style="width:75%;top:-25vh;" padding>
      <fire-works style="z-index:10" v-if="t[LessonExample.quiz[0].correct]" />
      <div class="q-pt-md row">
        <h3 class="q-mb-xs col-12">{{LessonExample.name}}</h3>
        <h5 class="q-mb-xs col-12">Content</h5>
        <div class="col-12" v-html="LessonExample.content"></div>
        <div class="col-12" v-if="LessonExample.quiz">
          <h5 class="q-mb-xs">Quizz</h5>
          <div class="row" v-for="(qz, k) in LessonExample.quiz" :key="k">
            <div class="col-12">{{qz.question}}</div>
            <div class="col-xs-12 col-md-6" v-for="(ans, index) in qz.answers" :key="index">
              <transition name="fade">
                <q-checkbox
                  v-if="t[qz.correct]||!t[qz.correct]&&!t[index]"
                  v-model="t[index]"
                  :disable="t[qz.correct]||t[index]"
                  @click="checkAnswer"
                  :label="ans"
                  :color="qz.correct==index?'green':'pink'"
                />
              </transition>
            </div>
          </div>
        </div>
        <div v-else></div>
        <div
          v-if="t[LessonExample.quiz[0].correct]&&LessonExample.nextLessonName"
          class="col-12 text-center q-mt-xl q-pa-md"
        >
          <div class="full-width q-mb-xs">
            Congrats, You have successfully Completed {{LessonExample.name}} Topic.
            <br />
            We can Move on now to the new Section {{LessonExample.nextLessonName}}
          </div>
          <q-btn
            no-caps
            color="secondary"
            text-color="black"
            style="z-index:100;"
            :to="'/psc/lesson/'+LessonExample.nextLessonName"
            label="To the Next"
          />
        </div>
      </div>
    </q-page>
  </div>
</template>

<script>
import FireWorks from "components/FireWorks.vue";
import LessonExample from "../../../utils/lesson.json";
export default {
  name: "LessonPreview",
  components: {
    FireWorks
  },
  methods: {
    checkAnswer() {
      this.$q.notify("Hii");
    }
  },
  data() {
    return {
      t: {
        0: false,
        1: false,
        2: false,
        3: false
      },
      LessonExample
    };
  }
};
</script>

<style>
</style>
