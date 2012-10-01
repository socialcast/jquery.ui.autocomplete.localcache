describe('jquery.ui.autocomplete.localcache', function() {

  describe('#amendResponse', function() {
    describe('when the autocomplete menu is visible', function() {
      it('adds new elements to the existing menu', function() {
        // expect(true).toEqual(true);
      });
      it('adds the new results to the local cache');
    });
    describe('when the autocomplete menu is not visible', function() {
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
  });

  describe('autocompletesearch event', function() {
    it('calls #abort');
  });
  describe('autocompleteclose event', function() {
    it('calls #abort');
  });

  describe('#abort', function() {
    describe('when currentXhr exists', function() {
      it('calls currentXhr.abort');
      it('sets currentXhr to null');
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
