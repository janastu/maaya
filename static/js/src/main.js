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

 	return this;
 }

 Maaya.prototype = {
 	init: function() {
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
 		this.$audioPlayer = new audioPlayer({
 							src: this.audioUrl,
 							type: "audio/mpeg"
 						});
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
 		    element.innerText = transcript.data[i].begin + " - " + transcript.data[i].text + " ";
 		    element.style.display = 'none';
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
 		/* render view
 		*/
 		var self = this;
 		var $annosContainer = document.getElementById("annotations-container");
 		var $transcriptContainer = document.getElementById("transcript-container");
 		// where $annos = [[]]
 		self.$annos.forEach(function(anno){
 			anno.forEach(function(annoNode){
 				$annosContainer.appendChild(annoNode);
 			});
 		});
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
 	// depends on dataUrl - configured
 	// in html script tag as a js var
 	const maayaTask = await fetchAndParse(dataUrl);;

 	// instantiate MaayaJaal an instance of Maaya
 	window.maayaJaal = new Maaya(maayaTask);

 	//initialize the instance
 	maayaJaal.init();
 }

 bootstrap();