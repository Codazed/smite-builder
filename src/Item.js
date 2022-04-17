class Item {
    constructor(itemObject) {
        this.name = itemObject.name;
        this.physical = itemObject.type === 0 || itemObject.type === 2;
        this.magical = itemObject.type === 1 || itemObject.type === 2;

        if (itemObject.style === 0) {
            this.type = 'offense';
        } else if (itemObject.style === 1) {
            this.type = 'defense';
        } else if (itemObject.style === 2) {
            this.type = 'both';
        }

        this.availability = {
            assassin: this.physical,
            hunter: this.physical,
            mage: this.magical,
            warrior: this.physical,
            guardian: this.magical
        };

        if (itemObject.requirements) {
            this.requirements = itemObject.requirements;

            if (itemObject.requirements.type) {
                this.availability = {
                    assassin: itemObject.requirements.type.includes('assassin'),
                    hunter: itemObject.requirements.type.includes('hunter'),
                    mage: itemObject.requirements.type.includes('mage'),
                    warrior: itemObject.requirements.type.includes('warrior'),
                    guardian: itemObject.requirements.type.includes('guardian')
                };
            }
        }

        if (itemObject.group) {
            this.group = itemObject.group;
        }
    }

    available(god) {
        if (this.requirements && this.requirements.god) {
            if (this.requirements.god.includes(god.name)) {
                return true;
            } else {
                return false;
            }
        } else {
            return this.availability[god.position.toLowerCase()];
        }
    }

    get offensive() {
        return this.type === 'offense' || this.type === 'both';
    }

    get defensive() {
        return this.type === 'defense' || this.type === 'both';
    }
}

module.exports = Item;
