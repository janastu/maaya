/*
 * Purpose: Entry point
 *   Import all dependencies of the app
 *   Dependency List: player.js 
 *	 Create Interfaces
 *	 Bind Events
 *	 Launch app
 */

 Maaya = function (maayaOpts) {
 	// Task can have some options later
 	this.task = maayaOpts.task;
 	this.jsonLdUrl = maayaOpts.jsonldUrl;
 	this.audioUrl = maayaOpts.audioUrl;
 	this.transcriptUrl = maayaOpts.transcripUrl;
 	this.annotationsUrl = maayaOpts.annotationsUrl;

 	// JSON DATA
 	this.$audioPlayer;
 	this.jsonLD;
 	this.transcript = [];
 	this.annotations;
 	return this;
 }

 Maaya.prototype = {
 	init: function() {
 		this.parseJsonLd();
 		this.launchAudioPlayer();
 		this.getTranscript();
 		this.getAnnotations();
 		this.render();
 	},
 	parseJsonLd: function(){
 		/* Parse JSON-LD for validity and set other variables
 		/* required for rendering view
 		*/

 	},
 	launchAudioPlayer: function(){
 		/* 
 		/* Prepare and launch audio player
 		 * will expose the playe element to controls(play/pause)
 		*/
 		this.$audioPlayer = new audioPlayer({
 							src: this.audioUrl,
 							type: "audio/mpeg"
 						});
 	},
 	getTranscript: function(){
 		/* 
 		/* this.transcriptUrl = [] 
 		/* Get Transcript data for all transcript URLs
 		*/
 		let me = this;
 		console.log()
 		me.transcriptUrl.forEach(async function(url){
 			let gotTranscript = await fetch(url);
 			me.transcript.push(await gotTranscript.json());
 		});
 	},
 	getAnnotations: function(){
 		/* 
 		/* Get Annotations data for the audio resource
 		*/

 	},
 	render: function(){
 		/* 
 		/* render view
 		*/
 	},
 	update: function(){
 		/* 
 		/* Update any state variabled
 		 * like annotations, transcript so on..
 		*/
 		this.render();

 	},
 	destroy: function(){

 	}
 }

 async function bootstrap() {

 	const maayaRequest = await fetch(dataUrl);
 	const maayaTask = await maayaRequest.json();

 	// instantiate MaayaJaal an instance of Maaya
 	window.maayaJaal = new Maaya(maayaTask);

 	maayaJaal.init();
 }

 bootstrap();