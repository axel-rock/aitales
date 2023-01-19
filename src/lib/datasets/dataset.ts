export class Dataset {
	id: string
	name: string
	constructor({ id, name = 'My new dataset' }) {
		this.id = id
		this.name = name
	}
}
