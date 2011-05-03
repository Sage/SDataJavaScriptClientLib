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

    Sage.SData.Client.SDataBatchRequest = Sage.SData.Client.SDataApplicationRequest.extend({
        items: null,
        constructor: function() {
            this.base.apply(this, arguments);

            this.items = [];
            this.uri.setPathSegment(
                Sage.SData.Client.SDataUri.ResourcePropertyIndex,
                Sage.SData.Client.SDataUri.BatchSegment
            );
        },
        using: function(fn, scope) {
            if (this.service)
                this.service.registerBatchScope(this);
            else
                throw "A service must be associated with the batch request.";

            try
            {
                fn.call(scope || this, this);
            }
            catch (e)
            {
                this.service.clearBatchScope(this);
                throw e;
            }

            this.service.clearBatchScope(this);

            return this;
        },
        add: function(item) {
            this.items.push(item);
        },
        commit: function(options) {
            this.service.commitBatch(this, options);
        }
    });
})();