/******************************************************************************
=== GLOBAL ATTRIBUTE ===
******************************************************************************/
try { CONFIG; } catch( error ){ CONFIG = {};   }

var ATTR = {
  'timeout'  : 0,
  'interval' : 0,
  'now'      : new Date(),
  'cookie'   : 'simplifia_support',
  'storage'  : {},
  'carouselAutoSwipe': CONFIG['carouselAutoSwipe'], 
  'language'       : CONFIG['language']      || 'no',
  'errorMSG'       : CONFIG['validationErrorMSG'],
  'errorSTD'       : CONFIG['validationErrorSTD'],
  'popupChatWidget': CONFIG['popupChatWidget'], 
  'translation'    : CONFIG['translation']   || {},
  'api'            : CONFIG['api']           || {},
  'sessionId'      : null
};

/******************************************************************************
=== MAIN GLOBAL FUCNTION ===
******************************************************************************/
$( document ).ready(function() {
  setupSessionId();
  convertTranslation(); 
  setupFormValidaiton();
  setupCarousel();
  setupPopupChatWidget();
  initializeOpenDatabase();

  //console.log('==> ' + ATTR.sessionId);

  ATTR.tab   = $('.tab-btn');
  ATTR.panel = $('.tab-panel');
  ATTR.body = $('body');  

  $( document ).on('click', clickHandler);
  $( window ).on('hashchange', hashChangeHandler)
    .on('beforeunload', closeWindow);

  verifyAuthentication();
  hashChangeHandler();
});

/******************************************************************************
=== SETUP FUCNTION ===
******************************************************************************/
function convertTranslation() {
  $('[data-translate]').each( function(i,dom) {  
    var node = $(dom), key = node.attr('data-translate');
    var label = (ATTR['translation'][key] || {})[ATTR['language']];
    if ( ! label && label !== '' ) { label = key; }

    if ( node.is('input') ) {
      node.attr('placeholder', label);
    } else {
      node.html( label );      
    }
  });
}

function closeWindow() {
  //var memory = getLocalStorage();
  //memory[ATTR.cookie+'-sessionId'] = '';
}

function setupSessionId() {
  var memory = getLocalStorage();
  ATTR.sessionId = memory[ATTR.cookie+'-sessionId'];
  if ( ATTR.sessionId ) { return; }

  ATTR.sessionId = (new Date()).getTime() + 'K'+ Math.floor((Math.random() * 1000) + 1);
  memory[ATTR.cookie+'-sessionId'] = ATTR.sessionId;

  /*
  ATTR.sessionId = readCookie(ATTR.cookie+'-sessionId');
  if ( ATTR.sessionId ) { return; }

  ATTR.sessionId = (new Date()).getTime() + 'K'+ Math.floor((Math.random() * 1000) + 1);
  createCookie( ATTR.cookie+'-sessionId', ATTR.sessionId, 1 );
  */
}

function setupPopupChatWidget( stop ) {
  if ( ! ATTR.popupChatWidget || ATTR.popupChatWidget.showed ) { return; }
  clearTimeout( ATTR.popupChatWidget.timer || 0);

  if ( stop ) { 
    ATTR.popupChatWidget.showed = true;
    return; 
  }

  ATTR.popupChatWidget.timer = setTimeout( function() {
    var text =  ATTR.popupChatWidget.message[ATTR.language];
    var board = $('#chat-text-board').append('<div class="message -left">'+text+'</div>');
    board.scrollTop( board.get(0).clientHeight );

    clickOnChatWidgetBtn( {}, true );
    ATTR.popupChatWidget.showed = true;
  }, ATTR.popupChatWidget.delay || 10000 );
}

function setupCarousel() {
  $('.carousel_screen').Carousel({
    'carousel'        : false,
    'autoSwipe'       : ATTR['carouselAutoSwipe'] ? true : false,
    'arrowNavigator'  : true,
    'autoSwipe'       : ATTR['carouselAutoSwipe']
  }); 
}

function setupFormValidaiton() {
  $('#contact-us-form').FormValidation({
    'language'           : ATTR['language'],
    'summaryError'       : false,
    'validationErrorSTD' : ATTR['errorSTD'],
    'validationErrorMSG' : ATTR['errorMSG'],
    'submitCallback'     : submitContactUsForm    
  });

  $('#product-payment-form').FormValidation({
    'language'           : ATTR['language'],
    'summaryError'       : false,
    'validationErrorSTD' : ATTR['errorSTD'],
    'validationErrorMSG' : ATTR['errorMSG'],
    'submitCallback'     : submitProductPayment    
  });

  $('#login-form').FormValidation({
    'language'           : ATTR['language'],
    'summaryError'       : false,
    'validationErrorSTD' : ATTR['errorSTD'],
    'validationErrorMSG' : ATTR['errorMSG'],
    'submitCallback'     : submitLoginForm    
  });

  $('#signup-form').FormValidation({
    'language'           : ATTR['language'],
    'summaryError'       : false,
    'validationErrorSTD' : ATTR['errorSTD'],
    'validationErrorMSG' : ATTR['errorMSG'],
    'submitCallback'     : submitSignupForm    
  });  

  var chatform = $('#chat-widget-form').FormValidation({
    'language'           : ATTR['language'],
    'summaryError'       : false,
    'validationErrorSTD' : ATTR['errorSTD'],
    'validationErrorMSG' : ATTR['errorMSG'],
    'submitCallback'     : submitChatWidget    
  });

  $('#chat-widget-textarea').on('keyup', function(e) {
    if ( e.keyCode === 13 && ! e.shiftKey ) {
      chatform.submit();
    }
  });
}

function submitChatWidget( source, querstion ) {
  var area = $('#chat-widget-textarea'), chat = $('#chat-text-board'); 
  var text = querstion || area.val();

  var last = chat.children().last();
  if ( last.hasClass('message') && last.hasClass('-option') ) {
    last.remove();
  }

  if ( text.replace( /\s+/,'') ) {
    var board = chat.append('<div class="message -right">'+text+'</div>');
    board.scrollTop( board.get(0).clientHeight );
    if ( source ) {
      source.main.get(0).reset();
    }
    setupPopupChatWidget( true );

    var verify = function( response ) {
      if ( ! response ) { return; }

      if ( response.text ) {
        board = chat.append('<div class="message -left">'+response.text+'</div>');
        board.scrollTop( board.get(0).clientHeight );        
      }

      if ( response.buttons && response.buttons instanceof Array ) {
        var option = [], buttons = response.buttons, length = buttons.length;
        for ( var i=0; i<length; i++ ) {
          option.push(
            '<li>'+
              '<a href="#" role="button" class="message-option-btn secondary-btn -block">'+buttons[i].payload+'</a>'+
            '</li>'
          );
        }
        board = chat.append(
          '<div class="message -option">'+
            '<ul class="message-option-list">' + option.join('') +'</ul>'+
          '</div>'
        );
        board.scrollTop( board.get(0).clientHeight ); 
      }
    }, failed = function() {

    };

    var url = ATTR.api.chat, data = {
      'sender' : {'id': ATTR.sessionId},
      'message' : {'text': text}
    };
    ATTR.ajax = $.ajax({
      'type':'POST','url': url, 'data': data, 'success':verify, 'error': failed
    });
  }
  return false;
}

function submitProductPayment( source ) {
  source.main.addClass('-loading');
  setTimeout( function() {
    source.main.removeClass('-loading').addClass('-send-success');
  }, 1000 );
  return false;
}

function submitCallback( source ) {
  source.main.addClass('-loading');
  setTimeout( function() {
    source.main.removeClass('-loading').addClass('-send-success');
  }, 1000 );
  return false;
}

function submitLoginForm( source ) {
  source.main.addClass('-loading');

  var verify = function( response ) {
    console.log( response );
    source.main.removeClass('-loading');
    var person = '';
    try {
      person = JSON.stringify(response);
    } catch( error ) {}

    if ( person && response.UserID && !(isNaN(response.UserID)) && response.UserID > 0 ) {
      sessionStorage.setItem( ATTR.cookie + 'person', person);
      verifyAuthentication();
      changeTab( 'home' );
    } else {
      source.main.removeClass('-loading');
      source.insertSummaryError( ATTR.translation['main.login.invalid'][ATTR.language] );
    }
  }, failed = function() {
    source.main.removeClass('-loading');
    source.insertSummaryError( ATTR.translation['main.login.system-error'][ATTR.language] );
  };

  var url = ATTR.api.login;// + '?username='+source.data.username+'&password='+source.data.password;
  ATTR.ajax = $.ajax({
    'type':'POST','url': url, 'data': source.data, 'success':verify, 'error': failed
  });

  /*
  setTimeout( function() {
    source.main.removeClass('-loading');
    updateLocationHash({'tab': 'home'});
  }, 500 );
  */
  return false;
}

function submitContactUsForm( source ) {
  source.main.addClass('-loading');

  var verify = function( response ) {
    console.log( response );
    source.main.removeClass('-loading').addClass('-send-success');

    /*
    source.main.removeClass('-loading');
    var person = '';
    try {
      person = JSON.stringify(response);
    } catch( error ) {}

    if ( person && response.UserID && !(isNaN(response.UserID)) && response.UserID > 0 ) {
      sessionStorage.setItem( ATTR.cookie + 'person', person);
      verifyAuthentication();
      changeTab( 'home' );
    } else {
      source.main.removeClass('-loading');
      source.insertSummaryError( ATTR.translation['main.login.invalid'][ATTR.language] );
    }
    */
  }, failed = function() {
    source.main.removeClass('-loading');
    source.insertSummaryError( ATTR.translation['main.login.system-error'][ATTR.language] );
  };

  var url = ATTR.api.contact;// + '?username='+source.data.username+'&password='+source.data.password;
  console.log( url );
  console.log( source.data );
  ATTR.ajax = $.ajax({
    'type':'POST','url': url, 'data': source.data, 'success':verify, 'error': failed
  });

  /*
  setTimeout( function() {
    source.main.removeClass('-loading');
    updateLocationHash({'tab': 'home'});
  }, 500 );
  */
  return false;
}


function submitSignupForm( source ) {
  source.main.addClass('-loading');
  setTimeout( function() {
    source.main.removeClass('-loading');
    updateLocationHash({'tab': 'home'});
  }, 500 );
  return false;
}

/******************************************************************************
=== EVENT FUCNTION ===
******************************************************************************/
/**
* The function 
* @return {Void}
*/
function hashChangeHandler( e ) {
  var opt = getURLoption();
  changeTab( opt.tab || 'home' );
  scrollBodyTop(0);
}

/**
 * @param e {Window.Event}
 * @return {Void}
 */
function clickHandler( e ) {
  var target = $(e.target), parent = target.parent(); 
  if (target.hasClass('ignor-handler') || parent.hasClass('ignor-handler')) { return; }

  var order = [
    //{'type':'id',    'what':'btnLogo',           'handler':clickOnBtnLogo       },
    {'type':'class','what':'chat-widget-btn',    'handler':clickOnChatWidgetBtn    },      
    {'type':'class','what':'message-option-btn', 'handler':clickOnMessageOptionBtn },      
    {'type':'class', 'what':'tab-btn',           'handler':clickOnTabBtn           }
  ]; 
  
  var i = 0, loop = order.length, current = null; 
  for ( i; i < loop; i++ ) {

    if ( order[i].type === 'class' ) {
      if ( target.hasClass(order[i].what) ) {
        current = target;
      } else if ( parent.hasClass(order[i].what) ) {
        current = parent;
      }
    } else if ( order[i].type === 'id' ) {
      if ( target.is(order[i].what) ) {
        current = target;
      } else if ( parent.is(order[i].what) ) {
        current = parent;
      }
    }

    if ( current ) {
      e.preventDefault();
      order[i].handler({'e':e, 'current': current});
      i = loop;
    }
  }
  setupPopupChatWidget();
}

function clickOnMessageOptionBtn( data ) {
  //var current = data.current, message = current.closest('.message').;
  //message.removeClass('-option').html( current.html() );

  //var current = data.current; 
  //current.closest('.message').remove();
  submitChatWidget( null, data.current.html() );
}

function clickOnTabBtn( data ) {
  var href = data.current.attr('href');
  if ( ! href ) { return; }

  if ( data.current.hasClass('-menu-headline') ) {
    var parent = data.current.hasClass('-cloned') ? 
      $('#setmenu-head-link').parent() : data.current.parent();
    href = parent.find('.tablist .tab-btn').eq(0).attr('href');
    if ( href ) {
      updateLocationHash({'menu': href.replace( /\#/g, '' )});
    } 
  } else if ( data.current.hasClass('-menu') ) {
    updateLocationHash({'menu': href.replace( /\#/g, '' )});
  } else {
    updateLocationHash({'tab': href.replace( /\#/g, '' )});
  }
}

function changeTab( name ) {
  if ( ! name ) { return; }

  var pin = name.replace( /\?.*/,''), opt = getURLoption( name ); 

  ATTR.tab.removeClass('-show').each( function(i,d) {    
    $(d).attr('aria-selected', 'false');
  });
  ATTR.panel.removeClass('-show').each( function(i,d) {
    $(d).attr('aria-hidden', 'true');
  });

  var tab = ATTR.tab.filter('#tab-'+pin).addClass('-show').attr('aria-selected', 'true');
  var panel = ATTR.panel.filter('#panel-'+pin).addClass('-show').attr('aria-hidden', 'false');

  if ( ! panel  ) { return; }

  panel.find('form').each( function(i,dom) {
    dom.reset();
    $(dom).removeClass('-send-success');
  });

  for ( var key in opt ) {
    var input = panel.find('[name="'+key+'"]');
    if ( input.length && opt[key] ) {
      input.val( opt[key] || '');
    }
  }

  // Pre insert value
  panel.find('input,select,textarea,[data-field]').each( function(i,dom) {
    var node = $( dom ), name = node.attr('name') || '', tmp = node.attr('data-field') || '';
    var value = ATTR.storage[name || tmp] || '';

    if ( tmp ) { 
      node.html( value || '&nbsp;' );
    } else if ( value ) {
      if ( (node.attr('type') || '').match(/radio|checkbox/i) ) {

      } else {
        node.val( value );
      }
    }
  });
}

function clickOnChatWidgetBtn( data, force ) {
  var widget = $('#chat-widget'), mode = '-expanded';
  if ( ! widget.length ) { return; }

  var has = typeof(force) === 'boolean' ? !(force) : widget.hasClass(mode);
  if ( has ) {
    widget.removeClass( mode );
  } else {
    widget.addClass( mode );
  }
}


/******************************************************************************
=== GENERAL FUCNTION ===
******************************************************************************/
function initializeOpenDatabase() {
  try { // http://www.tutorialspoint.com/html5/html5_web_sql.htm
    ATTR.database = openDatabase(ATTR['cookie'], '1.0', 'simplifai', 50*1024*1024);
    ATTR.database.transaction(function (tx) {
      tx.executeSql('CREATE TABLE IF NOT EXISTS LOGS (id unique, log)');
    });
  } catch( error ) {}
}

function getStorageData( callback, key, type, isArray ) { 
  var text = '';
  if ( ! key ) { 
    return typeof(callback)=='function' ? callback( 
      type == 'json' ? (isArray ? [] : {}) :text
    ) : null; 
  }

  var render = function() {
    if ( type == 'json' ) {
      if ( text ) {
        var json = JSON.parse( text );
        text = typeof(json)=='string' ? JSON.parse(json) : json; 
      } else { text = isArray ? [] : {}; }
    }
    if ( typeof(callback)=='function' ) callback(text);
  };

  if ( ATTR.database ) {
    return ATTR.database.transaction(function (tx) {
      tx.executeSql('SELECT * FROM LOGS WHERE id = ?', [key], function (tx, results) {
        text = results.rows.length ? decodeURI( results.rows.item(0).log ) : '';
        if ( text ) text = decodeLZW( text ) || '';
        //if ( typeof(callback)=='function' ) callback( text );
        render();
      }, null );
    });
  }

  if ( ATTR.storage ) text = decodeLZW(ATTR.storage[key]) || '';
  render();
  //if ( typeof(callback)=='function' ) callback( text );
}

function setStorageData( key, text ) { 
  if ( ATTR.database ) {
    text = text ? encodeURI( encodeLZW(text) ) : '';
    ATTR.database.transaction(function(tx) {
      tx.executeSql('DELETE FROM LOGS WHERE id = ?', [key], function(){
        tx.executeSql('INSERT INTO LOGS (id, log) VALUES ("'+key+'", "'+text+'")');
      });
    });
  } else if ( ATTR.storage ) { ATTR.storage[key] = encodeLZW(text||''); }
}

function verifyAuthentication() {
  /*
  var storage = sessionStorage.getItem( ATTR.cookie + 'person') || '';
  var mode    = 'authenticated';

  try {
    ATTR.storage = JSON.parse( storage || '{}' );
  } catch( error ) {}

  if ( ATTR.storage && JSON.stringify(ATTR.storage) !== '{}' ) {
    ATTR.body.addClass( mode );
  } else {
    ATTR.body.removeClass( mode );
  }
  */
}

/******************************************************************************
=== GENERAL FUCNTION ===
******************************************************************************/
function updateLocationHash( data ) {
  if ( ! data ) { data = {}; }

  var opt = getURLoption(), key = '', param = [];
  for ( key in data ) {
    opt[key] = data[key];
  }

  for ( key in opt ) {
    if ( opt[key] ) {
      param.push( key+'='+opt[key] );
    }
  }
  window.location.hash = param.length ? ('?'+param.join('&')) : '';
}
 
function getURLoption( href ) {
  var opt = {}, url = href || window.location.href;
  var matched = url.replace(/\#+/g, '#').match( /^([\w\.\-\s\_\%\/\:]+)\#(.*)/ )
    || url.replace(/\?+/g, '?').match( /^([\w\.\-\s\_\#\%\/\:]+)\?(.*)/ );

  if ( matched ) {
    var splited = (decodeURIComponent(matched[2]) || '')
      .replace( /\#\?/g, '&' ).split( '&' );
    for ( var i = 0; i < splited.length; i++ ) {
      var m = splited[i].match( /(\w+)\=(.*)/ );
      if ( m ) { opt[m[1]] = m[2].replace( /\#$/, '' ); }
    }
  }
  return opt;
}

function getAutoId() {
  var random = Math.floor((Math.random() * 10) + 1);
  var time   = (new Date()).getTime();
  return 'auto_' + time + '_' + random;
}

function getScrollPosition() {
  if (typeof window.pageYOffset !== 'undefined') {
    return [ window.pageXOffset, window.pageYOffset ];
  }

  if (
    typeof document.documentElement.scrollTop !== 'undefined' &&
    document.documentElement.scrollTop > 0
  ) {
    return [
      document.documentElement.scrollLeft,
      document.documentElement.scrollTop
    ];
  }

  return typeof document.body.scrollTop !== 'undefined' ? [
    document.body.scrollLeft, document.body.scrollTop
  ] : [0, 0];
}

function getBodyScrollTop() {
  return document.body.scrollTop || document.documentElement.scrollTop || 0;
}

function scrollBodyTop( where ) {
  document.body.scrollTop = document.documentElement.scrollTop = 
    where && (! isNaN(where) ) && where > 0 ? where : 0;
}

function createCookie( name, value, days ) {
  if ( ! name ) return;
  var cookie = [ name+'='+(value||'') ];
  var d = new Date(), expires = days || 100;
  d.setTime( d.getTime() + (expires*24*60*60*1000) );
  cookie.push( 'expires='+d.toGMTString() );
  cookie.push( 'path=/' );
  document.cookie = cookie.join('; ');
}

function readCookie( name ) {
  var nameEQ = name + '=', ca = document.cookie.split(';');
  for ( var i=0; i<ca.length; i++ ) {
    var c = ca[i];
    while (c.charAt(0)==' ') c = c.substring(1,c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
  }
  return '';
}

function eraseCookie( name ) { 
  return createCookie( name, '', -1 ); 
}

function getLocalStorage( wantSession ) {
  var storage = wantSession ? (sessionStorage || localStorage) : 
    (localStorage || sessionStorage);     
  return storage || {'NOTSUPPERTLOCALSTORAGW': true};
}
