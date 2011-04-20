describe('SDataServiceOperationRequest', function() {
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

    it('can build url with service operation', function() {
        var request = new Sage.SData.Client.SDataServiceOperationRequest(service)
            .setResourceKind('tasks')
            .setOperationName('CompleteTask');

        expect(request.build()).toEqual("http://localhost/sdata/aw/dynamic/-/tasks/%24service/CompleteTask?_includeContent=false");
    });

    it('can format atom entry for service operation call', function() {
        spyOn(Sage.SData.Client.Ajax, 'request');

        var request = new Sage.SData.Client.SDataServiceOperationRequest(service)
            .setResourceKind('tasks')
            .setOperationName('CompleteTask');        

        var entry = {
            '$name': 'TaskComplete',
            'request': {
                'TaskId': 1
            }
        };

        request.execute(entry);

        (function(formatted) {
            expect(formatted).toHaveProperty('entry');
            expect(formatted).toHaveProperty('entry.sdata:payload');
            expect(formatted).toHaveProperty('entry.sdata:payload.TaskComplete');
            expect(formatted).toHaveProperty('entry.sdata:payload.TaskComplete.request');
            expect(formatted).toHaveProperty('entry.sdata:payload.TaskComplete.request.TaskId', '1');
        })(xml.parseXML(Sage.SData.Client.Ajax.request.mostRecentCall.args[0].body));
    });

    it('can execute service operation call', function() {
        
        withResponseContent('TestServiceResponse.xml');

        var success = jasmine.createSpy(),
            failure = jasmine.createSpy();
        
        var request = new Sage.SData.Client.SDataServiceOperationRequest(service)
            .setResourceKind('tasks')
            .setOperationName('CompleteTask');

        var entry = {
            '$name': 'TaskComplete',
            'request': {
                'TaskId': 1
            }
        };

        request.execute(entry, {
            success: success,
            failure: failure
        });

        expect(success).toHaveBeenCalled();
        expect(failure).not.toHaveBeenCalled();

        (function(entry) {
            expect(entry).toExist();
            expect(entry).toHaveProperty('response');
            expect(entry).toHaveProperty('response.Result');
            expect(entry).toHaveProperty('response.Result.Description', 'Confirm Meeting');
        })(success.mostRecentCall.args[0]);
    });
});
