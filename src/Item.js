const {boolean} = require('boolean');
class Item {

	constructor(itemObject) {
		this.name = itemObject.Name;
		this.physical = boolean(itemObject.Physical);
		this.magical = boolean(itemObject.Magical);
		this.type = itemObject.ItemType.toLowerCase();
		this.availability = [
			boolean(itemObject.Assassins) + 0,
			boolean(itemObject.Hunters) + 0,
			boolean(itemObject.Mages) + 0,
			boolean(itemObject.Warriors) + 0,
			boolean(itemObject.Guardians) + 0
		];
	}

	get mask() {
		return ['Lono\'s Mask', 'Rangda\'s Mask', 'Bumba\'s Mask'].includes(this.name);
	}

	available(god) {
		return this.availability[(god.position)];
	}

	get offensive() {
		return this.type === 'offense' || this.type === 'both';
	}

	get defensive() {
		return this.type === 'defense' || this.type === 'both';
	}

}

module.exports = Item;