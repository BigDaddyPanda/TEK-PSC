<template>
  <q-card flat>
    <!-- content -->
    <q-card-section>
      <h5 class="text-center text-bold">SIGN UP AND START PLAYING, FOR FREE</h5>
      <div class="row justify-between">
        <q-btn
          size="lg"
          align="left"
          style="width:48%"
          class="q-mb-lg"
          color="white"
          text-color="grey"
          no-caps
          unelevated
          outline
          icon="img:statics/social/google.png"
          label="Sign up with Google"
        />
        <q-btn
          size="lg"
          align="left"
          style="width:48%"
          class="q-mb-lg"
          color="white"
          text-color="grey"
          no-caps
          unelevated
          outline
          icon="img:statics/social/facebook.png"
          label="Sign up with Facebook"
        />
        <q-btn
          size="lg"
          align="left"
          style="width:48%"
          class="q-mb-sm"
          color="white"
          text-color="grey"
          no-caps
          unelevated
          outline
          icon="img:statics/social/github.png"
          label="Sign up with GitHub"
        />
        <q-btn
          size="lg"
          align="left"
          style="width:48%"
          class="q-mb-sm"
          color="white"
          text-color="grey"
          no-caps
          unelevated
          outline
          icon="img:statics/social/linkedin.png"
          label="Sign up with LinkedIN"
        />
      </div>
    </q-card-section>
    <q-card-section>
      <div class="row q-gutter-xs">
        <q-input
          class="col-12"
          square
          outlined
          type="email"
          v-model="email"
          label="Email"
        />
        <q-input
          class="col-12"
          square
          outlined
          type="password"
          v-model="password"
          label="Password"
        />
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
export default {
  // name: 'PageName',
  data() {
    return {
      email: "",
      password: ""
    };
  }
};
</script>

<style>
</style>
