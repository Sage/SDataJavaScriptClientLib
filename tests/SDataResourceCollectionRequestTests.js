JEST.testCase('SDataResourceCollectionRequest');
JEST.before(function() {
    this.service = new Sage.SData.Client.SDataService({
        serverName: 'localhost',
        virtualDirectory: 'sdata',
        applicationName: 'aw',
        contractName: 'dynamic'
    });

    Sage.SData.Client.Ajax.push([{
        predicate: /use=atomPrefixed/i,
        url: 'TestFeedWithPrefix.xml'
    },{
        predicate: /use=atomNonPrefixed/i,
        url: 'TestFeed.xml'
    },{
        predicate: /use=json/i,
        url: 'TestFeed.json'
    }]);
});

JEST.after(function() {
    Sage.SData.Client.Ajax.pop();
});

JEST.it('Can Build Url With Paging', function() {
    var request = new Sage.SData.Client.SDataResourceCollectionRequest(this.service)
        .setResourceKind('employees')
        .setStartIndex(1)
        .setCount(100);

    ASSERT.equal(request.build(), "http://localhost/sdata/aw/dynamic/-/employees?_includeContent=false&startIndex=1&count=100");
});

JEST.it('Can Build Url With Query', function() {
    var request = new Sage.SData.Client.SDataResourceCollectionRequest(this.service)
        .setResourceKind('employees')
        .setQueryArg('where', 'gender eq m');

    ASSERT.equal(request.build(), "http://localhost/sdata/aw/dynamic/-/employees?_includeContent=false&where=gender%20eq%20m");
});

JEST.it('Can Read Atom Feed With Prefixed Properties', function() {
    var request = new Sage.SData.Client.SDataResourceCollectionRequest(this.service)
        .setResourceKind('employees')
        .setQueryArg('_use', 'atomPrefixed');

    ASSERT.exists(request);

    request.read({
        async: false,
        success: function(feed) {
            ASSERT.exists(feed, 'feed does not exist.');
            ASSERT.exists(feed['$resources'], 'feed does not have resources.');

            ASSERT.equal(feed['$resources'].length, 2, 'resource count does not match expected.');
            ASSERT.equal(feed['$resources'][0]['ContactId'], '1209', 'entry does not match expected.');
        },
        failure: function() {
            ASSERT.fail('fail', 'success', 'failure returned', 'fail');
        }
    });
});

JEST.it('Can Read Atom Feed With Non-Prefixed Properties', function() {
    var request = new Sage.SData.Client.SDataResourceCollectionRequest(this.service)
        .setResourceKind('employees')
        .setQueryArg('_use', 'atomNonPrefixed');

    ASSERT.exists(request);

    request.read({
        async: false,
        success: function(feed) {
            window._feed = feed;
            ASSERT.exists(feed, 'feed does not exist.');
            ASSERT.exists(feed['$resources'], 'feed does not have resources.');

            ASSERT.equal(feed['$resources'].length, 2, 'resource count does not match expected.');
            ASSERT.equal(feed['$resources'][0]['ContactId'], '1209', 'entry does not match expected.');
        },
        failure: function() {
            ASSERT.fail('fail', 'success', 'failure returned', 'fail');
        }
    });
});

// if running this test through IIS, be sure to have the appropriate mime type, 'application/json', set for '.json'.
JEST.it('Can Read Json Feed', function() {
    this.service.enableJson();

    var request = new Sage.SData.Client.SDataResourceCollectionRequest(this.service)
        .setResourceKind('employees')
        .setQueryArg('_use', 'json');

    ASSERT.exists(request);

    request.read({
        async: false,
        success: function(feed) {
            window._feed = feed;
            ASSERT.exists(feed, 'feed does not exist.');
            ASSERT.exists(feed['$resources'], 'feed does not have resources.');

            ASSERT.equal(feed['$resources'].length, 2, 'resource count does not match expected.');
            ASSERT.equal(feed['$resources'][0]['ContactId'], '1209', 'entry does not match expected.');
        },
        failure: function() {
            ASSERT.fail('fail', 'success', 'failure returned', 'fail');
        }
    });
});