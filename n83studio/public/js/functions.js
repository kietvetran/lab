/** ****************************************************************************
 ***************************************************************************** */
function generateId (prefix='app', wantText) {
    var time = (new Date()).getTime();
    var first = Math.floor(Math.random() * 10000 + 1);
    var second = Math.floor(Math.random() * 10000 + 1);
    
    if ( wantText || typeof(wantText) === 'number' ) {
        var character = ['a','b','c','d','e','f','g','k','l','m'];
        var text = `${typeof(wantText) === 'number' ? wantText : 0}${time}${first}${second}`;
        return text.split('').map( (v) => {
            var i = parseInt(v, 10);
            return character[i] || 'x';
        }).join('');
    }

    return [ prefix, time, first, second ].join('-');
};

function hasClass ( target, type ) {
    if ( ! target ) { return false; }
    var v = target && target.tagName ? (target.getAttribute('class') || '') : '';
    var r = new RegExp( `(^|\\s+)${type}($|\\s+)`, 'g' );
    return r.test( v );
};

function getClosestParent ( target, what) {
    if ( ! target || ! what ) { return; }

    var key    = what.replace( /^#/, '');
    var check  = what.match( /^#/ ) ? 'id' : 'class';
    var verify = function ( parent, type, specific ) {
        if ( ! parent || (parent.tagName||'').match(/^html/i) ) {return;}

        if ( specific && typeof(parent.getAttribute) === 'function' ) {
            var t = parent.getAttribute('id') === type;
            return t ? parent : verify( parent.parentNode, type, specific );
        }

        return hasClass(parent,type) ? parent :
            verify( parent.parentNode, type, specific );
    };
    return verify( target, key, (check === 'id') );
};

/** ****************************************************************************
 ***************************************************************************** */
function addEvent (callback, target, type) {
    if (target) {
        if (typeof target.addEventListener !== 'undefined') {
            target.addEventListener(type, callback);
        } else if (typeof target.attachEvent !== 'undefined') {
            target.attachEvent(`on${type}`, callback);
        }
    }
};

function removeEvent (myFunction, target, type) {
    if (target) {
        if (typeof target.removeEventListener !== 'undefined') {
            target.removeEventListener(type, myFunction);
        } else if (typeof target.detachEvent !== 'undefined') {
            target.detachEvent(`on${type}`, myFunction);
        }
    }
};

/** ****************************************************************************
  getWindowSize
***************************************************************************** */
function getWindowSize() {
    var size = [0, 0];
    if (!window.innerWidth) {
        // IE
        if (!(document.documentElement.clientWidth === 0)) {
            size[0] = document.documentElement.clientWidth;
            size[1] = document.documentElement.clientHeight;
        } else {
            size[0] = document.body.clientWidth;
            size[1] = document.body.clientHeight;
        }
    } else {
        size[0] = window.innerWidth;
        size[1] = window.innerHeight;
    }
    return size;
};

/** ****************************************************************************
 ***************************************************************************** */
function clearSelection() {
    if (window.getSelection) {
        window.getSelection().removeAllRanges();
    } else if (document.selection) {
        document.selection.empty();
    }
};

/** ****************************************************************************
 ***************************************************************************** */
function getDocumentScrollPosition() {
    if (typeof window.pageYOffset !== 'undefined') {
        return [window.pageXOffset, window.pageYOffset];
    }

    if (typeof document.documentElement.scrollTop !== 'undefined' && document.documentElement.scrollTop > 0) {
        return [document.documentElement.scrollLeft, document.documentElement.scrollTop];
    }

    return typeof document.body.scrollTop !== 'undefined' ?
        [document.body.scrollLeft, document.body.scrollTop] : [0, 0];
};

function scrollBodyTop(where) {
    var top = where && !isNaN(where) && where > 0 ? where : 0;
    document.body.scrollTop = top;
    document.documentElement.scrollTop = top;
};

/** ****************************************************************************
 ***************************************************************************** */
function sortList (list, field, decreasing, numberTest) {
    if ( ! (list || []).length || ! field ) { return []; }

    var keys = field instanceof Array ? field : [field];
    var length = keys.length;
    var i = 0;
    return list ? list.sort((a, b) => {
        var z = 0;
        var x = '';
        var y = '';
        for (i = 0; i < length; i++) {
            x = numberTest ? parseFloat(`${a[keys[i]] || '0'}`) : `${a[keys[i]] || ''}`;
            y = numberTest ? parseFloat(`${b[keys[i]] || '0'}`) : `${b[keys[i]] || ''}`;

            z = x < y ? -1 : x > y ? 1 : 0;
            if (z !== 0) { i = length; }
        }

        return z * (decreasing ? -1 : 1);
    }) : [];
};

/** ****************************************************************************
 ***************************************************************************** */
function getClickHandler (e, handlerList ) {
    var target = e ? e.target : null;
    if ( !target || (handlerList || []).length === 0 ) { return; }

    var parent = target.parent;
    var handler = null;
    var length = handlerList.length;
    for ( var i=0; i<length; i++ ) {
        if ( handlerList[i].type === 'id' ) {
            if ( handlerList[i].what === target.id || handlerList[i].what === parent.id ) {
                handler = handlerList[i];
                handler.currentTarget = handlerList[i].what === target.id ? target : parent;
                i = length;
            }
        } else {
            if ( hasClass(target, handlerList[i].what) || hasClass(parent, handlerList[i].what) ) {
                handler = handlerList[i];
                handler.currentTarget = hasClass(target, handlerList[i].what) ? target : parent;
                i = length;
            }
        }
    }

    if ( handler && e.preventDefault ) { e.preventDefault(); }
    return handler;
};


/** ****************************************************************************
 ***************************************************************************** */
function getURLquery ( href, query ) {
    var opt = {...(query || {})};
    var list = [];
    var key = '';

    var url = href || window.location.href;
    var matched = url.replace(/\?+/g, '?').match(/^([\w.\-\s_#%/:]+)\?(.*)/);
    var sharp = url.match(/#(\w+)(\?|$)/);

    if ( sharp ) {
        opt.sharp = `#${sharp[1]}`;
    }

    if (matched) {
        var splited = (decodeURIComponent(matched[2]) || '').replace(/#\?/g, '&').split('&');
        for (var i = 0; i < splited.length; i++) {
            var m = splited[i].match(/(\w+)=(.*)/);
            if ( ! m || ! m[1] || ! m[2] ) { continue; }

            opt[m[1]] = m[2].replace(/#$/, '');

            var n = opt[m[1]].match( /^\[(.*)\]$/ );
            if ( ! n || ! n[1] ) { continue; }

            opt[m[1]] = n[1].split(',').reduce( (p,d) => {
                if ( d ) {
                    try {
                        p.push(JSON.parse(d));
                    } catch ( error ) {
                        p.push(d);
                    }
                }
                return p;
            }, []);
        }
    }

    return opt;
};

/** ****************************************************************************
 ***************************************************************************** */
function createRegexp (text, g, i, b, f, ignorReplacing ) {
    if (text === '*') { return /.*/; }
    var v = ignorReplacing ? text : text
        .replace(/\*/, '.*')
        .replace(/\+/g, '\\+')
        .replace(/\(/g, '\\(')
        .replace(/\)/g, '\\)')
        .replace(/\?/g, '\\?')
        .replace(/\-/g, '\\-')
        .replace(/\[/g, '\\[')
        .replace(/\]/g, '\\]')
        .replace(/\$/g, '\\$');

    var m = g && i ? 'gi' : g || i ? (g ? 'g' : 'i') : '';
    var s = b ? (b === 2 ? '^' : b === 3 ? '(^|/|\\s+|,|\\()' : '(^|/|\\s+)') : '';
    var e = f ? (f === 2 ? '$' : f === 3 ? '($|/|\\s+|,|\\))' : '($|/|\\s+)') : '';
    return new RegExp(`${s}(${v})${e}`, m);
};

/******************************************************************************
  === cookie ===
******************************************************************************/
function createCookie ( name, value, day ) {
    if ( ! name ) return;
    var cookie = [ `${name}=${value || ''}`];
    var d = new Date();
    var expires = day || 1000;
    d.setTime( d.getTime() + (expires*24*60*60*1000) );
    cookie.push( `expires=${d.toGMTString()}` );
    cookie.push( 'path=/' );
    document.cookie = cookie.join('; ');
}

function readCookie ( name ) {
    var query = getURLquery();
    if ( query.ignorcookie ) { return ''; }

    var nameEQ =  `${name}=`;
    var ca = document.cookie.split(';');
    for ( var i=0; i<ca.length; i++ ) {
        var c = ca[i];
        while (c.charAt(0) === ' ') { c = c.substring(1,c.length); }

        if ( c.indexOf(nameEQ) === 0 ) {
            return c.substring(nameEQ.length,c.length);
        }
    }
    return '';
}

function eraseCookie ( name ) {
    return createCookie( name, '', -1 );
}
