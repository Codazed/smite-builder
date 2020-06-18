let stg;

class Team extends Array {
    constructor(SmiteTeamGenerator) {
        super();
        stg = SmiteTeamGenerator;
    }

    add(player) {
        this.push(player);
    }

    get gods() {
        const gods = [];
        this.forEach((player) => {
            gods.push(player.god.name);
        });
        return gods;
    }

    set(index, player) {
        this[index] = player;
    }

    get size() {
        return this.length;
    }

    getPlayer(index) {
        return this[index];
    }

    rerollPlayer(index) {
        const Chance = require('chance');
        const chance = new Chance();
        const selected = this[index];
        let rerolling;
        if (stg.forcingBalanced) {
            const taken = [];
            this.forEach((player) => {
                taken.push(player.god);
            });
            rerolling = stg.makePlayer();
            let testing = true;
            while (testing) {
                testing = false;
                taken.forEach((god) => {
                    if (rerolling.god === god || rerolling.god === selected.god) {
                        rerolling = stg.makePlayer();
                        testing = true;
                    }
                });
            }
            this.set(index, rerolling);
        } else {
            const takenPositions = [];
            this.forEach((player) => {
                takenPositions.push(player.god.position);
            });
            takenPositions.splice(index, 1);
            rerolling = stg.makePlayer();
            let testing = true;
            while (testing) {
                testing = false;
                takenPositions.forEach((position) => {
                    if (rerolling.god.position === position) {
                        rerolling = stg.makePlayer();
                        testing = true;
                    }
                });
            }
            this.set(index, rerolling);
        }
    }
}

module.exports = Team;
