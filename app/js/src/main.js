 Maaya = function (maayaOpts) {
 	// Task can have some options later
 	this.task = maayaOpts.task;
 	this.jsonLdUrl = maayaOpts.jsonldUrl;
 	this.audioUrl = maayaOpts.audioUrl;
 	this.captionsUrl = maayaOpts.captionsUrl;
 	this.annotationsUrl = maayaOpts.annotationsUrl;

 	// hardcoding default lang / container setting, should be inherited 
 	// maaya settings option
 	this.i18n = 'eng';
 	this.$captionsContainer;
 	this.$annosContainer;

 	// JSON DATA
 	this.$audioPlayer;
 	this.jsonLD;
 	this.transcript = [];
 	this.annotations = [];
 	this.$annos = [];
 	this.$transcripts = [];
 	this.currentBlocks = {};

 	return this;
 }


 Maaya.prototype = {
 	init: function(playerId, options) {
 		console.log(playerId, options);

 		var self = this;
 		self.playerEl = playerId;
 		self.initOptions = options;
 		this.parseJsonLd();
 	},
 	parseJsonLd: async function(){
 		/* Parse JSON-LD for validity and set other variables
 		/* required for rendering view
 		*/
 		this.jsonLD = await fetchAndParse(this.jsonLdUrl);
 		var layoutTemplate = document.querySelector("#maaya-layout");
 		var templateClone = document.importNode(layoutTemplate.content, true);
 		var heading = templateClone.querySelector("header h1");
 		var subHeading = templateClone.querySelector("header h4");
 		var metaContainer = templateClone.querySelector("#metadata-container");
 		
 		heading.textContent = this.jsonLD["headline"];
 		subHeading.textContent = this.jsonLD["author"];
 		metaContainer.textContent = JSON.stringify(this.jsonLD, undefined, 2);
 		await document.body.appendChild(templateClone);
 		this.$annosContainer = document.querySelector("#annotations-container");
 		this.launchPlayer();
 	},
 	launchPlayer: function(){

 		this.plyr = new Plyr(this.playerEl);
 		this.fetchAnnotations();
 		this.plyr.on('timeupdate', event => {
 			
 		    const instance = event.detail.plyr;
 		    self.renderAnnoInPoster();
 		});
 		this.setPlyrSource(this.initOptions);
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
 			me.annotations.push(parser.parse(response));
 			me.renderAnnosInSidebar();
 		});
 		
 	},
 	renderAnnosInSidebar: function() {
 		var self = this;
 		self.$annosContainer.innerHTML = "";
 		var $ul = document.createElement('ul');
 		this.annotations[0].cues.forEach(function(cue){
 			var $li = document.createElement('li');
 			$li.setAttribute('data-start', cue.startTime);
 			$li.setAttribute('data-end', cue.endTime);
 			var $label = document.createElement('label');
 			$label.setAttribute('class', 'badge');
 			$label.innerHTML = secondToHHMMSS(cue.startTime);
 			$li.addEventListener('click', function(event){
 				console.log(event.currentTarget.dataset);
 				self.plyr.currentTime = Number(event.currentTarget.dataset.start);
 			});
 			var $img = document.createElement('img');
 			$img.src = cue.text;
 			$img.setAttribute('class', 'anno-img');
 			$li.append($label, $img);
 			$ul.append($li);
 		});
 		self.$annosContainer.append($ul);

 	},
 	renderAnnoInPoster: function(){
 		var self = this;
 		
 		// render images in video poster el
 		this.annotations[0].cues.forEach(function(cue){
 			var startCheck = self.plyr.currentTime >= cue.startTime;
 			var endCheck =  cue.endTime >= self.plyr.currentTime;
 			var isCheckPassed = startCheck && endCheck;	
 			if (isCheckPassed) {
 				$('video').attr('poster', cue.text);
 				// scroll relevant img in sidebar
 				var activeAnno = document.querySelector('[data-start="'+ cue.startTime +'"]');
 				var isActive = document.querySelector("#annotations-container .active");
 				if(isActive) isActive.removeAttribute('class', 'active');

 				activeAnno.setAttribute('class', 'active');
 				activeAnno.scrollIntoView({
 					behaviour: "smooth",
 				
 					inline: "start"
 				});
 			}
 		});

 	}
 }

 async function bootstrap() {
 	// depends on dataUrl - configured
 	// in html script tag as a js var
 	const maayaTask = await fetchAndParse(dataUrl);;

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