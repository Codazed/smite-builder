const Chance = require('chance');
const chance = new Chance();
const Item = require('./src/Item.js');
const God = require('./src/God.js');
const Team = require('./src/Team.js');

const boots = [];
const gods = [];
const items = [];
const relics = [];

const positions = ['assassin', 'hunter', 'mage', 'warrior', 'guardian'];

class SmiteBuilder {
    constructor() {
        this.forcingBalanced = false;
        this.forcingBoots = true;
        this.warriorsOffensive = true;
        this.buildType = 0;
    }

    get version() {
        return require('./package.json').version;
    }

    get lists() {
        return {
            'boots': boots,
            'gods': gods,
            'items': items,
            'relics': relics,
        };
    }

    async getLists() {
        const bootsUrl = 'https://api.smitebuilder.app/lists/boots.csv';
        const godsUrl = 'https://api.smitebuilder.app/lists/gods.csv';
        const itemsUrl = 'https://api.smitebuilder.app/lists/items.csv';
        const relicsUrl = 'https://api.smitebuilder.app/lists/relics.csv';
        const a = await parseList(bootsUrl, boots, Item);
        const b = await parseList(godsUrl, gods, God);
        const c = await parseList(itemsUrl, items, Item);
        const d = await parseList(relicsUrl, relics, null);
        return Promise.all([a, b, c, d]);
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
        let availableBoots = boots.filter(boot => boot.available(god));

        function getItem() {
            let item = availableItems.splice(
                chance.integer({min: 0, max: availableItems.length - 1}), 1)[0];
            if (item.mask) {
                availableItems.forEach((item, index) => {
                    if (item.mask) {
                        availableItems.splice(index, 1);
                    }
                });
            }
            return item;
        }

        function getBoot() {
            return availableBoots.splice(
                chance.integer({min: 0, max: availableBoots.length - 1}), 1)[0];
        }

        const generation = [];
        if (god.name === 'Ratatoskr') {
            const items = [
                {
                    Name: 'Evergreen Acorn',
                    Physical: true,
                    Magical: false,
                    ItemType: 'both',
                    Assassins: true,
                    Hunters: false,
                    Mages: false,
                    Warriors: false,
                    Guardians: false,
                },
                {
                    Name: 'Thickbark Acorn',
                    Physical: true,
                    Magical: false,
                    ItemType: 'both',
                    Assassins: true,
                    Hunters: false,
                    Mages: false,
                    Warriors: false,
                    Guardians: false,
                },
                {
                    Name: 'Bristlebush Acorn',
                    Physical: true,
                    Magical: false,
                    ItemType: 'both',
                    Assassins: true,
                    Hunters: false,
                    Mages: false,
                    Warriors: false,
                    Guardians: false,
                },
                {
                    Name: 'Thistlethorn Acorn',
                    Physical: true,
                    Magical: false,
                    ItemType: 'both',
                    Assassins: true,
                    Hunters: false,
                    Mages: false,
                    Warriors: false,
                    Guardians: false,
                }
            ];
            generation.push(new Item(items[chance.integer({min: 0, max: items.length-1})]));
        } else {
            if (chance.integer({min: 0, max: 100}) > 35 && !this.forcingBoots) {
                generation.push(getItem(god.position));
            } else {
                generation.push(getBoot(god.position));
            }
        }
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
            } else if (!checkMasks(build)) {
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
        const relic1 = relics[chance.integer({min: 0, max: relics.length})];
        let relic2 = relics[chance.integer({min: 0, max: relics.length})];
        while (relic1 === relic2) {
            relic2 = relics[chance.integer({min: 0, max: relics.length})];
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

async function parseList(listUrl, list, obj) {
    const Papa = require('papaparse');
    const axios = require('axios');
    const response = await axios.get(listUrl);
    const parsed = Papa.parse(response.data, {header: true}).data;
    parsed.pop();
    for (const item of parsed) {
        list.push(obj !== null ? new obj(item) : item);
    }
}

function checkMasks(build) {
    let num = 0;
    build.forEach((item) => {
        if (item.mask) {
            num++;
            if (num > 1) {
                return false;
            }
        }
    });
    return true;
}

module.exports = SmiteBuilder;
