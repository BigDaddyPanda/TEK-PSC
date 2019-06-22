<template>
  <q-page padding>
    <q-ajax-bar ref="bar" position="bottom" color="accent" size="10px" skip-hijack/>
    <!-- content -->
    <div class="q-pa-md">
      <q-parallax :height="300">
        <template v-slot:media>
          <video  :poster="yesNoWtf.image" autoplay loop muted>
            <!-- <source type="video/webm" :src="yesNoWtf.image"> -->
            <source type="video/webm" src="https://cdn.quasar.dev/img/polina.webm">
            <source type="video/mp4" src="https://cdn.quasar.dev/img/polina.mp4">
          </video>
        </template>

        <h3 class="text-white">{{yesNoWtf.answer}}</h3>
      </q-parallax>
      <div class="q-pa-md">
        <q-btn color="secondar" label="Trigger" @click="trigger"/>
        <p v-for="i in 50" :key="i">Lorem ipsum dolor sit amet consectetur adipisicing elit. Quo pariatur obcaecati, voluptatibus rerum ea quos sequi accusamus magni excepturi eligendi vero iste, tempore ab quod libero sit nemo laborum voluptatem.</p>
      </div>
    </div>
  </q-page>
</template>

<script>
export default {
  // name: 'PageName',
  data() {
    return {
      yesNoWtf: {}
    };
  },
  methods: {
    // we manually trigger it (this is not needed if we
    // don't skip Ajax calls hijacking)
    trigger() {
      const bar = this.$refs.bar;

      bar.start();
      this.$axios("https://yesno.wtf/api").then(r => {
        this.yesNoWtf = r.data;
        this.$refs.bar.stop();
      });
    }
  }
};
</script>

<style>
</style>
