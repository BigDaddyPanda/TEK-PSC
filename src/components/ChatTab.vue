<template>
  <div style="width: 100%; max-width: 400px">
    <q-scroll-area style="height: 60vh;">
      <q-chat-message name="me" :text="['hey, how are you?']" sent stamp="7 minutes ago"/>
      <q-chat-message
        name="Jane"
        :text="[`doing fine, how r you?`,`doing fine, how r you?`]"
        stamp="4 minutes ago"
      />
      <q-chat-message name="Jane" :text="[`doing fine, how r you?`]" stamp="4 minutes ago"/>
      <q-chat-message name="me" :text="['hey, how are you?']" sent stamp="7 minutes ago"/>
      <q-chat-message
        name="Jane"
        :text="[`doing fine, how r you?`,`doing fine, how r you?`]"
        stamp="4 minutes ago"
      />
      <q-chat-message name="me" :text="['hey, how are you?']" sent stamp="2 minutes ago"/>
      <q-chat-message
        name="Jane"
        :text="[`doing fine, how r you?`,`doing fine, how r you?`]"
        stamp="2 minutes ago"
      />
    </q-scroll-area>
    <q-input
      outlined
      bottom-slots
      v-model="message_text"
      label="Label"
      dense
    >
      <template v-slot:after>
        <q-btn round dense flat icon="send"/>
      </template>
    </q-input>
  </div>
</template>

<script>
export default {
  name: "chat-tab",
  data() {
    return {
      message_text: ""
    };
  }
};
</script>

<style>
</style>
