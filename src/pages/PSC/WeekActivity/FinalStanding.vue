<template>
  <q-page padding>
    <!-- content -->
    <div class="q-pa-md row q-gutter-md full-width justify-center">
      <q-list dark class="bg-primary" style="width: 700px">
        <q-item clickable class="bg-grey-3" v-ripple>
          <q-item-section></q-item-section>
          <q-item-section></q-item-section>
          <q-item-section side>
            <q-chip outline square color="deep-orange" text-color="white" class="q-ml-none">Rank</q-chip>
          </q-item-section>
          <q-item-section side>
            <q-chip outline square color="deep-orange" text-color="white" class="q-ml-none">Rank</q-chip>
          </q-item-section>
          <q-item-section side>
            <q-chip outline square color="deep-orange" text-color="white" class="q-ml-none">Rank</q-chip>
          </q-item-section>
        </q-item>
        <q-item v-ripple>
          <q-item-section avatar>
            <q-avatar size="100px">
              <img src="https://cdn.quasar.dev/img/avatar2.jpg" />
            </q-avatar>
          </q-item-section>

          <q-item-section style="width:50%">
            <q-item-label lines="1" class="text-h4">Ladys Wesharom</q-item-label>
          </q-item-section>

          <q-item-section side>
            <q-avatar
              outline
              square
              color="deep-orange"
              text-color="white"
              class="q-ml-none"
              size="60px"
            >1st</q-avatar>
          </q-item-section>
          <q-item-section side>
            <q-avatar
              outline
              square
              color="deep-orange"
              text-color="white"
              class="q-ml-none"
              size="60px"
            >1st</q-avatar>
          </q-item-section>
          <q-item-section side>
            <q-avatar
              outline
              square
              color="deep-orange"
              text-color="white"
              class="q-ml-none"
              size="60px"
            >1st</q-avatar>
          </q-item-section>
        </q-item>
      </q-list>
    </div>
  </q-page>
</template>

<script>
import FireWorks from "components/FireWorks.vue";
export default {
  // name: 'PageName',
  components: {
    // FireWorks
  }
};
</script>

<style>
</style>
