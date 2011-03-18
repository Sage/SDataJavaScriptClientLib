### Information

This repository contains a JavaScript library for consuming [SData](http://sdata.sage.com).

### Downloading

* [minified](http://github.com/SageScottsdalePlatform/SDataJavaScriptClientLib/raw/master/deploy/sdata-client.js)
* [debug](http://github.com/SageScottsdalePlatform/SDataJavaScriptClientLib/raw/master/deploy/sdata-client-debug.js)

### Building A Release Version

#### Requirements

*	Windows
*	The Java Runtime (JRE)
*	The environment variable, `JAVA_HOME`, pointing to the JRE base path, eg:

		c:\Program Files (x86)\Java\jre6

#### Steps

2.	Open a command prompt and execute the following from the root repository folder, eg:

		build\release.cmd
3.	The deployed product will be in a `deploy` folder in the root repository folder.