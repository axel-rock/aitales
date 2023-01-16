type ChunkType = 'raw' | 'splitted'
export const ChunkSplitted = 'splitted'

export class Chunk {
	id?: string
	text: string
	type: ChunkType
	source: File | string

	constructor({
		id,
		text,
		type,
		source
	}: {
		id?: string
		text: string
		type: ChunkType
		source: File | string
	}) {
		if (id) this.id
		this.text = text
		this.type = type
		this.source = source
	}

	static from(file: File) {}
}
