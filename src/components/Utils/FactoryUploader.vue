<template>
  <div :class="className">
    <q-uploader :factory="factoryFn">
      <template v-slot:list="scope">
        <q-list separator>
          <q-item v-for="file in scope.files" :key="file.name">
            <q-item-section>
              <q-item-label class="full-width ellipsis">{{ file.name }}</q-item-label>

              <q-item-label caption>Status: {{ file.__status }}</q-item-label>

              <q-item-label caption>{{ file.__sizeLabel }} / {{ file.__progressLabel }}</q-item-label>
            </q-item-section>

            <q-item-section v-if="file.__img" thumbnail class="gt-xs">
              <img :src="file.__img.src" />
            </q-item-section>

            <q-item-section top side>
              <q-btn
                class="gt-xs"
                size="12px"
                flat
                dense
                round
                icon="delete"
                @click="scope.removeFile(file)"
              />
            </q-item-section>
          </q-item>
        </q-list>
      </template>
    </q-uploader>
  </div>
</template>

<script>
import nanoid from "nanoid";

export default {
  name: "FactoryUploader",
  props: {
    coverPhoto: {
      type: String,
      default: ""
    },
    mediaType: {
      type: String,
      default: "PDF"
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
    factoryFn(file) {
      console.log(file);
      return this.$storage
        .ref(this.mediaType + "/" + nanoid(3) + "." + file[0].name.split(".").pop())
        .put(file[0])
        .then(response => {
          response.ref
            .getDownloadURL()
            .then(downloadURL => {
              this.$positive(
                `Successfully uploaded the ${this.$_.startCase(
                  this.mediaType
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
