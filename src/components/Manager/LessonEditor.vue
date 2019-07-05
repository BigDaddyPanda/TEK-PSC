<template>
  <q-card class="text-white">
    <q-bar class="bg-primary">
      <q-space />

      <q-btn dense flat icon="minimize" @click="toggleMaximizedToggle" :disable="!maximizedToggle">
        <q-tooltip v-if="maximizedToggle" content-class="bg-white text-primary">Minimize</q-tooltip>
      </q-btn>
      <q-btn
        dense
        flat
        icon="crop_square"
        @click="toggleMaximizedToggle"
        :disable="maximizedToggle"
      >
        <q-tooltip v-if="!maximizedToggle" content-class="bg-white text-primary">Maximize</q-tooltip>
      </q-btn>
      <q-btn dense flat icon="close" @click="dismissModal">
        <q-tooltip content-class="bg-white text-primary">Close</q-tooltip>
      </q-btn>
    </q-bar>
    <q-card-section>
      <div class="text-h6 full-width">Lesson Details</div>
      <div class="row">
        <q-input
          class="col-xs-6 col-md-3 q-pa-md"
          dense
          label="Name"
          filled
          v-model="lessonModel.name"
        />
        <q-input
          class="col-xs-6 col-md-3 q-pa-md"
          dense
          label="Editor"
          filled
          v-model="lessonModel.editor"
        />
        <q-input
          class="col-xs-6 col-md-3 q-pa-md"
          dense
          label="Cover Photo URL"
          filled
          v-model="lessonModel.coverPhoto"
        />
        <q-space />
        <q-input
          class="col-xs-6 col-md-3 q-pa-md"
          dense
          label="Added Date"
          filled
          v-model="lessonModel.addedDate"
          mask="date"
        >
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                <q-date v-model="lessonModel.addedDate" @input="() => $refs.qDateProxy.hide()" />
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </div>
    </q-card-section>
    <q-card-section>
      <div class="text-h6">Lesson Content</div>
    </q-card-section>
    <q-card-section>
      <q-editor
        v-model="lessonModel.content"
        class="text-black"
        :dense="$q.screen.lt.md"
        :toolbar="EditorOptions.toolbar"
        :fonts="EditorOptions.fonts"
      />
    </q-card-section>
    <q-card-section>
      <q-btn round icon="add" color="positive" class="q-mr-md" />Include a Quizz
    </q-card-section>

    <q-card-section v-if="!$_.isEmpty(lessonModel.quiz)" class="q-ma-md">
      <div v-for="(qz, quizIndex) in lessonModel.quiz" :key="quizIndex">
        <q-input
          outlined
          v-model="lessonModel.quiz[quizIndex].question"
          label="Question"
          class="q-pr-md"
          dense
        />
        <div class="row">
          <q-input
            v-for="(qst, ansInd) in lessonModel.quiz[quizIndex].answers"
            :key="ansInd"
            class="col-xs-12 col-md-6 q-pa-md"
            label="Answer"
            outlined
            v-model="lessonModel.quiz[quizIndex].answers[ansInd]"
            dense
          >
            <template v-slot:append>
              <q-icon
                @click="toggleIsAnswer(quizIndex,ansInd)"
                color="positive"
                class="cursor-pointer"
                :name="lessonModel.quiz[quizIndex].correct.includes(ansInd)?'star':'star_border'"
              >
                <q-tooltip>Correct Answer</q-tooltip>
              </q-icon>
              <q-icon
                name="close"
                @click="lessonModel.quiz[quizIndex].answers[ansInd].text = ''"
                class="cursor-pointer"
              />
            </template>
          </q-input>
        </div>
        <q-separator class="q-mb-sm" />
      </div>

      <q-btn
        outline
        class="full-width q-pr-md"
        color="secondary"
        label="Add another"
        @click="addQuizz()"
      />
    </q-card-section>
    <q-btn
      outline
      class="full-width q-pa-md"
      color="positive"
      label="Save Lesson"
      @click="saveLesson()"
    />
  </q-card>
</template>

<script>
import editorOptions from "../../utils/editor";
import { mapGetters, mapActions } from "vuex";
export default {
  name: "LessonEditor",
  props: {
    maximizedToggle: Boolean,
    toggleMaximizedToggle: Function,
    dismissModal: Function
  },
  computed: {
    ...mapGetters({
      lessonPreview: "lessonStore/lessonPreview"
    })
  },
  data() {
    return {
      lessonModel: {
        name: "",
        content: "",
        editor: "",
        isWeekActivity: false,
        addedDate: "",
        backGroundPhoto: "",
        quiz: [
          {
            question: "",
            answers: ["", "", "", ""],
            correct: []
          }
        ],
        nextLessonName: ""
      },
      EditorOptions: editorOptions(this.$q)
    };
  },
  methods: {
    addQuizz() {
      this.lessonModel.quiz.push({
        question: "",
        answers: ["", "", "", ""],
        correct: []
      });
    },
    toggleIsAnswer(quizIndex, ansInd) {
      if (this.lessonModel.quiz[quizIndex].correct.includes(ansInd)) {
        this.lessonModel.quiz[quizIndex].correct.splice(
          this.lessonModel.quiz[quizIndex].correct.indexOf(ansInd),
          1
        );
      } else {
        this.lessonModel.quiz[quizIndex].correct.push(ansInd);
      }
    },
    saveLesson() {},
    ...mapActions({
      dismissLesson: "lessonStore/dismissLesson"
    })
  }
};
</script>

<style>
</style>
