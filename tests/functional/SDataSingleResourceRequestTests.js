JEST.testCase('Atom SDataSingleResourceRequest Test Case');
JEST.before(function() {
    this.service = new Sage.SData.Client.SDataService({
        serverName: testConfig.server,
        virtualDirectory: 'sdata',
        applicationName: 'slx',
        contractName: 'dynamic',
        port: 80,
        protocol: /https/i.test(window.location.protocol) ? 'https' : false,
        userName: 'Admin',
        password: ''
    });    
});
JEST.it('can convert resource collection', function() {
    var request = new Sage.SData.Client.SDataSingleResourceRequest(this.service)
        .setResourceKind('accounts')
        .setResourceSelector("'AGHEA0002669'")
        .setQueryArg('include', 'Contacts');    

    request.read({
        async: false,
        success: function(entry) {
            var contacts = entry && entry['Contacts'],
                resources = contacts && contacts['$resources'],
                contact = resources && resources[0];

            ASSERT.exists(contact, 'first contact does not exist.');
            ASSERT.exists(contact['Account'], 'first contact\'s account does not exist.');
            ASSERT.equal(contact['Account']['$key'], 'AGHEA0002669', 'first contact\'s account does not match.');
        },
        failure: function() {
            ASSERT.fail('fail', 'success', 'failure returned', 'fail');
        }
    });
});

JEST.testCase('Json SDataSingleResourceRequest Test Case');
JEST.before(function() {
    this.service = new Sage.SData.Client.SDataService({
        serverName: testConfig.server,
        virtualDirectory: 'sdata',
        applicationName: 'slx',
        contractName: 'dynamic',
        port: 80,
        protocol: /https/i.test(window.location.protocol) ? 'https' : false,
        json: true,
        userName: 'Admin',
        password: ''
    });
});