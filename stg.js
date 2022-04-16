const Chance = require('chance');
const fs = require('fs');

const chance = new Chance();

// Internal class imports
const Item = require('./src/Item.js');
const God = require('./src/God.js');
const Team = require('./src/Team.js');

const gods = [];
const items = [];
const relics = [];

const positions = ['assassin', 'hunter', 'mage', 'warrior', 'guardian'];

class SmiteBuilder {
    constructor(
        godsList = fs.readFileSync("lists/gods.json").toString(),
        itemsList = fs.readFileSync("lists/items.json").toString(),
        relicsList = fs.readFileSync("lists/relics.json").toString()
        ) {
        this.forcingBalanced = false;
        this.warriorsOffensive = true;
        this.buildType = 0;

        this.godsList = godsList;
        this.itemsList = itemsList;
        this.relicsList = relicsList;

        parseList(this.godsList, gods, God);
        parseList(this.itemsList, items, Item);
        parseList(this.relicsList, relics, null);
    }

    get version() {
        return require('./package.json').version;
    }

    get lists() {
        return {
            'gods': gods,
            'items': items,
            'relics': relics,
        };
    }

    generateTeam(options = {}) {
        this.forcingBalanced = options.forceBalanced !== undefined ? options.forceBalanced : false;
        this.forcingBoots = options.forceBoots !== undefined ? options.forceBoots : true;
        this.buildType = options.buildType !== undefined ? options.buildType : 0;
        const size = options.size !== undefined ? options.size : 5;
        const shuffle = require('knuth-shuffle-seeded');
        const team = new Team(this);
        if (this.forcingBalanced) {
            // Generate a team that does not duplicate positions
            shuffle(positions);
            for (let i = 0; i < size; i++) {
                const player = this.makePlayer(positions[i]);
                team.add(player);
            }
        } else {
            // Generate a team that can have more then one god of the same position
            for (let i = 0; i < size; i++) {
                const player = this.makePlayer(
                    positions[chance.integer({min: 0, max: 4})]);
                team.add(player);
            }
            let dupes = true;
            while (dupes) {
                dupes = false;
                for (let i = 0; i < size; i++) {
                    const currentPlayer = team.getPlayer(i);
                    for (let j = 0; j < size; j++) {
                        if ((i !== j) && currentPlayer.god ===
                            team.getPlayer(j).god) {
                            dupes = true;
                            team.set(j, this.makePlayer(
                                positions[chance.integer({min: 0, max: 4})]));
                            break;
                        }
                    }
                    if (dupes) break;
                }
            }
        }
        return team;
    }

    makePlayer(
        position = positions[chance.integer({min: 0, max: 4})],
        buildType = this.buildType) {
        const player = {};
        player.god = this.getGod(position);
        player.build = {};
        const items = this.getItems(player.god, 6);
        player.build.items = this.processBuild(player.god, items, buildType);
        player.build.relics = this.getRelics(2);
        return player;
    }

    getItems(god, num = 6) {
        let availableItems = items.filter(item => item.available(god));

        function getItem() {
            let item = availableItems.splice(chance.integer({min: 0, max: availableItems.length - 1}), 1)[0];
            return item;
        }

        const generation = [];

        while (generation.length < num) {
            generation.push(getItem(god.position));
        }

        return generation;
    }

    processBuild(god, build, buildType) {
        let items = build;
        while (true) {
            if (!god.checkBuild(build)) {
                items = this.getItems(god);
            } else {
                let offensiveNum = 0;
                let defensiveNum = 0;
                items.forEach(item => {
                    if (item.offensive) offensiveNum++;
                    if (item.defensive) defensiveNum++;
                });
                switch (buildType) {
                default:
                case 0:
                    // Default random
                    return items;
                case 1:
                    // Full offensive
                    if (offensiveNum < 6) {
                        items = this.getItems(god);
                        break;
                    } else return items;
                case 2:
                    // Full defensive
                    if (defensiveNum < 6) {
                        items = this.getItems(god);
                        break;
                    } else return items;
                case 3:
                    // Half-and-half
                    if (offensiveNum < 3 || defensiveNum < 3) {
                        items = this.getItems(god);
                        break;
                    } else return items;
                case 4:
                    // Full offensive on offensive gods, full defensive on defensive gods
                    if (['assassin', 'hunter', 'mage'].includes(
                        god.position.toLowerCase()) ||
                        ('warrior' === god.position.toLowerCase() &&
                            this.warriorsOffensive)) {
                        if (offensiveNum < 6) items = this.getItems(god);
                        else return items;
                    } else {
                        if (defensiveNum < 6) items = this.getItems(god);
                        else return items;
                    }
                    break;
                }
            }
        }
    }

    getRelics() {
        const chanceParam = {min: 0, max: relics.length - 1}
        const relic1 = relics[chance.integer(chanceParam)];
        let relic2 = relics[chance.integer(chanceParam)];
        while (relic1.group === relic2.group) {
            relic2 = relics[chance.integer(chanceParam)];
        }
        return [relic1, relic2];
    }

    getGod(position) {
        let random = chance.integer({min: 0, max: gods.length - 1});
        let god = gods[random];
        while (god.position.toLowerCase() !== position.toLowerCase()) {
            god = gods[chance.integer({min: 0, max: gods.length - 1})];
        }
        return god;
    }
}

function parseList(listCsvStr, list, obj) {
    const parsed = JSON.parse(listCsvStr);
    for (const item of parsed) {
        list.push(obj !== null ? new obj(item) : item);
    }
}

module.exports = SmiteBuilder;
