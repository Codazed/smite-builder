let stg;

class Team {
    constructor(SmiteTeamGenerator) {
        stg = SmiteTeamGenerator;
        this.team = [];
    }

    add(player) {
        this.team.push(player);
    }

    get gods() {
        const gods = [];
        this.team.forEach(player => {
            gods.push(player.god.name);
        });
        return gods;
    }

    set(index, player) {
        this.team[index] = player;
    }

    get size() {
        return team.length;
    }

    getPlayer(index) {
        return this.team[index];
    }

    rerollPlayer(index) {
        const Chance = require('chance');
        const chance = new Chance();
        const selected = this.team[index];
        let rerolling;
        if (stg.forcingBalanced) {
            const taken = [];
            this.team.forEach(player => {
                taken.push(player.god);
            });
            rerolling = stg.makePlayer(chance.integer({min: 0, max: 4}));
            let testing = true;
            while (testing) {
                testing = false;
                taken.forEach(god => {
                    if (rerolling.god === god || rerolling.god === selected.god) {
                        rerolling = stg.makePlayer(chance.integer({min: 0, max: 4}));
                        testing = true;
                        break;
                    }
                });
            }
            this.set(index, rerolling);
        } else {
            const takenPositions = [];
            this.team.forEach(player => {
                takenPositions.push(player.god.position);
            });
            takenPositions.splice(index, 1);
            rerolling = stg.makePlayer(chance.integer({min: 0, max: 4}));
            let testing = true;
            while (testing) {
                testing = false;
                takenPositions.forEach(position => {
                    if (rerolling.god.position === position) {
                        rerolling = stg.makePlayer(chance.integer({min: 0, max: 4}));
                        testing = true;
                        break;
                    }
                });
            }
            this.set(index, rerolling);
        }
    }
}

module.exports = Team;