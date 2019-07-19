const rp = require("request-promise");
const cheerio = require("cheerio");
const cheerioTableparser = require("cheerio-tableparser");
const _ = require("lodash");

/**
 * knowing that at 7/16/2019
 * Codeforces Group Contest problem list
 * ### Rank  Name	 Nothing Nothing Nothing
 * we parse it the we return the result as an array
 * [index - name]
 */
module.exports = async contestUrl => {
  contestUrl += "/standings";
  let allStandings = [];
  const html = await rp(contestUrl).catch(err => {
    return err;
  });
  $ = cheerio.load(html);
  cheerioTableparser($);
  let allParsedStandings = $("table.standings").parsetable(false, false, true);
  let keyz = allParsedStandings.map((e, i) => {
    switch (e[0]) {
      case "#":
        return 100 + i + "|Rank";
      case "Who":
        return 100 + i + "|Contestant";
      case "":
        return 100 + i + "|";
      case "=":
        return 100 + i + "|Solved";
      default:
        return 100 + i + "|" + e[0];
    }
  });
  allStandings = _.zip(..._.map(allParsedStandings, e => e.slice(1))).map(
    e => ({
      ..._.zipObject(
        keyz,
        e.map(v => {
          if (typeof v === typeof "String" && v.includes("\n")) {
            if (v.split("\n").length > 1) {
              return `${v.split("\n")[0].trim()}|${v.split("\n")[1].trim()}`;
            } else {
              return `${v.split("\n")[0].trim()}`;
            }
          } else {
            return v;
          }
        })
      )
    })
  );
  allParsedStandings.slice(4).map(e => {
    let fts = _.indexOf(
      e.slice(1),
      _.minBy(e.slice(1), v => (v ? `${v}` : "...."))
    );
    (
      allStandings[fts].firstToSolve || (allStandings[fts].firstToSolve = [])
    ).push(e[0]);
  });

  //the last row is a summuary for submissions
  allStandings.pop();
  return Promise.all(allStandings);
};
