window.addEventListener("message", function (e) 
{
	console.log(e.data.video_config_media);

	let video_config_media = JSON.parse(e.data.video_config_media);
	let user_lang = 'ptBR';

	let stream = "";
	let video_id = video_config_media['metadata']['id'];
	let rows_number = 0;
	let m3u8_array = [];

	for (var i = 0; i < video_config_media['streams'].length; i++) 
	{
		if (video_config_media['streams'][i].format == 'trailer_hls' && video_config_media['streams'][i].hardsub_lang == user_lang)
		{
			if (rows_number <= 4) 
			{
				m3u8_array.push(video_config_media['streams'][i].url.replace("clipTo/120000/", "clipTo/" + video_config_media['metadata']['duration'] + "/").replace(video_config_media['streams'][i].url.split("/")[2], "dl.v.vrv.co"));
				rows_number++;
			}
		}
		if (video_config_media['streams'][i].format == 'adaptive_hls' && video_config_media['streams'][i].hardsub_lang == user_lang) {
			stream = video_config_media['streams'][i].url.replace("pl.crunchyroll.com", "dl.v.vrv.co");
			break;
		}
	}

	m3u8 = '#EXTM3U' +
	'\n#EXT-X-STREAM-INF:PROGRAM-ID=1,BANDWIDTH=4112345,RESOLUTION=1280x720,FRAME-RATE=23.974,CODECS="avc1.640028,mp4a.40.2"' +
	'\n' + m3u8_array[0] +
	'\n#EXT-X-STREAM-INF:PROGRAM-ID=1,BANDWIDTH=8098235,RESOLUTION=1920x1080,FRAME-RATE=23.974,CODECS="avc1.640028,mp4a.40.2"' +
	'\n' + m3u8_array[1] +
	'\n#EXT-X-STREAM-INF:PROGRAM-ID=1,BANDWIDTH=2087088,RESOLUTION=848x480,FRAME-RATE=23.974,CODECS="avc1.4d401f,mp4a.40.2"' +
	'\n' + m3u8_array[2] +
	'\n#EXT-X-STREAM-INF:PROGRAM-ID=1,BANDWIDTH=1090461,RESOLUTION=640x360,FRAME-RATE=23.974,CODECS="avc1.4d401e,mp4a.40.2"' +
	'\n' + m3u8_array[3] +
	'\n#EXT-X-STREAM-INF:PROGRAM-ID=1,BANDWIDTH=559942,RESOLUTION=428x240,FRAME-RATE=23.974,CODECS="avc1.42c015,mp4a.40.2"' +
	'\n' + m3u8_array[4];

	if (stream == "") 
	{
		var blob = new Blob([m3u8], {
			type: "text/plain; charset=utf-8"
		});
		stream = URL.createObjectURL(blob) + "#.m3u8";
	}

	const jw = jwplayer("player_div");

	jw.setup({
		"file": stream,
		"image": video_config_media['thumbnail']['url'],
		"width": "100%",
		"height": "100%",
		"autostart": false,
		"displayPlaybackLabel": true,
		"primary": "html5"
	});

	jwplayer().on('ready', function (e) 
	{	
		if (localStorage.getItem(video_id) != null) 
		{
			document.getElementsByTagName("video")[0].currentTime = localStorage.getItem(video_id);
		}
		
		document.body.querySelector(".paypal-content").style.display = "flex";
		document.body.querySelector(".main-content").style.display = "none";
		document.body.querySelector(".footer").style.display = "none";
	});

	setInterval(function() 
	{
		if (jwplayer().getState() == "playing") 
		{
			localStorage.setItem(video_id, jwplayer().getPosition());
		}
	}, 3000);
});
