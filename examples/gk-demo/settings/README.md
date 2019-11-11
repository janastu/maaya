# Data Store

## maaya.json

Is the json object, the initial params to start Maaya
This object will be called `Task`, which at later point 
may assist with extending Maaya's features. example below, transcriptUrl and annotationsUrl will be an array.

```
{
	"task": "maaya-options", 
	"title": "Your Presentation Title",
	"jsonldUrl": "settings/settings.json",
	"audioUrl": "path to web audio file mp3/ogg",
	"transcripUrl": {
		    "en": "metadata/webvtt/captions-en.vtt", 
		    "ka": "metadata/webvtt/captions-ka.vtt"
		    },
	"annotationsUrl": "metadata/webvtt/img-annos.vtt",
	"poster": "http://gk.chaluvaraju.pantoto.org/static/uploads/mangalya_daarana2.JPG"
}
```

## json-ld.json

The Metadata of the Digital media / Content
this example as reference to `schema.org->Article`

## Transcript

Keys 2 char language descriptor
val path to captions file

## Annotations

Media annotations to the audio file, supports images only

## poster

The image to be shown on media player init



