const physicals = ['Assassin', 'Hunter', 'Warrior'];
const magicals = ['Mage', 'Guardian'];

class God {

    constructor(godObject) {
        this.name = godObject.Name;
        this.position = godObject.Type;
    }

    checkBuild(build) {
        build.forEach(item => {
            if (!item.available(this)) {
                return false;
            }
        });
        return true;
    }

    get type() {
        if (['assassin', 'hunter', 'warrior'].includes(this.position.toLowerCase())) {
            return 'physical';
        } else {
            return 'magical';
        }
    }

    get physical() {
        return physicals.includes(this.position);
    }

    get magical() {
        return magicals.includes(this.position);
    }

}

module.exports = God;