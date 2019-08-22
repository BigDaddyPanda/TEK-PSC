<template>
  <div :class="className">
    <input type="file" ref="file" style="display: none" @change="uploadFile" />
    <q-btn
      :loading="isUpdating"
      :percentage="percentile"
      :color="buttonColor"
      class="col-3"
      @click="$refs.file.click()"
      label="upload"
      flat
    />

    <q-btn
      v-if="inlineLink"
      class="col-9"
      @click="$goto(coverPhoto)"
      :label="$_.min([coverPhoto,coverPhoto&&`${coverPhoto.slice(0,30)+'...'}`])"
      flat
    />
  </div>
</template>

<script>
import nanoid from "nanoid";

export default {
  name: "MyUploader",
  props: {
    coverPhoto: {
      type: String,
      default: ""
    },
    photoCollection: {
      type: String,
      default: "lessons"
    },
    buttonColor: {
      type: String,
      default: "primary"
    },
    inlineLink: {
      type: Boolean,
      default: true
    },
    className: {
      type: Array,
      default: () => ["col-xs-6 col-md-3 q-pa-md row"]
    }
  },
  data() {
    return {
      isUpdating: false,
      percentile: 0
    };
  },
  methods: {
    uploadFile(e) {
      this.isUpdating = true;
      const file = e.target.files[0];
      this.percentile = 0;
      this.$storage
        .ref(this.photoCollection + "/" + nanoid(3))
        .put(file)
        .then(response => {
          response.ref
            .getDownloadURL()
            .then(downloadURL => {
              this.$positive(
                `Successfully uploaded the ${this.$_.startCase(
                  this.photoCollection
                )} Media`
              );
              this.percentile = 100;
              this.$emit("input", downloadURL);
              this.isUpdating = false;
            })
            .catch(err => {
              this.$q.notify({
                color: "negative",
                messag: err.toString()
              });
              this.isUpdating = false;
              // console.log(err);
            });
        });
    }
  }
};
</script>

<style>
</style>
