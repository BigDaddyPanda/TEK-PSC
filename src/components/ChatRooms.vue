<template>
  <div class="q-pa-none">
    <div class="bg-grey-1" style="max-width: 600px">
      <q-expansion-item v-model="expanded">
        <template v-slot:header>
          <q-item-section avatar>
            <q-avatar>
              <img src="statics/media/discord.png">
            </q-avatar>
          </q-item-section>
          <q-item-section>Join us on Discord</q-item-section>
        </template>

        <q-card>
          <q-card-section class="text-center">
            {{$t("joindiscordtext")}}
            <q-btn
              size="sm"
              replace
              class="full-width"
              type="a"
              to="https://discord.gg/VeYhgje"
              target="_blank"
              outline
              label="Join us!"
            />
          </q-card-section>
        </q-card>
      </q-expansion-item>

      <q-bar style="min-width: 250px;" class="bg-teal text-white rounded-borders">
        <q-btn label="General" flat @click="tab='General'"/>
        <q-btn label="Edit" flat @click="tab='Edit'"/>
        <q-btn label="Edit" flat @click="tab='Edit'"/>
        <q-btn label="Edit" flat @click="tab='Edit'"/>
        <q-btn label="Edit" flat @click="tab='Edit'"/>
      </q-bar>
      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="General">
          <chat-tab/>
        </q-tab-panel>
      </q-tab-panels>
    </div>
  </div>
</template>

<script>
import ChatTab from "./ChatTab";
export default {
  name: "chat-rooms",
  components: {
    ChatTab
  },
  data() {
    return {
      tab: "General",
      expanded: false
    };
  }
};
</script>

<style>
</style>
