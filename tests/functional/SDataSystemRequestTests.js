JEST.testCase('SDataSystemRequest');
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
JEST.it('can read from system request', function() {
    var request = new Sage.SData.Client.SDataSystemRequest(this.service);

    ASSERT.exists(request);

    request.read({
        async: false,
        success: function(entry) {            
        },
        failure: function() {
            ASSERT.fail('fail', 'success', 'failure returned', 'fail');
        }
    });
});