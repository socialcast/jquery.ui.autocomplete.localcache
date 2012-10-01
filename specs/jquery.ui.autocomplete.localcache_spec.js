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
});
