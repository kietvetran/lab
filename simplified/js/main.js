/******************************************************************************
=== GLOBAL ATTRIBUTE ===
******************************************************************************/
try { CONFIG;  } catch( error ){ CONFIG  = {}; }
var ATTR = {
  'resizeTimer'   : 0,
  'scrollTimer'   : 0,
  'interval'      : 0,
  'index'         : 0,
  'today'         : new Date(),
  'day'           : 60*60*24*1000,
  'queue'         : [],
  'hashList'      : [],
  'history'       : [],
  'cookie'        : 'reddbarna_support',
  'reference'     : {'phone':{},'auto':{}},
  'language'      : CONFIG['language']      || 'nb',
  'offline'       : false
};

$( document ).ready(function() {
  convertTranslation(); 
  setupFormValidaiton();
  setupCarousel();

  $( document ).on('click', clickHandler);
  $( window ).on('hashchange', hashChangeHandler);
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
*/
function scroll( e ) {
  clearTimeout( ATTR.timeout );
  ATTR.timeout = setTimeout( function() {
    var position = getScrollPosition();
    position[1] > 20 ? ATTR.body.addClass('scrolled-passed') : 
      ATTR.body.removeClass('scrolled-passed');
  }, 100 );
}

/**
*/
function hashChangeHandler( e ) {
  var opt = getURLoption();
  console.log('=======');
  console.log( opt );
}
/**
 */
function clickHandler( e ) {
  if ( ATTR['dragged'] ) return e.preventDefault();
  if ( e['which'] == 3 ) return true;

  var target  = $( e.target ), parent = target.parent();
  var disabled = target.hasClass('disabled') || parent.hasClass('disabled') ||
    target.hasClass('lib_disabled') || parent.hasClass('lib_disabled');
  if ( disabled ) {
    e.preventDefault();
    return false;
  }

  var href = target.attr('href') || parent.attr('href') || '';
  if ( href.length > 3 && ! href.match( /^\#/ ) ) return true;
  var order = [
    {'type':'class','what':'goto_adding_comment',   'handler':clickOnCommentBtn },      
    {'type':'class','what':'product-get-start-btn', 'handler':clickOnProductGetStartBnt },      
    {'type':'class','what':'navigation-item',       'handler':clickOnNavigationItem },      
    {'type':'class','what':'chat-widget-btn',       'handler':clickOnChatWidgetBtn },      
    {'type':'id',   'what':'logout_btn',            'handler':clickOnLogoutBtn  }
  ];

  var i = 0, loop = order.length, current = null, trigger = 0, data = null, temp = [];
  for ( i; i<loop; i++ ) {
    var test = order[i]['type'] === 'id' ? (
      target.attr('id')==order[i]['what'] ? 1  : (parent.attr('id')==order[i]['what'] ? 2 : 0) 
    ) : ( 
      target.hasClass(order[i]['what']) ? 1 : (parent.hasClass(order[i]['what']) ? 2 : 0)
    );

    if ( ! test ) { 
      if ( order[i].grand ) {
        var grand = parent.parent(), grandP = grand.parent();
        test = order[i].type === 'id' ? (
          grand.attr('id')==order[i]['what'] ? 1  : (grandP.attr('id')==order[i]['what'] ? 2 : 0) 
        ) : ( 
          grand.hasClass(order[i]['what']) ? 1 : (grandP.hasClass(order[i]['what']) ? 2 : 0)
        );        

        if      ( test == 1 ) target = grand;
        else if ( test == 2 ) parent = grandP;
      }
      if ( ! test ) continue;
    }

    current = test == 1 ? target : parent;

    href = current.attr('href') || target.attr('href') || parent.attr('href') || '';
    if ( href.length < 3 || href.match( /^\#/ ) ) e.preventDefault();   

    //order[i].handler({'target':target,'current':current,'event':e});

    data = {'target':target,'current':current,'event':e};
    trigger = order[i].handler( data );

    if ( trigger === 1 ) ATTR['queue'].push( data ); 
    i = loop;
  }

  while ( ATTR['queue'].length ) {
    data = ATTR['queue'].shift();
    if ( current && trigger !== -1 ) {
      if ( data['current'].attr('id') == current.attr('id') ) {
        temp.push( data );
        continue;
      }
    }

    if ( data['rm'] ) {
      data['current'].removeClass( data['rm'] );
      if ( data['parent'] ) data['parent'].removeClass( data['rm'] );
    }
    if ( data['ad'] ) { 
      data['current'].addClass( data['ad'] );
      if ( data['parent'] ) data['parent'].addClass( data['ad'] );
    }
    if ( typeof(data['callback'])=='function' ) data['callback'](data);
  }

  ATTR['queue'] = temp;
  return true;
}

/******************************************************************************
=== CLICK ACTION FUCNTION ===
******************************************************************************/
function clickOnProductGetStartBnt( data ) {
}

function clickOnNavigationItem( data ) {
  var href = data.current.attr('href');
  if ( href === 'login' ) {
    toggleLoginWidget();
  } 
}

function clickOnChatWidgetBtn( data ) {
  var widget = $('#chat-widget'), mode = '-expanded';
  if ( ! widget.length ) { return; }
  widget.toggleClass( mode );
}

function clickOnCommentBtn() {
}

function clickOnLogoutBtn() {}


/******************************************************************************
=== LOGIN FUCNTION ===
******************************************************************************/
function toggleLoginWidget() {

}