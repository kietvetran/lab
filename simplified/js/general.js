/******************************************************************************
=== GENERAL GLOBAL FUCNTION ===
******************************************************************************/
/**
* The function returns the IE version. If zero returns, it simulates
* that the client's browser is not IE.
* @return {Integer}
*/
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
function isSafari() {
	if ( navigator.userAgent.indexOf('Safari/') == -1 ) return 0;
	var m = navigator.userAgent.match( /Version\/([0-9\.]+)/ );
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
 * The function returns width and height of the browser window.
 * @param e {window.event} as current event.
 * @param touch {Boolean}, true refers to touch event. Otherwice 
 *        it is a mouse event.
 * @return {Array}
 */
function getEventPosition( e, touch ){
  if ( ! e ) e = window.event;
  var target = (e.targetTouches || e.changedTouches || [])[0], pos = [
    e.clientX || e.pageX || (touch && target ? target.pageX : 0),  
    e.clientY || e.pageY || (touch && target ? target.pageY : 0)
  ];

  if ( pos[0]===0 && pos[1]===0 ) {
    try {
       pos =[e.originalEvent.touches[0].pageX,e.originalEvent.touches[0].pageY];
    } catch(error) { pos = [0,0]; } 
  }
  return pos;
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
 * The function get selected text
 * @return {String}
 */
function getSelectionText() {
  var html = "";
  if (typeof window.getSelection != "undefined") {
    var sel = window.getSelection();
    if (sel.rangeCount) {
      var container = document.createElement("div");
      for (var i = 0, len = sel.rangeCount; i < len; ++i) {
          container.appendChild(sel.getRangeAt(i).cloneContents());
      }
      html = container.innerHTML;
    }
  } else if (typeof document.selection != "undefined") {
    if (document.selection.type == "Text") {
        html = document.selection.createRange().htmlText;
    }
  }
  return html;
}

/**
 * The function return scroll's top position of document body.
 * @return {Integer}
 */
function getBodyScrollTop() {
	return document.body.scrollTop || document.documentElement.scrollTop || 0;
}

/**
 * The function scrolls vertical of document's body to the current position
 * @param where {Integer} as current position.
 * @return {Void}
 */
function scrollBodyTop( where ) {
	document.body.scrollTop = document.documentElement.scrollTop = 
		where && (! isNaN(where) ) && where > 0 ? where : 0;
}

/**
 * The function 
 * @return {String}
 */
function generateId( target ) {
	if ( ! target ) return ''; 
	var id = target.getAttribute( 'id' );
	if ( ! id ) {
		var id = 'auto_' + (new Date()).getTime()+'_'+ATTR['index']++;
		target.setAttribute('id', id);
  }
  return id;
}

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
function convertDate2Text( date ) {
	var m = date ? [date.getFullYear(), date.getMonth()+1, date.getDate()] : null;
	if ( m ) {
		for (var i=0; i<m.length; i++ ) 
			m[i] = m[i] < 10 ? '0'+m[i] : m[i];
	}
	return m ? m.join('-') : '';
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

/******************************************************************************
=== ENCODING & DECOING FUNCTIONS ===
******************************************************************************/
/**
 * The function encodes text to UTF8.
 * @return {String}
 */
function encodeUTF8( text ) {
  return text ? unescape(encodeURIComponent(text)) : text;
}

/**
 * The function decodes the UTF8 text.
 * @return {Hash}
 */
function decodeUTF8( text ) {
  return text ? decodeURIComponent(escape(text)) : text;
}

/**
 * The function encodes the text to LZW.
 * @param text {String} as current.
 * @return {String}
 */
function encodeLZW( text ) {
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
 * @return {String}
 */
function trim( text, multipleWhiteSpace ) {
	var out = (text || '').replace( /^\s+/, '').replace( /\s+$/g, '');
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
  var v = text.replace( /\+/g, '\\+' );
  if ( r ) v = v.replace( r[0], r[1] );

  var m = (g && i) ? 'gi' : ( (g || i) ? (g ? 'g' : 'i') : '' );
  return new RegExp((b ? '(^|\/|\\s+)' : '') +'('+v+')' + (f ? '($|\/|\\s+)': ''),m);
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
* @return {Void}
*/
function getBase64Image( dom, noReplace ) {
  var size = dom ? [dom.width || 0, dom.height || 0] : [0,0];
  if ( ! size[0] || ! size[0] ) return '';

  var canvas = document.createElement("canvas");
  canvas.width = size[0], canvas.height = size[1];

  var ctx = canvas.getContext("2d");
  ctx.drawImage(dom, 0, 0);

  var base64 = canvas.toDataURL("image/png") || '';
  return noReplace ? base64 :
    base64.replace(/^data:image\/(png|jpg);base64,/, '');
}

/**
* The function
* @return {Void}
*/
function isEncoded( text ) {
  var limit = parseInt((text||'').length/3); 
  if ( limit > 1 ) return false;
 
  var check = '[\\w\\+\\.\\-\\_\\|\\{\\}\\?\\*\\^\\¨\\\'\\"\\s]{'+limit+'}';
  return ! text.match(createRegExp(check));	
}

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

  //var encoded = '', test = force!=null ? force : isEncoded(text);
  var encoded = '', test = force;
  for ( var i=0; i<length; i++ ) {
    var a = text.charCodeAt(i);
    var b = test ? (a - code) : (a + code);
    encoded = encoded+String.fromCharCode(b);
  }
  return encoded;
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

var Base64 = {
	// private property
	_keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

	// public method for encoding
	encode : function (input) {
	    var output = "";
	    var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
	    var i = 0;

	    input = Base64._utf8_encode(input);

	    while (i < input.length) {

	        chr1 = input.charCodeAt(i++);
	        chr2 = input.charCodeAt(i++);
	        chr3 = input.charCodeAt(i++);

	        enc1 = chr1 >> 2;
	        enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
	        enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
	        enc4 = chr3 & 63;

	        if (isNaN(chr2)) {
	            enc3 = enc4 = 64;
	        } else if (isNaN(chr3)) {
	            enc4 = 64;
	        }

	        output = output +
	        this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
	        this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);

	    }

	    return output;
	},

	// public method for decoding
	decode : function (input) {
	    var output = "";
	    var chr1, chr2, chr3;
	    var enc1, enc2, enc3, enc4;
	    var i = 0;

	    input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

	    while (i < input.length) {

	        enc1 = this._keyStr.indexOf(input.charAt(i++));
	        enc2 = this._keyStr.indexOf(input.charAt(i++));
	        enc3 = this._keyStr.indexOf(input.charAt(i++));
	        enc4 = this._keyStr.indexOf(input.charAt(i++));

	        chr1 = (enc1 << 2) | (enc2 >> 4);
	        chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
	        chr3 = ((enc3 & 3) << 6) | enc4;

	        output = output + String.fromCharCode(chr1);

	        if (enc3 != 64) {
	            output = output + String.fromCharCode(chr2);
	        }
	        if (enc4 != 64) {
	            output = output + String.fromCharCode(chr3);
	        }

	    }

	    output = Base64._utf8_decode(output);

	    return output;

	},

	// private method for UTF-8 encoding
	_utf8_encode : function (string) {
	    string = string.replace(/\r\n/g,"\n");
	    var utftext = "";

	    for (var n = 0; n < string.length; n++) {

	        var c = string.charCodeAt(n);

	        if (c < 128) {
	            utftext += String.fromCharCode(c);
	        }
	        else if((c > 127) && (c < 2048)) {
	            utftext += String.fromCharCode((c >> 6) | 192);
	            utftext += String.fromCharCode((c & 63) | 128);
	        }
	        else {
	            utftext += String.fromCharCode((c >> 12) | 224);
	            utftext += String.fromCharCode(((c >> 6) & 63) | 128);
	            utftext += String.fromCharCode((c & 63) | 128);
	        }

	    }

	    return utftext;
	},

	// private method for UTF-8 decoding
	_utf8_decode : function (utftext) {
	    var string = "";
	    var i = 0;
	    var c = c1 = c2 = 0;

	    while ( i < utftext.length ) {

	        c = utftext.charCodeAt(i);

	        if (c < 128) {
	            string += String.fromCharCode(c);
	            i++;
	        }
	        else if((c > 191) && (c < 224)) {
	            c2 = utftext.charCodeAt(i+1);
	            string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
	            i += 2;
	        }
	        else {
	            c2 = utftext.charCodeAt(i+1);
	            c3 = utftext.charCodeAt(i+2);
	            string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
	            i += 3;
	        }

	    }

	    return string;
	}
};