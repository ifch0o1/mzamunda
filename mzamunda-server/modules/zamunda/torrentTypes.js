var typeParser = (function() {

	// Private

	var types = {
		'cat_movies_sd.gif': 'movie',
		'cat_movs_hdtv.gif': 'moviehd',
		'cat_movies_dvdr.gif': 'dvd',
		'cat_bluray.gif': 'blueray',
		'cat_anime_anime.gif': 'anime',
		'cat_video_hdtv.gif': 'vidhd',
		'cat_3d.gif': '3d',
		'cat_movies_science.gif': 'science',
		'cat_movies_xvidrus.gif': 'movierus',
		'cat_movies_xvidbg.gif': 'moviebg',
		'cat_music_clips.gif': 'clips',

		'cat_episodes_tveps.gif': 'tv',
		'cat_episodes_tveps_hd.gif': 'tvhd',

		'cat_games_pcrip.gif': 'pcrip',
		'cat_games_pciso.gif': 'pciso',
		'cat_games_ps2.gif': 'ps3',
		'cat_apps_xbox.gif': 'xbox',

		'cat_apps_mac.gif': 'mac',
		'android-iconapps.png': 'androidapp',
		'android-icongames.png': 'androidgame',
		'cat_gsm.gif': 'mobile',

		'cat_apps_pciso.gif': 'pcsoft',
		'cat_apps_misc.gif': 'miscsoft',

		'cat_music_music.gif': 'music',
		'cat_music_music_flac.gif': 'flac',
		'cat_music_musicdts.gif': 'dts',
		'cat_music_dvdr.gif': 'musicdvd',
		'cat_music_hires.gif': '24bit',

		'cat_xxx_porn.gif': 'porn',
		'cat_xxx_hd.gif': 'pornhd',

		'cat_ebooks.gif': 'book',

		'cat_misc.gif': 'others',

		'cat_episodes_tveps_spo.gif': 'sport',
		'cat_episodes_tveps_spohd.gif': 'sport'
	};

	// Exposed

	function getType(typeImgUrl) {
		var filename = typeImgUrl.substring(typeImgUrl.lastIndexOf('/')+1);
		if (!filename) throw new Error('typeImgUrl is not defined');
		return types[filename] || "unknown";
	}
	// TODO remove list + {all: list} if is not used anymore.
	function list() {
		return types;
	}

	return {
		all: list,
		getType: getType
	};

}());

module.exports = typeParser;