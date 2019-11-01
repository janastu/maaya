
const fetchAndParse = async function(url){
	const jsonLdRequest = await fetch(url);
	const finalResponse = await jsonLdRequest.json();
	return finalResponse;
}