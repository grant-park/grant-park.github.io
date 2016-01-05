# angular-tabletop
### An AngularJS provider allowing easy use of Tabletop.js via promises
### [Ændrew Rininsland (@aendrew)](http://www.twitter.com/aendrew), MIT licensed.

## Installation

1. `bower install angular-tabletop --save`
1. Add 'Tabletop' to your module dependencies:
  ```javascript
  angular
    .module('myApp', [
      'times.tabletop'
    ])
  ```
1. Configure at runtime:
  ```javascript
  ...
  .config(function(TabletopProvider) {
    TabletopProvider.setTabletopOptions({
        key: '', // Your key here.
        simpleSheet: true // Any Tabletop option except 'callback' works.
      });
  });
  ```
1. This will return a promise, which you can resolve at will in your controller.
1. Optionally, you can resolve Tabletop before the controller loads using `ui-router`:
  ```javascript
  angular
  .module('myApp', [
    'times.tabletop'
    'ui.router'
  ])
  .config(function($stateProvider, $urlRouterProvider, TabletopProvider) {
    // Tabletop setup...
    TabletopProvider.setTabletopOptions({
      key: 'https://docs.google.com/spreadsheets/d/1RVnUq3oMwt9aLROzgDJDbPlacjzWkOnx8pzzvX4Lcw4/pubhtml',
    });

    $urlRouterProvider.otherwise('/');

    // Now set up the states
    $stateProvider
      .state('map', {
        url: '/',
        templateUrl: 'partials/map.html',
        resolve: {
          tabletopData: 'Tabletop'
        },
        controller: function($scope, tabletopData) {
          $scope.data = tabletopData; // This will be a resolved promise!
        }
      });
  });

  ```

## Using Tabletop to provide i18n translation strings to angular-translate

If you use [angular-translate](https://github.com/angular-translate/angular-translate), you can use Tabletop to store all your app's translations. This can also be used to give non-developers the ability to easily change an AngularJS app's microcopy — no more doing new builds for simple text tweaks!

1. Create a new sheet in your spreadsheet and call it `i18n en_US`. This assumes American English; if, for instance, you wanted Canadian French, you would put the language identifier `fr_CA`. See [this helpful table](http://www.i18nguy.com/unicode/language-identifiers.html).
1. In the header row, put "key" in the first column and "value" in the second.
1. In each row, put the generic translation key in the "key" column, and its translation value in the "value".
  * That is to say, you'd put something like `SOME_STRING_HERE` in your code as the "key" and "This is some text" as the "value".
1. Include `Tabletop_i18nLoader.js` in your app.
1. When configuring your app, provide `angular-translate` with `tabletopi18nLoader` as the loader as such:
  ```javascript
  angular.module('yourApp', [
    'times.tabletop', 
    'pascalprecht.translate'
  ])
  .config(function(TabletopProvider, $translateProvider) {
    // Tabletop setup...
    TabletopProvider.setTabletopOptions({
      key: 'your-key-here',
      simpleSheet: false
    });
    
    // Translation setup (defaults used below)...
    $translateProvider.useLoader('tabletopi18nLoader', 
      {
        lang: 'en_US', // The language identifier used to name your sheet.
        prefix: 'i18n ', // This is the bit before the lang identifier. Note the space.
        keyKey: 'key', // This is the name of your "key" column.
        valueKey: 'value' // This is the name of your "value" column.
      }
    );
  });
  
  ```
1. That's it! See the [angular-translate](https://angular-translate.github.io/)
 docs for more info.

### Changelog

* 0.2.1 — Added `tabletopi18nLoader` for easy translations.
* 0.2.0 — Tightened up code, fixed bugs, added better namespacing.
* 0.1.0 — Initial release.
