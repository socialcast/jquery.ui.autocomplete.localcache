describe('jquery.ui.autocomplete.localcache', function() {
  var $input = null;
  var autocomplete = null;
  beforeEach(function() {
    var localCache = [
      {label: 'Ruby', value: 'ruby'},
      {label: 'Java', value: 'java'}
    ];
    $input = $('#autocomplete_input').autocomplete({
      cache: localCache,
      remoteSource: function(request, response) {
        return $.getJSON('/foo', function() {
          response([
            {label: 'Javascript', value: 'javascript'}
          ]);
        });
      }
    });
    autocomplete = $input.data('autocomplete');
  });
  describe('#amendResponse', function() {
    describe('when the autocomplete menu is active', function() {
      beforeEach(function() {
        $input.autocomplete('search', 'java');
      });
      it('adds new elements to the existing menu', function() {
        expect(autocomplete.menu.element.find('li').length).toEqual(2);
      });
      it('adds the new results to the local cache', function() {
        expect(autocomplete.cache.length).toEqual(2)
      });
    });
    describe('when the autocomplete menu is not active', function() {
      it('adds creates and shows the menu');
      it('adds the new results to the local cache');
    });
    describe('when results already exist in cache', function() {
      it('does not add new entries to the cache');
    });
    describe('when element.val() has changed since search was requested', function() {
      it('does not show the autocomplete results');
      it('adds the new results to the local cache');
    });
    describe('when response is an array of strings', function() {
      it('normalizes array to expected hash (label, value) structure');
    });
  });

  describe('autocompletesearch event', function() {
    beforeEach(function() {
      autocomplete._trigger('search');
    });
    it('calls #abort');
  });
  describe('autocompleteclose event', function() {
    beforeEach(function() {
      autocomplete._trigger('close');
    });
    it('calls #abort');
  });

  describe('#abort', function() {
    describe('when currentXhr exists', function() {
      it('calls currentXhr.abort');
      it('sets currentXhr to null');
    });
    describe('when remoteSourceDelay exists', function() {
      it('clears the remoteSourceDelay timeout');
    });
  });

  describe('#localAndRemoteSource', function() {
    describe('when options.remoteDelay has passed', function() {
      it('adds ui-autocomplete-loading class');
      it('fires xhr request');
    });
    describe('when search event is cancelled', function() {
      it('does not fire xhr request');
    });
    describe('when xhr completes', function() {
      it('sets pending = 0');
      it('removes ui-autocomplete-loading class');
    });
  });
});
