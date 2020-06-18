const assert = require('chai').assert;
const SmiteBuilder = require('../stg.js');
const stg = new SmiteBuilder();
const maxTests = 1000000;
describe('stg', function() {
    this.timeout(60000);
    before(function(done) {
        stg.getLists(done);
    });
    it('All gods should be generated at least once', function() {
        let totalAttempts = 0;
        let gods = stg.lists.gods;
        let generatedGods = [];
        for (let i = 0; i < maxTests; i++) {
            totalAttempts++;
            let player = stg.makePlayer();
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
        } else {
            console.log(
                'All gods were successfully generated in ' + totalAttempts +
                ' generations.');
        }
    });
    it('All items should be generated at least once', function() {
        let totalAttempts = 0;
        let items = stg.lists.items;
        let generatedItems = [];
        for (let i = 0; i < maxTests; i++) {
            totalAttempts++;
            let player = stg.makePlayer();
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
        } else {
            console.log(
                'All items were successfully generated in ' + totalAttempts +
                ' generations.');
        }
    });
    it('Check for incorrect items on certain gods', function() {
        for (let i = 0; i < maxTests; i++) {
            let player = stg.makePlayer();
            let build = player.build.items;
            build.forEach(item => {
                if (!item.available(player.god)) {
                    assert.fail(item.name + 'was put on ' + player.god.name);
                }
            });
        }
    });
    it('Check for multiple masks on single build', function() {
        for (let i = 0; i < maxTests; i++) {
            let player = stg.makePlayer();
            let build = player.build.items;
            let maskCount = 0;
            build.forEach(item => {
                if (['Bumba\'s Mask', 'Lono\'s Mask', 'Rangda\'s Mask'].includes(item.name)) {
                    maskCount++;
                }
            });
            if (maskCount > 1) {
                assert.fail('There is more than one mask on a build.\nOffending build: ' + JSON.stringify(player, '', ' '));
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