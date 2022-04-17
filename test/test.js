const assert = require('chai').assert;
const Chance = require('chance');
const chance = new Chance();
const SmiteBuilder = require('../stg.js');
const builder = new SmiteBuilder();
const maxTests = 10000;
describe('stg', function() {
    this.timeout(60000);
    it('All gods should be generated at least once', function() {
        let gods = builder.lists.gods;
        let generatedGods = [];
        for (let i = 0; i < maxTests; i++) {
            let player = builder.makePlayer();
            let god = player.god;
            if (!generatedGods.includes(god)) {
                generatedGods.push(god);
            }
            if (gods.every(r => generatedGods.includes(r))) {
                break;
            }
        }
        if (!gods.every(r => generatedGods.includes(r))) {
            let missingGods = function() {
                let missing = gods.filter(god => !generatedGods.includes(god));
                let strings = [];
                missing.forEach(god => {
                    strings.push(god.name);
                });
                return strings;
            };
            console.log('Missing gods:');
            console.log(missingGods());
            assert.fail('Not all gods were generated.');
        }
    });
    it('All items should be generated at least once', function() {
        let items = builder.lists.items;
        let generatedItems = [];
        for (let i = 0; i < maxTests; i++) {
            let player = builder.makePlayer();
            let playerItems = player.build.items;
            playerItems.forEach(item => {
                if (!generatedItems.includes(item)) {
                    generatedItems.push(item);
                }
            });
            if (items.every(r => generatedItems.includes(r))) {
                break;
            }
        }
        if (!items.every(r => generatedItems.includes(r))) {
            let missingItems = function() {
                let missing = items.filter(
                    god => !generatedItems.includes(god));
                let strings = [];
                missing.forEach(item => {
                    strings.push(item.name);
                });
                return strings;
            };
            console.log('Missing items:');
            console.log(missingItems());
            assert.fail('Not all items were generated.');
        }
    });
    it('Test reroll player method', function() {
        let team = builder.generateTeam();
        const clone = require('clone');
        let initTeam = clone(team);
        team.rerollPlayer(0);
        if (initTeam === team) {
            assert.fail('Team is identical after rerolling a player.');
        }
    });
    it('Check for incorrect items on certain gods', function() {
        for (let i = 0; i < maxTests; i++) {
            let player = builder.makePlayer();
            let build = player.build.items;
            build.forEach(item => {
                if (!item.available(player.god)) {
                    assert.fail(item.name + 'was put on ' + player.god.name);
                }
            });
        }
    });
    it('Check for duplicate items on a single build', function() {
        for (let i = 0; i < maxTests; i++) {
            let player = builder.makePlayer();
            let build = player.build.items;
            let items = [];
            build.forEach(item => {
                if (items.includes(item)) {
                    assert.fail(`There is more than one group [${item.name}] item on a build.\nOffending build: ${JSON.stringify(player, '', ' ')}`);
                } else {
                    items.push(item);
                }
            });
        }
    });
    it('Check for duplicate group items on a single build', function() {
        for (let i = 0; i < maxTests; i++) {
            let player = builder.makePlayer();
            let build = player.build.items;
            let groups = [];
            build.forEach(item => {
                if (item.group) {
                    if (groups.includes(item.group)) {
                        assert.fail(`There is more than one group [${item.group}] item on a build.\nOffending build: ${JSON.stringify(player, '', ' ')}`);
                    } else {
                        groups.push(item.group);
                    }
                }
            });
        }
    });
    it('Check for duplicate relics on a single build', function() {
        for (let i = 0; i < maxTests; i++) {
            let player = builder.makePlayer();
            let build = player.build;
            if (build.relics[0] === build.relics[1]) {
                assert.fail(`There is more than one [${build.relics[0].name}] relic on a build.\nOffending build: ${JSON.stringify(player, '', ' ')}`);
            }
        }
    });
    it('Check for duplicate relic groups on a single build', function() {
        for (let i = 0; i < maxTests; i++) {
            let player = builder.makePlayer();
            let build = player.build;
            if ((build.relics[0].group && build.relics[1].group) && (build.relics[0].group === build.relics[1].group)) {
                assert.fail(`There is more than one [${build.relics[0].group}] relic on a build.\nOffending build: ${JSON.stringify(player, '', ' ')}`);
            }
        }
    });
    it('Check for duplicate gods on a team of 5 players', function() {
        for (let i = 0; i < maxTests/5; i++) {
            let team = builder.generateTeam();
            team.forEach((iPlayer, iIndex) => {
                team.forEach((jPlayer, jIndex) => {
                    if (iIndex !== jIndex && iPlayer.god === jPlayer.god) {
                        assert.fail('There are duplicate gods on a team.\nOffending team: ' + JSON.stringify(team));
                    }
                });
            });
        }
    });
    it('Check for duplicate gods on a team of less than 5 players', function() {
        for (let i = 0; i < maxTests/5; i++) {
            let random = chance.integer({min: 2, max: 4});
            let team = builder.generateTeam(random);
            team.forEach((iPlayer, iIndex) => {
                team.forEach((jPlayer, jIndex) => {
                    if (iIndex !== jIndex && iPlayer.god === jPlayer.god) {
                        assert.fail('There are duplicate gods on a team.\nOffending team: ' + JSON.stringify(team));
                    }
                });
            });
        }
    });
    it('Check for balanced team, no duplicate positions, forceBalanced=true', function() {
        let positions = ['assassin', 'hunter', 'mage', 'warrior', 'guardian'];
        for (let i = 0; i < maxTests/5; i++) {
            let random = chance.integer({min: 1, max: 5});
            let team = builder.generateTeam({size: random, forceBalanced: true});
            let availablePositions = positions.slice(0, positions.length);
            team.forEach(player => {
                let position = player.god.position.toLowerCase();
                if (availablePositions.includes(position)) {
                    availablePositions.splice(availablePositions.indexOf(position), 1);
                } else {
                    assert.fail('A position was duplicated.\nOffending Team: ' + JSON.stringify(team));
                }
            });
        }
    });
    it('Check for not always balanced team, sometimes duplicate positions, forceBalanced=false', function() {
        let positions = ['assassin', 'hunter', 'mage', 'warrior', 'guardian'];
        for (let i = 0; i < maxTests/5; i++) {
            let random = chance.integer({min: 1, max: 5});
            let team = builder.generateTeam({size: random, forceBalanced: false});
            let availablePositions = positions.slice(0, positions.length);
            let dupedPosition = false;
            team.forEach(player => {
                let position = player.god.position.toLowerCase();
                if (availablePositions.includes(position)) {
                    availablePositions.splice(availablePositions.indexOf(position), 1);
                } else {
                    dupedPosition = true;
                }
            });
            if (dupedPosition) return;
        }
        assert.fail('Every team generated out of ' + maxTests/5 + ' generations was balanced. No duplicate positions.');
    });
    it('Check full offensive build type', function() {
        for (let i = 0; i < maxTests; i++) {
            let player = builder.makePlayer(undefined, 1);
            player.build.items.forEach(item => {
                if (!item.offensive) {
                    assert.fail('A non-offensive item was found.\nOffending item: ' + item.name);
                }
            });
        }
    });
    it('Check full defensive build type', function() {
        for (let i = 0; i < maxTests; i++) {
            let player = builder.makePlayer(undefined, 2);
            player.build.items.forEach(item => {
                if (!item.defensive) {
                    assert.fail('A non-defensive item was found.\nOffending item: ' + item.name);
                }
            });
        }
    });
    it('Check 50/50 build type', function() {
        for (let i = 0; i < maxTests; i++) {
            let player = builder.makePlayer(undefined, 3);
            let offensiveNum = 0;
            let defensiveNum = 0;
            player.build.items.forEach(item => {
                if (item.offensive) offensiveNum++;
                if (item.defensive) defensiveNum++;
            });
            if (offensiveNum < 3 || defensiveNum < 3) {
                assert.fail('A build was not 50/50.\nOffending build: ' + JSON.stringify(player.build.items));
            }
        }
    });
    it('Check offensive vs defensive build type, warriorsOffensive=false', function() {
        builder.warriorsOffensive = false;
        for (let i = 0; i < maxTests; i++) {
            let player = builder.makePlayer(undefined, 4);
            let offensiveNum = 0;
            let defensiveNum = 0;
            player.build.items.forEach(item => {
                if (item.offensive) offensiveNum++;
                if (item.defensive) defensiveNum++;
            });
            if (['assassin', 'hunter', 'mage'].includes(
                player.god.position.toLowerCase())) {
                if (offensiveNum < 6) assert.fail('A defensive item was found on an offensive god.\nOffending player: ' + JSON.stringify(player));
            } else {
                if (defensiveNum < 6) assert.fail('An offensive item was found on an defensive god.\nOffending player: ' + JSON.stringify(player));
            }
        }
    });
    it('Check offensive vs defensive build type, warriorsOffensive=true', function() {
        builder.warriorsOffensive = true;
        for (let i = 0; i < maxTests; i++) {
            let player = builder.makePlayer(undefined, 4);
            let offensiveNum = 0;
            let defensiveNum = 0;
            player.build.items.forEach(item => {
                if (item.offensive) offensiveNum++;
                if (item.defensive) defensiveNum++;
            });
            if (['assassin', 'hunter', 'mage', 'warrior'].includes(
                player.god.position.toLowerCase())) {
                if (offensiveNum < 6) assert.fail('A defensive item was found on an offensive god.\nOffending player: ' + JSON.stringify(player));
            } else {
                if (defensiveNum < 6) assert.fail('An offensive item was found on an offensive god.\nOffending player: ' + JSON.stringify(player));
            }
        }
    });
    /*it('Get generator stats', function() {
        console.log('This test is designed to check the percent chance of full builds of a particular play style (Offense, Defense). It will also calculate how fast the generator is on your system. This test will NOT fail.');
        console.log('Depending on the \'testMultiplier\' value, this test can take anywhere from a few seconds to a few minutes. Just remember, the higher the value for that variable, the more accurate the results are going to be.');
        let testMultiplier = 1;
        console.log('\'testMultiplier\' is ' + testMultiplier);
        let totalAttempts = 0;
        let offOnDef = 0;
        let offOnOff = 0;
        let defOnDef = 0;
        let defOnOff = 0;
        stg.buildType = 0;
        // Time values for speed calculation
        let startTime = Date.now();
        let times = [];
        for (let i = 0; i < maxTests * testMultiplier; i++) {
            totalAttempts++;
            let player = stg.makePlayer();
            let defensiveGod = false;
            if (['warrior', 'guardian'].includes(player.god.position.toLowerCase())) {
                defensiveGod = true;
            }
            let offensiveItems = 0;
            let defensiveItems = 0;
            player.build.items.forEach(item => {
                if (item.offensive) {
                    offensiveItems++;
                }
                if (item.defensive) {
                    defensiveItems++;
                }
            });
            if (offensiveItems === 6) {
                if (defensiveGod) {
                    offOnDef++;
                } else {
                    offOnOff++;
                }
            } else if (defensiveItems === 6) {
                if (defensiveGod) {
                    defOnDef++;
                } else {
                    defOnOff++;
                }
            }
            if (totalAttempts % 10000 === 0) {
                let currentTime = Date.now();
                let elapsedTime = (currentTime - startTime);
                console.log(`Generated ${totalAttempts}/${testMultiplier*maxTests} builds. Test is ${(totalAttempts/(testMultiplier*maxTests))*100}% complete. Elapsed time: ${elapsedTime}ms`);
                times.push(elapsedTime);
                startTime = currentTime;
            }
        }

        // Time calculations
        let avgTime = 0;
        times.forEach(time => {
            avgTime += time;
        });
        avgTime /= times.length;
        let secondsPerInterval = avgTime / 1000;
        let bps = 10000 / secondsPerInterval;

        console.log();
        console.log(`Full Offensive Builds on Offensive Gods Count: ${offOnOff} | Percent chance: ${(offOnOff/totalAttempts)*100}%`);
        console.log(`Full Offensive Builds on Defensive Gods Count: ${offOnDef} | Percent chance: ${(offOnDef/totalAttempts)*100}%`);
        console.log(`Full Defensive Builds on Offensive Gods Count: ${defOnOff} | Percent chance: ${(defOnOff/totalAttempts)*100}%`);
        console.log(`Full Defensive Builds on Defensive Gods Count: ${defOnDef} | Percent chance: ${(defOnDef/totalAttempts)*100}%`);
        console.log();
        console.log('Statistics calculated out of the total ' + totalAttempts + ' build generations for this particular test.');
        console.log('Average elapsed time per 10000 builds: ' + avgTime + 'ms');
        console.log('Calculated builds per second: ' + bps + ' b/s');
    });*/
});