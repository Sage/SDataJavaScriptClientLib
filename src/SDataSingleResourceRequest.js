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

    Sage.SData.Client.SDataSingleResourceRequest = Sage.SData.Client.SDataApplicationRequest.extend({
        constructor: function() {
            this.base.apply(this, arguments);
        },
        read: function(options) {
            return this.service.readEntry(this, options);
        },
        update: function(entry, options) {
            return this.service.updateEntry(this, entry, options);
        },
        create: function(entry, options) {
            return this.service.createEntry(this, entry, options);
        },
        'delete': function(entry, options) {
            return this.service.deleteEntry(this, entry, options);
        },
        getResourceSelector: function() {
            return this.uri.getCollectionPredicate();
        },
        setResourceSelector: function(value) {
            this.uri.setCollectionPredicate(value);
            return this;
        }
    });
})();
