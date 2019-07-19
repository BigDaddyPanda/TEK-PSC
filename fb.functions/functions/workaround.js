exports.remakeAll = functions.https.onRequest((req, resp) => {
  getAll()
    .then(async r => {
      // await r.map(e => {});
      resp.json("Done", r);
    })
    .catch(err => {
      resp.status(500).json(err.toString());
    });
});

const getAll = async nextPageToken => {
  // List batch of users, 1000 at a time.
  let profile = (e, v) => ({
    progress: {
      userId: v,
      codeforcesHandle: e,
      level: {
        totalXP: 0,
        lessons: []
      },
      achievements: [],
      contestStandings: []
    },
    successfullSubmissions: []
  });
  let allUsersId = [];
  console.log("Next Page");
  await admin
    .auth()
    .listUsers(100)
    .then(async listUsersResult => {
      await console.log(
        "listUsersResult.length",
        _.size(listUsersResult.users)
      );

      let x = [];
      x = listUsersResult.users.map(async userRecord => {
        let e = userRecord.toJSON().uid;
        await admin
          .firestore()
          .collection("progress")
          .doc(e)
          .get()
          .then(async snapshot => {
            await console.log(_.size(snapshot.data()), "data for", snapshot.id);
            // let datum = snapshot.data();
            if (snapshot.exists) {
              if (!snapshot.data().contestSubmissions) {
                console.log("No Submissions", Object.keys(snapshot.data()));
              } else {
                await admin
                  .firestore()
                  .collection("progress")
                  .doc(e)
                  .update({
                    ...profile(
                      snapshot.data().contestSubmissions[0].Contestant,
                      e
                    )
                  });
                console.log(
                  "You ruined",
                  e,
                  "progress",
                  snapshot.data().contestSubmissions[0].Contestant,
                  Object.keys(snapshot.data())
                );
                console.log(
                  _.size(snapshot.data().contestSubmissions),
                  "contest sub",
                  e
                );
                allUsersId.push(e);
                // admin
                //   .firestore()
                //   .collection("progress")
                //   .doc(e)
                //   .update({
                //     ...profile(datum.contestSubmissions[0].Contestant)
                //   });
              }
            }
          });
        // allUsersId.push(userRecord.toJSON().uid);
        Promise.all(x);
      });
    })
    .catch(function(error) {
      console.log("Error listing users:", error);
      return Promise.reject(500);
    });
  return Promise.all(allUsersId);
};
