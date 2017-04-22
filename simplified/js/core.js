/******************************************************************************
******************************************************************************/
try { CONFIG; } catch( error ){ CONFIG = {};   }
var ATTR = {
  'index'     : 0,
  'today'     : new Date(),
  'day'       : 60*60*24*1000,
  'queue'     : [],
  'hashList'  : [],
  'history'   : [],
  'language'  : CONFIG['language']           || 'no',
  'errorMSG'  : CONFIG['validationErrorMSG'] || {},
  'errorSTD'  : CONFIG['validationErrorSTD'] || {}
};

$( document ).ready(function() {
  convertTranslation(); 
  setupFormValidaiton();
});

/******************************************************************************
=== SETUP FUCNTION ===
******************************************************************************/
function convertTranslation() {
  $('[data-translate]').each( function(i,dom) {      
  });
}

function setupFormValidaiton() {
  $('#product-payment-form').FormValidation({
    'language' : Conser['language'],
    'summaryError'       : false,
    'validationErrorSTD' : CONFIG['errorSTD'],
    'validationErrorMSG' : CONFIG['errorMSG'],
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
function hashChangeEvent( e ) {
}

/**
 */
function scrollEvent( e ) {

}

/**
 */
function keyupEvent( e ) {
}

/**
 */
function resizeEvent( e ) {
}

/**
 */
function clickEvent( e ) {
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
    {'type':'class','what':'goto_adding_comment',   'handler':clickOnCommentBtn  },      
    {'type':'id',   'what':'logout_btn',            'handler':clickOnLogoutBtn   }
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
=== FUCNTION ===
******************************************************************************/
function clickOnCommentBtn() {

}

function clickOnLogoutBtn() {

}