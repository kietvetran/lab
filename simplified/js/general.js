/******************************************************************************
=== GENERAL GLOBAL FUCNTION ===
******************************************************************************/
function isIE() {
  var m = null;
  if ( (navigator.appName).match('Microsoft Internet Explorer') )
    m = (navigator.appVersion).match(/MSIE\s([\d\.]+)/);
  else if ( (navigator.appName).match('Netscape') )
    m = (navigator.appVersion).match( /rv:([\d\.]+)/);
  return m && m[1] ? parseFloat( m[1] ) : 0; 
}

/**
* The function returns the Mozilla version. If zero returns, it simulates
* that the client's browser is not Mozilla.
* @return {Integer}
*/
function isMozilla() {
  if (navigator.userAgent.indexOf('Firefox') == -1 ) return 0;
  var m = (navigator.userAgent).match( /Firefox\/([\d\.]+)/);
  return m && m[1] ? parseFloat( m[1] ) : 0; 
}

/**
* The function returns the Chrome version. If zero returns, it simulates
* that the client's browser is not Chrome.
* @return {Integer}
*/
function isChrome() {
  if ( ! window.chrome || navigator.userAgent.indexOf('Chrome') == -1 ) 
    return 0;
  var m = (navigator.userAgent).match( /Chrome\/([\d\.]+)/);
  return m && m[1] ? parseFloat( m[1] ) : 0; 
}

/**
* The function returns the Chrome version. If zero returns, it simulates
* that the client's browser is not Chrome.
* @return {Integer}
*/
function isOpera() {
  if ( navigator.userAgent.indexOf('OPR/') == -1 ) return 0;
  var m = navigator.userAgent.match( /OPR\/([\d\.]+)/ );
  return m && m[1] ? parseInt( m[1] ) || 1 : 1;
}

/**
* The function returns the Chrome version. If zero returns, it simulates
* that the client's browser is not Chrome.
* @return {Integer}
*/
function isSafari() {
  if ( navigator.userAgent.indexOf('Safari/') == -1 ) return 0;
  var m = navigator.userAgent.match( /Version\/([\d\.]+)/ );
  return m && m[1] ? parseInt( m[1] ) || 1 : 1;
}

/**
* The function detects iPad Browser.
* @return {Boolean}
*/
function isIpad() { 
  return navigator.userAgent.match(/iPad/i) != null;
}

/**
* The function detects Mobile Browser.
* @return {Boolean}
*/
function isMobile() { 
  if ( ! (navigator.appVersion.indexOf('Mobile') > -1) ) 
    return false;
  return ! ( navigator.userAgent.match(/iPad/i) != null );
}

function isAndroid() { return isMobileAndroid(); }

function isMobileAndroid() {
  if ( ! isMobile() ) return 0;
  var ua = navigator.userAgent.toLowerCase();
  var m = ua.match( /android(\s+)?([1-9\.]+)/i );
  return m ? parseFloat( m[m.length -1] ) : 0;
}

function isMobileWindow() {
  if ( ! isMobile() ) return 0;
  var ua = navigator.userAgent.toLowerCase();
  var m = ua.match( /windows(\s+)?phone(\s+)?os(\s+)?([1-9\.]+)/i );  
  return m ? parseFloat( m[m.length-1] ) : 0;
}

function isMobileIphone() {
  if ( ! isMobile() ) return 0;
  var ua = navigator.userAgent.toLowerCase();
  m = ua.match( /iphone(\s+)?os(\s+)?([1-9\.]+)/i );
  return m ? parseFloat( m[m.length-1] ) : 0;
}

function isWindowsNT() {
  if ( ! (navigator.appName).match('Microsoft Internet Explorer') ) return 0;
  var m = (navigator.appVersion).match( /Windows\s+NT\s([\d\.]+)/ );
  return m && m[1] ? parseFloat( m[1] ) : 0; 
}

function isTouchDevice(){
  var test =  !!('ontouchstart' in window) // works on most browsers 
    || !!('onmsgesturechange' in window); // works on ie10 
  
  if ( test && isIE() > 10 )
    test = !!(navigator.msMaxTouchPoints);
  return test;
}

function isMSpointerEnabled() {
  return window.navigator.msPointerEnabled && isTouchDevice();
}

/**
 */
function capitaliseFirstLetter(text, name){
  return ! text ? '' : ( name ? text.replace( /(?:^|\s)\S/g, function(a) { 
    return a.toUpperCase(); 
  }) : (text.charAt(0).toUpperCase()+text.slice(1).toLowerCase()) );
}

/**
 */
function updateWindowHash( key, text ) {
  if ( ! key ) return;
  var opts = getURLoption(), out = [];
  opts[key] = text || null;
  for ( var k in opts ) {
    if ( k !='pathname' && opts[k] ) out.push( k+'='+opts[k] );
  }
  window.location.hash = '?'+out.join('&');
  //setTimeout( function() { if ( ATTR['hashTimer'] ) clearTimeout(ATTR['hashTimer']);}, 50 );
}

/**
 */
function getURLoption() {
  var opts    = {}, url =  window.location.href; 
  //var matched = url.replace(/\?+/g,"?").match( /^([\w\.\-\s\_\#\%\/\:]+)\?(.*)/ );
  var matched = url.replace(/\#+/g,'#').match( /^([\w\.\-\s\_\%\/\:]+)\#(.*)/ )
    || url.replace(/\?+/g,"?").match( /^([\w\.\-\s\_\#\%\/\:]+)\?(.*)/ );

  if (  matched ) { 
    opts.pathname = matched[1];
    var splited = (decodeURIComponent(matched[2]) || "")
      .replace( /\#\?/g,"&" ).split("&");
    for ( var i=0; i<splited.length; i++ ) {
      var m = splited[i].match( /(\w+)\=(.*)/ );
      if ( m ) opts[m[1]] = m[2].replace( /\#$/, "" );  
    }
  }
  return opts;
}

/**
 */
function getStyle( dom, property ){
	var value = "";
	if(document.defaultView && document.defaultView.getComputedStyle){
		value = document.defaultView.getComputedStyle(dom, "").getPropertyValue(property);
	}
	else if(dom.currentStyle){
		property = property.replace(/\-(\w)/g, function (strMatch, p1){
			return p1.toUpperCase();
		});
		value = dom.currentStyle[property];
	}
	return value;
}

/**
 * The function prevents the current event. it'll check if preventDefault 
 * is defined, and if not, it will use IE’s event.returnValue instead.
 * @param e {window.event} as current event.  
 * @return {Array}
 */
function preventDefaultEvent( e ) {
	if ( e ) {
		if ( typeof(e.preventDefault)=='function' ) 
			e.preventDefault();
	  else 
	  	e.returnValue = false;
	}
}

/**
 * The function returns width and height of the browser window.
 * @return {Array}
 */
function getWindowSize(){
	var w = 0;var h = 0;
	var size = [0, 0];
	if( ! window.innerWidth ) { // IE 
    if( !(document.documentElement.clientWidth == 0) ){
      size[0] = document.documentElement.clientWidth;
      size[1] = document.documentElement.clientHeight;
    } 
    else {
      size[0] = document.body.clientWidth;
      size[1] = document.body.clientHeight;
    }
	} 
	else {
	  size[0] = window.innerWidth;
	  size[1] = window.innerHeight;
	}
	return size;
}

/**
 * The function .
 * @return {Array}
 */
function getScrollPosition(){
	if (typeof window.pageYOffset != 'undefined')
		return [ window.pageXOffset, window.pageYOffset ];

	if (
		typeof document.documentElement.scrollTop != 'undefined' && 
		document.documentElement.scrollTop > 0
	) { 
		return [ 
			document.documentElement.scrollLeft,
			document.documentElement.scrollTop
		];
	}

	return typeof document.body.scrollTop != 'undefined' ? [
		document.body.scrollLeft, document.body.scrollTop
	] : [0,0];
}

/**
 * The function returns offset size of the current dom element
 * @param dom {DOM} as current element.  
 * @return {Array}
 */
function clearSelection() {
  if ( window.getSelection )
  	window.getSelection().removeAllRanges();
  else if ( document.selection ) 
  	document.selection.empty();
}

/**
 * The function creates the cookie's information.
 * @param name {String} of cookie.
 * @param value {String} to be saved in cookie.
 * @param days {Integer} as how many days is expired day. 
 *        The default equals 100 days.
 * @return {Void}
 */
function createCookie( name, value, days ) {
  if ( ! name ) return;
  var cookie = [ name+'='+(value||'') ];
  var d = new Date(), expires = days || 100;
  d.setTime( d.getTime() + (expires*24*60*60*1000) );
  cookie.push( 'expires='+d.toGMTString() );
  cookie.push( 'path=/' );
  document.cookie = cookie.join('; ');
}

/**
 * The function returns the value of name in cookie.
 * @return {String}.
 */
function readCookie( name ) {
  var nameEQ = name + '=', ca = document.cookie.split(';');
  for ( var i=0; i<ca.length; i++ ) {
    var c = ca[i];
    while (c.charAt(0)==' ') c = c.substring(1,c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
  }
  return '';
}

/**
 * The function erases the cookie.
 * @return {Void}
 */
function eraseCookie( name ) { 
  return createCookie( name, '', -1 ); 
}

/**
 * The function returns hash list of storage.
 * @param wantSession {Boolen}, the true refers to sessionStorage.
 *        Otherwise localStorage returns.
 * @return {Hash}
 */
function getLocalStorage( wantSession ) {
  var storage = wantSession ? (sessionStorage || localStorage) : 
    (localStorage || sessionStorage);     
  return storage || {'NOTSUPPERTLOCALSTORAGW': true};
}

/**
 * The function return scroll's top position of document body.
 * @return {Integer}
 */
function getBodyScrollTop() {
	return document.body.scrollTop || document.documentElement.scrollTop || 0;
}

/**
 * The function 
 * @return {String}
 */
function generateId( node ) {
  var index = Math.floor((Math.random() * 10000) + 1);
  var auto = 'auto_' + (new Date()).getTime()+'_'+index;

	if ( ! node || ! node.size() ) return auto; 

	var id = node.attr( 'id' ) || '';
	if ( ! id ) {
		node.attr('id', auto);
    id = auto;
  }
  return id;
}

/**
 * The function 
 * @return {String}
 */
function trim( text, multipleWhiteSpace ) {
	var out  = (text || '').replace( /^\s+/, '').replace( /\s+$/g, '');
	return multipleWhiteSpace ? out.replace( /\s+/g, ' ' ) : out;
}

/**
* The function
* @param text {String} as source of RegExp
* @param g {Booelan}, the true refers to perform a global match .
* @param i {Booelan}, the true refers to perform case-insensitive matching
* @param b {Booelan}, the true refers the matched shall be 
*        beginning or start with white space.
* @param f {Booelan}, the true refers the matched shall be 
*        ending or end with white space.
* @param e {Boolean}, the true refers to escape the none character of the text
* @return {RegExp}
*/
function createRegExp( text, g, i, b, f, e, r ) {
  if ( text == '*' ) { return /.*/; }
	text = e ? escapeText( text ) : text.replace( /\*/, '.*' );

	//debug( text );
  //var k = ['(',')'];
  //for ( var j=0; j<k.length; j++ )
  //  text = text.replace( new RegExp( '\\' + k[j], 'g'), '\\' + k[j] );

  //var v = text.replace( /^\+/, '\\+').replace( /\|\+/, '\|\\+');
  //var v = text.replace( /\+/g, '\\+' );
  var v = text.replace( /\+/g, '\\+' );
  if ( r ) v = v.replace( r[0], r[1] );

  var m = (g && i) ? 'gi' : ( (g || i) ? (g ? 'g' : 'i') : '' );
  return new RegExp((b ? '(^|\\s+)' : '') +'('+v+')' + (f ? '($|\\s+)': ''),m);
}

/**
* The function
* @param text {String}, to be eacaped of the none character.
* @return {String}
*/
function escapeText( text ) {
	var t = text || '', a = ['\\','.','?','+','-','/','"',':','*','@'];
  for ( var j=0; j<a.length; j++ )
    t = t.replace( new RegExp( '\\' + a[j], 'g'), '\\' + a[j] );
  return t;
}

/**
* The function
* @return {Hash}
*/
function getRule( node ) {
  var rule = node ? node.attr( 'data-rule' ) : '';
  return rule ? JSON.parse( rule.replace(/\'/g, '"') ) : {};
};

function getDataRule ( node ) {
  if ( ! node ) { return {}; } 

  var rule = {}, list = [node.attr('data-rule')];
  var type = node.attr('type') || '';
  var reg  = type ? new RegExp('(^|\\s)'+type+'(\\s|$)','i') : null;
  //if ( reg && opt.method.join(' ').match(reg) ) list.push( type ); 
  if ( reg && opt.method && opt.method.join(' ').match(reg) && type !== 'text' ) { 
    list.push( type ); 
  }

  var text = trim( list.join(' '), true );
  if ( ! text ) { return; }

  var render = function( v, d ) {      
    if ( ! d ) { d = rule; }
    var m = v.match( /(\w+)\[(.*)\]/ );
    if ( m ) {
      if ( m[1] === 'interval' ) {
        d[m[1]] = m[2] ? $.map( m[2].split(','), function(param){
          var number = parseFloat(param || '');
          return isNaN(number) ? null : number;
        }) : [null,null];
      }
      else if ( m[2].match( /(.*\,|^)(\w+\[.*\])/ ) ) {
        if ( ! d[m[1]] || typeof(d[m[1]]) === 'string' ) { d[m[1]] = {}; }
        render( m[2], rule[m[1]] );
      }
      else { d[m[1]] = m[2].match(/^[\d+\.]$/) ? parseFloat(m[2]) : m[2]; }
    }
    else { d[v] = ''; }
  };

  //var test = text.match( /([\w\-\_]+)(\[[\w\s\"\,\_\.]+\])?(\s+|$)/g ) || [];
  var test = text.match( /([\w\-\_]+)(\[[\w\s\"\,\_\.\#\-]+\])?(\s+|$)/g ) || [];
  for ( var i=0; i<test.length; i++ ) {
    render( trim(test[i],true) );
  }

  return rule;
};

/******************************************************************************
=== DATE CONVERTING FUNCTIONS ===
******************************************************************************/

/**
 * The function converts text to Date object. 
 * @param text {String} in pattern as "YYYY-MM-DD"
 * @return {Date}, Otherwise null returns.
 */
function convertText2Date( text ) {
  var m = text ? text.match( /^(\d{1,4})\-(\d{1,2})\-(\d{1,2})/ ) : null;
  if ( m ) {
    for ( var i=1; i<m.length; i++ )
      m[i] = parseInt( (m[i]+'').replace(/^0/, '') );
  }
  return m ? new Date( m[1], m[2]-1, m[3], 0, 0, 0) : null;
}

/**
 * The function 
 * @return {String}
 */
function convertDate2Text( date, separation, reverse, monthList ) {
  var m = date ? [date.getFullYear(), date.getMonth()+1, date.getDate()] : null;
  if ( m ) {
    for (var i=0; i<m.length; i++ )  m[i] = m[i] < 10 ? '0'+m[i] : m[i];

    if ( monthList && monthList[date.getMonth()] ) {      
      m[1] = monthList[date.getMonth()];
      m[2] +='.';
    }
    
    if ( reverse ) m = m.reverse();
  }
  return m ? m.join( separation || '-') : '';
}

/**
 * The function 
 * @return {String}
 */
function convertDate2Name( date ) {
  if ( ! date ) return '';

  var value = date.getTime(), d = new Date(), day = 60*60*24*1000, now = ( 
    new Date(d.getFullYear(),d.getMonth(),d.getDate(),0,0,0,0) 
  ).getTime();

  var list = [
    {'id': -1, 'name': 'Tomorrow'  },
    {'id': 0,  'name': 'Today'     },
    {'id': 1,  'name': 'Yesterday' }
  ];

  for ( var i=0; i<list.length; i++ ) {   
    var from = now-(day*list[i]['id']), to = from + day;
    if ( value >= from && value < to ) {
      return list[i]['name'];
    }
  }

  var difference = (value - now)/ day, ago = difference < 0;
  var number = parseInt( ago ? (difference-1)*-1 : difference);
  return ago ? number+'_days_ago' : 'about_'+number+'_days';
}

/**
 * @param callback {Function},
 * @param reference {HASH},
 * @param interval {Integer}
 * @return {String}
 */
function wait( callback, reference, interval ) {
  if ( ! callback || ! reference ) return;

  var count = 100, timer = 0;
  if ( reference['DONE'] )
    callback();
  else {
    timer = setInterval( function() {
      if ( reference['DONE'] || count-- < 0 ) {
        clearInterval( timer ), callback();
      } 
    }, interval || 300 );
  } 
}

/**
* The function
* @return {Void}
*/
function rc4( key, str ) {
  var s = [], i = 0, j = 0, x = 0, res = '';
  for ( i=0; i<256; i++ ) s[i] = i;

  for ( i=0; i<256; i++) {
    j = (j + s[i] + key.charCodeAt(i % key.length)) % 256;
    x = s[i], s[i] = s[j], s[j] = x;
  }

  i = 0, j = 0;
  for (var y = 0; y<str.length; y++) {
    i    = (i + 1) % 256;
    j    = (j + s[i]) % 256;
    x    = s[i], s[i] = s[j], s[j] = x;
    res += String.fromCharCode(str.charCodeAt(y) ^ s[(s[i] + s[j]) % 256]);
  }
  return res;
}

function convertToHtmlEntity( text, decode ) {
  if ( ! text ) return '';

  var code = [
    [[/\ø/g, '&oslash;'], [/\&oslash\;/g, 'ø']],
    [[/\Ø/g, '&Oslash;'], [/\&Oslash\;/g, 'Ø']],
    [[/\æ/g, '&aelig;'],  [/\&aelig\;/g,  'æ']],
    [[/\Æ/g, '&AElig;'],  [/\&AElig\;/g,  'Æ']],
    [[/\å/g, '&åring;'],  [/\&aring\;/g, 'å']],
    [[/\Å/g, '&Åring;'],  [/\&Aring\;/g, 'ø']],
    [[/\s/g, '&nbsp;'],   [/\&nbsp\;/g, ' ']],
  ];

  var loop = code.length;
  for ( var i=0; i<loop; i++ ) {
    var a = decode ? code[i][1] : code[i][0];
    text = text.replace( a[0], a[1]);
  }
  return text;
}

/**
* The function
* @return {Void}
*/
function highLightText( text, reg, all, type ) {
  if (! text || ! reg || text.match( /<([\w]+)[^>]*>(.*?)<\/\1>/ ) ) 
    return text;

  if ( ! type ) type = 'sb1_lib_highligth';
  return ! all ? text.replace( reg, function( $0 ) {
    var s = '', t = $0;
    if ( t.match(/^\s/ ) ) {
      s = ' ', t = t.replace( /^\s/, '');
    }
    return s + '<span class="'+type+'">'+ t +'</span>';
  }) : ('<span class="'+type+'">'+(text||'')+'</span>');
}


/**
* The function
* @return {Void}
*/
function setSelectionRange( dom, start, end ) {
  
  var getTextNodesIn = function( el ) {
    var text = [];
    if (el.nodeType == 3) text.push( el );
    else {
      var children = el.childNodes;
      for (var i = 0, len = children.length; i < len; ++i) 
        text.push.apply(text, getTextNodesIn(children[i]));
    }
    return text;
  };

  if (document.createRange && window.getSelection) {
    var range = document.createRange();
    range.selectNodeContents( dom );

    var textNodes  = getTextNodesIn( dom ); 
    var foundStart = false, charCount = 0, endCharCount;

    for ( var i=0,textNode; textNode=textNodes[i++]; ) {
      endCharCount = charCount + textNode.length;
      if (!foundStart && start >= charCount && (start < endCharCount ||(start == endCharCount && i < textNodes.length))) {
        range.setStart(textNode, start - charCount);
        foundStart = true;
      }
      if (foundStart && end <= endCharCount) {
        range.setEnd(textNode, end - charCount);
        break;
      }
      charCount = endCharCount;
    }

    var sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  } else if (document.selection && document.body.createTextRange) {
    var range = document.body.createTextRange();
    range.moveToElementText( dom );
    range.collapse(true);
    range.moveEnd("character", end);
    range.moveStart("character", start);
    range.select();
  }
};

/**
* The function
* @return {Boolean}
*/
function isClickable( node ) {
  if ( ! node || ! node.size() ) return false;
  var dom = node.get(0), type = node.attr('type'), tag = dom.nodeName.toLowerCase();
  return (type+' '+tag).match(/radio|checkbox|select|option/i) !== null || 
    tag.match(/^a$/i) !== null;
};

/**
* The function
* @return {Boolean}
*/
function isRadio( input ) {
  return input ? (input.attr('type') || '').match(/radio/i) !== null : false;
};

/**
* The function
* @return {Void}
*/
function bin2hex (code,str) {
  var out = '', note = '', text = str+'';
  for ( var i=0; i<text.length; i++ ) {
    note = text.charCodeAt(i).toString(code || 16);
    out += note.length < 2 ? '0' + note : note;
  }
  return out;
}

function hex2bin(code,str) {
  var bytes = [], text = str+'';
  for( var i=0; i<text.length-1; i+=2 )
    bytes.push(parseInt(text.substr(i, 2), code || 16));
  return String.fromCharCode.apply(String, bytes);    
}

/**
* The function
* @return {Void}
*/
function convertBitwise( code, text, force ) {
  var length = (text || '').length;
  if ( (! code || ! length) || (length<4 && force==null) ) return text; 

  var encoded = '', test = force;
  for ( var i=0; i<length; i++ ) {
    var a = text.charCodeAt(i);
    var b = test ? (a - code) : (a + code);
    encoded = encoded+String.fromCharCode(b);
  }
  return encoded;
}

/**
 * The function encodes the text to LZW.
 * @param text {String} as current.
 * @return {String}
 */
function encodeLZW( text ) {
  if ( ! text ) return '';
  var dict = {}, data = (text + '').split(''), out = [];
  var currChar = null, phrase = data[0], code = 256;
  for (var i=1; i<data.length; i++) {
    currChar = data[i];
    if (dict[phrase + currChar] != null)
      phrase += currChar;
    else {
      out.push(phrase.length > 1 ? dict[phrase] : phrase.charCodeAt(0));
      dict[phrase + currChar] = code++;
      phrase = currChar;
    }
  }

  out.push(phrase.length > 1 ? dict[phrase] : phrase.charCodeAt(0));
  for (var i=0; i<out.length; i++) {
    out[i] = String.fromCharCode( out[i] );
  }
  return out.join('');
}

/**
 * The function decodes the LZW to text.
 * @param text {String} as current.
 * @return {String}
 */
function decodeLZW( text ) {
  if ( ! text ) return '';
  var dict = {}, data = (text + '').split(''); 
  var currChar = data[0], oldPhrase = currChar;
  var out = [currChar], code = 256, phrase = null;

  for (var i=1; i<data.length; i++) {
    var currCode = data[i].charCodeAt(0);
    if (currCode < 256)
      phrase = data[i];
    else
      phrase = dict[currCode] ? dict[currCode] : (oldPhrase + currChar);

    out.push(phrase);
    currChar     = phrase.charAt(0);
    dict[code++] = oldPhrase + currChar;
    oldPhrase    = phrase;
  }
  return out.join('');
}


/**
* The function
* @return {Void}
*/
function rc4( key, str ) {
  var s = [], i = 0, j = 0, x = 0, res = '';
  for ( i=0; i<256; i++ ) s[i] = i;

  for ( i=0; i<256; i++) {
    j = (j + s[i] + key.charCodeAt(i % key.length)) % 256;
    x = s[i], s[i] = s[j], s[j] = x;
  }

  i = 0, j = 0;
  for (var y = 0; y<str.length; y++) {
    i    = (i + 1) % 256;
    j    = (j + s[i]) % 256;
    x    = s[i], s[i] = s[j], s[j] = x;
    res += String.fromCharCode(str.charCodeAt(y) ^ s[(s[i] + s[j]) % 256]);
  }
  return res;
}
/**
* The function
* @return {Void}
*/
function debug( text, value ) {
  var debug = $('#debugWidget'), v = '', d = new Date();
  if ( ! debug.size() ) debug = $('<div id="debugWidget"></div>').appendTo('body');
  
  var p = debug.html();
  var t = d.getMinutes() + ':' + d.getSeconds();
  if ( value != null ) {
    if ( typeof(value) != 'object' )
      v = value;
    else if( value instanceof Array )
      v = value.join('<br/>');
    else {
      var data = [];
      for ( var k in value ) data.push( k + ' : ' + value[k]);
      v = data.join( '<br/>' );
    }
  }
  debug.html( t + '<br/>' + text + '<br/>' + v + '<div>&nbsp;</div>' + p);
}