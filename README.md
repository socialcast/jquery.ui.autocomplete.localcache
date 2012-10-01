# jquery.ui.autocomplete.localcache

jQuery UI Autocomplete Extension to support local + remote results via
AJAX

Why choose between a static list of local results for autocomplete and
waiting for AJAX responses to load information?  This extension provides
the best of both worlds by searching a local cache of results
immediately while additional results are loaded from the server in the
background.

[Demo](http://todo)

[Core jQuery UI Autocomplete Documentation](http://jqueryui.com/demos/autocomplete/)

## Usage

```javascript
// initial local cache of results
var cache = [
  {label: "Java", value: 'java'},
  {label: "Ruby", value: 'ruby'}
];
$('input').autocomplete({
  cache: cache,
  remoteSource: function(request, response) {
    return $.getJSON('/some/search/endpoint', function(data) {
      response(data);
    });
  }
});
```

## Features

* Local cache of results is updated after each AJAX response to increase
  speed of future searches.

## Installation

* Ensure all JS dependencies are included in your page
* Include [jquery.ui.autocomplete.localcache.js](https://github.com/socialcast/jquery.ui.autocomplete.localcache/raw/master/jquery.ui.autocomplete.localcache.js) script
* Initialize the jQuery UI autocomplete component with localcache
  configuration.

## Configuration

* `remoteDelay` - number of milliseconds to wait between local search and
  firing remote ajax call (default = 200)

## Contributing

* [Contribution guidelines](https://github.com/socialcast/jquery.ui.autocomplete.localcache/blob/master/CONTRIBUTING.md)
* [List of project contributors](https://github.com/socialcast/jquery.ui.autocomplete.localcache/blob/master/CONTRIBUTORS.txt)

## Copyright

Copyright (c) 2012 VMware, Inc. All Rights Reserved.
See [Project license](https://github.com/socialcast/jquery.ui.autocomplete.localcache/blob/master/LICENSE.txt) for additional details.
