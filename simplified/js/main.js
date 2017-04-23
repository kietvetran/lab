/******************************************************************************
=== GLOBAL ATTRIBUTE ===
******************************************************************************/
try { CONFIG; } catch( error ){ CONFIG = {};   }
try { HOMEGALLERY; } catch( error ){ HOMEGALLERY = null;   }
try { MENUGALLERY; } catch( error ){ MENUGALLERY = null;   }
try { ALACARTE; } catch( error ){ ALACARTE = [];   }
try { SETMENU; } catch( error ){ SETMENU = [];   }
try { GALLERY; } catch( error ){ GALLERY = [];   }
try { MAPSTYLING; } catch( error ){ MAPSTYLING = [];   }
try { INFORMATION; } catch( error ){ INFORMATION = [];   }

var ATTR = {
  'timeout'  : 0,
  'interval' : 0,
  'now'      : new Date()
};

/******************************************************************************
=== MAIN GLOBAL FUCNTION ===
******************************************************************************/
$( document ).ready(function() {
  convertTranslation(); 
  setupFormValidaiton();
  setupCarousel();

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
  });
}

function setupCarousel() {
  $('.carousel_screen').Carousel({
    'carousel'        : false,
    'autoSwipe'       : false,
    'arrowNavigator'  : true
  }); 
}

function setupFormValidaiton() {

  $('#contact-us-form').FormValidation({
    'language'           : ATTR['language'],
    'summaryError'       : false,
    'validationErrorSTD' : ATTR['errorSTD'],
    'validationErrorMSG' : ATTR['errorMSG'],
    'submitCallback'     : sendProductPaymentForm    
  });

  $('#authentication').FormValidation({
    'language'           : ATTR['language'],
    'summaryError'       : false,
    'validationErrorSTD' : ATTR['errorSTD'],
    'validationErrorMSG' : ATTR['errorMSG'],
    'submitCallback'     : sendProductPaymentForm    
  });

  $('#product-payment-form').FormValidation({
    'language'           : ATTR['language'],
    'summaryError'       : false,
    'validationErrorSTD' : ATTR['errorSTD'],
    'validationErrorMSG' : ATTR['errorMSG'],
    'submitCallback'     : sendProductPaymentForm    
  });
}

function sendProductPaymentForm( data ) {
  console.log( '==== sendProductPaymentForm ===');
  console.log( data );
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
  
  for ( var key in opt ) {
    var input = panel.find('[name="'+key+'"]');
    if ( input.length && opt[key] ) {
      input.val( opt[key] || '');
    }
  }
}

function clickOnChatWidgetBtn( data ) {
  var widget = $('#chat-widget'), mode = '-expanded';
  if ( ! widget.length ) { return; }
  widget.toggleClass( mode );
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
