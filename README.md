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

## Contributing

See CONTRIBUTING.md for instructions
See CONTRIBUTORS.txt for list of project contributors

## Copyright

Copyright (c) 2012 VMware, Inc. All Rights Reserved.
See LICENSE.txt for further details.
