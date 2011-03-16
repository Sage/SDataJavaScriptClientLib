JEST.testCase('SDataServiceOperationRequest');
JEST.before(function() {
    this.xml = new XML.ObjTree();
    this.xml.attr_prefix = '@';
    
    this.service = new Sage.SData.Client.SDataService({
        serverName: 'localhost',
        virtualDirectory: 'sdata',
        applicationName: 'aw',
        contractName: 'dynamic'
    });

    Sage.SData.Client.Ajax.push([{
        predicate: /use=atom/i,
        scope: this,
        url: 'TestServiceResponse.xml',
        capture: function(options) {
            this.requestOptions = options;
        }
    }]);
});

JEST.after(function() {
    Sage.SData.Client.Ajax.pop();
});

JEST.it('Can Build Url With Service Operation', function() {
    var request = new Sage.SData.Client.SDataServiceOperationRequest(this.service)
        .setResourceKind('tasks')
        .setOperationName('CompleteTask');

    ASSERT.equal(request.build(), "http://localhost/sdata/aw/dynamic/-/tasks/%24service/CompleteTask?_includeContent=false");
});

JEST.it('Can Execute Service Operation', function() {
    var request = new Sage.SData.Client.SDataServiceOperationRequest(this.service)
        .setResourceKind('tasks')
        .setOperationName('CompleteTask')
        .setQueryArg('_use', 'atom');

    ASSERT.exists(request);

    var entry = {
        '$name': 'TaskComplete',
        'request': {
            'TaskId': 1
        }
    };

    request.execute(entry, {
        async: false,
        success: function(entry) {
            ASSERT.exists(entry['response'], 'response does not exist.');
            ASSERT.exists(entry['response']['Result'], 'response container does not exist.');
            
            ASSERT.equal(entry['response']['Result']['Description'], 'Confirm Meeting', 'Description does not match.');
        },
        failure: function() {
            ASSERT.fail('fail', 'success', 'failure returned', 'fail');
        }
    });

    var converted = this.xml.parseXML(this.requestOptions.body);

    ASSERT.exists(converted['entry']['sdata:payload'], 'payload does not exist.');
    ASSERT.exists(converted['entry']['sdata:payload']['TaskComplete'], 'request container does not exist.');
    ASSERT.exists(converted['entry']['sdata:payload']['TaskComplete']['request'], 'request does not exist.');

    ASSERT.equal(converted['entry']['sdata:payload']['TaskComplete']['request']['TaskId'], '1', 'TaskId does not match.');
});
