describe('SDataSingleResourceRequest', function() {
    var service,
        xml = new XML.ObjTree(),
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

    it('can build url with simple selector', function() {
        var request = new Sage.SData.Client.SDataSingleResourceRequest(service)
            .setResourceKind('employees')
            .setResourceSelector('1');

        expect(request.build()).toEqual("http://localhost/sdata/aw/dynamic/-/employees(1)?_includeContent=false");
    });

    it('can build url with complex selector', function() {
        var request = new Sage.SData.Client.SDataSingleResourceRequest(service)
            .setResourceKind('employees')
            .setResourceSelector("id eq '1234'");

        expect(request.build()).toEqual("http://localhost/sdata/aw/dynamic/-/employees(id%20eq%20'1234')?_includeContent=false");
    });

    it('can read atom entry with prefixed properties', function() {

        withResponseContent('TestEntryWithPrefix.xml');

        var success = jasmine.createSpy(),
            failure = jasmine.createSpy();            

        var request = new Sage.SData.Client.SDataSingleResourceRequest(service)
            .setResourceKind('employees')
            .setResourceSelector('1');

        request.read({
            success: success,
            failure: failure
        });

        expect(success).toHaveBeenCalled();
        expect(failure).not.toHaveBeenCalled();

        (function(entry) {
            expect(entry).toExist();
            expect(entry).toHaveProperty('NationalIdNumber');
            expect(entry).toHaveProperty('DirectReports');
            expect(entry).toHaveProperty('DirectReports.$resources');
            expect(entry).toHaveProperty('DirectReports.$resources.length', 2);
            expect(entry).toHaveProperty('DirectReports.$resources.0.NationalIdNumber', '14417808');
        })(success.mostRecentCall.args[0]);
    });

    it('can read atom entry with non-prefixed properties', function() {

        withResponseContent('TestEntry.xml');

        var success = jasmine.createSpy(),
            failure = jasmine.createSpy();

        var request = new Sage.SData.Client.SDataSingleResourceRequest(service)
            .setResourceKind('employees')
            .setResourceSelector('1');

        request.read({
            success: success,
            failure: failure
        });

        expect(success).toHaveBeenCalled();
        expect(failure).not.toHaveBeenCalled();

        (function(entry) {
            expect(entry).toExist();
            expect(entry).toHaveProperty('NationalIdNumber');
            expect(entry).toHaveProperty('DirectReports');
            expect(entry).toHaveProperty('DirectReports.$resources');
            expect(entry).toHaveProperty('DirectReports.$resources.length', 2);
            expect(entry).toHaveProperty('DirectReports.$resources.0.NationalIdNumber', '14417808');
        })(success.mostRecentCall.args[0]);
    });
});
