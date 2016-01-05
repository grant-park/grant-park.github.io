/**
 * @ngdoc service
 * @name times.tabletop.tabletopi18nLoader
 * @description Factory allowing easy configuration of angular-translate using Tabletop.
 */
'use strict';
 
angular.module('times.tabletop')
.factory('tabletopi18nLoader', function (Tabletop, $q) {
    // return loaderFn
    return function (options) {
      var deferred = $q.defer();
      var lang = typeof options.lang !== 'undefined' ? options.lang : 'en_US';
      var tablePrefix = typeof options.prefix !== 'undefined' ? options.prefix : 'i18n ';
      var table = tablePrefix + lang;
      var tableKey = typeof options.keyKey !== 'undefined' ? options.keyKey : 'key';
      var tableVal = typeof options.valueKey !== 'undefined' ? options.valueKey : 'value';
      
      Tabletop.then(function(data){
        var strings = {};
        if (typeof data[0] !== 'undefined' && data[0][table] !== 'undefined') {
          angular.forEach(data[0][table].elements, function(v) {
            strings[tableKey] = v[tableVal];
          });
          // resolve with translation data
          deferred.resolve(strings);
        } else {
          // or reject with language key
          deferred.reject(options.key);
        }
      });
      
      return deferred.promise;
    };
});
