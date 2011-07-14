/* Copyright (c) 2010, Sage Software, Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

(function(){
    var S = Sage,
        C = Sage.namespace('Sage.SData.Client');

    Sage.SData.Client.SDataApplicationRequest = Sage.SData.Client.SDataBaseRequest.extend({
        constructor: function() {
            this.base.apply(this, arguments);

            if (this.service)
            {
                this.uri.setProduct(this.service.getApplicationName() ? this.service.getApplicationName() : '-');
                this.uri.setContract(this.service.getContractName() ? this.service.getContractName() : '-');
                this.uri.setCompanyDataset(this.service.getDataSet() ? this.service.getDataSet() : '-');
            }
        },
        clone: function() {
            return new Sage.SData.Client.SDataApplicationRequest(this.service)
                .setUri(new Sage.SData.Client.SDataUri(this.uri));
        },
        getApplicationName: function() {
            return this.uri.getProduct();
        },
        setApplicationName: function(value) {
            this.uri.setProduct(value);
            return this;
        },
        getContractName: function() {
            return this.uri.getContract();
        },
        setContractName: function(value) {
            this.uri.setContract(value);
            return this;
        },
        getDataSet: function() {
            return this.uri.getCompanyDataset();
        },
        setDataSet: function(value) {
            this.uri.setCompanyDataset(value);
            return this;
        },
        getResourceKind: function() {
            return this.uri.getCollectionType();
        },
        setResourceKind: function(value) {
            this.uri.setCollectionType(value);
            return this;
        }
    });
})();

