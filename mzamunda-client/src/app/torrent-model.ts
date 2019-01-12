interface Torrent {
	name: string,
	rating: number,
	seeds?: number,
	size: string,
	type: string,
	url: string
}

export class TorrentModel implements Torrent {
	name: string;
	rating: number;
	seeds: number;
	size: string;
	type: string;
	url: string;

	constructor(source: Torrent) {
		this.name = source.name;
		this.rating = source.rating,
		this.seeds = source.seeds ? source.seeds : -1,
		this.size = source.size;
		this.type = source.type;
		this.url = source.url;
	}
}