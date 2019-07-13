<template>
  <div style="width: 100%; max-width: 400px">
    <q-scroll-area style="height: 60vh;">
      <!-- <q-chat-message name="me" :text="['hey, how are you?']" sent stamp="7 minutes ago"/>
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
      -->
      <q-chat-message
        v-for="(chatItem, ind) in generalChat"
        :key="ind"
        :name="getName(chatItem.name)"
        :text="chatItem.text"
        :stamp="$moment(chatItem.time).from()"
        :sent="getName(chatItem.name)=='Me'"
      />
    </q-scroll-area>
    <q-input
      outlined
      bottom-slots
      v-model="message_text"
      label="Input a text for General Chat"
      @keyup.enter="sendMessage"
      dense
    >
      <template v-slot:after>
        <q-btn round dense flat icon="send" @click="sendMessage" />
      </template>
    </q-input>
  </div>
</template>

<script>
import ChatTab from "./ChatTab";
import { mapGetters, mapActions } from "vuex";
export default {
  name: "chat-tab",

  computed: {
    ...mapGetters({
      generalChatGetter: "chatStore/generalChatGetter"
    }),
    generalChat() {
      if (this.$_.isEmpty(this.generalChatGetter)) {
        return [];
      } else {
        return this.$_.reduce(this.generalChatGetter, (result, current) => {
          if (!result.length) {
            result = [
              {
                ...current,
                text: [current.text]
              }
            ];
          } else {
            if (current.name === result[0].name) {
              result[0].text.unshift(current.text);
            } else {
              result.unshift({
                ...current,
                text: [current.text]
              });
            }
          }
          return result;
        });
      }
    }
  },
  methods: {
    ...mapActions({
      sendChat: "chatStore/sendChat"
    }),
    sendMessage() {
      if (this.message_text === "") return;
      this.sendChat(this.message_text);
      this.message_text = "";
    },
    getName(name) {
      const user = this.$firebase.auth().currentUser;
      if (user) {
        if (name === user.displayName || name === user.email) {
          return "Me";
        }
      }
      return name;
    }
  },
  data() {
    return {
      message_text: ""
    };
  }
};
</script>

<style>
</style>
