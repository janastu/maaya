# Data Store

## maaya.json

Is the json object, the initial params to start Maaya
This object will be called `Task`, which at later point 
may assist with extending Maaya's features. example below, transcriptUrl and annotationsUrl will be an array.

```
{
	"task": "maaya-options",
	"jsonldUrl": "../static/json-ld.json",
	"audioUrl": "../static/audios/HampiGirijaKalyanaStorybyCraju.mp3",
	"transcripUrl": ["../static/json/transcript.json", "../static/json/transcript-kan.json"],
	"annotationsUrl": ["../static/json/annotations.json"]
}
```

## json-ld.json

The Metadata of the Digital media / Content
this example as reference to `schema.org->Article`

## Transcript
JSON structure similar to https://github.com/aeneas01/aeneas

Default `transcript.json => English transcript of the audio`
Language options must be seperated by `-`
ex: kannada transcript will be `transcript-kan.json`

## Annotations

Media annotations to the audio file, could be Image, Link, Embed



