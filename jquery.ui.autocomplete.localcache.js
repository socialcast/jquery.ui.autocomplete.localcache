// Copyright (c) 2012 VMware, Inc. All Rights Reserved.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to
// deal in the Software without restriction, including without limitation the
// rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
// sell copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
// FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
// IN THE SOFTWARE.

/**
 * serve autocomplete results from local + remote cache.
 *
 * options:
 *  remoteDelay - number of milliseconds delay before firing remote request (default=200)
 *  remoteSource - function responsible for creating xhr to perform ajax request
 *
 * example usage:
 *  var cache = [];
 *  $('input').autocomplete({
 *    cache: cache,
 *    remoteSource: function(request, response) {
 *      return $.getJSON('/path/to/search', function(data) {
 *        response(data.entries);
 *      });
 *    }
 *  });
 */
(function($) {
  'use strict';
  var proto = $.ui.autocomplete.prototype;
  var origInitSource = proto._initSource;

  proto.options.cache = null;
  proto.options.remoteDelay = 200;
  proto.options.filter = $.ui.autocomplete.filter;

  $.extend(proto, {
    requestedTerm: null,
    currentXhr: null,
    remoteSourceDelay: null,
    _initSource: function() {
      if (this.options.cache) {
        //move options to top level object to fix scoping
        this.remoteSource = this.options.remoteSource;
        this.cache = this.options.cache;

        var self = this;
        this.element.on('autocompletesearch autocompleteclose', function() {
          self.abort();
        });

        this.source = this.localAndRemoteSource;
      } else {
        origInitSource.call(this);
      }
    },
    // abort current xhr and cancel pending remoteSource call
    abort: function() {
      if (this.remoteSourceDelay) {
        clearTimeout(this.remoteSourceDelay);
        this.remoteSourceDelay = null;
      }

      if (this.currentXhr) {
        this.currentXhr.abort();
        this.currentXhr = null;
      }
    },
    /**
     * append new results to existing autocomplete or show the autocomplete for the first time
     * adds new results to the cache
     * prevents display of results if input value has changed since the search was performed
     * @param results [Array] list of results for the requested term.  new entries will automatically be added to the cache
     */
    amendResponse: function(results) {
      var self = this;
      var newEntries = _.reject(this._normalize(results), function(entry) {
        return _.detect(self.cache, function(e) { return e.value === entry.value; });
      });
      this.cache = this.cache.concat(newEntries);
      if ((this.requestedTerm && this.requestedTerm !== this.element.val()) || !newEntries.length) {
        // input value has changed since the search was performed or there are
        // no new results to add
        return;
      }
      
      if (this.menu.element.is(':visible') && this.menu.element.children('.ui-menu-item').length) {
        // amend new entries to existing menu
        this._renderMenu(this.menu.element, newEntries);
        this.menu.refresh();
        this._resizeMenu();
      } else {
        // show menu for the first time
        this.__response.apply(this, [newEntries]);
      }
    },
    /**
     * remove an element from the cache
     */
    removeFromCache: function(element) {
      this.cache.remove(element);
    },
    /**
     * show results from local cache immediately and prepare to fire off ajax request to load more results
     */
    localAndRemoteSource: function(request, response) {
      var localResults = this.options.filter.call(this, this.cache, request.term);
      response(localResults);

      var self = this;
      this.remoteSourceDelay = setTimeout(function() {
        var event = null;
        if (self._trigger("search", event) === false) {
          return;
        }

        self.requestedTerm = self.element.val();
        self.pending++;
        self.element.addClass('ui-autocomplete-loading');
        self.currentXhr = self.remoteSource(request, function() { self.amendResponse.apply(self, arguments); });
        self.currentXhr.always(function() {
          self.pending--;
          if (!self.pending) {
            self.element.removeClass('ui-autocomplete-loading');
          }
        });
      }, this.options.remoteDelay);
    }
  });
})(jQuery);
