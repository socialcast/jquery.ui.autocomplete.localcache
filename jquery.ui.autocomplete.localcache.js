// Copyright (c) 2012 VMware, Inc. All Rights Reserved.
//= require underscore
//= require jquery-ui
//= require array.remove

/**
 * serve autocomplete results from local + remote cache.
 *
 * options:
 *  remoteDelay - delay in millis before firing remote request (default=200)
 *  remoteSource - function to create xhr to perform ajax request
 *
 * usage:
 *  var cache = [];
 *  $('input').autocomplete({
 *    cache: cache,
 *    remoteDelay: 200,
 *    remoteSource: function(request, response) {
 *      return $.ajax({
 *        url: '/path/to/search',
 *        data: {q: request.term},
 *        success: function(data) {
 *          response(data.entries);
 *        }
 *      });
 *    }
 *   },
 *  });
 */
(function($) {
  var proto = $.ui.autocomplete.prototype;
  var origInitSource = proto._initSource;

  proto.options.cache = null;
  proto.options.remoteDelay = 200;
  proto.options.filter = $.ui.autocomplete.filter;

  $.extend(proto, {
    _initSource: function() {
      if (this.options.cache) {
        //move options to top level object to fix scoping
        this.remoteSource = this.options.remoteSource;
        this.cache = this.options.cache;
        this.requestIndex = 0;

        var self = this;
        this.element.on('autocompletesearch', function() {
          self.abort();
        });
        this.element.on('autocompleteclose', function() {
          self.abort();
        });

        this.source = this.localAndRemoteResponse;
      } else {
        origInitSource.call(this);
      }
    },
    currentXhr: null,
    // abort current xhr
    abort: function() {
      if (this.currentXhr) {
        this.currentXhr.abort();
        this.currentXhr = null;
      }
    },
    /**
     * allow for appending new results to existing autocomplete results
     */
    amendResponse: function(results, requestIndex) {
      var self = this;
      var newEntries = _.reject(results, function(entry) {
        return _.detect(self.cache, function(e) { return e.value === entry.value; });
      });
      this.cache = this.cache.concat(newEntries);
      if (requestIndex && requestIndex !== this.requestIndex) {
        return;
      }

      this.element.removeClass('ui-autocomplete-loading');
      if (this.menu.element.is(':visible')) {
        _.each(newEntries, function(item) {
          self._renderItem(self.menu.element, item);
        });
        this.menu.refresh();
        this._resizeMenu();
      } else {
        this.__response.apply( this, [newEntries] );
      }
    },
    /**
     * remove an element from the cache
     */
    removeFromCache: function(element) {
      this.cache.remove(element);
    },
    /**
     * show results from local cache immediately and fire off ajax request to load more results
     */
    localAndRemoteResponse: function(request, response) {
      if (this.remoteSourceDelay) {
        clearTimeout(this.remoteSourceDelay);
      }

      this.pending = 1;

      var localResults = this.options.filter.call(this, this.cache, request.term);
      response(localResults);

      var self = this;
      this.remoteSourceDelay = setTimeout(function() {
        var event = null;
        if (self._trigger("search", event) === false) {
          return;
        }

        var uniqueRequestId = ++self.requestIndex;
        self.element.addClass('ui-autocomplete-loading');
        self.currentXhr = self.remoteSource(request, function() { self.amendResponse.apply(self, arguments); });
        self.currentXhr.fail(function() {
          self.amendResponse([], uniqueRequestId);
        });
        self.currentXhr.complete(function() {
          self.pending = 0;
          self.element.removeClass('ui-autocomplete-loading');
        });
      }, this.options.remoteDelay);
    }
  });
})(jQuery);
