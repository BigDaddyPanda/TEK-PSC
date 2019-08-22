<template>
  <q-page class="fit">
    <q-toolbar class="bg-primary text-white">
      <q-btn outline round dense :loading="loadingResult" @click="roll" icon="play_arrow" />
      <q-toolbar-title>
        Code it Online!
        <!-- Code #7299
        <span class="text-caption">by Amine Zarouane</span>-->
      </q-toolbar-title>
      <q-space />
      <q-select
        style="width:120px"
        dark
        dense
        label="Lang"
        filled
        v-model="language"
        :options="codeOptions.lang"
      />
      <q-select
        style="width:120px"
        dark
        dense
        label="Theme"
        filled
        v-model="theme"
        :options="codeOptions.theme"
      />
    </q-toolbar>
    <div class="fit row">
      <div class="col-xs-12 col-md-6 q-pa-md">
        <editor
          v-model="user_code"
          @init="editorInit"
          ref="user_code"
          :lang="language.value"
          :theme="theme.value"
          :width="S.x"
          :height="S.y"
        ></editor>
      </div>
      <div class="col-xs-12 col-md-6 row justify-center">
        <div class="col-8">
          <h6 class="q-mx-none q-mb-none q-mt-lg">Input</h6>
          <editor
            v-model="user_input"
            @init="editorInit"
            ref="user_input"
            lang="powershell"
            :theme="theme.value"
            :width="S.x_console"
            :height="S.y_console"
          ></editor>
        </div>
        <div class="col-8">
          <h6 class="q-ma-none">Output</h6>
          <editor
            :value="user_output"
            @init="editorInit"
            lang="powershell"
            :theme="theme.value"
            ref="user_output"
            :width="S.x_console"
            :height="S.y_console"
          ></editor>
        </div>
      </div>
    </div>
    <div class="col-12 row justify-around">
      <table class="full-width text-center">
        <thead>
          <th>Status</th>
          <th>Memory</th>
          <th>CPU Runtime</th>
        </thead>
        <tr>
          <td>{{statusCode==200?"Success":"N/A"}}</td>
          <td>{{memory?(memory+" KB"):"N/A"}}</td>
          <td>{{cpuTime ?(cpuTime+ " ms"):"N/A"}}</td>
        </tr>
      </table>
    </div>
  </q-page>
</template>

<script>
import codeOptions from "../../../utils/codeOptions.js";
import jdoodleSettings from "../../../secrets/jdoodle.json";
import axios from "axios";
export default {
  name: "CIOnline",
  components: {
    editor: require("vue2-ace-editor")
  },
  methods: {
    roll() {
      console.log("jdood", {
        ...jdoodleSettings,
        language: this.jdlanguage,
        script: this.user_code,
        stdin: this.user_input
      });

      this.loadingResult = true;
      // https://docs.jdoodle.com/compiler-api/compiler-api#what-languages-and-versions-supported
      axios
        .post("https://simple-counter.herokuapp.com/execute", {
          ...jdoodleSettings,
          language: this.jdlanguage,
          script: this.user_code,
          stdin: this.user_input
        })
        .then(r => r.data)
        .then(r => {
          this.loadingResult = false;
          if (!r.error) {
            this.user_output = r.output;
            this.statusCode = r.statusCode;
            this.memory = r.memory;
            this.cpuTime = r.cpuTime;
            this.$positive("Successfully Submitted");
          } else {
            this.$negative("Could not submit your Problem");
          }
        })
        .catch(err => {
          this.$negative(err.toString());
          this.loadingResult = false;
        });
    },
    editorInit: function() {
      require("brace/ext/language_tools"); // language extension prerequsite...
      require("brace/mode/html");
      require("brace/mode/javascript"); // language
      require("brace/mode/c_cpp"); // language
      require("brace/mode/powershell"); // language
      require("brace/mode/less");
      require("brace/theme/chrome");
      require("brace/theme/monokai");
      require("brace/theme/dracula");
      require("brace/snippets/powershell"); // snippet
      require("brace/snippets/c_cpp"); // snippet
      require("brace/snippets/python"); // snippet
    }
  },
  watch: {
    selected_langg(nv) {
      if (nv === this.codeOptions.lang[0]) {
        this.jdlanguage = "cpp14";
      } else {
        this.jdlanguage = "python3";
      }
    }
  },
  computed: {
    selected_langg() {
      // cpp
      return this.language.value;
    },
    script_id() {
      return this.$route.params.script_id || "New Code";
    },
    S() {
      return {
        x: this.$q.screen.lt.md
          ? this.$q.screen.width
          : Math.floor((this.$q.screen.width * 5) / 11),
        y: this.$q.screen.lt.md
          ? this.$q.screen.height
          : Math.floor((this.$q.screen.height * 6) / 9),
        x_console: this.$q.screen.lt.md
          ? this.$q.screen.width
          : Math.floor((this.$q.screen.width * 3) / 8),
        y_console: this.$q.screen.lt.md
          ? this.$q.screen.height
          : Math.floor(this.$q.screen.height / 4)
      };
    }
  },
  data() {
    return {
      jdoodleSettings,
      codeOptions,
      loadingResult: false,
      user_code: "",
      user_input: "",
      user_output: "",
      statusCode: "",
      memory: "",
      cpuTime: "",
      jdlanguage: "cpp14",
      language: codeOptions.lang[0],
      theme: codeOptions.theme[0],
      size: codeOptions.size[0]
    };
  }
};
</script>

<style>
</style>
