class Item {

    constructor(name, physical, magical, type, availability) {
        this.name = name;
        this.physical = physical;
        this.magical = magical;
        this.type = type;
        this.availability = availability;
    }

    get mask() {
        return "Lono's Mask" === name || "Rangda's Mask" === name || "Bumba's Mask" === name;
    }

    available(god) {
        return this.availability.get(god.position);
    }

    get offensive() {
        return this.type === 'offense' || this.type === 'both';
    }

    get defensive() {
        return this.type === 'defense' || this.type === 'both';
    }

}