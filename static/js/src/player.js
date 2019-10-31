
audioPlayer = function(input){
	this.src = input.src;
	this.type = input.type;
	// instigate our audio context

	// for cross browser
	const AudioContext = window.AudioContext || window.webkitAudioContext;
	const audioCtx = new AudioContext();
	// load some sound
	const audioElement = document.createElement('audio');
	audioElement.src = this.src;
	audioElement.type = this.type;
	const track = audioCtx.createMediaElementSource(audioElement);
	const playerContainer = document.querySelectorAll('.tape');
	playerContainer[0].appendChild(audioElement);
	const playButton = document.querySelector('.tape-controls-play');

	// play pause audio
	playButton.addEventListener('click', function() {

	    // check if context is in suspended state (autoplay policy)
	    if (audioCtx.state === 'suspended') {
	        audioCtx.resume();
	    }

	    if (this.dataset.playing === 'false') {
	        audioElement.play();
	        this.dataset.playing = 'true';
	    // if track is playing pause it
	    } else if (this.dataset.playing === 'true') {
	        audioElement.pause();
	        this.dataset.playing = 'false';
	    }

	    let state = this.getAttribute('aria-checked') === "true" ? true : false;
	    this.setAttribute( 'aria-checked', state ? "false" : "true" );

	}, false);

	// if track ends
	audioElement.addEventListener('ended', () => {
	    playButton.dataset.playing = 'false';
	    playButton.setAttribute( "aria-checked", "false" );
	}, false);

	// volume
	const gainNode = audioCtx.createGain();

	const volumeControl = document.querySelector('[data-action="volume"]');
	volumeControl.addEventListener('input', function() {
	    gainNode.gain.value = this.value;
	}, false);
	

	// connect our graph
	track.connect(gainNode).connect(audioCtx.destination);
	return audioElement;
}

