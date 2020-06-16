const {boolean} = require('boolean');
class Item {
    constructor(itemObject) {
        this.name = itemObject.Name;
        this.physical = boolean(itemObject.Physical);
        this.magical = boolean(itemObject.Magical);
        this.type = itemObject.ItemType.toLowerCase();
        this.availability = {
            assassin: boolean(itemObject.Assassins),
            hunter: boolean(itemObject.Hunters),
            mage: boolean(itemObject.Mages),
            warrior: boolean(itemObject.Warriors),
            guardian: boolean(itemObject.Guardians)
        };
    }

    get mask() {
        return ['Lono\'s Mask', 'Rangda\'s Mask', 'Bumba\'s Mask'].includes(this.name);
    }

    available(god) {
        return this.availability[god.position.toLowerCase()];
    }

    get offensive() {
        return this.type === 'offense' || this.type === 'both';
    }

    get defensive() {
        return this.type === 'defense' || this.type === 'both';
    }
}

module.exports = Item;
