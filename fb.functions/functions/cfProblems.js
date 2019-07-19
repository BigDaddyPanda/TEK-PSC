const rp = require("request-promise");
const cheerio = require("cheerio");
const cheerioTableparser = require("cheerio-tableparser");
const _ = require("lodash");

/**
 * knowing that at 7/16/2019
 * Codeforces Group Contest problem list
 * #	Name	 nothing nothing nothing
 * we parse it the we return the result as an array
 * [index - name]
 */
module.exports = async contestUrl => {
  let allProblemsAsObjects = [];
  const html = await rp(contestUrl).catch(error => {
    return [];
  });
  $ = cheerio.load(html);
  cheerioTableparser($);
  let allParsedProblems = $("table.problems").parsetable(false, false, true);
  let keyz = allParsedProblems.map((e, i) => (e[0] ? e[0] : i));
  allProblemsAsObjects = _.concat(
    allProblemsAsObjects,
    _.zip(..._.map(allParsedProblems, e => e.slice(1)))
      .map(e => ({
        ..._.zipObject(
          keyz,
          e.map(v => {
            if (typeof v == typeof "String") {
              return v.split("\n")[0];
            } else {
              return v;
            }
          })
        )
      }))
      .map(e => ({
        name: `${e["#"]} - ${e["Name"]}`,
        link: contestUrl + `/problem/${e["#"]}`,
        index: e["#"]
      }))
  );

  return Promise.all(allProblemsAsObjects);
};
