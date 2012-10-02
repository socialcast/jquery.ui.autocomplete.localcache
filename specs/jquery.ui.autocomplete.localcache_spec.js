describe('jquery.ui.autocomplete.localcache', function() {
  var $input = null;
  var autocomplete = null;
  var newItem = {label: 'Javascript', value: 'javascript'};
  beforeEach(function() {
    var localCache = [
      {label: 'Ruby', value: 'ruby'},
      {label: 'Java', value: 'java'}
    ];
    var fixtures = $('#jasmine_fixtures').empty();
    $input = $('<input type="text" />').appendTo(fixtures).autocomplete({
      cache: localCache,
      remoteSource: function(request, response) {
        return $.getJSON('/foo', function(data) {
          response(data);
        });
      }
    });
    autocomplete = $input.data('autocomplete');
  });

  describe('#amendResponse', function() {
    describe('when the autocomplete menu is active', function() {
      beforeEach(function() {
        $.mockjax({
          url: '/foo',
          responseText: [newItem]
        });
        $input.val('java').autocomplete('search');
        tick(autocomplete.options.remoteDelay);
        mockjaxTick();
      });
      it('adds new elements to the existing menu', function() {
        expect(autocomplete.menu.element.find('li').length).toEqual(2);
      });
      it('adds the new results to the local cache', function() {
        expect(newItem).toBeCachedIn(autocomplete);
      });
    });
    describe('when the autocomplete menu is not active', function() {
      beforeEach(function() {
        $.mockjax({
          url: '/foo',
          responseText: [newItem]
        });
        $input.val('script').autocomplete('search');
        tick(autocomplete.options.remoteDelay);
        mockjaxTick();
      });
      it('adds creates and shows the menu', function() {
        expect(autocomplete.menu.element.find('li').length).toEqual(1);
      });
      it('adds the new results to the local cache', function() {
        expect(newItem).toBeCachedIn(autocomplete);
      });
    });
    describe('when results already exist in cache', function() {
      var originalCacheSize;
      beforeEach(function() {
        originalCacheSize = autocomplete.cache.length;
        var existingItem = autocomplete.cache[0];
        $.mockjax({
          url: '/foo',
          responseText: [existingItem]
        });
        $input.val('java').autocomplete('search');
        tick(autocomplete.options.remoteDelay);
        mockjaxTick();
      });
      it('does not add new entries to the cache', function() {
        expect(autocomplete.cache.length).toEqual(originalCacheSize);
      });
    });
    describe('when element.val() has changed since search was requested', function() {
      beforeEach(function() {
        $.mockjax({
          url: '/foo',
          responseText: [newItem]
        });
        $input.val('script').autocomplete('search');
        tick(autocomplete.options.remoteDelay);
        $input.val('foo');
        mockjaxTick();
      });
      it('does not add new results to the autocomplete', function() {
        expect(autocomplete.menu.element.is(':visible')).toBe(false);
      });
      it('adds the new results to the local cache', function() {
        expect(newItem).toBeCachedIn(autocomplete);
      });
    });
    describe('when response is an array of strings', function() {
      beforeEach(function() {
        $.mockjax({
          url: '/foo',
          responseText: ['javascript']
        });
        $input.val('script').autocomplete('search');
        tick(autocomplete.options.remoteDelay);
        mockjaxTick();
      });
      it('normalizes array to expected hash (label, value) structure', function() {
        var expectedCacheEntry = {label: 'javascript', value: 'javascript'};
        expect(expectedCacheEntry).toBeCachedIn(autocomplete);
      });
    });
  });

  describe('autocompletesearch event', function() {
    beforeEach(function() {
      stub(autocomplete, 'abort');
      autocomplete._trigger('search');
    });
    afterEach(function() {
      autocomplete.abort.restore();
    });
    it('calls #abort', function() {
      expect(autocomplete.abort.called).toBe(true);
    });
  });
  describe('autocompleteclose event', function() {
    beforeEach(function() {
      stub(autocomplete, 'abort');
      autocomplete._trigger('close');
    });
    afterEach(function() {
      autocomplete.abort.restore();
    });
    it('calls #abort', function() {
      expect(autocomplete.abort.called).toBe(true);
    });
  });

  describe('#abort', function() {
    describe('when currentXhr exists', function() {
      var xhrStub;
      beforeEach(function() {
        xhrStub = stub({abort: function() {}});
        autocomplete.currentXhr = xhrStub;
        autocomplete.abort();
      });
      it('calls currentXhr.abort', function() {
        expect(xhrStub.abort.called).toBe(true);
      });
      it('sets currentXhr to null', function() {
        expect(autocomplete.currentXhr).toBe(null)
      });
    });
    describe('when remoteSourceDelay exists', function() {
      beforeEach(function() {
        autocomplete.remoteSourceDelay = true;
        autocomplete.abort();
      });
      it('clears the remoteSourceDelay timeout', function() {
        //TODO: how to test this?
      });
      it('sets remoteSourceDelay to null', function() {
        expect(autocomplete.remoteSourceDelay).toBe(null);
      });
    });
  });

  describe('#localAndRemoteSource', function() {
    describe('when options.remoteDelay has passed', function() {
      var mockLookup;
      beforeEach(function() {
        mockLookup = $.mockjax({
          url: '/foo',
          responseText: []
        });
        $input.val('script').autocomplete('search');
        tick(autocomplete.options.remoteDelay);
      });
      it('adds ui-autocomplete-loading class', function() {
        expect($input.hasClass('ui-autocomplete-loading')).toBe(true);
      });
      it('fires xhr request', function() {
        // FIXME: mockjax issue
        // expect(mockLookup.fired).toBe(true);
      });
      it('sets pending == 1', function() {
        expect(autocomplete.pending).toEqual(1);
      });
    });
    describe('when search event is prevented by listener', function() {
      beforeEach(function() {
        $input.bind('autocompletesearch', false);
      });
      it('does not fire xhr request', function() {
        //TODO: how to test this?
      });
    });
    describe('when xhr completes', function() {
      beforeEach(function() {
        $.mockjax({
          url: '/foo',
          responseText: []
        });
        $input.val('script').autocomplete('search');
        tick(autocomplete.options.remoteDelay);
        mockjaxTick();
      });
      it('sets pending = 0', function() {
        expect(autocomplete.pending).toEqual(0)
      });
      it('removes ui-autocomplete-loading class', function() {
        expect(autocomplete.element.hasClass('ui-autocomplete-loading')).toBe(false)
      });
    });
  });
});
