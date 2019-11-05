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
 	this.annotations = [];
 	this.$annos = [];
 	this.$transcripts = [];

 	// dom elements and other settings

 	// hardcoding default lang / container setting, should be inherited 
 	// maaya settings option
 	this.i18n = 'eng';
 	this.$captionsContainer = document.getElementById('captions-container');
 	this.$annosContainer = document.getElementById("annotations-container");

 	return this;
 }

 Maaya.prototype = {
 	init: function() {
 		this.captionBlocks = '';
 		this.parseJsonLd();
 		this.launchAudioPlayer();
 		this.prepareTranscript();
 		this.prepareAnnotations();
 		this.render();
 	},
 	parseJsonLd: async function(){
 		/* Parse JSON-LD for validity and set other variables
 		/* required for rendering view
 		*/
 		this.jsonLD = await fetchAndParse(this.jsonLdUrl);

 	},
 	launchAudioPlayer: function(){
 		/* 
 		/* Prepare and launch audio player
 		 * will expose the playe element to controls(play/pause)
 		*/
 		var self = this;
 		self.$audioPlayer = new audioPlayer({
 							src: this.audioUrl,
 							type: "audio/mpeg",
 							id: "now-playing"
 						});

 		// Bind time change event to the media element
 		self.$audioPlayer.addEventListener('timeupdate', (event) => {
 			self.onTimeUpdate(event);
 		})
 	},
 	onTimeUpdate: function() {
 		// event listener calls this method
 		var self= this;
 		self.captionBlocks = self.getCaptionBlocks(self.$audioPlayer.currentTime);
 		//var annoBlocks = self.getAnnoBlocks(self.$audioPlayer.currentTime);
 		self.update();
 	},
 	getCaptionBlocks: function() {
 		var self = this;

 		// check for current localization setting eng/kan
 		var activeCaptions = self.transcript.find(function(transcript){
 			return transcript.language === self.i18n;
 		})
 		// then with the returned data check for blocks
 		var activeBlockIndex = activeCaptions.data.findIndex(function(block, index){
 			var startCheck = self.$audioPlayer.currentTime >= hmsToSecondsOnly(block.begin);
 			var endCheck =  self.$audioPlayer.currentTime <= hmsToSecondsOnly(block.end);
 			var isCheckPassed = startCheck && endCheck;
 			return isCheckPassed;
 		});
 		// find the corresponding dom el from cache
 		var captionDom = self.$transcripts.find(function(tDom){
 			return Object.keys(tDom)[0] === self.i18n;
 		});
 		return captionDom[self.i18n][activeBlockIndex];
 		
 	},
 	getAnnoBlocks: function() {
 		// almost similar steps as captions, but data
 		// will be web anno model
 	},
 	prepareTranscript: function(){
 		/* 
 		/* this.transcriptUrl = [] 
 		/* Get Transcript data for all transcript URLs
 		*/
 		let me = this;
 		me.transcriptUrl.forEach(async function(url){
 			let gotTranscript = await fetchAndParse(url);
 			//let responseData = await gotTranscript.json();
 			me.transcript.push(gotTranscript);
 			// to have the language of the transcript as key
 			// and data as value
 			var newObject = new Object();
 			newObject[gotTranscript.language] = me.transcriptToDom(gotTranscript);
 			me.$transcripts.push(newObject);
 		});
 	},
 	prepareAnnotations: function(){
 		/* 
 		/* Get Annotations data for the audio resource
 		*/
 		let me = this;
 		me.annotationsUrl.forEach(async function(url){
 			let gotAnnos = await fetchAndParse(url);
 			// similar to transcripts, this data may need a index
 			// or key in future, may be username: annos 			
 			me.annotations.push(gotAnnos);
 			// prepare DOM elements for the data
 			me.$annos.push(me.annotationsToDom(gotAnnos.data));
 		});
 	},
 	transcriptToDom: function(transcript){
 		/* Purpose:
 		 * returns an array of dom elements 
 		 * for each transcript source
 		 * 
 		 */
 		var element;
 		var elements = [];
 		for (var i = 0; i < transcript.data.length; i++) {
 		    element = document.createElement('p');
 		    element.setAttribute("id", "c_" + i);
 		    element.setAttribute("class", "playing");
 		    element.innerText = transcript.data[i].begin + " - " + transcript.data[i].lines[0] + " ";
 		    //element.style.display = 'none';
 		    elements.push(element);
 		}
 		return elements;
 	},
 	annotationsToDom: function(annos) {
 		/* Purpose:
 		 * returns an array of dom elements depending on
 		 * the resource type specified in the annotation
 		 * currently handles type "image" & "embed"
 		 */
 		var element;
 		var elements = [];
 		for (var i = 0; i < annos.length; i++) {
 			for(var j=0; j < annos[i].resources.length; j++){
 				if(annos[i].resources[j].type === "image"){
 					element = document.createElement('img');
 					element.setAttribute("id", "r_" + i);
 					element.setAttribute("class", "playing");
 					element.setAttribute("src", annos[i].resources[j].url);
 				}
 				if(annos[i].resources[j].type === "embed"){
 					element = document.createElement('div');
 					element.setAttribute("id", "r_" + i + j);
 					element.setAttribute("class", "playing");
 					element.innerHTML = annos[i].resources[j].html;
 				}
 				element.style.display = 'none';
 				elements.push(element);
 			}
 		}
 		return elements;
 	},
 	render: function(){
 		/* 
 		/* render view - this.$captionsContainer
 		*/
 		var self = this;
 		self.$captionsContainer.append(self.captionBlocks);
 		
 	},
 	update: function(){
 		/* 
 		/* Update any state variabled
 		 * like annotations, transcript so on..
 		*/
 		this.$captionsContainer.innerHTML = '';
 		this.render();

 	},
 	destroy: function(){

 	}
 }


 async function bootstrap() {
 	// depends on dataUrl - configured
 	// in html script tag as a js var
 	const maayaTask = await fetchAndParse(dataUrl);;

 	// instantiate MaayaJaal an instance of Maaya
 	window.maayaJaal = new Maaya(maayaTask);

 	//initialize the instance
 	maayaJaal.init();
 }

 bootstrap();