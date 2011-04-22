describe('SDataBatchRequest', function() {
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

    it('can add requests to batch', function() {
        var batch = new Sage.SData.Client.SDataBatchRequest(service),
            employeeA = {},
            employeeB = {};

        batch.using(function() {
            new Sage.SData.Client.SDataSingleResourceRequest()
                .setResourceKind('employees')
                .setResourceSelector('1')
                .update(employeeA);

            new Sage.SData.Client.SDataSingleResourceRequest()
                .setResourceKind('employees')
                .setResourceSelector('2')
                .update(employeeB);
        });
    });

    it('can commit batch request', function() {

        withResponseContent('TestBatch.xml');

        var success = jasmine.createSpy(),
            failure = jasmine.createSpy(); 

        var batch = new Sage.SData.Client.SDataBatchRequest(service),
            employeeA = {},
            employeeB = {};

        batch.using(function() {
            new Sage.SData.Client.SDataSingleResourceRequest()
                .setResourceKind('employees')
                .setResourceSelector('1')
                .update(employeeA);

            new Sage.SData.Client.SDataSingleResourceRequest()
                .setResourceKind('employees')
                .setResourceSelector('2')
                .update(employeeB);
        });

        batch.commit({
            success: success,
            failure: failure
        });
    });
});