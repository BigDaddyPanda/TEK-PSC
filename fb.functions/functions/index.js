const getContestStandings = require("./cfStandings");
const getSubmissions = require("./cfStatus");
const getContestProblems = require("./cfProblems");
const functions = require("firebase-functions");
const _ = require("lodash");
const admin = require("firebase-admin");
admin.initializeApp({ credential: admin.credential.applicationDefault() });
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.helloWorld = functions.https.onRequest((request, response) => {
  response.set("Access-Control-Allow-Origin", "*");
  response.send("Hello from Firebase!");
});

exports.scrapStandings = functions.https.onRequest((request, response) => {
  let { link } = request.query;
  response.set("Access-Control-Allow-Origin", "*");
  getContestStandings(link)
    .then(res => response.json(res))
    .catch(err => response.json(err));
});
exports.scrapProblems = functions.https.onRequest((request, response) => {
  let { link } = request.query;
  response.set("Access-Control-Allow-Origin", "*");
  getContestProblems(link)
    .then(res => response.json(res))
    .catch(err => response.json(err));
});

exports.scrapStatus = functions.https.onRequest((request, response) => {
  let { link } = request.query;
  response.set("Access-Control-Allow-Origin", "*");
  console.log("parsing", link);

  getSubmissions(link)
    .then(res => {
      let resGroupByHandle = _.groupBy(res, "Contestant");
      console.log(res.length, "ok submissions among", _.size(resGroupByHandle));
      let handles = _.map(resGroupByHandle, submissions => {
        let cfhandle = submissions[0].Contestant;
        console.log(_.size(submissions), "submissions to save for ", cfhandle);
        admin
          .firestore()
          .collection("progress")
          .where("progress.codeforcesHandle", "==", cfhandle)
          .get()
          .then(snapshot => {
            console.log(snapshot.size, "profiles matched");
            snapshot.forEach(doc => {
              console.log("Document exists for", cfhandle, doc.id);
              admin
                .firestore()
                .collection("progress")
                .doc(doc.id)
                .update({
                  contestSubmissions: admin.firestore.FieldValue.arrayUnion(
                    ...submissions
                  )
                });
            });
          })
          .catch(err => {
            console.log(err);
          });
        return cfhandle;
      });
      return Promise.all(handles);
    })
    .then(res => {
      console.log("Done updating", _.size(res), "profiles");
      let sanitized_link = link.match(/\/group\/.+\/contest\/\w+\/?/);
      if (sanitized_link) {
        sanitized_link = sanitized_link[0].replace(/\//g, "_");
      } else {
        sanitized_link = _.uniqueId();
      }
      console.log("Setting document for", sanitized_link);
      var doneb = {
        "done-writing": "true",
        last_check: Date.now()
      };
      admin
        .firestore()
        .collection("sample_scrappedStatus")
        .doc(sanitized_link)
        .set({ ...doneb })
        .then(() => {
          console.log("Done Saving to database");
          response.json("Done");
        })
        .catch(err => {
          console.log("You messed up", err.toString());
          response.json("Error");
        });
    })
    .catch(err => {
      console.log(err);
      response.status(500).json(err);
    });
});
