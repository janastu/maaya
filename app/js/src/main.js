 /* Purpose: Global Maaya class
 */

 Maaya = function (maayaOpts) {
 	// Task can have some options later
 	this.task = maayaOpts.task;
 	// jsonLd url contains metadata of the presentation
 	this.jsonLdUrl = maayaOpts.jsonldUrl;
 	// relative or absolute path to Audio source 
 	this.audioUrl = maayaOpts.audioUrl;
 	/* captions URL = json object
 	 * {
	 *   "en": "./path/to/vtt/file",
	 *   "ka": "en": "./path/to/vtt/file"
 	 * }
 	 *
 	 */
 	this.captionsUrl = maayaOpts.captionsUrl;
 	// relative or absolute path to annotations in webVTT format
 	this.annotationsUrl = maayaOpts.annotationsUrl;	
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
 Maaya.prototype = {
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
 		this.jsonLD = await controller.fetchAndParse(this.jsonLdUrl);
 		return;
 	},
 	launchPlayer: function(){
 		// initialize Plyr
 		var plyr = new Plyr(this.playerEl);
 		return plyr;
 	},
 	setPlyrSource: function(sourceOptions) {
 		var self = this;
 		//to create caption track options
 		var langs = Object.keys(self.captionsUrl);
 		var tracks = langs.map(function(lang){
 			return {
	            kind: 'captions',
	            label: lang.toUpperCase(),
	            srclang: lang,
	            src: self.captionsUrl[lang]
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
 		
 		$.get(me.annotationsUrl)
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
 	const maayaTask = await controller.fetchAndParse(dataUrl);;

 	// instantiate MaayaJaal an instance of Maaya
 	window.maayaJaal = new Maaya(maayaTask);

 	//initialize the instance
 	maayaJaal.init("#audio-player", {
 					type: 'video', 
 					title: maayaTask.title,
 					poster: maayaTask.poster, 
 					sources: [{
 							src: maayaTask.audioUrl, 
 							type: 'audio/mp3'}],
 					captions: {
 						active: true,
 						language: 'en',
 						update: false
 					}
 				});
 }

$(document).ready(function(){
	bootstrap();
	});