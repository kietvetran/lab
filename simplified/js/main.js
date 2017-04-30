/******************************************************************************
=== GLOBAL ATTRIBUTE ===
******************************************************************************/
try { CONFIG; } catch( error ){ CONFIG = {};   }

var ATTR = {
  'timeout'  : 0,
  'interval' : 0,
  'now'      : new Date(),
  'cookie'        : 'simplifia_support',
  'carouselAutoSwipe': CONFIG['carouselAutoSwipe'], 
  'language'       : CONFIG['language']      || 'no',
  'errorMSG'       : CONFIG['validationErrorMSG'],
  'errorSTD'       : CONFIG['validationErrorSTD'],
  'popupChatWidget': CONFIG['popupChatWidget'], 
  'translation'    : CONFIG['translation']   || {},
  'api'            : CONFIG['api']           || {}
};

/******************************************************************************
=== MAIN GLOBAL FUCNTION ===
******************************************************************************/
$( document ).ready(function() {
  convertTranslation(); 
  setupFormValidaiton();
  setupCarousel();
  setupPopupChatWidget();
  initializeOpenDatabase();

  ATTR.tab   = $('.tab-btn');
  ATTR.panel = $('.tab-panel');
  ATTR.body = $('body');  

  $( document ).on('click', clickHandler);
  $( window ).on('hashchange', hashChangeHandler);

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
    'submitCallback'     : submitCallback    
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

  $('#chat-widget-form').FormValidation({
    'language'           : ATTR['language'],
    'summaryError'       : false,
    'validationErrorSTD' : ATTR['errorSTD'],
    'validationErrorMSG' : ATTR['errorMSG'],
    'submitCallback'     : submitChatWidget    
  });  
}

function submitChatWidget( source ) {
  var area = $('#chat-widget-textarea'), text = area.val(); 
  if ( text.replace( /\s+/,'') ) {
    var board = $('#chat-text-board').append('<div class="message -right">'+text+'</div>');
    board.scrollTop( board.get(0).clientHeight );
    source.main.get(0).reset();
    setupPopupChatWidget( true );
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

  }, failed = function() {
    source.main.removeClass('-loading');
    source.insertSummaryError( ATTR.translation['main.login.system-error'][ATTR.language] );
  };

  ATTR.ajax = $.ajax({
    'type':'POST','url': ATTR.api.login, 'data': source.data, 'success':verify, 'error': failed
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
}

/**
 * @param e {Window.Event}
 * @return {Void}
 */
function clickHandler( e ) {
  var target = $(e.target), parent = target.parent(), order = [
    //{'type':'id',    'what':'btnLogo',           'handler':clickOnBtnLogo       },
    {'type':'class','what':'chat-widget-btn',    'handler':clickOnChatWidgetBtn },      
    {'type':'class', 'what':'tab-btn',           'handler':clickOnTabBtn        }
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
    let splited = (decodeURIComponent(matched[2]) || '')
      .replace( /\#\?/g, '&' ).split( '&' );
    for ( let i = 0; i < splited.length; i++ ) {
      let m = splited[i].match( /(\w+)\=(.*)/ );
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
