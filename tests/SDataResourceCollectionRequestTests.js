describe('SDataResourceCollectionRequest', function() {
    var service,
        withResponseContent = function(name) {
            spyOn(Sage.SData.Client.Ajax, 'request').andCallFake(function(options) {
                options.success.call(options.scope || this, {
                    responseText: Resources.get(name)
                });
            });
        };

    beforeEach(function() {
        service = new Sage.SData.Client.SDataService({
            serverName: 'localhost',
            virtualDirectory: 'sdata',
            applicationName: 'aw',
            contractName: 'dynamic'
        });
    });

    it('can build url with paging', function() {
        var request = new Sage.SData.Client.SDataResourceCollectionRequest(service)
            .setResourceKind('employees')
            .setStartIndex(1)
            .setCount(100);

        expect(request.build()).toEqual("http://localhost/sdata/aw/dynamic/-/employees?_includeContent=false&startIndex=1&count=100");
    });

    it('can build url with query', function() {
        var request = new Sage.SData.Client.SDataResourceCollectionRequest(service)
            .setResourceKind('employees')
            .setQueryArg('where', 'gender eq m');

        expect(request.build()).toEqual("http://localhost/sdata/aw/dynamic/-/employees?_includeContent=false&where=gender%20eq%20m");
    });

    it('can read atom feed with non-prefixed properties', function() {

        withResponseContent('TestFeed.xml');

        var success = jasmine.createSpy(),
            failure = jasmine.createSpy();

        var request = new Sage.SData.Client.SDataResourceCollectionRequest(service)
            .setResourceKind('employees');

        request.read({
            success: success,
            failure: failure
        });

        expect(success).toHaveBeenCalled();
        expect(failure).not.toHaveBeenCalled();

        (function(feed) {
            expect(feed).toExist();
            expect(feed).toHaveProperty('$resources');
            expect(feed).toHaveProperty('$resources.length', 2);
            expect(feed).toHaveProperty('$resources.0.ContactId', '1209');
        })(success.mostRecentCall.args[0]);
    });

    it('can read atom feed with prefixed properties', function() {

        withResponseContent('TestFeedWithPrefix.xml');

        var success = jasmine.createSpy(),
            failure = jasmine.createSpy();

        var request = new Sage.SData.Client.SDataResourceCollectionRequest(service)
            .setResourceKind('employees');

        request.read({
            success: success,
            failure: failure
        });

        expect(success).toHaveBeenCalled();
        expect(failure).not.toHaveBeenCalled();

        (function(feed) {
            expect(feed).toExist();
            expect(feed).toHaveProperty('$resources');
            expect(feed).toHaveProperty('$resources.length', 2);
            expect(feed).toHaveProperty('$resources.0.ContactId', '1209');
        })(success.mostRecentCall.args[0]);
    });

    it('can read json feed', function() {

        withResponseContent('TestFeed.json');

        var success = jasmine.createSpy(),
            failure = jasmine.createSpy();

        var request = new Sage.SData.Client.SDataResourceCollectionRequest(service)
            .setResourceKind('employees');

        service.enableJson();
        
        request.read({
            success: success,
            failure: failure
        });

        expect(success).toHaveBeenCalled();
        expect(failure).not.toHaveBeenCalled();

        (function(feed) {
            expect(feed).toExist();
            expect(feed).toHaveProperty('$resources');
            expect(feed).toHaveProperty('$resources.length', 2);
            expect(feed).toHaveProperty('$resources.0.ContactId', '1209');
        })(success.mostRecentCall.args[0]);
    });

    it('uses correct accept header for atom', function() {
        spyOn(Sage.SData.Client.Ajax, 'request');

        var request = new Sage.SData.Client.SDataResourceCollectionRequest(service)
            .setResourceKind('employees');

        request.read();

        (function(options) {
            expect(options).toHaveProperty('headers');
            expect(options).toHaveProperty('headers.Accept', 'application/atom+xml;type=feed,*/*');
        })(Sage.SData.Client.Ajax.request.mostRecentCall.args[0]);
    });

    it('uses correct accept header for json', function() {
        spyOn(Sage.SData.Client.Ajax, 'request');

        var request = new Sage.SData.Client.SDataResourceCollectionRequest(service)
            .setResourceKind('employees');

        service.enableJson();

        request.read();

        (function(options) {
            expect(options).toHaveProperty('headers');
            expect(options).toHaveProperty('headers.Accept', 'application/json,*/*');
        })(Sage.SData.Client.Ajax.request.mostRecentCall.args[0]);
    });
});