(function() {
  "use strict";

  var inNodeJS = false;
  if (typeof process !== 'undefined' && !process.browser) {
    inNodeJS = true;
    var request = require('request'.trim()); //prevents browserify from bundling the module
  }

  var supportsCORS = false;
  var inLegacyIE = false;
  try {
    var testXHR = new XMLHttpRequest();
    if (typeof testXHR.withCredentials !== 'undefined') {
      supportsCORS = true;
    } else {
      if ("XDomainRequest" in window) {
        supportsCORS = true;
        inLegacyIE = true;
      }
    }
  } catch (e) { }

  // Create a simple indexOf function for support
  // of older browsers.  Uses native indexOf if 
  // available.  Code similar to underscores.
  // By making a separate function, instead of adding
  // to the prototype, we will not break bad for loops
  // in older browsers
  var indexOfProto = Array.prototype.indexOf;
  var ttIndexOf = function(array, item) {
    var i = 0, l = array.length;
    
    if (indexOfProto && array.indexOf === indexOfProto) return array.indexOf(item);
    for (; i < l; i++) if (array[i] === item) return i;
    return -1;
  };
  
  /*
    Initialize with Tabletop.init( { key: '0AjAPaAU9MeLFdHUxTlJiVVRYNGRJQnRmSnQwTlpoUXc' } )
      OR!
    Initialize with Tabletop.init( { key: 'https://docs.google.com/spreadsheet/pub?hl=en_US&hl=en_US&key=0AjAPaAU9MeLFdHUxTlJiVVRYNGRJQnRmSnQwTlpoUXc&output=html&widget=true' } )
      OR!
    Initialize with Tabletop.init('0AjAPaAU9MeLFdHUxTlJiVVRYNGRJQnRmSnQwTlpoUXc')
  */

  var Tabletop = function(options) {
    // Make sure Tabletop is being used as a constructor no matter what.
    if(!this || !(this instanceof Tabletop)) {
      return new Tabletop(options);
    }
    
    if(typeof(options) === 'string') {
      options = { key : options };
    }

    this.callback = options.callback;
    this.wanted = options.wanted || [];
    this.key = options.key;
    this.simpleSheet = !!options.simpleSheet;
    this.parseNumbers = !!options.parseNumbers;
    this.wait = !!options.wait;
    this.reverse = !!options.reverse;
    this.postProcess = options.postProcess;
    this.debug = !!options.debug;
    this.query = options.query || '';
    this.orderby = options.orderby;
    this.endpoint = options.endpoint || "https://spreadsheets.google.com";
    this.singleton = !!options.singleton;
    this.simple_url = !!options.simple_url;
    this.callbackContext = options.callbackContext;
    // Default to on, unless there's a proxy, in which case it's default off
    this.prettyColumnNames = typeof(options.prettyColumnNames) == 'undefined' ? !options.proxy : options.prettyColumnNames;
    
    if(typeof(options.proxy) !== 'undefined') {
      // Remove trailing slash, it will break the app
      this.endpoint = options.proxy.replace(/\/$/,'');
      this.simple_url = true;
      this.singleton = true;
      // Let's only use CORS (straight JSON request) when
      // fetching straight from Google
      supportsCORS = false;
    }
    
    this.parameterize = options.parameterize || false;
    
    if(this.singleton) {
      if(typeof(Tabletop.singleton) !== 'undefined') {
        this.log("WARNING! Tabletop singleton already defined");
      }
      Tabletop.singleton = this;
    }
    
    /* Be friendly about what you accept */
    if(/key=/.test(this.key)) {
      this.log("You passed an old Google Docs url as the key! Attempting to parse.");
      this.key = this.key.match("key=(.*?)(&|#|$)")[1];
    }

    if(/pubhtml/.test(this.key)) {
      this.log("You passed a new Google Spreadsheets url as the key! Attempting to parse.");
      this.key = this.key.match("d\\/(.*?)\\/pubhtml")[1];
    }

    if(!this.key) {
      this.log("You need to pass Tabletop a key!");
      return;
    }

    this.log("Initializing with key " + this.key);

    this.models = {};
    this.model_names = [];

    this.base_json_path = "/feeds/worksheets/" + this.key + "/public/basic?alt=";

    if (inNodeJS || supportsCORS) {
      this.base_json_path += 'json';
    } else {
      this.base_json_path += 'json-in-script';
    }
    
    if(!this.wait) {
      this.fetch();
    }
  };

  // A global storage for callbacks.
  Tabletop.callbacks = {};

  // Backwards compatibility.
  Tabletop.init = function(options) {
    return new Tabletop(options);
  };

  Tabletop.sheets = function() {
    this.log("Times have changed! You'll want to use var tabletop = Tabletop.init(...); tabletop.sheets(...); instead of Tabletop.sheets(...)");
  };

  Tabletop.prototype = {

    fetch: function(callback) {
      if(typeof(callback) !== "undefined") {
        this.callback = callback;
      }
      this.requestData(this.base_json_path, this.loadSheets);
    },
    
    /*
      This will call the environment appropriate request method.
      
      In browser it will use JSON-P, in node it will use request()
    */
    requestData: function(path, callback) {
      if (inNodeJS) {
        this.serverSideFetch(path, callback);
      } else {
        //CORS only works in IE8/9 across the same protocol
        //You must have your server on HTTPS to talk to Google, or it'll fall back on injection
        var protocol = this.endpoint.split("//").shift() || "http";
        if (supportsCORS && (!inLegacyIE || protocol === location.protocol)) {
          this.xhrFetch(path, callback);
        } else {
          this.injectScript(path, callback);
        }
      }
    },

    /*
      Use Cross-Origin XMLHttpRequest to get the data in browsers that support it.
    */
    xhrFetch: function(path, callback) {
      //support IE8's separate cross-domain object
      var xhr = inLegacyIE ? new XDomainRequest() : new XMLHttpRequest();
      xhr.open("GET", this.endpoint + path);
      var self = this;
      xhr.onload = function() {
        var json;
        try {
          json = JSON.parse(xhr.responseText);
        } catch (e) {
          console.error(e);
        }
        callback.call(self, json);
      };
      xhr.send();
    },
    
    /*
      Insert the URL into the page as a script tag. Once it's loaded the spreadsheet data
      it triggers the callback. This helps you avoid cross-domain errors
      http://code.google.com/apis/gdata/samples/spreadsheet_sample.html

      Let's be plain-Jane and not use jQuery or anything.
    */
    injectScript: function(path, callback) {
      var script = document.createElement('script');
      var callbackName;
      
      if(this.singleton) {
        if(callback === this.loadSheets) {
          callbackName = 'Tabletop.singleton.loadSheets';
        } else if (callback === this.loadSheet) {
          callbackName = 'Tabletop.singleton.loadSheet';
        }
      } else {
        var self = this;
        callbackName = 'tt' + (+new Date()) + (Math.floor(Math.random()*100000));
        // Create a temp callback which will get removed once it has executed,
        // this allows multiple instances of Tabletop to coexist.
        Tabletop.callbacks[ callbackName ] = function () {
          var args = Array.prototype.slice.call( arguments, 0 );
          callback.apply(self, args);
          script.parentNode.removeChild(script);
          delete Tabletop.callbacks[callbackName];
        };
        callbackName = 'Tabletop.callbacks.' + callbackName;
      }
      
      var url = path + "&callback=" + callbackName;
      
      if(this.simple_url) {
        // We've gone down a rabbit hole of passing injectScript the path, so let's
        // just pull the sheet_id out of the path like the least efficient worker bees
        if(path.indexOf("/list/") !== -1) {
          script.src = this.endpoint + "/" + this.key + "-" + path.split("/")[4];
        } else {
          script.src = this.endpoint + "/" + this.key;
        }
      } else {
        script.src = this.endpoint + url;
      }
      
      if (this.parameterize) {
        script.src = this.parameterize + encodeURIComponent(script.src);
      }
      
      document.getElementsByTagName('script')[0].parentNode.appendChild(script);
    },
    
    /* 
      This will only run if tabletop is being run in node.js
    */
    serverSideFetch: function(path, callback) {
      var self = this;
      request({url: this.endpoint + path, json: true}, function(err, resp, body) {
        if (err) {
          return console.error(err);
        }
        callback.call(self, body);
      });
    },

    /* 
      Is this a sheet you want to pull?
      If { wanted: ["Sheet1"] } has been specified, only Sheet1 is imported
      Pulls all sheets if none are specified
    */
    isWanted: function(sheetName) {
      if(this.wanted.length === 0) {
        return true;
      } else {
        return (ttIndexOf(this.wanted, sheetName) !== -1);
      }
    },
    
    /*
      What gets send to the callback
      if simpleSheet === true, then don't return an array of Tabletop.this.models,
      only return the first one's elements
    */
    data: function() {
      // If the instance is being queried before the data's been fetched
      // then return undefined.
      if(this.model_names.length === 0) {
        return undefined;
      }
      if(this.simpleSheet) {
        if(this.model_names.length > 1 && this.debug) {
          this.log("WARNING You have more than one sheet but are using simple sheet mode! Don't blame me when something goes wrong.");
        }
        return this.models[ this.model_names[0] ].all();
      } else {
        return this.models;
      }
    },

    /*
      Add another sheet to the wanted list
    */
    addWanted: function(sheet) {
      if(ttIndexOf(this.wanted, sheet) === -1) {
        this.wanted.push(sheet);
      }
    },
    
    /*
      Load all worksheets of the spreadsheet, turning each into a Tabletop Model.
      Need to use injectScript because the worksheet view that you're working from
      doesn't actually include the data. The list-based feed (/feeds/list/key..) does, though.
      Calls back to loadSheet in order to get the real work done.

      Used as a callback for the worksheet-based JSON
    */
    loadSheets: function(data) {
      var i, ilen;
      var toLoad = [];
      this.googleSheetName = data.feed.title.$t;
      this.foundSheetNames = [];

      for(i = 0, ilen = data.feed.entry.length; i < ilen ; i++) {
        this.foundSheetNames.push(data.feed.entry[i].title.$t);
        // Only pull in desired sheets to reduce loading
        if( this.isWanted(data.feed.entry[i].content.$t) ) {
          var linkIdx = data.feed.entry[i].link.length-1;
          var sheet_id = data.feed.entry[i].link[linkIdx].href.split('/').pop();
          var json_path = "/feeds/list/" + this.key + "/" + sheet_id + "/public/values?alt=";
          if (inNodeJS || supportsCORS) {
            json_path += 'json';
          } else {
            json_path += 'json-in-script';
          }
          if(this.query) {
            json_path += "&sq=" + this.query;
          }
          if(this.orderby) {
            json_path += "&orderby=column:" + this.orderby.toLowerCase();
          }
          if(this.reverse) {
            json_path += "&reverse=true";
          }
          toLoad.push(json_path);
        }
      }

      this.sheetsToLoad = toLoad.length;
      for(i = 0, ilen = toLoad.length; i < ilen; i++) {
        this.requestData(toLoad[i], this.loadSheet);
      }
    },

    /*
      Access layer for the this.models
      .sheets() gets you all of the sheets
      .sheets('Sheet1') gets you the sheet named Sheet1
    */
    sheets: function(sheetName) {
      if(typeof sheetName === "undefined") {
        return this.models;
      } else {
        if(typeof(this.models[ sheetName ]) === "undefined") {
          // alert( "Can't find " + sheetName );
          return;
        } else {
          return this.models[ sheetName ];
        }
      }
    },

    sheetReady: function(model) {
      this.models[ model.name ] = model;
      if(ttIndexOf(this.model_names, model.name) === -1) {
        this.model_names.push(model.name);
      }

      this.sheetsToLoad--;
      if(this.sheetsToLoad === 0)
        this.doCallback();
    },
    
    /*
      Parse a single list-based worksheet, turning it into a Tabletop Model

      Used as a callback for the list-based JSON
    */
    loadSheet: function(data) {
      var that = this;
      var model = new Tabletop.Model( { data: data, 
                                        parseNumbers: this.parseNumbers,
                                        postProcess: this.postProcess,
                                        tabletop: this,
                                        prettyColumnNames: this.prettyColumnNames,
                                        onReady: function() {
                                          that.sheetReady(this);
                                        } } );
    },

    /*
      Execute the callback upon loading! Rely on this.data() because you might
        only request certain pieces of data (i.e. simpleSheet mode)
      Tests this.sheetsToLoad just in case a race condition happens to show up
    */
    doCallback: function() {
      if(this.sheetsToLoad === 0) {
        this.callback.apply(this.callbackContext || this, [this.data(), this]);
      }
    },

    log: function(msg) {
      if(this.debug) {
        if(typeof console !== "undefined" && typeof console.log !== "undefined") {
          Function.prototype.apply.apply(console.log, [console, arguments]);
        }
      }
    }

  };

  /*
    Tabletop.Model stores the attribute names and parses the worksheet data
      to turn it into something worthwhile

    Options should be in the format { data: XXX }, with XXX being the list-based worksheet
  */
  Tabletop.Model = function(options) {
    var i, j, ilen, jlen;
    this.column_names = [];
    this.name = options.data.feed.title.$t;
    this.tabletop = options.tabletop;
    this.elements = [];
    this.onReady = options.onReady;
    this.raw = options.data; // A copy of the sheet's raw data, for accessing minutiae

    if(typeof(options.data.feed.entry) === 'undefined') {
      options.tabletop.log("Missing data for " + this.name + ", make sure you didn't forget column headers");
      this.original_columns = [];
      this.elements = [];
      this.onReady.call(this);
      return;
    }
    
    for(var key in options.data.feed.entry[0]){
      if(/^gsx/.test(key))
        this.column_names.push( key.replace("gsx$","") );
    }

    this.original_columns = this.column_names;
    
    for(i = 0, ilen =  options.data.feed.entry.length ; i < ilen; i++) {
      var source = options.data.feed.entry[i];
      var element = {};
      for(j = 0, jlen = this.column_names.length; j < jlen ; j++) {
        var cell = source[ "gsx$" + this.column_names[j] ];
        if (typeof(cell) !== 'undefined') {
          if(options.parseNumbers && cell.$t !== '' && !isNaN(cell.$t))
            element[ this.column_names[j] ] = +cell.$t;
          else
            element[ this.column_names[j] ] = cell.$t;
        } else {
            element[ this.column_names[j] ] = '';
        }
      }
      if(element.rowNumber === undefined)
        element.rowNumber = i + 1;
      if( options.postProcess )
        options.postProcess(element);
      this.elements.push(element);
    }
    
    if(options.prettyColumnNames)
      this.fetchPrettyColumns();
    else
      this.onReady.call(this);
  };

  Tabletop.Model.prototype = {
    /*
      Returns all of the elements (rows) of the worksheet as objects
    */
    all: function() {
      return this.elements;
    },
    
    fetchPrettyColumns: function() {
      if(!this.raw.feed.link[3])
        return this.ready();
      var cellurl = this.raw.feed.link[3].href.replace('/feeds/list/', '/feeds/cells/').replace('https://spreadsheets.google.com', '');
      var that = this;
      this.tabletop.requestData(cellurl, function(data) {
        that.loadPrettyColumns(data);
      });
    },
    
    ready: function() {
      this.onReady.call(this);
    },
    
    /*
     * Store column names as an object
     * with keys of Google-formatted "columnName"
     * and values of human-readable "Column name"
     */
    loadPrettyColumns: function(data) {
      var pretty_columns = {};

      var column_names = this.column_names;

      var i = 0;
      var l = column_names.length;

      for (; i < l; i++) {
        if (typeof data.feed.entry[i].content.$t !== 'undefined') {
          pretty_columns[column_names[i]] = data.feed.entry[i].content.$t;
        } else {
          pretty_columns[column_names[i]] = column_names[i];
        }
      }

      this.pretty_columns = pretty_columns;

      this.prettifyElements();
      this.ready();
    },
    
    /*
     * Go through each row, substitutiting
     * Google-formatted "columnName"
     * with human-readable "Column name"
     */
    prettifyElements: function() {
      var pretty_elements = [],
          ordered_pretty_names = [],
          i, j, ilen, jlen;

      for(j = 0, jlen = this.column_names.length; j < jlen ; j++) {
        ordered_pretty_names.push(this.pretty_columns[this.column_names[j]]);
      }

      for(i = 0, ilen = this.elements.length; i < ilen; i++) {
        var new_element = {};
        for(j = 0, jlen = this.column_names.length; j < jlen ; j++) {
          var new_column_name = this.pretty_columns[this.column_names[j]];
          new_element[new_column_name] = this.elements[i][this.column_names[j]];
        }
        pretty_elements.push(new_element);
      }
      this.elements = pretty_elements;
      this.column_names = ordered_pretty_names;
    },

    /*
      Return the elements as an array of arrays, instead of an array of objects
    */
    toArray: function() {
      var array = [],
          i, j, ilen, jlen;
      for(i = 0, ilen = this.elements.length; i < ilen; i++) {
        var row = [];
        for(j = 0, jlen = this.column_names.length; j < jlen ; j++) {
          row.push( this.elements[i][ this.column_names[j] ] );
        }
        array.push(row);
      }
      return array;
    }
  };

  if(typeof module !== "undefined" && module.exports) { //don't just use inNodeJS, we may be in Browserify
    module.exports = Tabletop;
  } else if (typeof define === 'function' && define.amd) {
    define(function () {
        return Tabletop;
    });
  } else {
    window.Tabletop = Tabletop;
  }

})();

/**
 * @ngdoc service
 * @name times.tabletop.Tabletop
 * @description Provider allowing easy config and return of Tabletop data in Angular.
 */
(function(){
'use strict';

angular.module('times.tabletop', [])
  .provider('Tabletop', function () {
    var tabletopResponse;

    var tabletopOptions = {
      callback: function(data, Tabletop) {
        tabletopResponse.resolve([data, Tabletop]);
      }
    };

    // Public API for configuration
    this.setTabletopOptions = function (opts) {
      tabletopOptions = angular.extend(tabletopOptions, opts);
    };

    // Method for instantiating
    this.$get = ['$q', '$window', function ($q, $window) {
      tabletopResponse = $q.defer();
      $window.Tabletop.init(tabletopOptions);

      return tabletopResponse.promise;
    }];
});
})();

(function(){
"use strict";

angular.module('Site', ['ngAnimate','times.tabletop','ngSanitize','luegg.directives'])

.config(['TabletopProvider', function(TabletopProvider){
    // Tabletop setup
    TabletopProvider.setTabletopOptions({
            key: '1uvHeB66RrTJ87hmna5SnSvBeiuCQ3PE84OLcTL6iwdI',
            simple_url: true
    });
}])        

.factory('RandomName',[function(){
        var adjectives = ["Black","White","Gray","Brown","Red","Pink","Crimson","Carnelian","Orange","Yellow","Ivory","Cream","Green","Viridian","Aquamarine","Cyan","Blue","Cerulean","Azure","Indigo","Navy","Violet","Purple","Lavender","Magenta","Rainbow","Iridescent","Spectrum","Prism","Bold","Vivid","Pale","Clear","Glass","Translucent","Misty","Dark","Light","Gold","Silver","Copper","Bronze","Steel","Iron","Brass","Mercury","Zinc","Chrome","Platinum","Titanium","Nickel","Lead","Pewter","Rust","Metal","Stone","Quartz","Granite","Marble","Alabaster","Agate","Jasper","Pebble","Pyrite","Crystal","Geode","Obsidian","Mica","Flint","Sand","Gravel","Boulder","Basalt","Ruby","Beryl","Scarlet","Citrine","Sulpher","Topaz","Amber","Emerald","Malachite","Jade","Abalone","Lapis","Sapphire","Diamond","Peridot","Gem","Jewel","Bevel","Coral","Jet","Ebony","Wood","Tree","Cherry","Maple","Cedar","Branch","Bramble","Rowan","Ash","Fir","Pine","Cactus","Alder","Grove","Forest","Jungle","Palm","Bush","Mulberry","Juniper","Vine","Ivy","Rose","Lily","Tulip","Daffodil","Honeysuckle","Fuschia","Hazel","Walnut","Almond","Lime","Lemon","Apple","Blossom","Bloom","Crocus","Rose","Buttercup","Dandelion","Iris","Carnation","Fern","Root","Branch","Leaf","Seed","Flower","Petal","Pollen","Orchid","Mangrove","Cypress","Sequoia","Sage","Heather","Snapdragon","Daisy","Mountain","Hill","Alpine","Chestnut","Valley","Glacier","Forest","Grove","Glen","Tree","Thorn","Stump","Desert","Canyon","Dune","Oasis","Mirage","Well","Spring","Meadow","Field","Prairie","Grass","Tundra","Island","Shore","Sand","Shell","Surf","Wave","Foam","Tide","Lake","River","Brook","Stream","Pool","Pond","Sun","Sprinkle","Shade","Shadow","Rain","Cloud","Storm","Hail","Snow","Sleet","Thunder","Lightning","Wind","Hurricane","Typhoon","Dawn","Sunrise","Morning","Noon","Twilight","Evening","Sunset","Midnight","Night","Sky","Star","Stellar","Comet","Nebula","Quasar","Solar","Lunar","Planet","Meteor","Sprout","Pear","Plum","Kiwi","Berry","Apricot","Peach","Mango","Pineapple","Coconut","Olive","Ginger","Root","Plain","Fancy","Stripe","Spot","Speckle","Spangle","Ring","Band","Blaze","Paint","Pinto","Shade","Tabby","Brindle","Patch","Calico","Checker","Dot","Pattern","Glitter","Glimmer","Shimmer","Dull","Dust","Dirt","Glaze","Scratch","Quick","Swift","Fast","Slow","Clever","Fire","Flicker","Flash","Spark","Ember","Coal","Flame","Chocolate","Vanilla","Sugar","Spice","Cake","Pie","Cookie","Candy","Caramel","Spiral","Round","Jelly","Square","Narrow","Long","Short","Small","Tiny","Big","Giant","Great","Atom","Peppermint","Mint","Butter","Fringe","Rag","Quilt","Truth","Lie","Holy","Curse","Noble","Sly","Brave","Shy","Lava","Foul","Leather","Fantasy","Keen","Luminous","Feather","Sticky","Gossamer","Cotton","Rattle","Silk","Satin","Cord","Denim","Flannel","Plaid","Wool","Linen","Silent","Flax","Weak","Valiant","Fierce","Gentle","Rhinestone","Splash","North","South","East","West","Summer","Winter","Autumn","Spring","Season","Equinox","Solstice","Paper","Motley","Torch","Ballistic","Rampant","Shag","Freckle","Wild","Free","Chain","Sheer","Crazy","Mad","Candle","Ribbon","Lace","Notch","Wax","Shine","Shallow","Deep","Bubble","Harvest","Fluff","Venom","Boom","Slash","Rune","Cold","Quill","Love","Hate","Garnet","Zircon","Power","Bone","Void","Horn","Glory","Cyber","Nova","Hot","Helix","Cosmic","Quark","Quiver","Holly","Clover","Polar","Regal","Ripple","Ebony","Wheat","Phantom","Dew","Chisel","Crack","Chatter","Laser","Foil","Tin","Clever","Treasure","Maze","Twisty","Curly","Fortune","Fate","Destiny","Cute","Slime","Ink","Disco","Plume","Time","Psychadelic","Relic","Fossil","Water","Savage","Ancient","Rapid","Road","Trail","Stitch","Button","Bow","Nimble","Zest","Sour","Bitter","Phase","Fan","Frill","Plump","Pickle","Mud","Puddle","Pond","River","Spring","Stream","Battle","Arrow","Plume","Roan","Pitch","Tar","Cat","Dog","Horse","Lizard","Bird","Fish","Saber","Scythe","Sharp","Soft","Razor","Neon","Dandy","Weed","Swamp","Marsh","Bog","Peat","Moor","Muck","Mire","Grave","Fair","Just","Brick","Puzzle","Skitter","Prong","Fork","Dent","Dour","Warp","Luck","Coffee","Split","Chip","Hollow","Heavy","Legend","Hickory","Mesquite","Nettle","Rogue","Charm","Prickle","Bead","Sponge","Whip","Bald","Frost","Fog","Oil","Veil","Cliff","Volcano","Rift","Maze","Proud","Dew","Mirror","Shard","Salt","Pepper","Honey","Thread","Bristle","Ripple","Glow","Zenith"];

        var nouns = ["head","crest","crown","tooth","fang","horn","frill","skull","bone","tongue","throat","voice","nose","snout","chin","eye","sight","seer","speaker","singer","song","chanter","howler","chatter","shrieker","shriek","jaw","bite","biter","neck","shoulder","fin","wing","arm","lifter","grasp","grabber","hand","paw","foot","finger","toe","thumb","talon","palm","touch","racer","runner","hoof","fly","flier","swoop","roar","hiss","hisser","snarl","dive","diver","rib","chest","back","ridge","leg","legs","tail","beak","walker","lasher","swisher","carver","kicker","roarer","crusher","spike","shaker","charger","hunter","weaver","crafter","binder","scribe","muse","snap","snapper","slayer","stalker","track","tracker","scar","scarer","fright","killer","death","doom","healer","saver","friend","foe","guardian","thunder","lightning","cloud","storm","forger","scale","hair","braid","nape","belly","thief","stealer","reaper","giver","taker","dancer","player","gambler","twister","turner","painter","dart","drifter","sting","stinger","venom","spur","ripper","swallow","devourer","knight","lady","lord","queen","king","master","mistress","prince","princess","duke","dutchess","samurai","ninja","knave","slave","servant","sage","wizard","witch","warlock","warrior","jester","paladin","bard","trader","sword","shield","knife","dagger","arrow","bow","fighter","bane","follower","leader","scourge","watcher","cat","panther","tiger","cougar","puma","jaguar","ocelot","lynx","lion","leopard","ferret","weasel","wolverine","bear","raccoon","dog","wolf","kitten","puppy","cub","fox","hound","terrier","coyote","hyena","jackal","pig","horse","donkey","stallion","mare","zebra","antelope","gazelle","deer","buffalo","bison","boar","elk","whale","dolphin","shark","fish","minnow","salmon","ray","fisher","otter","gull","duck","goose","crow","raven","bird","eagle","raptor","hawk","falcon","moose","heron","owl","stork","crane","sparrow","robin","parrot","cockatoo","carp","lizard","gecko","iguana","snake","python","viper","boa","condor","vulture","spider","fly","scorpion","heron","oriole","toucan","bee","wasp","hornet","rabbit","bunny","hare","brow","mustang","ox","piper","soarer","flasher","moth","mask","hide","hero","antler","chill","chiller","gem","ogre","myth","elf","fairy","pixie","dragon","griffin","unicorn","pegasus","sprite","fancier","chopper","slicer","skinner","butterfly","legend","wanderer","rover","raver","loon","lancer","glass","glazer","flame","crystal","lantern","lighter","cloak","bell","ringer","keeper","centaur","bolt","catcher","whimsey","quester","rat","mouse","serpent","wyrm","gargoyle","thorn","whip","rider","spirit","sentry","bat","beetle","burn","cowl","stone","gem","collar","mark","grin","scowl","spear","razor","edge","seeker","jay","ape","monkey","gorilla","koala","kangaroo","yak","sloth","ant","roach","weed","seed","eater","razor","shirt","face","goat","mind","shift","rider","face","mole","vole","pirate","llama","stag","bug","cap","boot","drop","hugger","sargent","snagglefoot","carpet","curtain"];

        function randomNoun(generator){
                    generator = generator || Math.random;
                    return nouns[Math.floor(generator()*nouns.length)];
        }

        function randomAdjective(generator){
                    generator = generator || Math.random;
                    return adjectives[Math.floor(generator()*adjectives.length)];
        }

        function generateStupidName(generator){
                    var noun1 = randomNoun(generator);
                    var noun2 = randomNoun(generator);
                    noun1 = noun1.substr(0, 1).toUpperCase() + noun1.substr(1);
                    noun2 = noun2.substr(0, 1).toUpperCase() + noun2.substr(1);
                    var adjective = randomAdjective(generator);
                    return adjective + noun1 + noun2;
        }

        return generateStupidName();
}])

.factory('DialoguePortfolioParser',[function(){
        var api = {
                parse: function(data){
                        var parsedObj = {};
                        parsedObj.dialogue = [];
                        _.each(data[0].Dialogue.elements,function(el) {
                                parsedObj.dialogue.push({
                                    possibleInputs: el.possibleInputs.split(','),
                                    response: el.response
                                });
                        });
                        parsedObj.portfolio = data[0].Portfolio.elements;
                        return parsedObj;
                }
        };
        return api;
}])

.factory('DialogueCache',[function(){
    return { dialogue: [{response:"Hello &#128522;",possibleInputs:["hello","greetings","hi","hey","wassup","whats up","ayy","hola","ni hao","hoy","eyy"]},{response:"I was born in Chattanooga, TN and raised in Huntsville, AL.",possibleInputs:["where are you from","you from","born"]},{response:"Yup",possibleInputs:["okay","oh"]},{response:"Why, thank-you &#128522;",possibleInputs:["you're","youre","you are"]},{response:"My favorite movie is <i>The Imitation Game</i>.",possibleInputs:["movie"]},{response:"My favorite novel is <i>The Brothers Karamazov</i> by Fyodor Dostoevsky.",possibleInputs:["book"]},{response:"Nikola Tesla",possibleInputs:["person in history","historical person","favorite person"]},{response:"Bay Area",possibleInputs:["place"]},{response:"Tonkatsu",possibleInputs:["food"]},{response:"Dog",possibleInputs:["animal"]},{response:"Teal",possibleInputs:["color","colour"]},{response:"I&#39;d like to someday work full-time at either a start-up or a large company as a software engineer.",possibleInputs:["want to do","plan","future","would you like to do","what do you want"]},{response:"I like jazz, hip-hop, and classical music.",possibleInputs:["music","listen","genre","what do you like","what kind of stuff do you like"]},{response:"I play the piano and violin.",possibleInputs:["instruments","play"]},{response:"I&#39;m currently majoring in computer science and music at Amherst College.",possibleInputs:["study","major","subject","degree","bachelor","college","school"]},{response:"20",possibleInputs:[" age","old"]},{response:"Grant Park",possibleInputs:["name"]},{response:"I currently live in Amherst, MA.",possibleInputs:["where","live"]},{response:"Sorry to hear that. &#128533;",possibleInputs:["not","bad","terrible"]},{response:"Sweet. &#128522;",possibleInputs:["good","fine","well","awesome","fantastic","amazing","same","me too","as well"]},{response:"I&#39;m doing pretty well, thanks! How about you?",possibleInputs:["how are you","how are you doing","how are you feeling"]},{response:"I think everyday is a nice day...",possibleInputs:["weather","cold","climate","temp","hot","warm","chill"]},{response:"&#128522;",possibleInputs:["lol","rofl","wow","woah","dang","huh","eh","hm","jeez","geez","cool"]},{response:'Tap this phone&#39;s home button or enter <span style="color:lemonchiffon">&#39;switch&#39;</span> to transition to my projects.',possibleInputs:["project","example","done"]},{response:'You can email me at <a href="mailto:gpark18@amherst.edu">gpark18@amherst.edu</a>. &#128522;',possibleInputs:["contact","email","reach"]},{response:"I&#39;m a sophomore at Amherst College and I freelance iOS. I&#39;m also a full-stack dev working with MEAN, Python, and Swift/Obj-C.",possibleInputs:["about","you do","job","occupation","now","language","work","who are you","who"]},{response:'I&#39;m an <a href="https://soundcloud.com/grant-park">indie artist</a>, rowing athlete, and <a href="https://www.behance.net/grantpark">designer</a>. Check out my <a href="https://medium.com/@grantxs">blog</a> &#128513;',possibleInputs:["do you like to do","hob","design","extracurricular","outside","fun"]},{response:'Here is my <a href="https://www.linkedin.com/in/granthpark">LinkedIn</a>.',possibleInputs:["linkedin"]},{response:'Here is my <a href="https://github.com/sungjp">Github</a>.',possibleInputs:["git"]},{response:'Here is my <a href="parkgrantresume.pdf" target="_blank">resume</a>.',possibleInputs:["resume"]},{response:'Here is my <a href="parkgrantresume.pdf">resume</a>, <a href="https://github.com/sungjp">Github</a>, and <a href="https://www.linkedin.com/in/granthpark">LinkedIn</a>.',possibleInputs:["links"]},{response:"Hello &#128522;",possibleInputs:["yo","oi"]},{response:'Try including: <span style="color:lemonchiffon"> <br/> &#39;links&#39; <br/> &#39;projects&#39; <br/> &#39;hobbies&#39; <br/> &#39;contact&#39; <br/> &#39;about&#39; </span> ',possibleInputs:["?","help"]}],
            portfolio: [{
                name: 'Hurdlr',
                icon: 'hurdlr',
                link: 'https://hurdlr.com/'
            },
            {
                name: 'Dangle',
                icon: 'dangle',
                link: 'https://itunes.apple.com/us/app/dangle-parents-kids-connect/id1082572052?mt=8'
            },
            {
                name: 'Hungrie',
                icon: 'hungrie',    
                link: 'http://www.hungrie.site/'
            },
            {
                name: 'Byte',
                icon: 'byte',
                link: 'http://yhackbyte.herokuapp.com/'
            },
            {
                name: 'Amherst EC',
                icon: 'amherstec',
                link: 'http://amherstec.github.io/'
            },
            {
                name: 'NoteSMS',
                icon: 'notesms',
                link: 'http://www.granthpark.me/BostonHacks/index.html'
            },
            {
                name: 'OutsideHacks',
                icon: 'outsidehacks',
                link: 'http://www.granthpark.me/outside.html'
            },
            {
                name: 'CodePen',
                icon: 'codepen',
                link: 'http://codepen.io/sungjp/'
            },
            {
                name: 'LinkedIn',
                icon: 'linkedin',
                link: 'https://www.linkedin.com/in/granthpark'
            },
            {
                name: 'Github',
                icon: 'github',
                link: 'https://github.com/sungjp'
            },
            {
                name: 'Resume',
                icon: 'resume',
                link: 'http://www.granthpark.me/parkgrantresume.pdf'
            },
            {
                name: 'Website 1.0',
                icon: 'website1',
                link: 'http://www.grantpark.rocks/'
            }]
    };
}])

.factory('GrantsAge',[function(){
    var date = new Date(),
    month = date.getMonth() + 1,
    year = date.getFullYear(),
    day = date.getDay(),
    diff = year - 1995;
    if (12 > month) {
            diff -= 1;
    } else {
            if (2 > day) {
                    diff -= 1;
            }
    }
    return diff.toString();
}])

.factory('Weather',['$http','$q',function($http,$q){
    var deferred = $q.defer();
    var weather;
    var weatherPromise = $http.get("http://api.wunderground.com/api/c1ea49b3e06dc3b3/geolookup/conditions/q/MA/Amherst.json").then(function(response){
            var data = response.data;
            var location = data.location.city,
                currentTemp = data.current_observation.temp_f;
                weather = "The current temperature in " + location + " is: " + currentTemp + "&deg;F &#128513;";
            if (50 > currentTemp) {
                    weather = "Brrr! The current temperature in " + location + " is: " + currentTemp + "&deg:F &#128559;";
            }
         },function(errorMsg){
            console.error(errorMsg);
            weather = "I don't have a clue actually...";
         });
    var resolve = function(){
        deferred.resolve(weather);
    };
    if (weather) {
        resolve();
    } else {
        weatherPromise.then(function(){
            resolve();
        });
    }
    return deferred.promise;
}])
    
.controller('Dialogue', ['$sce','$element','$timeout','$q','$scope','Tabletop','DialoguePortfolioParser','DialogueCache','Weather','GrantsAge','RandomName',function($sce,$element,$timeout,$q,$scope,Tabletop,DialoguePortfolioParser,DialogueCache,Weather,GrantsAge,RandomName) {

    // Socket.io
    // 1) if app starts with me online
    // then start init message indicatinng im online
    // 2) if I come online while app already started
    //  then quietly send message (which pings if user is not in chat mode)
    var socket = io.connect('http://grantbot.herokuapp.com/');
    socket.emit('new user', RandomName);
    window.socket = socket;

    $scope.amSelected = false;

    socket.on('I choose you!', function(){
        $scope.amSelected = true; 
        registerMessage("Grant has connected.", undefined, { ping: true, offline: false });
    });

    socket.on('master message', function(data) {
        registerMessage(data);        
    });

    socket.on('bye', function(){
        $scope.amSelected = false; 
        // should ping here grant has disconnected
        registerMessage("Grant has disconnected.", undefined, { ping: true, offline: true });
    });

    socket.on('masterOnline', function(){
        $scope.masterOnline = true; 
        // could ping here that grant connected
    });

    // In case spreadsheets are too slow
    var parsedData = DialogueCache, 
        dialogue = DialogueCache.dialogue, 
        portfolio = DialogueCache.portfolio;

    // Returns response promise based on input
    var dialogueResponse = function(input){
        var deferred = $q.defer();
        for (var i=0;i<dialogue.length;i++){
            for (var j=0;j<dialogue[i].possibleInputs.length;j++){
                if (input.toLowerCase().indexOf(dialogue[i].possibleInputs[j].toLowerCase()) !== -1) {
                        deferred.resolve({ response: dialogue[i].response, i: i, j: j });
                        return deferred.promise;
                }
            }
        }
        deferred.reject("Sorry, I can't respond to that.");
        return deferred.promise;
    };
    
    // currently set page capacity to 20 apps
    var capacity = 20;

    $scope.notifCount = 2;
    // if notif is 0, then dont show
    // if switch, reset notif to 0
    // if increment notif, animate it and remove class
    // bot messages dont cause incrememnt, only grant messages do

    $scope.pages = [];

    var currentIterPage = [];
    _.each($scope.portfolio, function(el){
        if (currentIterPage.length === capacity) {
            $scope.pages.push(currentIterPage);
            currentIterPage = [];
        }
        currentIterPage.push(el);
    });
    if (currentIterPage !== []) {
        $scope.pages.push(currentIterPage);
    }

    $scope.tabs = [{
        name: 'Github',
        icon: 'prod/img/github.jpg',
        link: 'https://github.com/sungjp'
    },
    {
        name: 'LinkedIn',
        icon: 'prod/img/linked.jpg',
        link: 'https://www.linkedin.com/in/granthpark'
    },
    {
        name: 'Resume',
        icon: 'prod/img/resume.jpg',
        link: 'http://www.granthpark.me/parkgrantresume.pdf'
    }];

    $scope.lock = false;
    // Add to message queue
    var registerMessage = function(msg,sender,/*optional*/ status){
            if (!sender && !$scope.lock) {
                $scope.lock = true;
                $timeout(function(){
        $scope.messageQueue.push({ sender: sender ? sender : 'Grant', message: msg, status: status }); 
                },900).then(function(){
                    $scope.lock = false;
                }); 
            } else {
                    if (!$scope.lock) {
        $scope.messageQueue.push({ sender: sender ? sender : 'Grant', message: msg }); 
                    }
            }
    };

    $scope.trustAsHtml = function(string){
        return $sce.trustAsHtml(string); 
    };

    // Initial screen is dialogue
    $scope.dialogue = true;
    $scope.buttonClicked = function(){
        $scope.dialogue = !$scope.dialogue;
    };

    var checkOverride = function(msg){
            function check(test){ return msg.toLowerCase().indexOf(test) !== -1; }
            if (check('project')) {
                    $timeout(function(){
                        $scope.dottedAnimate = true;
                    },500);
            } else if (check('switch')) {
                    $scope.buttonClicked();
            }
            return false;
    };

    $scope.currentUser = { text: '' };

    // Send filtered response
    $scope.messageQueue = [];
    $scope.send = function(input) {
            if (!$scope.lock && input) {
                if (!checkOverride(input)) {
                        registerMessage(input, 'user');
                        $element.find('input').val('');
                        $scope.currentUser.text = null;
                        if ($scope.amSelected) {
                                socket.emit('new message', input);
                        } else {
                                dialogueResponse(input).then(function(data){
                                        switch (data.response) {
                                                case "E.AGE":
                                                        registerMessage(GrantsAge);
                                                        break;
                                                case "E.WEATHER":
                                                        Weather.then(function(resp){
                                                                registerMessage(resp);
                                                        });
                                                        break;
                                                default:
                                                        registerMessage(data.response);
                                        }
                                },function(notFoundMsg){
                                    registerMessage(notFoundMsg);
                                });
                        }
                }
            }
    };

    // Waking Google spreadsheets up...
    Tabletop.then(function(data){
        var deferred = $q.defer();
        if (data) {
                deferred.resolve(data);
        } else {
                deferred.reject("Could not retrieve data");
        }
        return deferred.promise;
    }).then(function(data){
        parsedData = DialoguePortfolioParser.parse(data);
        dialogue = parsedData.dialogue;
        $scope.portfolio = parsedData.portfolio;
            // currently set page capacity to 20 apps
            $scope.pages = [];

            var currentIterPage = [];
            _.each($scope.portfolio, function(el){
                    if (currentIterPage.length === capacity) {
                        $scope.pages.push(currentIterPage); 
                        currentIterPage = [];
                    }
                    currentIterPage.push(el);
            });
            if (currentIterPage !== []) {
                    $scope.pages.push(currentIterPage);
            }

    },function(msg){console.error(msg);});

    registerMessage("Hi, I'm Grant Park. Ask me anything you'd like. For suggestions, try '?'");

    $timeout(function(){
        $element.addClass('loaded'); 
    },1250);

    $scope.pageMove = 'translateX(0)';
    $scope.currentOption = 0;
    $scope.optionSelected = function(index){
            $scope.pageMove = 'translateX(' + (index*-309) + 'px)';
            $scope.currentOption = index;
    };

    $scope.imageDict = {
        hurdlr: 'prod/img/hurdlr.jpeg',
        dangle: 'prod/img/dangle.jpg',
        hungrie: 'prod/img/hungrie.jpg',
        byte: 'prod/img/byte.jpg',
        notesms: 'prod/img/onenote.jpg',
        outsidehacks: 'prod/img/outside.jpg',
        amherstec: 'prod/img/amherst.jpg',
        codepen: 'prod/img/codepen.jpg',
        linkedin: 'prod/img/linked.jpg',
        github: 'prod/img/github.jpg',
        resume: 'prod/img/resume.jpg',
        website1: 'prod/img/web1.jpg',
        setmine: 'prod/img/setmine.jpg',
        r2r: 'prod/img/r2r.jpg',
        soundcloud: 'prod/img/soundcloud.jpg',
        medium: 'prod/img/medium.jpg',
        behance: 'prod/img/behance.jpg',
        pair: 'prod/img/pair.jpg',
        code: 'prod/img/code.jpg'
    };

}]);
})(); 
