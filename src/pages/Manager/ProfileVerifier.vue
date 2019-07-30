<template>
  <div class="fit">
    <div class="row justify-center">
      <q-parallax src="statics/covers/binary - Copy.png"></q-parallax>
      <q-page class="bg-grey-3" style="width:75%;top:-25vh;" padding>
        <div class="full-width row">
          <q-space />
          <q-btn label="Upload profiles" @click="updateUserLists" :loading="uploadingProfiles" />
        </div>
        <q-table
          :loading="retrievingUsers"
          title="Profiles Viewer"
          :data="myUsers"
          :columns="columns"
          row-key="name"
          :pagination="pagination"
        />
      </q-page>
    </div>
  </div>
</template>

<script>
import { db, firebase } from "boot/firebase";
import _ from "lodash";
export default {
  mounted() {
    this.loadMyUsers();
  },
  methods: {
    updateUserLists() {
      this.uploadingProfiles = true;
      db.collection("profiles")
        .doc("1")
        .set({
          public: this.myUsers
        })
        .then(() => {
          this.uploadingProfiles = false;
        });
    },
    async loadMyUsers() {
      this.retrievingUsers = true;
      let x = await this.$db
        .collection("progress")
        .get()
        .then(r =>
          _.sortBy(
            r.docs.map(e => ({
              codeforcesHandle: e.data().progress.codeforcesHandle,
              uid: e.data().progress.userId
            })),
            "uid"
          )
        );

      this.myUsers = await this.$axios
        .get("https://us-central1-tek-up-psc.cloudfunctions.net/getUsers")
        .then(r =>
          _.map(r.data, e => ({
            ...e,
            ..._.find(x, ["uid", e.uid])
          }))
        );
      this.retrievingUsers = false;
    }
  },
  data() {
    return {
      uploadingProfiles: false,
      retrievingUsers: false,
      myUsers: [],
      pagination: {
        page: 1,
        rowsPerPage: 100
        // rowsNumber: xx if getting data from a server
      },
      columns: [
        {
          name: "email",
          required: true,
          label: "Email Adress",
          align: "left",
          field: row => row.email,
          format: val => `${val}`,
          sortable: true
        },
        {
          name: "displayName",
          label: "Email Adress",
          align: "left",
          field: row => row.displayName,
          format: val => `${val || "No Display Name"}`,
          sortable: true
        },
        {
          name: "CodeForces",
          label: "CodeForces Handle",
          align: "left",
          field: row => row.codeforcesHandle,
          format: val => `${val || "No Affected Codeforces Handle"}`,
          sortable: true
        }
      ]
    };
  }
};
</script>

<style>
</style>
