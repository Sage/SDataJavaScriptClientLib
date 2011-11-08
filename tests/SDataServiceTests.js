describe('SDataService', function() {
    it('can set available url properties via constructor', function() {
        var service = new Sage.SData.Client.SDataService({
            protocol: 'https',
            serverName: 'localhost',
            port: 8080,
            virtualDirectory: 'sdata',
            applicationName: 'aw',
            contractName: 'dynamic',
            dataSet: 'alpha',
            includeContent: true
        });

        expect(service.uri.build()).toEqual("https://localhost:8080/sdata/aw/dynamic/alpha?_includeContent=true");
    });

    it('can set available url properties via url passed to constructor', function() {
        var service = new Sage.SData.Client.SDataService("https://localhost:8080/sdata/aw/dynamic/alpha");
        
        expect(service.uri.build()).toEqual("https://localhost:8080/sdata/aw/dynamic/alpha");
    });

    it('can set credentials via arguments passed to constructor', function() {
        var service = new Sage.SData.Client.SDataService("https://localhost:8080/sdata/aw/dynamic/alpha", "admin", "password");

        expect(service.uri.build()).toEqual("https://localhost:8080/sdata/aw/dynamic/alpha");
        expect(service.getUserName()).toEqual("admin");
        expect(service.getPassword()).toEqual("password");
    });

    it('can mix and match url properties via object passed to constructor', function() {
        var service = new Sage.SData.Client.SDataService({
            url: "https://localhost:8080/sdata/aw/dynamic/alpha",
            applicationName: "sample",
            dataSet: "omega",
            userName: "user",
            password: "password"
        }, "admin");

        expect(service.uri.build()).toEqual("https://localhost:8080/sdata/sample/dynamic/omega");
        expect(service.getUserName()).toEqual("admin");
        expect(service.getPassword()).toEqual("password");
    });

    it('does provide data set segment to requests', function() {
        var service = new Sage.SData.Client.SDataService({
            serverName: 'localhost',
            virtualDirectory: 'sdata',
            applicationName: 'aw',
            contractName: 'dynamic',
            dataSet: 'alpha'
        });

        var request = new Sage.SData.Client.SDataResourceCollectionRequest(service)
            .setResourceKind('employees');

        expect(request.build()).toEqual("http://localhost/sdata/aw/dynamic/alpha/employees?_includeContent=false")
    });

    it('supports extension of the accept header', function() {
        spyOn(Sage.SData.Client.Ajax, 'request');
        
        var service = new Sage.SData.Client.SDataService({
            serverName: 'localhost',
            virtualDirectory: 'sdata',
            applicationName: 'aw',
            contractName: 'dynamic'
        });

        var request = new Sage.SData.Client.SDataResourceCollectionRequest(service)
            .setResourceKind('employees')
            .setAccept('view=other');

        request.read();

        (function(options) {
            expect(options).toHaveProperty('headers');
            expect(options).toHaveProperty('headers.Accept', 'application/atom+xml;type=feed;view=other,*/*;view=other');
        })(Sage.SData.Client.Ajax.request.mostRecentCall.args[0]);
    });
});