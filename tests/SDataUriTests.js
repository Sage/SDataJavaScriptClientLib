describe('SDataUri', function() {
    it('can build url', function() {
        var uri = new Sage.SData.Client.SDataUri()
            .setHost('localhost')
            .setServer('sdata')
            .setProduct('aw')
            .setContract('dynamic')
            .setCompanyDataset('-');

        expect(uri.build()).toEqual("http://localhost/sdata/aw/dynamic/-");
    });

    it('can build url with included content', function() {
        var uri = new Sage.SData.Client.SDataUri()
            .setHost('localhost')
            .setServer('sdata')
            .setProduct('aw')
            .setContract('dynamic')
            .setCompanyDataset('-')
            .setIncludeContent(true);

        expect(uri.build()).toEqual("http://localhost/sdata/aw/dynamic/-?_includeContent=true");
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
});