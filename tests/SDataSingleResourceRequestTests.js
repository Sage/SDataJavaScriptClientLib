JEST.testCase('SDataSingleResourceRequest');
JEST.before(function() {
    this.service = new Sage.SData.Client.SDataService({
        serverName: 'localhost',
        virtualDirectory: 'sdata',
        applicationName: 'aw',
        contractName: 'dynamic'
    });

    Sage.SData.Client.Ajax.push([{
        predicate: /use=atomPrefixed/i,
        url: 'TestEntryWithPrefix.xml'
    },{
        predicate: /use=atomNonPrefixed/i,
        url: 'TestEntry.xml'
    }]);
});

JEST.after(function() {
    Sage.SData.Client.Ajax.pop();
});

JEST.it('Can Build Url With Simple Selector', function() {
    var request = new Sage.SData.Client.SDataSingleResourceRequest(this.service)
        .setResourceKind('employees')
        .setResourceSelector('1');

    ASSERT.equal(request.build(), "http://localhost/sdata/aw/dynamic/-/employees(1)?_includeContent=false");
});

JEST.it('Can Build Url With Complex Selector', function() {
    var request = new Sage.SData.Client.SDataSingleResourceRequest(this.service)
        .setResourceKind('employees')
        .setResourceSelector("id eq '1234'");

    ASSERT.equal(request.build(), "http://localhost/sdata/aw/dynamic/-/employees(id%20eq%20'1234')?_includeContent=false");
});

JEST.it('Can Read Atom Entry With Prefixed Properties', function() {
    var request = new Sage.SData.Client.SDataSingleResourceRequest(this.service)
        .setResourceKind('employees')
        .setResourceSelector('1')
        .setQueryArg('_use', 'atomPrefixed');

    ASSERT.exists(request);

    request.read({
        async: false,
        success: function(entry) {
            ASSERT.exists(entry, 'entry does not exist.');
            ASSERT.exists(entry['NationalIdNumber'], 'entry does not have properties.');
            ASSERT.exists(entry['DirectReports'], 'entry does not have included collection property.');
            ASSERT.exists(entry['DirectReports']['$resources'], 'entry does not have included collection resources.');

            ASSERT.equal(entry['DirectReports']['$resources'].length, 2, 'included collection resource count does not match expected.');
            ASSERT.equal(entry['DirectReports']['$resources'][0]['NationalIdNumber'], '14417808', 'included collection does not match expected.');
        },
        failure: function() {
            ASSERT.fail('fail', 'success', 'failure returned', 'fail');
        }
    });
});

JEST.it('Can Read Atom Entry With Non-Prefixed Properties', function() {
    var request = new Sage.SData.Client.SDataSingleResourceRequest(this.service)
        .setResourceKind('employees')
        .setResourceSelector('1')
        .setQueryArg('_use', 'atomNonPrefixed');

    ASSERT.exists(request);

    request.read({
        async: false,
        success: function(entry) {
            ASSERT.exists(entry, 'entry does not exist.');
            ASSERT.exists(entry['NationalIdNumber'], 'entry does not have properties.');
            ASSERT.exists(entry['DirectReports'], 'entry does not have included collection property.');
            ASSERT.exists(entry['DirectReports']['$resources'], 'entry does not have included collection resources.');

            ASSERT.equal(entry['DirectReports']['$resources'].length, 2, 'included collection resource count does not match expected.');
            ASSERT.equal(entry['DirectReports']['$resources'][0]['NationalIdNumber'], '14417808', 'included collection does not match expected.');
        },
        failure: function() {
            ASSERT.fail('fail', 'success', 'failure returned', 'fail');
        }
    });
});
