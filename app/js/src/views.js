/* Purpose: All DOM handling will be through maayaView
*/

var maayaView = function(jsonLd){
	this.jsonLD = jsonLd;
	this.$annosContainer;
	this.initLayout();
	return this;
}

maayaView.prototype = {
	initLayout: async function() {
		var layoutTemplate = document.querySelector("#maaya-layout");
		var templateClone = document.importNode(layoutTemplate.content, true);
		var heading = templateClone.querySelector("header h2");
		var subHeading = templateClone.querySelector("header p");
		var metaContainer = templateClone.querySelector("#metadata-container");
		heading.textContent = this.jsonLD["headline"];
		subHeading.textContent = this.jsonLD["author"];
		metaContainer.textContent = JSON.stringify(this.jsonLD, undefined, 2);
		await document.body.appendChild(templateClone);
		this.$annosContainer = document.querySelector("#annotations-container");
	},
	renderAnnosInSidebar: function(player, annos) {
		var self = this;
		self.$annosContainer.innerHTML = "";
		var $ul = document.createElement('ul');
		annos.cues.forEach(function(cue){
			var exp = cue.id !== "entry";
			console.log(exp);
			if(exp){
				var $li = document.createElement('li');
				$li.setAttribute('data-start', cue.startTime);
				$li.setAttribute('data-end', cue.endTime);
				$li.setAttribute('id', "cue-"+cue.id);
				var $label = document.createElement('label');
				$label.setAttribute('class', 'badge');
				$label.innerHTML = controller.secondToHHMMSS(cue.startTime);
				$li.addEventListener('click', function(event){
					player.currentTime = Number(event.currentTarget.dataset.start);
				});
				var $img = document.createElement('img');
				$img.src = cue.text;
				$img.setAttribute('class', 'anno-img');
				$img.setAttribute('loading', 'lazy');
				$li.append($label, $img);
				$ul.append($li);
			}
		});
		self.$annosContainer.append($ul);

	},
	renderAnnoInPoster: function(player, annos){
		var self = this;
		
		// render images in video poster el
		annos.cues.forEach(function(cue){
			var startCheck = player.currentTime >= cue.startTime;
			var endCheck =  cue.endTime >= player.currentTime;
			var isCheckPassed = startCheck && endCheck;	
			if (isCheckPassed) {
				$('video').attr('poster', cue.text);
				// scroll relevant img in sidebar
				var activeAnno = document.querySelector('[data-start="'+ cue.startTime +'"]');
				var isActive = document.querySelector("#annotations-container .active");
				if(isActive) isActive.removeAttribute('class', 'active');

				activeAnno.setAttribute('class', 'active');
				activeAnno.scrollIntoView(true, {
					behaviour: "smooth",
					inline: "start"
				});
				window.scrollBy(0, -130);
			}
		});
	}
}