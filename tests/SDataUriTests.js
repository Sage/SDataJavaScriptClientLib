describe('SDataUri', function() {
    it('can build url', function() {
        var uri = new Sage.SData.Client.SDataUri()
            .setHost('localhost')
            .setServer('sdata')
            .setProduct('aw')
            .setContract('dynamic')
            .setCompanyDataset('-')
            .setCollectionType('employees');

        expect(uri.build()).toEqual("http://localhost/sdata/aw/dynamic/-/employees");
    });

    it('can build url with included content', function() {
        var uri = new Sage.SData.Client.SDataUri()
            .setHost('localhost')
            .setServer('sdata')
            .setProduct('aw')
            .setContract('dynamic')
            .setCompanyDataset('-')
            .setCollectionType('employees')
            .setIncludeContent(true);

        expect(uri.build()).toEqual("http://localhost/sdata/aw/dynamic/-/employees?_includeContent=true");
    });

    it('can append path segment', function() {
        var uri = new Sage.SData.Client.SDataUri()
            .setHost('localhost')
            .setServer('sdata')
            .setProduct('aw')
            .setContract('dynamic')
            .setCompanyDataset('-');

        uri.appendPath('employees');

        expect(uri.build()).toEqual("http://localhost/sdata/aw/dynamic/-/employees");
    });

    it('can set path segment predicate', function() {
        var uri = new Sage.SData.Client.SDataUri()
            .setHost('localhost')
            .setServer('sdata')
            .setProduct('aw')
            .setContract('dynamic')
            .setCompanyDataset('-')
            .setCollectionType('employees');

        uri.setCollectionPredicate('1');

        expect(uri.build()).toEqual("http://localhost/sdata/aw/dynamic/-/employees(1)");
    });

    it('can clone url', function() {
        var uri = new Sage.SData.Client.SDataUri()
            .setHost('localhost')
            .setServer('sdata')
            .setProduct('aw')
            .setContract('dynamic')
            .setCompanyDataset('-')
            .setCollectionType('employees');

        var copy = new Sage.SData.Client.SDataUri(uri);

        expect(uri.build()).toEqual(copy.build());
    });

    it('does not modify original url when cloned', function() {
        var uri = new Sage.SData.Client.SDataUri()
            .setHost('localhost')
            .setServer('sdata')
            .setProduct('aw')
            .setContract('dynamic')
            .setCompanyDataset('-');

        var copy = new Sage.SData.Client.SDataUri(uri);

        uri.appendPath('employees');
        uri.setQueryArg('one', 'two');

        copy.appendPath('tasks');
        copy.setQueryArg('three', 'four');

        expect(uri.build()).toEqual("http://localhost/sdata/aw/dynamic/-/employees?one=two");
        expect(copy.build()).toEqual("http://localhost/sdata/aw/dynamic/-/tasks?three=four");
    });

    it('chooses correct include content argument for different versions', function() {
        var uriA = new Sage.SData.Client.SDataUri()
            .setHost('localhost')
            .setServer('sdata')
            .setProduct('aw')
            .setContract('dynamic')
            .setCompanyDataset('-')
            .setCollectionType('employees')
            .setVersion({major: 1, minor: 0})
            .setIncludeContent(false);

        var uriB = new Sage.SData.Client.SDataUri()
            .setHost('localhost')
            .setServer('sdata')
            .setProduct('aw')
            .setContract('dynamic')
            .setCompanyDataset('-')
            .setCollectionType('employees')
            .setVersion({major: 0, minor: 9})
            .setIncludeContent(false);

        expect(uriA.build()).toEqual("http://localhost/sdata/aw/dynamic/-/employees?_includeContent=false");
        expect(uriB.build()).toEqual("http://localhost/sdata/aw/dynamic/-/employees?includeContent=false");
    });
});