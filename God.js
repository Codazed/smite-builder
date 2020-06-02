const physicals = ['Assassin', 'Hunter', 'Warrior'];
const magicals = ['Mage', 'Guardian'];

class God {

    constructor(name, position) {
        this.name = name;
        this.position = position;
    }

    checkBuild(build) {
        build.forEach(item => {
            if (!item.available(this)) {
                return false;
            }
        });
        return true;
    }

    get physical() {
        return physicals.includes(this.position);
    }

    get magical() {
        return magicals.includes(this.position);
    }

}