<template>
  <div class="q-pa-md">
    <q-stepper header-nav v-model="step" vertical color="primary" animated>
      <q-step
        v-for="(part,k) in lessonModel.content"
        :key="part.id"
        :name="part.id"
        :title="`Part ${part.id+1}${part.header?(': '+part.header):''}`"
        icon="settings"
      >
        <q-input v-model="lessonModel.content[k].header" label="Section Header" />
        <q-input v-model="lessonModel.content[k].description" label="Section Description" autogrow />
        <div class="fit row">
          <div class="col-xs-12 col-md-6">
            <h6>Media uploader</h6>
            <my-uploader
              :mediaType="part.mediaType"
              @input="v=>lessonModel.content[k].mediaLink=v"
            />
          </div>
          <div class="col-xs-12 col-md-6">
            <h6>Media Preview</h6>
            <media
              v-if="part.mediaType&&part.mediaLink"
              :mediaType="part.mediaType"
              :mediaLink="part.mediaLink"
            />
            <div v-else class="fit row text-center">No Preview is available</div>
          </div>
        </div>
        <q-input v-model="lessonModel.content[k].mediaTitle" label="Media Title" />
        <q-input
          v-model="lessonModel.content[k].mediaDescription"
          label="Media Description"
          autogrow
        />

        <q-stepper-navigation>
          <q-btn @click="removePart(k)" color="negative" class="q-mr-md" round icon="delete" />
          <!-- <q-btn
            color="grey"
            class="q-mr-md"
            :disable="part.id==lessonModel.content.length-1"
            @click="downward(k)"
            round
            icon="arrow_downward"
          />
          <q-btn
            @click="upward(k)"
            color="grey"
            class="q-mr-md"
            :disable="part.id==0"
            round
            icon="arrow_upward"
          />-->
        </q-stepper-navigation>
      </q-step>

      <div
        v-if="lessonModel.content.length==0"
        class="full-width text-center text-grey-3 justify-center row"
      >
        <h3>No Content available yet.</h3>
      </div>
      <div
        class="full-width justify-center row"
        @mouseenter="showAdd=true"
        @mouseleave="showAdd=false"
      >
        <transition name="fade" mode="out-in">
          <div v-if="showAdd" class="fit row justify-around">
            <q-card
              v-for="(type,kt) in mediaTypes"
              :key="kt"
              class="cursor-pointer col-xs-12 q-pa-md col-md-2"
              @click="confirmAddPart(type)"
            >
              <q-img :src="photos[kt]" basic></q-img>
              <q-card-actions>
                <div class="absolute-bottom text-subtitle2 text-center">Add {{type}} Content</div>
              </q-card-actions>
            </q-card>
          </div>
          <q-btn
            class="q-mt-md"
            v-else
            size="md"
            @click="newPartModal=true"
            color="positive"
            label="Add New Part"
          />
        </transition>
      </div>
    </q-stepper>
  </div>
</template>

<script>
import _ from "lodash";
import MyUploader from "../Utils/FactoryUploader";
import Media from "../Utils/MediaPreview";
export default {
  props: ["lessonModel"],
  components: {
    MyUploader,
    Media
  },
  methods: {
    downward(id) {
      console.log(id, "is going down");

      const x = _.cloneDeep(this.lessonModel.content[id]);
      this.lessonModel.content[id] = this.lessonModel.content[id + 1];
      this.lessonModel.content[id + 1] = x;
      this.lessonModel.content[id] = id;
      this.lessonModel.content[id + 1] = id + 1;
    },
    upward(id) {
      const x = _.cloneDeep(this.lessonModel.content[id]);
      console.log(id, "is going up");
      this.lessonModel.content[id] = this.lessonModel.content[id + 1];
      this.lessonModel.content[id - 1] = x;
      this.lessonModel.content[id] = id;
      this.lessonModel.content[id - 1] = id - 1;
    },
    removePart(k, sure = false) {
      this.lessonModel.content.splice(k, 1);
    },
    alternatePart(k) {
      this.newPartModal = true;
    },
    cancelNewPart() {
      this.newPartModal = false;
    },
    confirmAddPart(type) {
      this.lessonModel.content.push({
        id: this.lessonModel.content.length,
        header: "",
        description: "",
        mediaTitle: "",
        mediaDescription: "",
        mediaType: type,
        mediaLink: "",
        includesQuiz: ""
      });
      this.step = this.lessonModel.content.length - 1;
    }
  },
  data() {
    return {
      mediaTypes: ["PDF", "Video", "Slider", "Text"],
      photos: [
        "statics/Util Icons/pdf.png",
        "statics/Util Icons/video-lesson.png",
        "statics/Util Icons/gallery.png",
        "statics/Util Icons/open-book.png"
      ],
      showAdd: false,
      step: 1,
      newPartModal: false
    };
  }
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter, .fade-leave-to
/* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
