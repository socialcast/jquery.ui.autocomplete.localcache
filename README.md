# jquery.ui.autocomplete.localcache

Extend the jQuery UI Autocomplete plugin to support Local + Remote AJAX
searches.

## Usage

```javascript
$('input').autocomplete({
  cache: [],
  remoteSource: function(request, response) {
    return $.getJSON('/some/search/endpoint', function(data) {
      response(data);
    });
  }
});
```

## Features

* Search local cache immediately while additional results are loaded
  from the server

## Installation

* Include JS Dependencies and Project Script in your page
* Initialize Component

## Options

* remoteDelay - number of milliseconds to wait between local search and
  firing remote ajax call (default = 200)

## Contributing

* [Contribution guidelines](CONTRIBUTING.md)
* [List of project contributors](CONTRIBUTORS.txt)

## Copyright

Copyright (c) 2012 VMware, Inc. All Rights Reserved.
See [Project license](LICENSE.txt) for additional details.
