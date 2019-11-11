# Maaya

Maaya is a class of utilities to generaate a AV presentation
from Images, Audio and subtitles.


## Directory structure
```
maaya
+-- app
+    +-- css   // Stylesheets
+    +-- img  // Images cache
+    +-- js  //  Application scripts
         +-- lib // Vendor depenencies
         +-- src
             +-- main.js    //Application entrypoint
             +-- view.js 
             +-- controller.js


+-- examples
+    +-- gk-demo
|    |     +-- audio
|    |     |   +-- audio.mp3
|    |     +-- images
|    |     +-- metadata
|    |     |    +-- webvtt
|    |     |        +-- captions-en.vtt
|    |     |        +-- captions-ka.vtt
|    |     |        +-- img-annos.vtt
|    |     +-- settings
|    |     |    +-- json-ld.json
|    |     |    +-- settings.json
|    |     |    +-- README.md
|    |     +-- index.html        

```

## Make your own
Copy one of the directories from the examples folder.
and edit the settings and add your own images, audio and metadata.
Let's call this your presentation folder. 

### Configuration

#### Settings

For this version the configuration object will be saved in `settings/settings.json` inside the root of the presentation folder.

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
#### json-ld
JSON-LD is the metadata for the Maayajaal presentation. Currently using schema.org features, for semantic markup.


### Metadata
All metadata is written in webVTT format, for more details
on syntax check out [MDN docs](https://developer.mozilla.org/en-US/docs/Web/API/WebVTT_API)

This project also includes a webVTT validator, available at
localhost/validator 

currently this project only supports images in the img-annos.vtt
