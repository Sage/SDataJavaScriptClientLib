## Information

This repository contains a JavaScript library for consuming [SData](http://sdata.sage.com).

## Downloading

* [minified](http://github.com/SageScottsdalePlatform/SDataJavaScriptClientLib/raw/master/deploy/sdata-client.js)
* [debug](http://github.com/SageScottsdalePlatform/SDataJavaScriptClientLib/raw/master/deploy/sdata-client-debug.js)

## Building A Release Version

### Requirements

*	Windows
*	The Java Runtime (JRE)
*	The environment variable, `JAVA_HOME`, pointing to the JRE base path, eg:

		c:\Program Files (x86)\Java\jre6

### Steps

2.	Open a command prompt and execute the following from the root repository folder, eg:

		build\release.cmd
3.	The deployed product will be in a `deploy` folder in the root repository folder.

## Examples

#### Example: Set up an SData service connection (to be used for rest of examples)
	var service = new Sage.SData.Client.SDataService({
	    url: 'http://localhost/sdata/slx/dynamic/-/',
	    userName: 'admin',
	    password: '',
	    json: true //if your SData provider supports JSON
	});

#### Example: Make a single resource request (Contact)
	var request = new Sage.SData.Client.SDataSingleResourceRequest(service)
		.setResourceKind('contacts')
		.setResourceSelector("'CGHEA0000001'");
	    
	request.read({
	    success: function(entry) { console.log(entry); }
	});

#### Example: Request a resource collection (Contacts)
	var request = new Sage.SData.Client.SDataResourceCollectionRequest(service)
	    .setResourceKind('contacts')
	    .setCount(5)
	    .setStartIndex(6); // 1 based, not 0 based (per spec)
	    
	request.read({
	    success: function(feed) { console.log(feed); }
	});

#### Example: Request all of the Contacts for a particular Account
	var request = new Sage.SData.Client.SDataResourcePropertyRequest(service)
	    .setResourceKind('accounts')
	    .setResourceSelector("'AGHEA0002669'")
	    .setResourceProperty('Contacts')
	    
	// use `readFeed` since we are targeting a collection property
	request.readFeed({
	    success: function(feed) { console.log(feed); }
	});

#### Example: Batch request (combine two account queries)
	var batch = new Sage.SData.Client.SDataBatchRequest(service)
	    .setResourceKind('accounts')
	    .using(function() {
	        new Sage.SData.Client.SDataSingleResourceRequest(service)
	            .setResourceKind('accounts')
	            .setResourceSelector("'AGHEA0002669'")
	            .read();
	        
	        new Sage.SData.Client.SDataSingleResourceRequest(service)
	            .setResourceKind('accounts')
	            .setResourceSelector("'AA2EK0013031'")
	            .read();        
	    });
	    
	batch.commit({
	    success: function(feed) { console.log(feed); }
	});