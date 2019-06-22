<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-charade text-white">
      <q-toolbar class="specialheader">
        <q-toolbar-title>
          <q-img src="statics/brand-logo.png" spinner-color="white" style="width:142px"/>
        </q-toolbar-title>

        <q-space></q-space>
        <q-btn color="secondary" >Login</q-btn>
        <q-btn>Register</q-btn>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view/>
    </q-page-container>

    <q-footer elevated>
      <q-toolbar class="bg-charade text-white">
        <div>{{release}}</div>
        <q-space/>
        <div>ACM TEK-UP</div>
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>

<script>
export default {
  data() {
    return {
      release:
        this.$_.startCase(process.env.NODE_ENV + " release") +
        " - " +
        this.$moment().year()
    };
  }
};
</script>
