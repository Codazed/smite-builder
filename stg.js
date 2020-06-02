const boots = [];
const gods = [];
const items = [];
const relics = [];

let forcingBalanced = false;
let forcingBoots = true;
let warriorsOffensive = true;

let buildType = 0;

class SmiteTeamGenerator {

    get version() {
        return '1.0.0';
    }

    get lists() {
      return {
        'boots': boots,
        'gods': gods,
        'items': items,
        'relics': relics
      }
    }

    getLists(callback) {
        const bootsUrl = "https://gitlab.com/Codazed/STG-Lib/-/raw/master/Lists/boots.csv";
        const godsUrl = "https://gitlab.com/Codazed/STG-Lib/-/raw/master/Lists/gods.csv";
        const itemsUrl = "https://gitlab.com/Codazed/STG-Lib/-/raw/master/Lists/items.csv";
        const relicsUrl = "https://gitlab.com/Codazed/STG-Lib/-/raw/master/Lists/relics.csv";
        parseList(bootsUrl, data => {
          boots.push(data);
          parseList(godsUrl, data => {
            gods.push(data);
            parseList(itemsUrl, data => {
              items.push(data);
              parseList(relicsUrl, data => {
                relics.push(data);
                callback();
              });
            });
          });
        });
    }

}

function parseList(listUrl, callback) {
    const Papa = require('papaparse');
    const got = require('got');
    (async () => {
      let response = await got(listUrl);
      callback(Papa.parse(response.body, {header: true}).data);
    })();
}

module.exports = SmiteTeamGenerator;
