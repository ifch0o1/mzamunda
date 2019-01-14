interface TorrentIcon {
	icon: string;
	color: string;
}

export class TorrentTypeIcon {
	private generalMovie: TorrentIcon = {
		icon: 'videocam',
		color: 'blueviolet'
	};
	private generalGame: TorrentIcon = {
		icon: 'games',
		color: 'orange'
	};
	private generalSoft: TorrentIcon = {
		icon: 'memory',
		color: 'limegreen'
	};
	private generalMusic: TorrentIcon = {
		icon: 'volume_up',
		color: 'darkorange'
	};
	private android: TorrentIcon = {
		icon: 'android',
		color: 'lightgreen'
	};

	public types: {[key: string]: TorrentIcon} = {
		unknown: {
			icon: "label",
			color: 'lightgrey'
		},
		movie: this.generalMovie,
		moviehd: {
			icon: 'high_quality',
			color: 'limegreen'
		},
		dvd: {
			icon: 'disc_full',
			color: 'brown'
		},
		blueray: {
			icon: 'disc_full',
			color: 'lightslategrey'
		},
		anime: Object.assign({}, this.generalMovie, { color: 'bisque' }),
		vidhd: {
			icon: 'high_quality',
			color: 'lightgreen'
		},
		"3d": {
			icon: '3d_rotation',
			color: 'deepskyblue'
		},
		science: {
			icon: 'camera_roll',
			color: 'brown'
		},
		movierus: Object.assign({}, this.generalMovie, { color: 'red' }),
		moviebg: Object.assign({}, this.generalMovie, { color: 'limegreen' }),

		tv: {
			icon: 'tv',
			color: 'lightblue'
		},
		tvhd: {
			icon: 'tv',
			color: 'limegreen'
		},
		clips: {
			icon: 'play_arrow',
			color: 'purple'
		},

		pcrip: this.generalGame,
		pciso: Object.assign({}, this.generalGame, { color: 'red' }),
		ps3: Object.assign({}, this.generalGame, { color: 'deepskyblue' }),
		xbox: Object.assign({}, this.generalGame, { color: 'limegreen' }),

		mac: {
			icon: 'apple',
			color: 'black'
		},
		androidapp: this.android,
		androidgame: this.android,
		mobile: {
			icon: 'smartphone',
			color: 'silver'
		},

		pcsoft: this.generalSoft,
		miscsoft: this.generalSoft,

		music: this.generalMusic,
		flac: Object.assign({}, this.generalMusic, { color: 'limegreen' }),
		dts: Object.assign({}, this.generalMusic, { color: 'limegreen' }),
		musicdvd: Object.assign({}, this.generalMusic, { color: 'limegreen' }),
		"24bit": Object.assign({}, this.generalMusic, { color: 'limegreen' }),

		porn: {
			icon: 'play_circle_outline',
			color: 'pink'
		},
		pornhd: {
			icon: 'play_circle_fill',
			color: 'pink'
		},

		book: {
			icon: 'book',
			color: 'grey'
		},

		sport: {
			icon: 'directions_bike',
			color: 'lightblue'
		},

		others: {
			icon: 'attachment',
			color: 'lightgrey'
		}
	};

	// getType(torrentTypeName: string): TorrentIcon {
	// 	const generalMovie = {
	// 	    icon: 'videocam',
	// 	    color: 'deepskyblue'
	// 	},
	// 	    generalGame = {
	// 	        icon: 'games',
	// 	        color: 'orange'
	// 	},
	// 	    generalSoft = {
	// 	        icon: 'memory',
	// 	        color: 'limegreen'
	// 	},
	// 	    generalMusic = {
	// 	        icon: 'volume_up',
	// 	        color: 'darkorange'
	// 	},
	// 	    android = {
	// 	        icon: 'android',
	// 	        color: 'lightgreen'
	// 	};

	// 	return types[torrentTypeName];
	// }
}
