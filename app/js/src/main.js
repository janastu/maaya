 /* Purpose: Global Yantra class, a kind of controller
 */

 Yantra = function (maayaOpts) {
 	this.settings = maayaOpts;
 	// DOM manipulation class
 	this.$view;
 	// The Player 
 	this.plyr;
 	// To store the JSONLD
 	this.jsonLD;
 	//To store the annotations
 	this.annotations;
 	return this;
 }

// Define methods
 Yantra.prototype = {
 	init: async function(playerId, options) {
 		var self = this;
 		self.playerEl = playerId;
 		self.initOptions = options;

 		await this.parseJsonLd();
 		// Initialize the view class
 		this.$view = new maayaView(this.jsonLD);
 		this.plyr = this.launchPlayer();
 		this.fetchAnnotations();

 		// Bind event to player
 		this.plyr.on('timeupdate', event => {	
 		    const instance = event.detail.plyr;
 		    self.$view.renderAnnoInPoster(instance, self.annotations);
 		});
 		this.setPlyrSource(this.initOptions);
 	},
 	parseJsonLd: async function(){
 		/* Parse JSON-LD for validity and set other variables
 		/* required for rendering view
 		*/
 		this.jsonLD = await controller.fetchAndParse(this.settings.jsonldUrl);
 		return;
 	},
 	launchPlayer: function(){
 		// initialize Plyr
 		var plyr = new Plyr(this.playerEl, {
					ratio: '16:9',
					captions: {
						active: true,
						language: 'en',
						update: false
					},
					controls: [
			        'play-large',
			        // 'restart',
			        'rewind',
			        'play',
			        'fast-forward',
			        'progress',
			        'current-time',
			        'duration',
			        'mute',
			        'volume',
			        'captions',
			        'settings',
			        //'pip',
			        //'airplay',
			        // 'download',
			        'fullscreen',
			   	 	]
 		});
 		return plyr;
 	},
 	setPlyrSource: function(sourceOptions) {
 		var self = this;
 		//to create caption track options
 		var langs = Object.keys(self.settings.captionsUrl);
 		var tracks = langs.map(function(lang){
 			return {
	            kind: 'captions',
	            label: lang.toUpperCase(),
	            srclang: lang,
	            src: self.settings.captionsUrl[lang]
        	};
 		});
 		
 		sourceOptions.tracks = tracks;
 		// Set source
 		this.plyr.source = sourceOptions;
 	},

 	fetchAnnotations: function(){
 		/* 
 		/* Get Annotations data for the audio resource
 		*/
 		let me = this;
 		
 		$.get(me.settings.annotationsUrl)
 		.done(function(response){
 			var parser = new WebVTTParser();
 			me.annotations = parser.parse(response);
 			me.$view.renderAnnosInSidebar(me.plyr, me.annotations);
 		});	
 	}
 }

 async function bootstrap() {
 	// depends on dataUrl - configured
 	// in html script tag as a js var
 	const maayaSettings = await controller.fetchAndParse(dataUrl);

 	// instantiate MaayaJaal an instance of Maaya
 	window.Maaya = new Yantra(maayaSettings);

 	//initialize the instance
 	Maaya.init("#audio-player", {
 					type: 'video', 
 					title: maayaSettings.title,
 					poster: maayaSettings.poster, 
 					sources: [{
 							src: maayaSettings.audioUrl, 
 							type: 'audio/mp3'}]
 				});
 }

$(document).ready(function(){
	bootstrap();
});