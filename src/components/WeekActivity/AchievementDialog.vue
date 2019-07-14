<template>
  <q-dialog ref="dialog" @hide="onDialogHide">
    <q-card class="q-dialog-plugin">
      <q-card-section class="row justify-center">
        <q-avatar size="25vh">
          <q-img :src="achievement.icon" />
        </q-avatar>
      </q-card-section>
      <q-card-section class="row justify-center text-center">
        <h6 class="col-12">Hurray!! new achievement!!</h6>
        <h5 class="col-12 text-secondary" v-html="achievement.label"></h5>
        <span class="col-12 text-italic text-teal" v-html="achievement.description"></span>
        <div class="col-12 text-center">
          <h6>Gracefully unlocked by your effort doing the following milestones:</h6>
          <q-badge
            v-for="(item, index) in achievement.required"
            :key="index"
            class="q-pl-xs"
            :label="item.goal+'x'+item.target"
          ></q-badge>
        </div>
      </q-card-section>

      <!-- buttons example -->
      <q-card-actions align="right">
        <social-sharing
          url="https://vuejs.org/"
          title="The Progressive JavaScript Framework"
          description="Intuitive, Fast and Composable MVVM for building interactive interfaces."
          quote="Vue is a progressive framework for building user interfaces."
          hashtags="vuejs,javascript,framework"
          twitter-user="vuejs"
          inline-template
        >
          <network network="facebook">
            <q-btn icon="fa fab-facebook" color="blue-7" flat round />
          </network>
        </social-sharing>
        <q-btn color="primary" label="Cool!" @click="onCancelClick" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
var SocialSharing = require("vue-social-sharing");
export default {
  components: {
    SocialSharing
  },
  props: {
    achievement: Object
    // ...your custom props
  },

  methods: {
    // following method is REQUIRED
    // (don't change its name --> "show")
    show() {
      this.$refs.dialog.show();
    },

    // following method is REQUIRED
    // (don't change its name --> "hide")
    hide() {
      this.$refs.dialog.hide();
    },

    onDialogHide() {
      // required to be emitted
      // when QDialog emits "hide" event
      this.$emit("hide");
    },

    onOKClick() {
      // on OK, it is REQUIRED to
      // emit "ok" event (with optional payload)
      // before hiding the QDialog
      this.$emit("ok");
      // or with payload: this.$emit('ok', { ... })

      // then hiding dialog
      this.hide();
    },

    onCancelClick() {
      // we just need to hide dialog
      this.hide();
    }
  }
};
</script>
