<template>
  <div>
    <object :data="mediaLink" width="100%" height="100%">
      <iframe :src="mediaLink" width="100%" height="100%" style="border: none;">
        <p>
          Your browser does not support {{mediaType}}s.
          <a
            :href="mediaLink"
          >Download the {{mediaType}}</a>.
        </p>
      </iframe>
    </object>
  </div>
</template>

<script>
export default {
  name: "MediaPreview",
  props: {
    mediaType: String,
    mediaLink: String,
    className: {
      type: Array,
      default: () => ["col-xs-6 col-md-3 q-pa-md row"]
    }
  }
};
</script>

<style>
</style>
