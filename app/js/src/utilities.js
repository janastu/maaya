
const fetchAndParse = async function(url){
	const jsonLdRequest = await fetch(url);
	const finalResponse = await jsonLdRequest.json();
	return finalResponse;
}

const secondToHHMMSS = function(seconds){
	return new Date(seconds * 1000).toISOString().substr(11, 8);
}
const hmsToSecondsOnly = function(str) {
	var p = str.split(':'),
	 s = 0, m = 1;

	while (p.length > 0) {
	 s += m * parseInt(p.pop(), 10);
	 m *= 60;
	}

	return s;
}