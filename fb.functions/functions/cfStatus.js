const rp = require("request-promise");
const cheerio = require("cheerio");
const cheerioTableparser = require("cheerio-tableparser");
const _ = require("lodash");

/**
 * knowing that at 7/16/2019
 * Codeforces Group Contest status results in the following
 * datatable
 * #, When, Who, Problem, Lang, Verdict, Time, Memory
 * we parse it the way we have a successful submission object
 * then we push it to the firebase database for the owner
 * successful submission
 */
module.exports = async contestUrl => {
  // const baseUrl = "https://codeforces.com/";
  // const groupUrl = baseUrl + "group/Bm8uz7ooRI/";
  // const contestUrl = groupUrl + "contest/247184/";
  const contestStatusUrlByPage = i =>
    contestUrl + `/status/page/${i}?order=BY_ARRIVED_DESC`;
  const genSubLink = e => contestUrl + "/submission/" + e;

  let i = 0;
  let prevHtml = -42;
  let allSubmissionsAsObjects = [];
  while (true) {
    console.log("fetching through", contestStatusUrlByPage(i));

    i++;
    const html = await rp(contestStatusUrlByPage(i)).catch(err => {
      return err;
    });
    $ = cheerio.load(html);
    cheerioTableparser($);
    let allSubmissions = $("table.status-frame-datatable").parsetable(
      false,
      false,
      true
    );
    console.log("Caught", allSubmissions.length);

    let currFirstId = allSubmissions[0][1];
    if (prevHtml === currFirstId) {
      break;
    } else {
      let keyz = allSubmissions.map((e, i) => {
        switch (e[0]) {
          case "#":
            return "submissionId";
          case "When":
            return "creationTimeSeconds";
          case "Who":
            return "Contestant";
          case "Lang":
            return "programmingLanguage";
          case "Verdict":
            return "verdict";
          default:
            return e[0];
        }
      });
      console.log("Defined keys:", keyz);

      allSubmissionsAsObjects = _.concat(
        allSubmissionsAsObjects,
        _.zip(..._.map(allSubmissions, e => e.slice(1))).map(e => ({
          ..._.zipObject(keyz, e),
          submissionLink: genSubLink(e[0])
        }))
      ).filter(e => e.verdict === "Accepted");
      // allSubmissionsAsObjects = _.uniqBy(
      //   allSubmissionsAsObjects,
      //   e => e["Who"] + e["Problem"]
      // );
      prevHtml = currFirstId;
    }
  }
  return Promise.all(allSubmissionsAsObjects);
};
