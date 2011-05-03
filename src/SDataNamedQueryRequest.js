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

    Sage.SData.Client.SDataNamedQueryRequest = Sage.SData.Client.SDataResourceCollectionRequest.extend({
        constructor: function() {
            this.base.apply(this, arguments);

            this.uri.setPathSegment(
                C.SDataUri.ResourcePropertyIndex,
                C.SDataUri.NamedQuerySegment
            );
        },
        getQueryName: function() {
            return this.uri.getPathSegment(C.SDataUri.ResourcePropertyIndex + 1);
        },
        setQueryName: function(value) {
            this.uri.setPathSegment(
                C.SDataUri.ResourcePropertyIndex + 1,
                value
            );
            return this;
        }
    });
})();
