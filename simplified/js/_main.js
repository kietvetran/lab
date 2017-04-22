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
  'errorMSG'      : CONFIG['validationErrorMSG'],
  'errorSTD'      : CONFIG['validationErrorSTD'],
  'menyOpen'      : CONFIG['menyOpen'],
  'menyAppending' : CONFIG['menyAppending'],
  'acceptText'    : CONFIG['acceptText'],
  'signature'     : CONFIG['signature']     || {},
  'carousel'      : CONFIG['carousel']      || {},
  'month'         : CONFIG['month'],
  'serverMessage' : CONFIG['serverMessage'] || {},
  'label'         : CONFIG['label']         || {},
  'overview'      : CONFIG['overview']      || null,
  'api'           : CONFIG['api']           || {},
  'personAjaxWait': CONFIG['personAjaxWait'],
  'secret'        : 'reddbarna',
  'offline'       : false
};

/******************************************************************************
=== MAIN GLOBAL FUCNTION ===
******************************************************************************/
/**
 */
function startup() {
  initializeAppCacheEvent();

  $('.dropdown_menu').each( function (i,d) { 
    $(d).DropdownMenu({}); 
  });

  ATTR['body']    = $( 'body' ); 
  ATTR['main']    = $( 'main' ); 
  ATTR['header']  = $( 'header' ); 
  ATTR['footer']  = $( 'footer' ); 

  updateOrientation();

  ATTR['application']    = $('#application');
  ATTR['authentication'] = $('#authentication');
  ATTR['comment']        = $('#comment').removeAttr('disabled');
  ATTR['sex']            = $('#sex').removeAttr('disabled');

  ATTR['stepHolder']     = $('#step_holder').hide();
  ATTR['autenHolder']    = $('#authentication_holder').hide();
  ATTR['userAccount']    = $('#user_account_tool').hide(); 
  ATTR['overviewHolder'] = $('#overview_holder').hide();
  ATTR['usernameHolder'] = $('#username_holder').html(''); 

  ATTR['carouselHolder'] = $('#carousel_holder');
  ATTR['infoView']       = $('#information_view');
  ATTR['lightbox']       = $('#lightbox').hide();
  ATTR['scenario']       = $('#scenario');

  //$('#screen_information_wrapper ')

  /*
  ATTR['username'] = $('#username').removeAttr('disabled').val(''); 
  ATTR['password'] = $('#password').removeAttr('disabled').val(''); 
  ATTR['loginBtn'] = $('#login_btn').removeAttr('disabled');
  */
  ATTR['child']    = $('#child'); 
  ATTR['location'] = $('#location'); 
  ATTR['username'] = $('#username'); 
  ATTR['password'] = $('#password'); 
  ATTR['loginBtn'] = $('#login_btn');

  setTimeout( function() {
    ATTR['main'].find('#location,#username,#password,#note,#signature,button').each(function(i,dom){
      dom.removeAttribute('disabled');
    });
    ATTR['main'].find('#location,#username,#password,#note,#other_contribution,#signature').each(function(i,dom){
      dom.value = '';
    });

    ATTR['giver_name'] = $('.giver_name');
    ATTR['carouselHolder'].Carousel( {
      'arrowNavigator'    : false,
      'scroll'            : true
    });
  }, 20 );

  FastClick.attach(document.body);

  initializeOpenDatabase();
  ATTR['storage'] = getLocalStorage();

  $( document ).on('click', clickEvent).on('keyup', keyupEvent );
  $( window ).on( 'hashchange', hashChangeEvent )
    .on( 'resize', resizeEvent ).on( 'scroll', scrollEvent )
    .on( 'orientationchange', updateOrientation );

  //setStorageData( 'token', '');
  getStorageData( function( token ) {
    ATTR['token'] = token['id'] ? token : null;

    var rule = getDataRule( ATTR['scenario'] ), key = [];
    for ( var k in rule ) {
      rule[k] = $.map( rule[k].split(','), function(v) {return parseFloat(v);});
      key.push( k );
    }
    ATTR['scenarioRule'] = rule; 
    ATTR['scenarioKey']  = key;

    setupUserAccount( null, function() {
      var exist =  ATTR['referList'] || [];
      if ( exist.length ) sendToServer( exist );
    });
  }, 'token', 'json' );

  setTimeout( function() {
    ATTR['comment'].FormValidation( {
      'language' : ATTR['language'],
      'summaryError'       : false,
      'validationErrorSTD' : ATTR['errorSTD'],
      'validationErrorMSG' : ATTR['errorMSG'],
      'submitCallback'     : sendForm
    });

    ATTR['authentication'].FormValidation( {
      'language' : ATTR['language'],
      'summaryError'       : false,
      'validationErrorSTD' : ATTR['errorSTD'],
      'validationErrorMSG' : ATTR['errorMSG'],
      'submitCallback'     : verifyLogin,
      'beforeSubmitCallback': function() { $('#login_msg').html(''); }
    });

    ATTR['poster'] = $('.poster');
    updatePostSelection(); 
  }, 100);
}

function updatePostSelection( poster ) {
  var mode  = 'selected', selected = poster || ATTR['poster'].filter('.'+mode);
  var index = selected.size() ? ATTR['poster'].index( selected ) : 0;
  ATTR['infoView'].html( 
    ATTR['poster'].removeClass(mode).eq(index).addClass(mode).html() 
  );
}

function setupUserAccount( ignorStorage, storageCallback ) {
  if ( ATTR['token'] ) {
    ATTR['stepHolder'].show();
    ATTR['userAccount'].show();
    ATTR['autenHolder'].hide(); 
    ATTR['overviewHolder'].hide();
    ATTR['usernameHolder'].html( ATTR['token']['user'] || ATTR['token']['id'] );
    ATTR['body'].removeClass('need_autenticaiton');
    reveal();
    if ( ! ignorStorage ) updateStorage( null, null, storageCallback );
  } else {
    ATTR['stepHolder'].hide();
    ATTR['userAccount'].hide();
    ATTR['overviewHolder'].hide();
    ATTR['autenHolder'].show(); 
    ATTR['body'].addClass('need_autenticaiton');
  }
}

function updateStorage( source, remove, callback ) {
  var id = (ATTR['token'] ||{})['id'] || '';
  if ( ! id ) return;

  var key = ATTR['cookie']+'_'+id, src = source || [];
  getStorageData( function( list ) {
    if ( ! list ) list = [];

    if ( src.length ) {
      if ( remove ) {
        var tmp = [], pin = {}, i = 0;
        for ( i=0; i<src.length; i++ ) pin[src[i]['id']] = 1;

        for ( i=0; i<list.length; i++ ) {
          if ( pin[list[i]['id']] ) { 
            $('#view_'+list[i]['id']).remove();
            continue;
          }
          tmp.push( list[i] );  
        }
        list = tmp;
      } else { list = list.concat( src ); }
      setStorageData( key, (list.length ? JSON.stringify(list) : '') );
    }

    $('#custoner_counter').html( list.length || '' );
    ATTR['referList'] = list;
    if ( typeof(callback)=='function' ) callback();
  }, key, 'json', true );
}

function reveal() {
  ATTR['commentBtn']      = $( '#comment_btn'            ).addClass('disabled');
  ATTR['personal']        = $( '#personal'               );
  ATTR['summary']         = $( '#summary_holder'         );
  ATTR['acceptable']      = $( '#acceptable'             );
  ATTR['acceptableLabel'] = $( 'label[for="acceptable"]' );
  ATTR['signatureField']  = $( '#signature_field'        );

  $('.slider_wrapper').each( function(i,dom){
    $(dom).SliderButton({
      'fieldFollowButton' : true,
      'updateValueCallback': updateContributionCcenario
    });
  });

  $('input[type="checkbox"]').removeAttr('checked');

  ATTR['accordion'] = $('.accordion_menu').AccordionMenu({
    'open'      : ATTR['menyOpen'],
    'appending' : ATTR['menyAppending'],
    'fixed'     : $('header'),
    'step'      : ATTR['header'].find('.step_navigator'),
    'nextClickCallback' : function(e) {
      var btn = $(e.currentTarget);
      if      ( btn.hasClass('confirm_btn') ) confirmForm();
    },
    'validation' : {
      'language' : ATTR['language'],
      'validationErrorSTD' : ATTR['errorSTD'],
      'validationErrorMSG' : ATTR['errorMSG'],
      'changeCallback' : function (e) {
        var input = $(e.currentTarget), name = input.attr('name');
        if ( name == 'contribution' ) {
          $('#other_contribution').val('').keyup();   
          verifyContribution( input );
        }
      },
      'afterKeyupCallback': function( input ) {
        verifyAfterValidationEvent( input, 'keyup' );
        if ( input.is('#other_contribution') ) {
          if ( ! ATTR['form'] ) 
            ATTR['form'] = ATTR['accordion'].AccordionMenu.getFormValidation();

          if ( input.val() ) {
            if ( ! input.parent().hasClass('active') ) {
              var contribution = $('input[name="contribution"]').last().prop('checked',true);
              input.parent().addClass('active');
              
              if ( contribution.hasClass('form_validation_has_error') )
                ATTR['form'].FormValidation.validate( contribution );
            }
          } else { input.parent().removeClass('active'); }

          if ( ATTR['contributionKeyup'] ) clearTimeout( ATTR['contributionKeyup'] );
          ATTR['contributionKeyup'] = setTimeout( function() {

            ATTR['form'].FormValidation.validate( input, true, true, null, true );
            var map  = ATTR['form'].FormValidation.getMap(), id = input.attr('id') || '_';
            var data = map[id] || {}, error = data['_error'] || [];
            if ( ! error.join('').match(/[a-z]/i) ) {
              verifyContribution( null, input.val() );



            }
          }, 300 );
        }
      },
      'afterValidationCallback' : function( input ) {
        verifyAfterValidationEvent( input, 'validation' );
        updateSummary();
      }      
    }
  }); 

  if ( ATTR['signature'] && ATTR['signature']['underline'] ) {
    ATTR['signature']['underline']['text'] = 
      _getSignatureUnderlineText( ATTR['signature']['underline']['text'] );
  }

  ATTR['signature']['endCallback'] = signatureEndHandler;
  ATTR['signature']['resize'] = ! isTouchDevice();
  ATTR['confirm'] = $('#signature').Signature(ATTR['signature']);  

  setTimeout( function() { 
    $('input[name="contribution"]').last().prop('checked',false);
    verifyContribution(); 
    verifyAfterValidationEvent( $('input[name="phone"]'),'start' );

    var token = ATTR['token'], out = [
      '<tr><td>Verver:</td><td>'+(token['id'] || token['user'])+'</td></tr>',
      '<tr><td>Lokasjon:</td><td>'+(token['location'] || '')+'</td></tr>',
      '<tr><td>Barn:</td><td>'+(token['child'] || '')+'</td></tr>',
    ];
    ATTR['personal'].html('<table id="personal_table">'+out.join('')+'</table>');
  }, 500 );  
}

function updateContributionCcenario( value, ignorScenario ) {
  var rule = ATTR['scenarioRule'], key = ATTR['scenarioKey'];
  if ( ATTR['scenarioTimer'] ) clearTimeout(ATTR['scenarioTimer']);
  if ( isNaN(value) ) return;

  if ( ! ATTR['contributionHolder'] ) ATTR['contributionHolder'] = [];
  ATTR['contributionHolder'].push(value);
  setTimeout( function() {
    value = (ATTR['contributionHolder'] || []).pop();
    ATTR['contributionHolder'] = null;
    if ( ! value ) return;

    ATTR['scenarioTimer'] = ignorScenario ? 0 : setTimeout( function() {
      verifyContribution( null, (value+''), true );
      updateSummary();
    }, 300 );

    ATTR['scenario'].removeClass( key.join(' ') );
    for ( var k in rule ) {
      if ( value >= rule[k][0] && value<rule[k][1] ) {
        return ATTR['scenario'].addClass( k );
      }
    }
  }, 20 );
}

/*
function updateContributionCcenario( value ) {
  var rule = ATTR['scenarioRule'], key = ATTR['scenarioKey'];
  if ( ATTR['scenarioTimer'] ) clearTimeout(ATTR['scenarioTimer']);
  if ( isNaN(value) ) return;

  setTimeout( function() {
    ATTR['scenarioTimer'] = setTimeout( function() {
      verifyContribution( null, (value+'') );
      updateSummary();
    }, 300 );

    ATTR['scenario'].removeClass( key.join(' ') );
    for ( var k in rule ) {
      if ( value >= rule[k][0] && value<rule[k][1] ) {
        return ATTR['scenario'].addClass( k );
      }
    }
  }, 20 );
}
*/

function verifyLogin() {
  //if ( ! ATTR['api']['authentication'] ) return false;
 
  var chd = ATTR['child'], lct = ATTR['location']; 
  var usr = ATTR['username'], pwd = ATTR['password'], btn = ATTR['loginBtn'];
  var msg = $('#login_msg').html(''), out = [], data = {
    'child'    : chd.prop('value') || '',
    'location' : lct.prop('value') || '',
    'username' : usr.prop('value') || '',
    'password' : pwd.prop('value') || ''
  };

  var success = ATTR['authentication'].FormValidation.isSuccess();
  $('#login_msg').html('');
  if ( ! success ) return false;

  if ( ! data['child'] )
    out.push( ATTR['language']=='en'? 'missing child' : 'barna mangler' );
  if ( ! data['location'] )
    out.push( ATTR['language']=='en'? 'missing location' : 'lokasjon mangler' );
  if ( ! data['username'] )
    out.push( ATTR['language']=='en'? 'missing username' : 'brukernavn mangler' );
  if ( ! data['password'] )
    out.push( ATTR['language']=='en'? 'missing password' : 'passord mangler' );

  if ( out.length ) {
    return msg.html( '<div>'+
      capitaliseFirstLetter(out.join((ATTR['language']=='en'? ' and ' :' og ')))+
    '</div>' );
  }

  lct.attr('disabled', 'true');
  usr.attr('disabled', 'true');
  pwd.attr('disabled', 'true');
  btn.attr('disabled', 'true');
  
  var verify = function(s) {
    lct.removeAttr('disabled');
    usr.removeAttr('disabled');
    pwd.removeAttr('disabled');
    btn.removeAttr('disabled');

    if ( ! s ) 
      msg.html( '<div>ERROR BACKEND</div>' );
    else {
      s = JSON.parse( s );
      if ( s['error'] || ! s['result'] )
        return msg.html( '<div>'+_convertServerMessage( s['message'] || s['error'] )+'</div>');
      ATTR['token'] = typeof(s['result'])==='string' ? 
        JSON.parse(s['result']) : s['result'];

      if ( ! ATTR['token']['location'] ) ATTR['token']['location'] = data['location'];
      if ( ! ATTR['token']['child']    ) ATTR['token']['child']    = data['child'];
      setStorageData( 'token', JSON.stringify(ATTR['token']) );
      setupUserAccount();
    }
  };

  var localCheck = function() {
    var out = data['password'] === ATTR['secret'] ? {
      'timestamp': (new Date()).getTime(),
      'result':{'id':data['username'],'key':data['username'] }
    } : {'error': 'error', 'message': 'Miss match'};
    verify( JSON.stringify(out) );
  };

  if ( ATTR['api']['authentication'] ) {
    try {
      //ATTR['loginAjax'] = $.ajax({'type':'POST','url':ATTR['api']['authentication'],'data':data,'success':function (s) {
      ATTR['loginAjax'] = $.ajax({
        'type':'POST','url':ATTR['api']['authentication']+'?getreddbarnatoken=1',
        'data': data, 'success':verify, 'error': localCheck
      });
    } catch( error ) {
      msg.html( '<div>'+_convertServerMessage( 'OFFLINE' )+'</div>');
    }
  } else { localCheck(); }
  return false;
}

function verifyContribution( current, force, ignorScenario ) {
  var value = force || '', other =  $('#other_contribution');
  if ( force ) {

  } else {
    if ( ! current ) {
      var all = $('input[name="contribution"]');
      current = all.filter(':checked'); 
      if ( ! current.size() ) current = all.eq(0).prop('checked',true);
    }
    value = (current.val() || '').replace(/[\D]+/g,'');
  }

  if ( ! force && ! value ) { value = other.val() || ''; }
  if ( ! value ) return;

  value = parseInt( (value||'').replace(/\s+/g,'') );

  if (  ! ignorScenario ) {
    updateContributionCcenario( value, true );
  }

  if ( ! ATTR['form'] ) 
    ATTR['form'] = ATTR['accordion'].AccordionMenu.getFormValidation();

  //var fixed = $('#fixed_excerpt').val( value ).blur(), limit = $('#amount_limit');

  var fixed = $('#fixed_excerpt'), limit = $('#amount_limit');
  if ( fixed.is('input') ) fixed.val( value ).blur();
  else {
    var text = ATTR['form'].FormValidation.splitText( value,'amount');
    fixed.html( text ); 
  }

  var rule  = ATTR['form'].FormValidation.getRule( limit, true );
  var map   = ATTR['form'].FormValidation.getMap(); 
  var data  = map['amount_limit'] || {}, interval = data['interval'];

  //debug('I: '+interval + '  V:'+value, rule );
  if ( rule['interval'][1]<value ) {
    data['interval'] = [value,value+1000];
    limit.val( value ).blur();
  } 
  else if ( rule['interval'][0]<value ) {
    data['interval'] = [value, rule['interval'][1]];
    limit.val( parseFloat(value*2) ).blur();
  }
  else {
    data['interval'] = rule['interval'];
  }

  if ( ATTR['acceptableLabel'] && ATTR['acceptText'] ) {
    setTimeout( function() {
      var text = ATTR['acceptText'], amount = fixed.is('input') ? 
        fixed.val() : fixed.text();
      if ( value >= 1000 ) {
        amount = '<span style="display:inline-block;overflow:hidden;width:1px">'+
          amount.replace(/\s+/g,'')+
        '</span>' + '<span aria-hidden="true">'+amount+'</span>';
      }
      ATTR['acceptableLabel'].html( text.replace( '==AMOUNT==', amount ) );
    }, 200 );
  }
}

function verifyAfterValidationEvent( input, mode ) {
  if ( ! input ) return;

  var phone = ATTR['reference']['phone'], auto = ATTR['reference']['auto'];
  var name = input.attr('name') || '', text = input.val() || '';

  if ( auto[name] && auto[name] != text ) {
    input.removeClass('auto_inserted');
    auto[name] = '';
  }

  //if ( name != 'phone' || mode !== 'keyup' ) return;
  if ( name != 'phone' ) return;

  if ( ! ATTR['form'] ) 
    ATTR['form'] = ATTR['accordion'].AccordionMenu.getFormValidation();

  var value = text.replace(/\s+/g,''), close = value.length<8;
  if ( ! close && mode === 'validation' ) return;

  if ( ! close ) {
    var map  = ATTR['form'].FormValidation.getMap(), id = input.attr('id') || '_';
    var data = map[id] || {}, error = data['_error'] || [];
    close = error.length && error.join('').match( /[a-z]/i);
  }

  var wrapper = ATTR['main'].find('.phonenumber_controller'); 
  var field   = wrapper.find('input');
  if ( close ) {
    ATTR['commentBtn'].addClass('disabled');
    wrapper.addClass('on_close').removeClass('on_search search_done');
    field.each( function(i,dom) {
      $(dom).attr('tabindex','-1').removeClass('auto_inserted');
    });
  }
  else {
    ATTR['commentBtn'].removeClass('disabled');
    wrapper.removeClass('on_close').addClass('on_search');
    field.filter('#email').removeAttr('tabindex');

    var render = function( src ) {
      phone[value] = src;  
      field.each( function(i,dom){
        var n = $(dom), name = n.attr('name'); 
        if ( isClickable(n) ) return;
        var v = name=='phone' || name=='email' ? n.val() : '';
        
        n.val( src[name] || v || '').removeAttr('tabindex');        
        if ( src[name] ) {
          n.addClass('auto_inserted');
          auto[name] = src[name];
        }

        if ( n.hasClass('form_validation_has_error') )
          ATTR['form'].FormValidation.validate( n, true, true );
        ATTR['form'].FormValidation.validateHasValue( n );

      });
      wrapper.removeClass('on_search').addClass('search_done');
    };
    phone[value] ? render(phone[value]) : getPersonData(render,value);
  }
}

function updateSummary() {
  if ( ! ATTR['summary'].size() ) return;

  if ( ATTR['updateSummaryTimer'] )
    clearTimeout( ATTR['updateSummaryTimer'] );

  var agreement = 'Vi har blitt engige om';

  ATTR['updateSummaryTimer'] = setTimeout( function() {
    var list = getSummaryList(), loop = list.length, out = [];
    for ( var i=0; i<loop; i++ ) {
      if ( ! list[i] ) continue;

      var temp = [list[i]['headline_']||''], row = list[i]['row'] || [];
      //debug( 'R: '+row.length );
      for ( var j=0; j<row.length; j++ ) {
        if ( ! row[j] ) continue;
        if ( row[j]['input_c'] && ! row[j]['input'].join('').match(/\w/) ) continue;

        if ( row[j]['label'][0] == agreement ) 
          agreement = '';
        else if ( agreement && row[j]['label'][0].match( /^\s+$/) ) {
           row[j]['label_'] = '<span class="as_label">'+agreement+'</span>';
           agreement = '';
        }
        
        temp.push(
          '<div class="form_row copy">'+
            '<div class="row_content label_wrapper">'+row[j]['label_']+'</div>'+
            '<div class="row_content input_wrapper">'+row[j]['input_']+'</div>'+
          '</div>'
        );
      }
      out.push('<li class="'+((list[i]['id']||'v') + '_summary')+'">'+temp.join('')+'</li>');
    }
    ATTR['summary'].html('<ul class="summary_list">'+out.join('')+'</ul>');
  }, 300 );
}

function getSummaryList() {
  var list  = [], grouping = [], i = 0; 
  var panel = ATTR['accordion'].AccordionMenu.getPanel();

  list[i] = {'headline': '','row':[],'pin':{}}, order = {}, sequence = [], other = [];

  $('.form_row:not(.copy)', panel ).each( function(j,r) {
    list[i]['row'][j] = {'label':[],'label_':'','input':[],'input_':''};

    var row = $(r), legend = false, v = '', u = '', t = '', s = '', g = '', o = 0, n = null;
    row.find('legend').each( function(k,d) {
      legend = true, n = $(d), v = n.attr('data-shortname') || n.text() || '';
      list[i]['row'][j]['label'].push( v );

      v = list[i]['row'][j]['label'].join(' ');
      list[i]['row'][j]['label_'] = '<span class="as_label">'+v+'</span>';

      if ( ! list[i]['pin'][v] ) list[i]['pin'][v] = [];
      list[i]['pin'][v].push( j );

      s = n.attr('data-separation') || '';
      if ( s ) list[i]['pin'][v+'_separation'] = s;

      if ( ! order[v] ) {
        o = n.attr('data-order') || '';
        order[v] = o ? parseFloat( o ) : 30;
      }
    });

    if ( ! legend ) {
      row.find('label').each( function(k,d) {
        n = $(d), v = n.attr('data-shortname') || n.text() || '';   
        list[i]['row'][j]['label'].push( v );

        v = list[i]['row'][j]['label'].join(' ');
        list[i]['row'][j]['label_'] = '<span class="as_label">'+v+'</span>';

        if ( ! list[i]['pin'][v] ) list[i]['pin'][v] = [];
        list[i]['pin'][v].push( j );

        s = n.attr('data-separation') || '';
        if ( s ) list[i]['pin'][v+'_separation'] = s;

        if ( ! order[v] ) {
          o = n.attr('data-order') || '';
          order[v] = o ? parseFloat( o ) : 30;    
        }
      });
    }

    row.find('input, .as_value').each( function(k,d) {
      n = $(d), v = (n.is('input') ? n.val() : n.text()) || ''; 
      if ( v=='_' ) v = '';

      u = n.attr('data-unit') || '', t = n.attr('data-text'); 
      g = n.attr('data-group') || '';
      if ( g ) {
        g = parseInt(g);
        if ( ! isNaN(g) ) grouping.push([g,i,j]);
      }

      if ( isClickable(n) ) {
        list[i]['row'][j]['input_c'] = true;
        if ( ! n.prop('checked') ) v = null;
        var ch = [n.attr('data-checked'),n.attr('data-unchecked')];
        if ( ch[0] || ch[1] ) {
          v = ' '; 
          t = (n.prop('checked') ? ch[0] : ch[1]) || '';
        }
      } else if ( n.attr('name') == 'name' ) {
        ATTR['giver_name'].text( capitaliseFirstLetter(v,true) );
      }

      if ( v === null  ) return;

      if ( ! v.replace(/\s+/g,'') && u ) { v = ''; }

      v = v+(u && v ? ' '+u : '');
      if ( v && t ) { v = t.replace( /==VALUE==/g, v); }

      list[i]['row'][j]['input'].push( v );
      list[i]['row'][j]['input_'] = 
        '<span class="as_value">'+list[i]['row'][j]['input'].join(' ')+'</span>';
    });
  });

  for ( var k in list[i]['pin'] ) {
    var loop = (list[i]['pin'][k] || []).length;
    if ( loop < 2 ) continue;

    var input = [], value = '';
    for ( var x=0; x<loop; x++ ) {
      value = trim( list[i]['row'][ list[i]['pin'][k][x] ]['input'].join(' '), true );
      if ( value ) input.push( value );
      if ( x ) list[i]['row'][ list[i]['pin'][k][x] ] = null;
    }

    s = list[i]['pin'][k+'_separation'] || ', ';
    list[i]['row'][ list[i]['pin'][k][0] ]['input']  = input;
    list[i]['row'][ list[i]['pin'][k][0] ]['input_'] =
      '<span class="as_value">'+input.join( s )+'</span>';
  }
  
  for ( var y=0; y<grouping.length; y++ ) {
    if ( 
      ! list[grouping[y][0]] || ! list[grouping[y][1]] || 
      ! list[grouping[y][1]]['row'][grouping[y][2]] 
    ) { continue; }
    list[grouping[y][0]]['row'].push( list[grouping[y][1]]['row'][grouping[y][2]] );
    list[grouping[y][1]]['row'][grouping[y][2]] = null;
  }

  for (var z=0; z<list[i]['row'].length; z++ ) {
    if ( ! list[i]['row'][z] ) continue;
    var value = list[i]['row'][z]['label'][0], index = order[value];
    if (index<0 || typeof(index) != 'number') continue;
    if ( index === 30 ) 
      other.push( list[i]['row'][z] );
    else
      sequence[index] = list[i]['row'][z];
  }

  //console.log( sequence );

  //list[i]['row'] = sequence;
  list[i]['row'] = sequence.concat( other );

  return list;
}


/*
function getSummaryList() {
  var list  = [], grouping = []; 
  var panel = ATTR['accordion'].AccordionMenu.getPanel();
  var tab   = ATTR['accordion'].AccordionMenu.getTab().each( function(i,t){
    var node = $(t), has = node.hasClass('no_summary');
    if ( has ) return;

    var head = node.find('h1,h2,h3').eq( 0 ), id = generateId( node );
    list[i] = {'headline' : head.text() || node.text(),'row':[],'pin':{}, 'id':id};

    panel.eq( i ).find('.form_row').each( function(j,r) {
      list[i]['row'][j] = {'label':[],'label_':'','input':[],'input_':''};

      var row = $(r), legend = false, v = '', u = '', t = '', s = '', g = '', n = null;
      row.find('legend').each( function(k,d) {
        legend = true, n = $(d), v = n.attr('data-shortname') || n.text() || '';
        list[i]['row'][j]['label'].push( v );
 
        v = list[i]['row'][j]['label'].join(' ');
        list[i]['row'][j]['label_'] = '<span class="as_label">'+v+'</span>';

        if ( ! list[i]['pin'][v] ) list[i]['pin'][v] = [];
        list[i]['pin'][v].push( j );

        s = n.attr('data-separation') || '';
        if ( s ) list[i]['pin'][v+'_separation'] = s;
      });

      if ( ! legend ) {
        row.find('label').each( function(k,d) {
          n = $(d), v = n.attr('data-shortname') || n.text() || '';
          list[i]['row'][j]['label'].push( v );
 
          v = list[i]['row'][j]['label'].join(' ');
          list[i]['row'][j]['label_'] = '<span class="as_label">'+v+'</span>';

          if ( ! list[i]['pin'][v] ) list[i]['pin'][v] = [];
          list[i]['pin'][v].push( j );

          s = n.attr('data-separation') || '';
          if ( s ) list[i]['pin'][v+'_separation'] = s;
        });
      }

      row.find('input, .as_value').each( function(k,d) {
        n = $(d), v = (n.is('input') ? n.val() : n.text()) || ''; 
        u = n.attr('data-unit') || '', t = n.attr('data-text'); 
        g = n.attr('data-group') || '';
        if ( g ) {
          g = parseInt(g);
          if ( ! isNaN(g) ) grouping.push([g,i,j]);
        }

        if ( isClickable(n) ) {
          if ( ! n.prop('checked') ) v = null;
          var ch = [n.attr('data-checked'),n.attr('data-unchecked')];
          if ( ch[0] || ch[1] ) {
            v = ' '; 
            t = (n.prop('checked') ? ch[0] : ch[1]) || '';
          }
        } else if ( n.attr('name') == 'name' ) {
          ATTR['giver_name'].text( capitaliseFirstLetter(v) );
        }

        if ( v === null  ) return;

        if ( ! v.replace(/\s+/g,'') && u ) { v = ''; }

        v = v+(u && v ? ' '+u : '');
        if ( v && t ) { v = t.replace( /==VALUE==/g, v); }

        list[i]['row'][j]['input'].push( v );
        list[i]['row'][j]['input_'] = 
          '<span class="as_value">'+list[i]['row'][j]['input'].join(' ')+'</span>';
      });
    });

    for ( var k in list[i]['pin'] ) {
      var loop = (list[i]['pin'][k] || []).length;
      if ( loop < 2 ) continue;

      var input = [], value = '';
      for ( var x=0; x<loop; x++ ) {
        value = trim( list[i]['row'][ list[i]['pin'][k][x] ]['input'].join(' '), true );
        if ( value ) input.push( value );
        if ( x ) list[i]['row'][ list[i]['pin'][k][x] ] = null;
      }

      s = list[i]['pin'][k+'_separation'] || ', ';
      list[i]['row'][ list[i]['pin'][k][0] ]['input']  = input;
      list[i]['row'][ list[i]['pin'][k][0] ]['input_'] =
        '<span class="as_value">'+input.join( s )+'</span>';
    }
  });
  
  for ( var y=0; y<grouping.length; y++ ) {
    if ( 
      ! list[grouping[y][0]] || ! list[grouping[y][1]] || 
      ! list[grouping[y][1]]['row'][grouping[y][2]] 
    ) { continue; }
    list[grouping[y][0]]['row'].push( list[grouping[y][1]]['row'][grouping[y][2]] );
    list[grouping[y][1]]['row'][grouping[y][2]] = null;
  }
  return list;
}
*/

function signatureEndHandler( force ) {
  var field = ATTR['signatureField'];
  if ( ! field.size() ) return;

  var empty = typeof(force)==='boolean' ? ! force : 
    ATTR['confirm'].Signature.isEmpty();
  //var text = empty ? '' : ATTR['confirm'].Signature.getSVG();
  var text = empty ? '' : ATTR['confirm'].Signature.getPNG();
  field.val( text ).keyup();
}

function confirmForm() {
  if ( ATTR['sendTimer'] ) clearTimeout( ATTR['sendTimer'] );
  ATTR['sendTimer'] = setTimeout( function() {
    if ( ! ATTR['form'] ) 
      ATTR['form'] = ATTR['accordion'].AccordionMenu.getFormValidation();

    var success = ATTR['form'].FormValidation.isSuccess();
    if ( ! success ) return;

    ATTR['body'].addClass('successed');
    ATTR['stepHolder'].hide();

    $('html, body').animate({ 'scrollTop':'0px' }, 20, function(){});
  }, 200 );
}


function sendForm( option ) {
  var success = ATTR['comment'].FormValidation.isSuccess();
  if ( ! success ) return false;

  ATTR['comment'].addClass('on_sending').find('input,textarea,button').each(function(i,dom) {
    $(dom).attr('disabled',true);
  });

  var note = ATTR['comment'].FormValidation.getFormData();
  if ( ! ATTR['form'] ) 
    ATTR['form'] = ATTR['accordion'].AccordionMenu.getFormValidation();

  success = ATTR['form'].FormValidation.isSuccess();
  if ( ! success ) return;
  var data = ATTR['form'].FormValidation.getFormData();

  if ( data['other_contribution'] ) 
    data['contribution'] = data['other_contribution'];

  try { 
    data['other_contribution'] = null;
    delete(data['other_contribution']); 
  } catch ( error ) {}

  data['date'] = (new Date()).getTime();
  data['id']   = ATTR['token']['id']+'_'+data['date'];
  data['kid']  = ATTR['kid'] || '';
  data['user'] = ATTR['token']['id'];
  data['location'] = ATTR['token']['location'] || '';
  data['child']    = ATTR['token']['child']    || '';

  for ( var k in note ) data[k] = note[k];

  //console.log( data );
  updateStorage( [data] );
  sendToServer( [data], function() { // send and reload 
    setTimeout( function() { window.location.reload(); }, 1000 );
  });
  return false;
}


function sendToServer( list, callback ) {
  if ( ! ATTR['api']['receiver'] || ! list || ! list.length )
    return typeof(callback) == 'function' ? callback() : null;

  var tmp = [], loop = list.length, ids = [];
  for ( var i=0; i<loop; i++ ) {
    tmp.push({'id':list[i]['id']});
    ids.push('#view_'+list[i]['id']);
  }
  //list = tmp;

  var item = $( ids.join(',') ).addClass('on_sending'), recall = function( out ) {
    item.removeClass('on_sending');
    return typeof(callback)=='function' ? callback( out ) : null;
  };

  var verify = function( s ) {
    var src = s ? JSON.parse(s) : {}, out = src['result'] || [];
    return out.length ? updateStorage( out, true, function() {
      recall( out );
    }) : recall();
  };

  if ( ATTR['offline'] )
    return setTimeout( function() { recall(); }, 2000 );

  try {
    var data = {'insertgiver': convertToHtmlEntity(JSON.stringify(list)) };
    //var data = {'insertgiver': JSON.stringify(list) };
    $.ajax({
      'type':'POST','url':ATTR['api']['receiver'],'data':data,
      'success':verify,'error': function() { verify(); }
    });
  } catch ( error ) { recall(); }
}

/******************************************************************************
=== STORAGE FUCNTION ===
******************************************************************************/
function initializeAppCacheEvent() {
  var appCache = window.applicationCache;
  if ( !  appCache ) return;

  //ATTR['firstCache'] = ! readCookie(ATTR['cookie']+'firstCache'); 
  //createCookie(ATTR['cookie']+'firstCache', '1', 365);

  // Fired after the first cache of the manifest.
  appCache.addEventListener('cached', handleCacheEvent, false);

  // Checking for an update. Always the first event fired in the sequence.
  appCache.addEventListener('checking', handleCacheEvent, false);

  // An update was found. The browser is fetching resources.
  appCache.addEventListener('downloading', handleCacheEvent, false);

  // The manifest returns 404 or 410, the download failed,
  // or the manifest changed while the download was in progress.
  appCache.addEventListener('error', handleCacheEvent, false);

  // Fired after the first download of the manifest.
  appCache.addEventListener('noupdate', handleCacheEvent, false);

  // Fired if the manifest file returns a 404 or 410.
  // This results in the application cache being deleted.
  appCache.addEventListener('obsolete', handleCacheEvent, false);

  // Fired for each resource listed in the manifest as it is being fetched.
  appCache.addEventListener('progress', handleCacheEvent, false);

  // Fired when the manifest resources have been newly redownloaded.
  appCache.addEventListener('updateready', handleCacheEvent, false);
}

function updateOrientation() {
  var orientation = window.orientation, type = ['landscape','portrait']; 
  var index = orientation===90 || orientation===-90 ? 0 : 1;
  ATTR['body'].removeClass( type.join(' ') );
  ATTR['body'].addClass( type[index] );  
};

function handleCacheEvent( e ) {
  var type = e.type;
  if ( type == 'updateready' && ! ATTR['firstCache'] ) {
    window.location.reload();
  }
  //if ( type=='updateready' || type=='noupdate' || type=='downloading' || type=='error')
  //debug( 'Cache '+type );
}

function initializeOpenDatabase() {
  try { // http://www.tutorialspoint.com/html5/html5_web_sql.htm
    ATTR['database'] = openDatabase(ATTR['cookie'], '1.0', 'ReddBarnaVerveDatabase', 50*1024*1024);
    ATTR['database'].transaction(function (tx) {
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

  if ( ATTR['database'] ) {
    return ATTR['database'].transaction(function (tx) {
      tx.executeSql('SELECT * FROM LOGS WHERE id = ?', [key], function (tx, results) {
        text = results.rows.length ? decodeURI( results.rows.item(0).log ) : '';
        if ( text ) text = decodeLZW( text ) || '';
        //if ( typeof(callback)=='function' ) callback( text );
        render();
      }, null );
    });
  }

  if ( ATTR['storage'] ) text = decodeLZW(ATTR['storage'][key]) || '';
  render();
  //if ( typeof(callback)=='function' ) callback( text );
}

function setStorageData( key, text ) { 
  if ( ATTR['database'] ) {
    text = text ? encodeURI( encodeLZW(text) ) : '';
    ATTR['database'].transaction(function(tx) {
      tx.executeSql('DELETE FROM LOGS WHERE id = ?', [key], function(){
        tx.executeSql('INSERT INTO LOGS (id, log) VALUES ("'+key+'", "'+text+'")');
      });
    });
  } else if ( ATTR['storage'] ) { ATTR['storage'][key] = encodeLZW(text||''); }
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
    {'type':'class','what':'goto_adding_comment',   'handler':clickOnCommentBtn        },      
    {'type':'id',   'what':'comment_btn',           'handler':clickOnCommentBtn        },      
    {'type':'class','what':'summary_edit',          'handler':clickOnSummaryEdit       },
    {'type':'class','what':'info_btn',              'handler':clickOnInfoBtn           },      
    {'type':'class','what':'backToStart',           'handler':clickOnBackToStart       },      
    {'type':'class','what':'signature_save_btn',    'handler':clickOnSignatureSaveBtn  },      
    {'type':'class','what':'signature_clear_btn',   'handler':clickOnSignatureClearBtn },
    {'type':'class','what':'send_refer_btn',        'handler':clickOnSendReferBtn      },
    {'type':'class','what':'resend_refer_list',     'handler':clickOnResendReferList   },
    {'type':'class','what':'poster',                'handler':clickOnPoster            },
    {'type':'id',   'what':'customer_overview',     'handler':clickOnCustomerOverview  },
    {'type':'id',   'what':'overview_close_btn',    'handler':clickOnCustomerOverview  },
    {'type':'id',   'what':'username_holder',       'handler':clickOnUsernameHolder    },
    {'type':'id',   'what':'logout_btn',            'handler':clickOnLogoutBtn         }
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

function clickOnCommentBtn( data ) {

  var mode ='adding_comment', on = ATTR['body'].hasClass( mode );
  if ( on ) {
    ATTR['body'].removeClass( mode );
    if ( ATTR['on_overview'] ) {
      ATTR['on_overview'] = false;
      ATTR['body'].addClass('on_overview');
      ATTR['overviewHolder'].show();
    }
  } else {
    ATTR['on_overview'] = ATTR['body'].hasClass('on_overview');
    if ( ATTR['on_overview'] ) {
      ATTR['body'].removeClass('on_overview');       
      ATTR['overviewHolder'].hide();
    }
    ATTR['body'].addClass( mode );
  }

  $('html, body').animate({ 'scrollTop':'0px' }, 20, function(){});
}

/**
 */
function clickOnPoster( data ) {
  updatePostSelection( data['current'] );
  $('html, body').animate({ 'scrollTop':'0px' }, 20, function(){});
}

/**
 */
function clickOnSendReferBtn( data ) {
  var current = data['current'], rule = getRule( current );
  if ( ! rule['id'] ) return;
  current.blur();

  var tmp = [], list = ATTR['referList'] || [], loop =list.length;
  for ( var i=0; i<loop; i++ ) {
    if ( list[i]['id'] == rule['id'] ) {
      tmp.push( list[i] );
      i = loop;
    }
  }
  sendToServer( tmp );
}

/**
 */
function clickOnCustomerOverview( data ) {
  //var mode = 'on_overview', on = ATTR['body'].hasClass( mode );
  //if ( on ) return ATTR['body'].removeClass( mode );
  //ATTR['body'].addClass(mode);
  
  var mode = 'on_overview', on = ATTR['overviewHolder'].prop( 'clientWidth' );
  if ( on ) {
    ATTR['body'].removeClass(mode);
    if ( ATTR['adding_comment'] ) { 
      ATTR['body'].addClass( 'adding_comment' );
      ATTR['adding_comment'] = false;
    }
    return setupUserAccount( true );
  }
  
  ATTR['adding_comment'] = ATTR['body'].hasClass('adding_comment');
  if ( ATTR['adding_comment'] ) ATTR['body'].removeClass( 'adding_comment' );

  ATTR['body'].addClass(mode);
  ATTR['stepHolder'].hide();
  ATTR['overviewHolder'].show();
  $('#overview_holder_content').html( getOverviewList() );
}

/**
 */
function clickOnUsernameHolder( data ) {
  var current = data['current'], mode = 'show_account_tool';
  var parent  = current.closest('#user_account_tool');
  if ( ! parent.size() ) return;

  if ( ! parent.hasClass(mode) ) {
    data.parent = parent.addClass(mode);
    data.rm     = mode;
    return 1;
  } 

  parent.removeClass( mode );
  return;
}

/**
 */
function clickOnResendReferList( data ) {
  var current = data['current'], parent = current.parent();
  if ( current.hasClass('no_btn') )
    return clickOnLogoutBtn( data, true );

  var btn = parent.find('.button,button')
    .attr('disabled','true').addClass('disabled');

  ATTR['lightbox'].addClass('on_sending');
  sendToServer( ATTR['referList'], function() {
    ATTR['lightbox'].removeClass('on_sending');  
    var list = ATTR['referList'] || [];
    if ( list.length ) {
      ATTR['lightbox'].find('.error_msg').remove();
      $('<div class="error_msg">'+ _convertServerMessage('RETRYSENDING')+'</div>')
        .insertBefore( parent );
      btn.removeAttr('disabled').removeClass('disabled');
    } else {
      clickOnLogoutBtn( data, true );
    }
  });
}

/**
 */
function clickOnLogoutBtn( data, forceLogout ) {
  var exist = ATTR['referList'] || [];
  if ( exist.length && ! forceLogout ) {
    displayLighbox(
      '<div>' + 
        _convertServerMessage('SENDREFER') +
        '<div>' +
          '<a href="#" roll="button" class="button resend_refer_list yes_btn">'+ _getLable('yes') +'</a>'+
          '<a href="#" roll="button" class="button resend_refer_list no_btn">'+ _getLable('no') +'</a>'+
        '</div>'+
      '</div>'
    );
  }
  else {
    setStorageData( 'token', '');
    setTimeout( function(){ window.location.reload(); }, 100 );
  }
}

/**
 */
function clickOnBackToStart( data ) {
  window.location.reload(); 
} 

/**
 */
function clickOnInfoBtn( data ) {
  var row = data['current'].closest('.form_row');
  if ( ! row.size() ) return;
  row.toggleClass('show_information');
}

/**
 */
function clickOnSummaryEdit( data ) {
  var current = data['current'], href = current.attr('href'), step = $( href );
  if ( ! step.size() ) return;
  ATTR['accordion'].AccordionMenu.expandTab( step );
}

/**
 */
function clickOnSignatureClearBtn( data ) {
  if ( ! ATTR['confirm'] ) return;
  ATTR['confirm'].Signature.clear();
  signatureEndHandler( false );
}

/**
 */
function clickOnSignatureSaveBtn( data ) {
  if ( ! ATTR['confirm'] ) return;
  var svg = data['current'].hasClass('png') ? 
    ATTR['confirm'].Signature.getPNG() :
    ATTR['confirm'].Signature.getSVG();
    
  $('#svg_displayer').html( '<textarea>'+svg+'</textarea>' );

  //var png = ATTR['confirm'].Signature.getPNG();
  //window.open( png );

  //var pdf = new jsPDF(), jpeg = ATTR['confirm'].Signature.getJPEG();
  //pdf.addImage( jpeg, 'JPEG', 0, 0);
  //pdf.save("kiet.pdf");
}

/******************************************************************************
=== FUCNTION ===
******************************************************************************/
/**
 */
function displayLighbox( text ) {
  if ( ! ATTR['lightbox'].size() || ! text ) return;
  ATTR['lightbox'].html( text ).show();
}

/**
 */
function getOverviewList() {
  var list  = ATTR['referList'] || [], loop = list.length;
  var out   = [], tmp = [], n = '', v = '', d = '', i = 0, j = 0, id = '', text = '';
  var order = ATTR['overview'] || ['date','name','phone','email'], length = order.length;

  for ( i=0; i<loop; i++ ) {
    if ( ! list[i] ) continue;
    tmp = [], id  = list[i]['id'];
    for ( j=0; j<length; j++ ) {
      n = order[j], v = list[i][n] || '&nbsp;';
      if ( n=='date' && v ) {
        d = new Date( parseInt(v) );
        v = convertDate2Text( d,' ',true,ATTR['month'] ) || '';
      }
      tmp.push('<td class="'+n+'">'+v+'</td>');
    }
    if ( tmp.length ) {
      tmp.push(
        '<td class="action">'+
          '<a href="#" class="icon_btn send send_refer_btn" data-rule="{\'id\':\''+id+'\'}">'+_getLable('send')+'</a>'+
        '</td>'
      );
      out.push('<tr id="view_'+id+'">'+tmp.join('')+'</tr>');
    }
  }

  if ( out.length ) {
    tmp = [];
    for ( i=0; i<length; i++ )
      tmp.push('<th class="'+order[i]+'">'+_getLable(order[i])+'</th>');
    tmp.push('<th class="action">'+_getLable('action')+'</th>');
    out.unshift('<tr>'+tmp.join('')+'</tr>');
    text = '<table>'+out.join('')+'</table>';
  } else {
    text = '<span class="empty">'+_getLable('empty')+'</span>';
  }
  return text;
}

/**
 */
function getPersonData( callback, phone ) {
  var data = {}, url = ATTR['api']['searchphone'];
  if ( ! phone || ! url ) { 
    if ( typeof(callback)=='function' ) callback(data);
  }

  if ( ATTR['personAjaxTimer'] ) clearTimeout( ATTR['personAjaxTimer'] );
  if ( ATTR['personAjax']      ) ATTR['personAjax'].abort();
  //if ( ATTR['kidAjax']         ) ATTR['kidAjax'].abort();

  var recall = function( out ) {
    if ( ATTR['personAjaxTimer']      ) clearTimeout( ATTR['personAjaxTimer'] );
    if ( ATTR['personAjax']           ) ATTR['personAjax'].abort();
    if ( typeof(callback)=='function' ) callback( out || {} );
  };

  if ( typeof(ATTR['personAjaxWait']) == 'number' )
    ATTR['personAjaxTimer'] = setTimeout( function() { recall(); }, ATTR['personAjaxWait'] );
  
  var verify = function( result ) {
    data = JSON.parse( result||'{}' )['result'] || {};
    recall( data );
  };

  /*
  var count = 1, verifyKid = function( result ) {
    if ( ! result && count ) {
      count = 0, ATTR['kidAjax'] = $.ajax({
        'url':url,'timeout':6000,'data':'getkid='+phone,'success':verifyKid,'error':function() { verifyKid(); }
      });
    } else {
      ATTR['kid'] = JSON.parse( result||'{}' )['result'] || '';
    }
  };
  */

  try {
    ATTR['personAjax'] = $.ajax({
      'url':url,'timeout':6000,'data':'searchphonebisnode='+phone+'&type=public','success':verify,'error':function() { verify(); }
    });
    /*
    ATTR['personAjax'] = $.ajax({
      'url':url,'timeout':6000,'data':'searchphone='+phone,'success':verify,'error':function() { verify(); }
    });
    */
    //ATTR['kidAjax'] = $.ajax({
    //  'url':url,'timeout':6000,'data':'getkid='+phone,'success':verifyKid,'error':function() { verifyKid(); }
    //});
  } catch ( error ) { recall(); }
}

/*
function getPersonData( callback, phone ) {
  var data = {}, url = ATTR['api']['searchphone'];
  if ( ! phone || ! url ) { 
    if ( typeof(callback)=='function' ) callback(data);
  }

  $.ajax({'url':url,'data':'searchphone='+phone,'success': function( result ) {
    try { data = JSON.parse( result||'{}' )['result']; } catch( error ) {};
    if ( typeof(callback)=='function' ) callback(data || {});    
  } });
}
*/


/******************************************************************************
=== INTERNAL ===
******************************************************************************/
function _getLable( key ) {
  var language = ATTR['language'] || 'nb', label = ATTR['label'] || {};
  return key && label[key] ? (label[key][language] || key) : key
}


function _convertServerMessage( key ) {
  var language = ATTR['language'] || 'nb', msg = ATTR['serverMessage'] || {};
  return key && msg[key] ? (msg[key][language] || key) : key
}

function _getSignatureUnderlineText( text ) {
  var date  = convertDate2Text( new Date(),' ',true,ATTR['month'] ) || '';
  var place = (ATTR['token'] ? ATTR['token']['location']  : ATTR['place']) || 'Oslo';
  return (text||'').replace('==PLACE==',place).replace( '==DATE==',date); 
}

