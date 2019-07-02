<template>
  <q-page padding>
    <!-- content -->
    <div class="row justify-center q-pa-lg">
      <div class="col-6 q-pl-md q-pr-md">
        <div class="full-width">
          <p
            class="text-bold text-grey-8 text-uppercase text-subtitle1 q-mb-none q- q-pl-none"
          >Next Contest</p>
          <p
            class="text-italic text-grey-6 text-subtitle2 q-mb-sm q- q-pl-none"
          >Contribute to enhance your level and gain huge prizes</p>
        </div>
        <activity-preview />
      </div>
      <div class="col-6 q-pl-md q-pr-md q-mb-lg">
        <div class="full-width">
          <p
            class="text-bold text-grey-8 text-uppercase text-subtitle1 q-mb-none q- q-pl-none"
          >Week Activity</p>
          <p
            class="text-italic text-grey-6 text-subtitle2 q-mb-sm q- q-pl-none"
          >Lessons that will take place during 27-31 July</p>
        </div>
        <activity-preview />
      </div>
      <div class="full-width row justify-start">
        <div class="col-12 q-pr-md q-pl-md q-pr-md">
          <p
            class="text-bold text-grey-8 text-uppercase text-subtitle1 q-mb-none q- q-pl-none"
          >All Lessons</p>
          <p
            class="text-italic text-grey-6 text-subtitle2 q-mb-sm q- q-pl-none"
          >Definition, guidelines and source codes for major Algorithms.</p>
        </div>
        <div class="col-md-3 col-xs-12 q-pr-md q-pl-md">
          <activity-preview />
        </div>
        <div class="col-md-3 col-xs-12 q-pr-md q-pl-md">
          <activity-preview />
        </div>
        <div class="col-md-3 col-xs-12 q-pr-md q-pl-md">
          <activity-preview />
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import ActivityPreview from "components/WeekActivity/ActivityPreview";
export default {
  name: "Lessons",
  components: {
    ActivityPreview
  }
};
</script>

<style>
</style>
