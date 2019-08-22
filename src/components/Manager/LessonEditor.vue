<template>
  <q-card class="text-primary">
    <q-bar class="bg-primary text-white">
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
    <q-stepper v-model="step" header-nav ref="stepper" color="primary" animated>
      <q-step :name="1" title="Set Lesson Details" icon="settings" :done="done1">
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
            <my-uploader
              photoCollection="lessons"
              :coverPhoto="lessonModel.coverPhoto"
              @input="v=>lessonModel.coverPhoto=v"
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
          <div class="row">
            <q-select
              filled
              dense
              v-model="lessonModel.tags"
              multiple
              :options="tags"
              use-chips
              label="Lesson Tags"
              class="col-xs-6 col-md-3 q-pa-md"
            />
            <q-select
              filled
              dense
              v-model="lessonModel.nextLesson"
              :options="allLessonsOption"
              label="Next Lesson"
              class="col-xs-6 col-md-3 q-pa-md"
              use-chips
            />
            <q-input
              filled
              dense
              v-model="lessonModel.xp"
              class="col-xs-6 col-md-3 q-pa-md"
              label="Lesson XP"
              type="number"
            />
            <div class="col-xs-6 col-md-3 q-pa-md text-primary justify-center content-center">
              <q-toggle color="primary" v-model="lessonModel.isPublic" />
              {{lessonModel.isPublic?"":"Don't"}} Make it public!
            </div>
            <div class="col-xs-12 q-pa-md text-primary justify-around row content-center">
              <h5 class="col-12 text-center q-ma-none">How do you like the content?</h5>
              <div
                @click="lessonModel.isModern=true"
                :class="[lessonModel.isModern?'shadow-2 bg-grey-2':'','cursor-pointer row justify-center']"
              >
                <q-avatar size="25vh" :square="true">
                  <q-img src="statics/Util Icons/lesson_modern.png"></q-img>
                </q-avatar>
                <div class="col-12 text-subtitle1 text-center q-pa-xs">
                  Modern Content
                  <div class="text-subtitle2 text-center">Various Media and Content</div>
                </div>
              </div>

              <div
                @click="lessonModel.isModern=false"
                :class="[!lessonModel.isModern?'shadow-2 bg-grey-2':'','cursor-pointer row justify-center']"
              >
                <q-avatar size="25vh" :square="true">
                  <q-img src="statics/Util Icons/lesson_standard.png"></q-img>
                </q-avatar>

                <div class="col-12 text-subtitle1 text-center q-pa-xs">
                  Simple Content
                  <div class="text-subtitle2 text-center">Single Course with Quizz</div>
                </div>
              </div>
            </div>
          </div>
        </q-card-section>
        <q-stepper-navigation>
          <q-btn @click="() => { done1 = true; step = 2 }" color="primary" label="Continue" />
        </q-stepper-navigation>
      </q-step>

      <q-step :name="2" title="Create rich content" icon="create_new_folder" :done="done2">
        <q-card-section>
          <div class="text-h6">Lesson Content</div>
        </q-card-section>
        <q-card-section>
          <modern-lesson :lessonModel="lessonModel" v-if="lessonModel.isModern" />
          <q-editor
            v-else
            @paste.native="evt => pasteCapture(evt)"
            @drop.native="evt => dropCapture(evt)"
            v-model="lessonModel.content"
            class="text-black"
            :dense="$q.screen.lt.md"
            :toolbar="EditorOptions.toolbar"
            :fonts="EditorOptions.fonts"
          />
        </q-card-section>
        <q-stepper-navigation>
          <q-btn @click="() => { done2 = true; step = 3 }" color="primary" label="Continue" />
          <q-btn flat @click="step = 1" color="primary" label="Back" class="q-ml-sm" />
        </q-stepper-navigation>
      </q-step>

      <q-step :name="3" title="Add Quiz" icon="add_comment" :done="done3">
        <q-stepper-navigation>
          <q-card-section v-if="!$_.isEmpty(lessonModel.quiz)" class="q-ma-md">
            <div v-for="(qz, quizIndex) in lessonModel.quiz" :key="quizIndex">
              <h6 class="q-my-none">Quizz Statement</h6>
              <q-editor
                v-model="lessonModel.quiz[quizIndex].question"
                class="text-black"
                :dense="$q.screen.lt.md"
                :toolbar="EditorOptions.toolbar"
                :fonts="EditorOptions.fonts"
              />
              <h6 class="q-mt-xs q-mb-none">Quizz Answers</h6>
              <div class="row">
                <q-input
                  v-for="(qst, ansInd) in lessonModel.quiz[quizIndex].answers"
                  :key="ansInd"
                  class="col-xs-12 col-md-6 q-px-md q-pb-md"
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
          <q-btn flat @click="step = 2" color="primary" label="Back" class="q-ml-sm" />
        </q-stepper-navigation>
      </q-step>
    </q-stepper>
    <q-card-actions>
      <q-btn
        v-if="lessonModel.lessonId!=null"
        class="q-pa-md full-width"
        color="positive"
        label="Update Lesson"
        @click="updateLesson(lessonModel)"
      />
      <q-btn
        v-else
        class="q-pa-md full-width"
        color="positive"
        label="Save Lesson"
        @click="saveLesson(lessonModel)"
      />
    </q-card-actions>
  </q-card>
</template>

<script>
import MyUploader from "../Utils/MyUploader";
import ModernLesson from "./ModernLesson";
import editorOptions from "../../utils/editor";
import { mapGetters, mapActions } from "vuex";
import tags from "../../utils/tags.json";
export default {
  name: "LessonEditor",
  props: {
    maximizedToggle: Boolean,
    toggleMaximizedToggle: Function,
    dismissModal: Function
  },
  components: {
    ModernLesson,
    MyUploader
  },
  watch: {
    watchModer(newV) {
      if (newV) {
        if (typeof this.lessonModel.content !== typeof []) {
          this.lessonModel.content = [];
        }
      } else {
        if (typeof this.lessonModel.content !== typeof "z") {
          this.lessonModel.content = "";
        }
      }
    }
  },
  computed: {
    ...mapGetters({
      lessonPreview: "lessonStore/lessonPreview",
      allLessons: "lessonStore/AllLessonsGetter"
    }),
    watchModer() {
      return this.lessonModel.isModern;
    }
  },
  mounted() {
    this.lessonModel = this.$_.cloneDeep(this.lessonPreview);
    this.allLessonsOption = this.allLessons.map(e => ({
      label: e.name,
      value: e.lessonId
    }));
  },
  data() {
    return {
      lessonModel: {},
      allLessonsOption: [],
      EditorOptions: editorOptions(this.$q),
      tags,
      step: 1,
      done1: false,
      done2: false,
      done3: false
    };
  },
  methods: {
    pasteCapture: evt => {},
    dropCapture(e) {
      e.stopPropagation();
      e.preventDefault();
      var files = e.dataTransfer.files;
      this.createFile(files[0]);
    },
    createFile(file) {
      if (!file.type.match("image.*")) {
        alert("Select an image");
        return;
      }
      var img = new Image();
      var reader = new FileReader();
      var vm = this;

      reader.onload = function(e) {
        vm.lessonModel.content += `<img :src="${e.target.result}"/>`;
      };
      reader.readAsDataURL(file);
    },
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
    saveLesson(les) {
      this.locsaveLesson(les).then(() => {
        this.$q.notify(`Successfully saved the ${les.name} Lesson`);
        this.$nextTick(this.dismissModal);
      });
    },
    updateLesson(les) {
      this.locupdateLesson(les).then(() => {
        this.$q.notify(`Successfully updated the ${les.name} Lesson`);
        this.$nextTick(this.dismissModal);
      });
    },
    ...mapActions({
      locsaveLesson: "lessonStore/saveLesson",
      locupdateLesson: "lessonStore/updateLesson",
      dismissLesson: "lessonStore/dismissLesson"
    })
  }
};
</script>

<style scoped>
</style>
