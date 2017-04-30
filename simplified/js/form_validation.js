/****
 * 
 * The plugin allows to integrate a customizable, 
 * Browser Support Details
 *   - FireFox 5.0+
 *   - Safari 5.0+
 *   - Chrome 19.0+
 *   - Internet Explorer 7+
 *   - Android 2.3+ 
 *   - Opera 12.0+
 *   - iOS Safari 4.0+
 */
;(function($) { $.fn.FormValidation = function ( config ) {
  /****************************************************************************
    === CONFIGURATION OPTION === 
  ****************************************************************************/
  if ( ! config ) { config = {}; }

    // 1 === live validation on blur 
    // 2 === live validation on keyup, 
    // 3 === live validation on blur, ignor aria-alert until focus again 
    // Live validation ignor required until submit is call.

  var opt = {
    'main'     : this,
    'success'  : config.success  || null,
    'language' : config.language || 'nb',
    'live'     : typeof(config.live)==='undefined' ? 3 : config.live,
    'animation': typeof(config.animation)==='undefined' ? true : config.animation,
    'map'      : {},
    'timer'    : {},
    'afterKeyup'          : config.afterKeyupCallback,  
    'beforeValidation'    : config.beforeValidationCallback,  
    'afterValidation'     : config.afterValidationCallback,  
    'beforeSubmitCallback': config.beforeSubmitCallback,
    'submitCallback'      : config.submitCallback,
    'changeCallback'      : config.changeCallback,  
    'summaryError'        : config.summaryError,
    'errorInsertBefore'   : config.errorInsertBefore || false,
    'parent_target'       : config.parentTarget      || '',
    'no_error_remove_summary_error_smg' : config.noErrorRemoveSummaryErrorMSG || false,
    'method'   : [
      'required','minlength','maxlength','email','url','number','digit',
      'date','day','month','year','amount','telephone','mobile',
      'postnumber','creditcardnumber','atleastoption','parent_target',
      'tab_target_class','personnumber','interval','text','accountnumber',
      'phoneprefix','kidormsg', 'creditcardexpiration', 'repeatpassword'
    ],
    'validation_error_message' : config.validationErrorMSG || {},
    'selector' : ':text, [type="password"], [type="file"], select, textarea, ' +
      '[type="number"], [type="search"] ,[type="tel"], [type="url"], ' +
      '[type="email"], [type="datetime"], [type="date"], [type="month"], ' +
      '[type="week"], [type="time"], [type="datetime-local"], [type="hidden"],' +
      '[type="range"], [type="color"], [type="radio"], [type="checkbox"]',

    /* jshint ignore:start */
    'validation_rule' : {
      'email' : /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      'url'   : /^(https?|s?ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i,
      'date'  : /^(0?[1-9]|[12][0-9]|3[01])([\/\-\.])(0?[1-9]|1[012])([\/\-\.])(\d{4})$/, // DD.MM.YYYY
      //'number': /^(\-|\+)?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/,
      'number': /^(\-|\+)?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:(\.|\,)\d+)?$/,
      'phonenumber'  : /^\+?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/,
      'postnumber'   : /^\d{4}$/,
      'personnumber' : /^\d{6}(\s+)?\d{5}$/,
      'accountnumber': /^\d{4}(\s+)?\d{2}(\s+)?\d{5}$/,
      'contrycode'   : /^\+\d{2,3}|00(\s)?\+\d{2,3}/,
      'monthCountDay': [0,31,28,31,30,31,30,31,31,30,31,30,31],
      'monthName'    : ['','january','february','march','april','may','june','july','august','september','october','november','desember'],
      'creditcardnumber': /^\d{4}\s\d{4}\s\d{4}\s\d{4}$/,
      'creditcardexpiration': /^(\d{2})\/(\d{2})$/
    },
    /* jshint ignore:end */
    'validation_error': config.validationErrorSTD || {}
  };

  var helper = {
    /*************************************************************************
    === Initialization ===
    **************************************************************************/
    init : function() {
      helper.bindInput();
      opt.form = opt.main.get(0).nodeName.toLowerCase() === 'form' ? 
        opt.main : opt.main.find('form').eq(0);

      helper._generateId( opt.main );

      opt.form.on('submit',helper._submit)
        .on( 'keydown', helper._formKeydown)
        .on( 'reset', function() { helper.removeError(); });
    },

    /*************************************************************************
    === PUBLIC FUNCTIOn ===
    **************************************************************************/
    insertSummaryError( text ) {
      var first = opt.main.children().eq(0);
      if ( first.hasClass('summary') ) {
        first.remove();
        first = opt.main.children().eq(0);
      }

      return $('<div class="form-row -summary-error" role="alert">'+text+'</div>')
        .insertBefore( first );
    },

    getMap : function () { return opt.map; },

    getRule : function ( input, ignorMap ) { 
      return helper._getRule( input, ignorMap );
    },

    getFormData : function () {
      var data = {};
      opt.all.each(function (i,d) {
        var node = $(d), name = node.prop('name'), value = node.prop('value');
        if ( helper.isCheckable(node) ) {
          var checked = node.prop('checked');
          if ( ! checked && helper.isRadio(node) ) { return; }
          value = checked ? (value || checked) : '';
        } 

        if ( typeof(data[name])!=='undefined' ) {
          if ( data[name] instanceof Array ) { 
            data[name].push( value );
          } else { 
            data[name] = [data[name],value];
          }
        } else { data[name] = value; }
      });
      return data;
    },

    isSuccess : function () {
      var all = opt.all, loop = all.size(), depending = 'depending_on_target';
      for ( var i=0; i<loop; i++ ) {
        var node  = all.eq(i), id = node.attr('id'), rule = opt.map[id] || {};        
        var error = rule[depending]  && helper._verifyDependingOnTarget(
          rule[depending], node
        ) ? [] : (helper.getError( node ) || []);
        if ( error.length ) { return false; }
      }
      return true;
      //return opt.main.find('.form-validation-error').size() === 0;
    },    

    getError : function( input ) {
      var node = $(input), id = node.attr('id'); 
      var rule = opt.map[id] || {}, list = [], pt = 'parent_target';
      if ( rule[pt] && opt.map._parent ) {
        var parent = opt.map._node[id] || 
          helper._getParentTarget(node,rule[pt]);
        if ( parent ) {

          var pId = parent.size() ? parent.attr('id') : '';
          var cnt =  opt.map._parent[pId] || [], pin = {};
          for ( var i=0; i<cnt.length; i++ ) {
            var nId = cnt[i].attr('id');
            var msg = opt.map[nId] ? (opt.map[nId]._error || []) : [];
            for ( var j=0; j<msg.length; j++ ) {
              if ( ! pin[msg[j]] ) {
                pin[msg[j]] = true;
                list.push(msg[j]);
              }
            }
          } 
        }
      }
      return list.length ? list : (rule ? rule._error || [] : []); 
    },

    showError : function( input, ignorAriaAlert ) {
      (input ? $(input) :  opt.all).each( function(i,dom) {                
        var node = $(dom), id = node.attr('id'), error = helper.getError(node);

        var not = ':not(.animation)';
        var pin = 'error_for_'+id, target = helper._getErrorInsertTarget( node );
        var animation = opt.animation && ! target.parent().find('#'+pin+not).size(); 

        if ( animation ) {
          animation = ! target.next('.form-validation-error'+not).size();
          if ( animation ) { 
            animation = ! target.prev('.form-validation-error'+not).size();
          }          
        }

        helper.removeError( node, error.length );
        if ( ! error.length ) { return; }

        var type  = 'form-validation-error'+( animation ? ' animation' : '');
        var aAlert = ignorAriaAlert ? '' : ' role="alert"', message = 
          '<div id="'+pin+'" class="'+type+'"'+aAlert+'>'+
            '<span>'+error.join('</span><span>') +'</span>'+
          '</div>';

        var next = target.next('.input_placeholder,label');
        if ( ! next.size() ) { next = null; }

        var msg  = opt.errorInsertBefore ? $(message).insertBefore(target) :
        $(message).insertAfter(next ? next : target);  

        if ( animation ) { 
          setTimeout( function(){ msg.removeClass('animation'); },15);
        }

        target.addClass('-has-error');
        node.addClass('-has-error');
      });
    },

    removeError : function( input, reInsert ) {
      (input ? $(input) :  opt.all).each( function(i,dom) {
        var node = $(dom), target = helper._getErrorInsertTarget( node ); 
        var mode = 'form-validation-error';

        var next = target.next('.input_placeholder,label');
        if ( ! next.size() ) { next = null; }

        var error = opt.errorInsertBefore ? target.previous('.'+mode) : 
        (next ? next.next('.'+mode) : target.next('.'+mode));
        
        if ( error.size() ) {
          var duration = ! reInsert && opt.animation ? helper.getDuration(error) : 0;
          if ( duration ) {
            error.addClass( 'animation' );
            setTimeout( function() { error.remove(); }, duration );
          } else { error.remove(); }
        }
        
        target.removeClass('-has-error');

        if ( reInsert ) { return; }

        node.removeClass('-has-error');

        var rule = helper._getRule( node ) || {}, name = node.attr('name');
        if ( ! rule.atleastoption && helper.isRadio(node) && name ) {
          clearTimeout( opt.timer[name+'_remove'] || 0 );
          opt.timer[name+'_remove'] = setTimeout( function() {
            var e = [], all = helper._getInputByName( name ).each( function(i,d) {
              var n = $(d), id = n.attr('id');
              if ( (opt.map[id]._error || []).length ) { 
                e.push( opt.map[id] );
              }
            });
            if ( ! e.length ) { 
              all.removeClass( '-has-error' );
            }
          }, 20 );
        }
      });
    },

    resetForm : function() {
      helper.removeError();
      opt.all.each(function (i, d) {
        var node = $(d);
        if ( helper.isCheckable(node) ) { 
          node.removeAttr('checked');
        } else { 
          node.val('').trigger('reset');
        }
      });

      opt.main.find('> .-summary-error').remove();
    },

    validate : function( input, ignorRequired, ignorAriaAlert, mode, onlyValidate ) {
      var current = input ? $(input) : opt.all, answer  = onlyValidate ? null :
        helper._beforeValidate( current, ignorRequired, ignorAriaAlert, mode );
      if ( answer === false ) { return; }

      current.each( function(x,dom) {

        var node = $(dom), id = node.attr('id'), rule = opt.map[id] || {}; 
        var msg  = '', pt = 'parent_target';
        rule._error = [];

        var error = [], i = 0, j = 0;
        for ( i=0; i<opt.method.length; i++ ) {
          var what = opt.method[i]; 

          if ( ignorRequired && what === 'required' )       { continue; }
          if ( mode === 'blur' && what === 'atleastoption' ) { continue; }

          var method = '_verify'+helper._capitaliseFirstLetter(what);
          if ( typeof(rule[what]) === 'undefined' || typeof(helper[method]) !== 'function' ) {  
            continue;
          }

          var depending = 'depending_on_target';
          msg = rule[depending] && helper._verifyDependingOnTarget(
            rule[depending], node
          ) ? '' : helper[method]( node, rule[what] );
          var test = what.match( /^atleastoption|day|month|year$/ ); 

          if ( msg && mode === 'blur' && (opt.live===1||opt.live===3) && test ) {
            var list = ( what === 'atleastoption' ?  
              helper._getAtLeastOption( node ) : helper._getDateOptionElements( node )
            ) || []; 

            var loop = list.length;
            for ( j=0; j<loop; j++ ) {
              if ( list[j].hasClass('form-validation-on-focus') ) {
                msg = ''; j = loop;
              }
            }
          }
          if ( msg ) { error.push( msg ); }
        }

        //if ( rule.atleastoption || (node.attr('type') || '').match(/radio/i) ) {
        if ( rule.atleastoption || helper.isRadio(node) ) {
          var parent = helper._getParentTarget( node, rule[pt], node );
          var same   = opt.map._parent[parent.attr('id') || ''] || []; 
          var l = same.length, f = null, r = {}, c = 0;

          if ( helper.isRadio(node) ) {
            if ( helper._hasError(node,parent) && ! error.join('') ) {
              for ( j=0; j<l; j++ ) {
                r = opt.map[same[j].attr('id') || ''] || {};
                r._error = error;
              }
            }
          }
          else if ( (same[l-1] && id === same[l-1].attr('id')) || current.size() === 1 ) {
            rule._error = error;

            if ( rule.atleastoption ) {
              for ( j=0; j<l; j++ ) {
                r = opt.map[same[j].attr('id') || ''] || {};
                if ( (r._error || []).length ) { 
                  f = r._error; c += 1;
                }
              }
              if ( c >= rule.atleastoption ) { 
                msg = helper.getErrorMessage( 
                  'at_least_option_not_meet_requirement', rule.atleastoption, node 
                );
                var txt = f.join(' ').replace( msg, '');
                if ( ! txt.replace( /\s+/, '') ) { 
                  f = null;
                }
              }
            }
            for ( j=0; j<l; j++ ) {
              r = opt.map[same[j].attr('id') || ''] || {};
              r._error = f || error;
            }
          }
        }

        rule._error = error;

        if ( ! onlyValidate ) helper.showError( input, ignorAriaAlert );
      });

      if ( ! onlyValidate ) 
        helper._afterValidate( current, ignorRequired, ignorAriaAlert, mode );
    },

    validateHasValue : function( node, parent ) {
      if ( ! node || ! node.size() ) { return; }
      opt.main.find('> .-summary-error').remove();

      var target = parent || helper._getErrorInsertTarget( node );
      if ( node.prop('value') ) { 
        node.addClass('form-validation-has-value');
        target.addClass('form-validation-has-value');
      } else { 
        node.removeClass('form-validation-has-value');   
        target.removeClass('form-validation-has-value');   
      }    
    },

    bindInput: function () {
      opt.all = opt.main.find( opt.selector ).each( function(i,dom) {
        var node = $(dom), rule = helper._getRule( node );
        if ( ! rule ) { return; }

        var id = helper._generateId(node), target = helper._getErrorInsertTarget( node );
        opt.map[ id ] = rule;

        if ( typeof(rule.required) !== 'undefined' ) { 
          node.attr('aria-required','true');
        }
        if ( typeof(rule.amount) !== 'undefined' ) { 
          helper._verifyAmount( node, null, false );
        }
        if ( typeof(rule.telephone) !== 'undefined' ) { 
          helper._verifyTelephone( node, null, true );
        }
        if ( typeof(rule.mobile) !== 'undefined' ) { 
          helper._verifyMobile( node, null, true );
        }
        if ( typeof(rule.creditcardnumber) !== 'undefined' ) { 
          helper._verifyCreditcardnumber( node, null, true );
        }
        if ( typeof(rule.creditcardexpiration) !== 'undefined' ) { 
          helper._verifyCreditcardexpiration( node, null, true );
        }
        if ( typeof(rule.personnumber) !== 'undefined' ) { 
          helper._verifyPersonnumber( node, null, true );
        }
        if ( typeof(rule.accountnumber) !== 'undefined' ) { 
          helper._verifyAccountnumber( node, null, true );
        }
        if ( typeof(rule.date) !== 'undefined' ) { 
          helper._verifyDate( node, null, true );
        }
        if ( typeof(rule.repeatpassword) !== 'undefined' ) { 
          helper._verifyRepeatpassword( node, null, true );
        }

        if ( helper.isClickable(node) ) {
          node.off( 'click', helper._click );
          node.on( 'click', helper._click );

          if ( typeof(opt.changeCallback)==='function' ) { 
            node.on('change', opt.changeCallback );
          }

          if ( ! node.hasClass('view_yes_no_btn') ) { 
            setTimeout( function() { helper._verifyTab( node, true ); }, 100 );
          }
        }
        else {
          helper.validateHasValue( node, target );
          var next = node.next( '.input_placeholder,label' );
          if ( next.size() && ! next.attr('aria-hidden') ) { 
            node.attr('aria-describedby', helper._generateId(next) );
          }

          if ( typeof(rule.clearbtn) !== 'undefined' ) { 
            opt.map._clearbtn[id] = target.find('#'+id+'_clearbtn');
            if ( ! opt.map._clearbtn[id].size() ) {
              var type = 'form-validation-clearbtn icon_btn close', label = $('label[for="'+id+'"]');
              var text = (opt.language == 'en' ? 'Clear textfeild ' : 'Visk bort tekstfelt ')+
                (label.text() || node.attr('name'));
              opt.map._clearbtn[id] = $(
                '<a href="#'+id+'" role="button" id="'+id+'_clearbtn" class="'+type+'">'+text+'</a>'
              ).insertAfter( node );              
            }
            opt.map._clearbtn[id].off('click',helper._clickClear).on('click',helper._clickClear);
          }
        }

        node.off('focus',helper._focus).off('blur',helper._blur).off('keyup',helper._keyup);
        node.on('focus',helper._focus).on('blur',helper._blur).on('keyup',helper._keyup);
        node.off('validate',helper._validateInput).on('validate', helper._validateInput );
      });
    },

    getDefaultMessage : function() {

    },

    isRadio : function( input ) {
      return ($(input).attr('type') || '').match(/radio/i) !== null;
    },

    isClickable: function( input ) {
      var node = $( input ), dom = node.get(0);
      var type = node.attr('type'), tag = dom.nodeName.toLowerCase();
      return (type +' '+tag).match(/radio|checkbox|select|option/i) !== null;
    },

    isCheckable: function( input ) {
      return ($(input).attr('type') || '').match(/radio|checkbox/i) !== null;
    },

    getLength: function( input ) {
      var node = $( input ), dom = node.get(0);
      var tag  = dom.nodeName.toLowerCase();

      if ( tag === 'select' ) { 
        return node.find('option:selected').length;
      }
      if ( tag === 'input' && helper.isCheckable(input) ) {
        var any = helper._getInputByName( dom.name ).filter( ':checked' );
        return ((any.size() ? any.prop('value') : '' ) || '').length;
      }

      return (dom.value || '').length;
    }, 

    getErrorMessage : function( error, param, node ) {
      var ve = 'validation_error', vemsg = 'validation_error_message';
      var language = opt.language, msg = error && opt[ve][error] ? 
        (opt[ve][error][language] || error) : error;

      var note = opt[vemsg];
      var name = node && node.size() ? node.attr('name') : '';

      if ( name && note[name] && note[name][error] && note[name][error][language] ) { 
        msg = note[name][error][language];
      }

      return param ? ( param instanceof Array ? 
        msg.replace( /\#PARAM1\#/, param[0] ).replace( /\#PARAM2\#/, param[1] ) :
        msg.replace( /\#PARAM\#/, param ) 
      ) : msg;
    },

    getDuration : function( node ) {
      var v = node && node.size() ? 
        (node.css('transition-duration') || 0) : 0;
      if ( v ) { v = parseFloat( v ) * 1000; }
      return isNaN(v) ? 0 : v;
    },

    showSummary : function ( summaryHolder, ignorFocus ) {
      var form = opt.main;
      var error = form.find('.form-validation-error:not(.validation_copy)');
      
      var summary = null, inserted = false, single = error.size() === 1, animation = opt.animation;
      var msg = single ? error.clone().removeAttr('id') : $(
        '<div class="kietve form-validation-error'+(animation ? ' animation': '')+'" role="alert">'+
          helper.getErrorMessage('form-contain-several-error') +
        '</div>'
      );

      if ( (opt.summaryError || summaryHolder) && opt.summaryError !== false ) {
        summary = summaryHolder || (typeof(opt.summaryError)==='string' ? 
          form.find(opt.summaryError) : opt.summaryError
        );
        if ( typeof(summary.size) === 'function' && summary.size() ) {
          summary.html( 
            '<div class="form-validation-error validation_copy '+(animation ? ' animation': '')+'" role="alert">'+
              msg.html()+
            '</div>' 
          );
          inserted = true;
        }
      }

      if ( ! inserted && opt.summaryError !== false ) {
        form.next( '.form-validation-error' ).remove();
        msg.insertAfter( form ); 
        setTimeout( function() { msg.removeClass('animation'); }, 15 );
      }

      if ( single ) {
        var input = error.parent().find('a.dropdown_btn,input');
        if ( helper.isCheckable(input) && input.next('a.input-radio-label').size() ) {
          input = input.next( 'a.input-radio-label').eq(0);
        }

        opt.keyupPrevent = true;
        if ( !ignorFocus ) { input.focus(); }
        
        setTimeout( function() { opt.keyupPrevent = false;},50);
        setTimeout( function() {
          if ( ! summary ) { return; } 
          summary.find('.form-validation-error').removeClass('animation'); 
        }, 15 );
      } 
      else if ( summary && summary.size() ) {
        var node = summary.eq(0), top = node.offset().top;
        if ( node.prop('clientHeight') > 2 || top ) {
          $('html, body').animate({ 'scrollTop': (top-10)+'px' }, 100, function(){
            var link =  $(
              '<a href="#" aria-hidden="true" tabindex="-1" style="position:absolute;z-index:-1"></a>'
            ).appendTo( node );
            if ( ! ignorFocus ) { link.focus(); }
          });
        }
        setTimeout( function() { summary.find('.form-validation-error').removeClass('animation'); }, 15 );
      }
      else if( ! ignorFocus && opt.summaryError !== false ) { 
        msg.focus(); 
      }
    },

    splitText : function( text, type ) { 
      if ( text ) {
        if ( type === 'amount' ) {
          text = helper._splitText( (text+''), 3 ).join(' '); 
        }
      }
      return text || '';
    },

    /*************************************************************************
    === INTERNAL FUNCTIOn ===
    **************************************************************************/
    _validateInput : function( e, data ) {
      if ( ! data ) { data = {}; }
      var node = $(e.target), id = node.attr('id');
      helper.validate( node, true, true );
      if ( typeof(data.callback)==='function' ) { data.callback( opt.map[id]||{} ); }
    },

    _verifyDependingOnTarget : function( selector, current ) {
      var node = selector ? opt.all.filter( selector ).eq(0) : null;
      if ( ! node || ! node.size() ) { return false; }

      var out = false, mode = '-has-error';
      if ( helper.isCheckable(node) ) { 
        out = node.prop('checked');
      } else { 
        out = node.prop('value').replace( /\s+/g, '') !== '';
      }

      if ( ! out && current.hasClass( mode ) ) {
        var id = current.attr('id'), rule = opt.map[id] || {};
        helper.removeError( current );
        rule._error = null;
      }

      return ! out;
    },

    /*
    _verifyDependingOnTarget : function( selector ) {
      var node = selector ? opt.all.filter( selector ).eq(0) : null;
      if ( ! node || ! node.size() ) return false;

      var out = false;
      if ( helper.isCheckable(node) )
        out = node.prop('checked');
      else
        out = node.prop('value').replace( /\s+/g, '') !== '';
      return ! out;
    },
    */

    _beforeValidate : function( current, ignorRequired, ignorAriaAlert, mode ) {
      if ( typeof(opt.beforeValidation) === 'function' ) { 
        return opt.beforeValidation( current );
      }
      return true;
    },

    _afterValidate : function( current, ignorRequired, ignorAriaAlert, mode ) {
      //debug( JSON.stringify(opt.map) );
      var nersesmg = 'no_error_remove_summary_error_smg';
      if ( helper.isSuccess() ) {
        var summary = opt.main.find('.error_summary_holder');
        if ( summary.size() ) {
          var error = summary.find('.form-validation-error');
          var duration = opt.animation ? helper.getDuration(error) : 0;
          if ( duration ) {
            error.addClass( 'animation' );
            setTimeout( function() { 
              //error.remove(); 
              if ( opt[nersesmg] ) {
                summary.css({'visiblity':'visible'}).removeClass('on_hidden')
                  .removeAttr('aria-hidden');
                error.remove(); 
              }
              else {
                summary.css({'visiblity':'hidden'}).addClass('on_hidden')
                  .attr('aria-hidden','true');
              }
            }, duration );
          } else { 
            if ( opt[nersesmg] ) {
              summary.css({'visiblity':'visible'}).removeClass('on_hidden')
                .removeAttr('aria-hidden');
              error.remove(); 
            }
            else {
              summary.css({'visiblity':'hidden'}).addClass('on_hidden')
                .attr('aria-hidden','true');
            }
          }
        }
      }

      if ( typeof(opt.afterValidation) === 'function' ) { 
        opt.afterValidation( current );
      }
    },

    _trim : function( text, multipleWhiteSpace ) {
      var out = (text || '').replace(/^\s+/, '').replace(/\s+$/g, '');
      return multipleWhiteSpace ? out.replace( /\s+/g, ' ' ) : out;
    },

    _hasError : function( node, target ) {
      var mode = '-has-error';
      return (target ? target.hasClass(mode) : false) || node.hasClass(mode);
    },

    _verify : function() {

    },

    _formKeydown : function (e) {
      if ( e.keyCode === 13 && $(e.target).is( opt.selector) ) { 
        e.preventDefault();
      }
    },

    _clickClear : function( e ) {
      e.preventDefault();
      var target = $(e.currentTarget), input = $(target.attr('href'));
      if ( ! input.size() ) { return; }

      var id = input.attr('id'), rule = opt.map[id] || {};
      if ( rule.clearbtn ) {
        $( rule.clearbtn ).each( function(i,dom) {
          var node = $(dom);
          helper.validate( node.val(''), true, true, true );
          helper.validateHasValue( node );          
        });
      }
      else {
        helper.validate( input.val(''), true, true, true );
        helper.validateHasValue( input );
      }   
      input.focus();
    },

    _click : function( e ) {
      var node = $(e.target), id = node.attr('id') || '_', rule = opt.map[id] || {};
      var target = helper._getErrorInsertTarget( node ), tId = target.attr('id') || '_';
      if ( opt.live===true || opt.live===1 || opt.live===3 ) {
        var pv = '_prevent_validation';
        if ( ! opt[pv] && rule.atleastoption && helper._hasError(node,target) ) { 
          var all = null;
          if ( opt.map._atleast[tId] ) { 
            all = target.find('#'+opt.map._atleast[tId].join(',#'));
          }
          helper.validate( all || node, true, opt.live===3, 'click');
        }
      }

      var has = node.hasClass('view_yes_no_btn'); 
      var pt  = 'parent_target', tt = 'tabpanel_target';
      if ( helper.isRadio(node) && ! has ) {
        var parent = helper._getParentTarget( node, rule[pt], node );
        var same   = opt.map._parent[parent.attr('id') || ''] || []; 
        for ( var j=0; j<same.length; j++ ) {
          var r = opt.map[same[j].attr('id') || ''];
          if ( r[tt] ) { helper._verifyTab( same[j], null, r ); }
        }
      }
      else if ( rule[tt] && ! has ) {
        helper._verifyTab( node, null, rule );
      }
    },

    _keyup : function( e ) {      
      if ( opt.keyupPrevent ) { return; }

      var node = $(e.target), id = node.attr('id') || '_', code = e.keyCode;
      if ( code === 9 ) { return; }

      var target   = helper._getErrorInsertTarget( node ); 
      var hasError = helper._hasError( node, target );
      if ( opt.live === 2 || (opt.live && hasError) ) { 
        setTimeout( function(){ helper.validate( node, true );}, 15);
      }

      var rule = opt.map[id] || {}, pt = 'parent_target';
      if ( typeof(rule.telephone) !== 'undefined' ) { 
        helper._verifyTelephone( node, null, true, true );
      }
      if ( typeof(rule.mobile) !== 'undefined' ) { 
        helper._verifyMobile( node, null, true, true );
      }
      if ( typeof(rule.creditcardnumber) !== 'undefined' ) { 
        helper._verifyCreditcardnumber( node, null, true, true );
      }
      if ( typeof(rule.creditcardexpiration) !== 'undefined' ) { 
        helper._verifyCreditcardexpiration( node, null, true, true );
      }
      if ( typeof(rule.repeatpassword) !== 'undefined' ) { 
        helper._verifyRepeatpassword( node, null, true, true );
      }      
      if ( typeof(rule.personnumber) !== 'undefined' ) { 
        helper._verifyPersonnumber( node, null, true, true );
      }
      if ( typeof(rule.accountnumber) !== 'undefined' ) { 
        helper._verifyAccountnumber( node, null, true, true );
      }
      if ( rule.atleastoption && (rule._error || []).join('') ) {
        var parent = helper._getParentTarget( node, rule[pt], node );
        var same   = opt.map._parent[parent.attr('id') || ''] || [];
        var last   = same[ same.length-1];
        if ( last && id !== last.attr('id') ) { helper.validate( last ); }
      }

      if ( typeof(opt.afterKeyup)==='function' ) {
        opt.afterKeyup( node );
      }

      helper.validateHasValue( node, target );
    },

    _focus: function( e ) {
      if ( opt.focusPrevent ) { return; }

      var node = $(e.target), id = node.attr('id') || '_', rule = opt.map[id] || {};
      if ( opt.timer[id] ) { clearTimeout( opt.timer[id] ); }

      var mode = 'form-validation-on-focus on_focus_type_'+
        (helper.isCheckable(node) ? 'clickable' : 'text');

      node.addClass( mode );

      if ( typeof(rule.amount) !== 'undefined' ) { 
        helper._verifyAmount( node, null, true );
      }
      var target = helper._getErrorInsertTarget( node ), tId = target.attr('id') || '_';
      if ( id !== tId ) { target.addClass( mode ); }
      setTimeout( function() { 
        if ( opt.live && helper._hasError(node,target) ) { 
          helper.validate( node );
        }
        if ( id !== tId ) { target.addClass( mode ); }
      }, 105);
    },

    _blur : function( e ) {
      var node = $(e.target), id = node.attr('id') || '_', rule = opt.map[id] || {};
      var target = helper._getErrorInsertTarget( node ), tId = target.attr('id') || '_';

      if ( typeof(rule.amount) !== 'undefined' ) { 
        helper._verifyAmount( node, null, false );
      }
      if ( typeof(rule.date) !== 'undefined' ) {
        helper._verifyDate( node, null, true );      
      }
      if ( node.hasClass('force_to_prettify') ) {
        if ( typeof(rule.telephone) !== 'undefined' ) { 
          helper._verifyTelephone( node, null, false, true );
        }
        if ( typeof(rule.mobile) !== 'undefined' ) { 
          helper._verifyMobile( node, null, false, true );
        }
        if ( typeof(rule.creditcardnumber) !== 'undefined' ) { 
          helper._verifyCreditcardnumber( node, null, false, true );
        }
        if ( typeof(rule.creditcardexpiration) !== 'undefined' ) { 
          helper._verifyCreditcardexpiration( node, null, false, true );
        }
        if ( typeof(rule.repeatpassword) !== 'undefined' ) { 
          helper._verifyRepeatpassword( node, null, false, true );
        }        
        if ( typeof(rule.personnumber) !== 'undefined' ) { 
          helper._verifyPersonnumber( node, null, false, true );
        }
        if ( typeof(rule.accountnumber) !== 'undefined' ) { 
          helper._verifyAccountnumber( node, null, false, true );
        }
      }

      if ( opt.timer[id] ) { clearTimeout( opt.timer[id] ); }
      var mode = 'form-validation-on-focus on_focus_type_'+
        (helper.isCheckable(node) ? 'clickable' : 'text');

      opt.timer[id] = setTimeout( function() {
        node.removeClass( mode );
        if ( tId !== id ) { 
          target.removeClass( mode ); 
          helper.validateHasValue( node, target );
        }

        if ( opt.map[id] && opt.map[id].digit ) { 
          helper._convertDigitSpace(node, opt.map[id].digit);
        }
        
        if ( opt.live===true || opt.live===1 || opt.live===3 ) {
          var pv = '_prevent_validation';
          if ( ! opt[pv] && ! helper._hasError(node,target) ) {
            var all = null;
            if ( rule.atleastoption &&  opt.map._atleast[tId] ) {
              all = target.find('#'+opt.map._atleast[tId].join(',#'));
            }
            helper.validate( all || node, true, opt.live===3, 'blur' );
          }
        }

        if ( helper.isClickable(node) ) { return; }

        /*
        if ( node.prop('value') ) { 
          node.addClass( 'form-validation-has-value');
        } else { 
          node.removeClass( 'form-validation-has-value');
        }
        */
      }, 100 );
    },

    _submit : function(e) {
      if ( typeof(opt.beforeSubmitCallback)==='function' ){
        if ( opt.beforeSubmitCallback({'e':e,'main':opt.main, 'data': helper.getFormData()})===false ) { return; }
      }

      var form = $( e.currentTarget ), mode = 'form-validation-all-valid';
      var pv   = '_prevent_validation';
      opt[pv] = true;
      if ( form.hasClass(mode) ) { return; }

      e.preventDefault();
      helper.validate();
      setTimeout( function() { opt[pv] = false; },150);

      var error = form.find('.form-validation-error:not(.validation_copy)');
      var count = error.size();

      if ( ! count ) { 
        if ( typeof(opt.submitCallback)==='function' ){
          var test = opt.submitCallback({
            'e':e, 'main':opt.main, 'data': helper.getFormData(),
            'insertSummaryError' : helper.insertSummaryError
          });

          if ( test === false ) { return; }
        }
        return form.addClass(mode).submit(); 
      }
      helper.showSummary();
    },

    _getParentTarget : function( node, selector, defaultParent ) {
      var parent = null;
      if ( node && selector ) {
        parent = node.closest( selector );
        if ( ! parent.size() ) { parent = null; }
      }
      return parent || defaultParent || null;
    },

    _getErrorInsertTarget : function (input) {
      var node = $(input), id = node.attr('id'), rule = opt.map[id] || {};
      var pt   = 'parent_target';
      return helper._getParentTarget( node, rule[pt]||opt[pt], node );
    },

    _getInputByName: function( name ) {
      return opt.all.filter('[name="'+name+'"]');
    },

    _getNumber: function( input ) {
      var value = $(input).prop('value') || '';
      return value ? parseFloat(value.replace(/\s+/g,'').replace(/^0+/,'')) : '';
    },

    _getRule : function ( input, ignorMap ) {
      var node = $(input), rule = {}, list = [node.attr('data-rule')];
      if ( node.attr('required')  ) { list.push('required');                              }
      if ( node.attr('minlength') ) { list.push('minlength['+node.attr('minlength')+']'); }
      if ( node.attr('maxlength') ) { list.push('maxlength['+node.attr('maxlength')+']'); }

      var type = node.attr('type') || '';
      var reg  = type ? new RegExp('(^|\\s)'+type+'(\\s|$)','i') : null;
      //if ( reg && opt.method.join(' ').match(reg) ) list.push( type ); 
      if ( reg && opt.method && opt.method.join(' ').match(reg) && type !== 'text' ) {  
        list.push( type ); 
      }

      var text = helper._trim( list.join(' '), true );
      if ( ! text ) { return; }

      var pt = 'parent_target', render = function( v, d ) {      
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
        render( helper._trim(test[i],true) );
      }

      var defaultParent = rule.atleastoption ? node.parent() : null;
      var parent = helper._getParentTarget( node, rule[pt], defaultParent );
      if ( parent && ! ignorMap  ) {
        if ( ! opt.map._parent   ) { opt.map._parent   = {'pin':{}}; }
        if ( ! opt.map._atleast  ) { opt.map._atleast  = {}; }
        if ( ! opt.map._node     ) { opt.map._node     = {}; }
        if ( ! opt.map._clearbtn ) { opt.map._clearbtn = {}; }

        var pId = helper._generateId( parent );
        var nId = helper._generateId( node );
        if ( ! opt.map._parent[pId]  ) { opt.map._parent[pId] = [];  }
        if ( ! opt.map._atleast[pId] ) { opt.map._atleast[pId] = []; }

        if ( ! opt.map._parent.pin[pId] ) { opt.map._parent.pin[pId] = {}; }

        if ( ! opt.map._parent.pin[pId][nId] ) {
          opt.map._parent.pin[pId][nId] = true;
          opt.map._parent[pId].push( node ); 
        }

        //opt.map._parent[pId].push( node ); 
        opt.map._node[nId] = parent; 
        opt.map._atleast[pId].push( nId );
      }

      if ( typeof(rule.day)   !== 'undefined' ) { node.addClass('_rule_day');  }
      if ( typeof(rule.month) !== 'undefined' ) { node.addClass('_rule_month');}
      if ( typeof(rule.year)  !== 'undefined' ) { node.addClass('_rule_year'); }

      return rule;
    },

    _generateId : function( node ) {
      var id = node.attr('id');
      if ( ! id ) {
        id = 'auto_'+(new Date()).getTime()+'_'+Math.floor((Math.random()*1000)+1);
        node.attr('id',id);
      }
      return id;
    },

    _capitaliseFirstLetter : function(text){
      return text ? (text.charAt(0).toUpperCase()+text.slice(1).toLowerCase()): '';
    },

    _addAttribute : function( node, prop, value ) {
      var v = node.attr( prop ) || '';
      if ( ! v ) { return node.attr(prop, value); }

      var r = new RegExp( '(^|\\s+)'+value+'($|\\s+)', 'g' );
      if ( ! v.match(r) ) { node.attr(prop,helper._trim((v+' '+value,true))); }
    },

    _removeAttribute : function( node, prop, value ) {
      var v = node.attr( prop ) || '';
      if ( ! v ) { return; }

      var r = new RegExp( '(^|\\s+)'+value+'($|\\s+)', 'g' );
      if ( v.match(r) ) { 
        node.attr(prop, helper._trim((v.split(r)).join(' '), true));
      }
    },

    _convertDigitSpace : function( input, param ) {
      var node = $(input), number = helper._getNumber( node );
      if ( !number || isNaN(number) || ! param) { return; }
      var loop =  param - (number+'').length, empty = [];
      if ( loop <= 0 ) { return; }
      while ( loop-- ) { empty.push('0'); }
      node.prop('value', empty.join('')+number);
    },

    _splitText : function( text, split ) {
      var i = (text||'').length % split, list = i ? [text.substr(0,i)] : [];
      for ( i; i<text.length; i += split ) { 
        list.push(text.substr(i,split)); 
      }
      return list;
    },

    _getAtLeastOption: function( input, parent ) {
      if ( ! input && ! parent ) { return []; }

      if ( ! parent ) {
        var node = $(input), id = node.attr('id'), rule = opt.map[id] || {};
        var pt   = 'parent_target';
        parent = opt.map._node[id] || helper._getParentTarget(node,rule[pt]);
      }

      var pId = parent.attr('id');
      return opt.map._parent ? (opt.map._parent[pId] || []) : [];
    },

    _getDateOptionElements: function( input ) {
      var node = $(input), id = node.attr('id'), rule = opt.map[id];
      var pt   = 'parent_target';
      return rule ? helper._getParentTarget( node, rule[pt], opt.main )
        .find('._rule_day,._rule_month,._rule_year').map( function(i,d){return $(d);}) || [] 
      : [];
    },

    //************************************
    _verifyRequired: function( input, param ) {
      var node = $( input ), dom = node.get(0), length = 0, type = 'field';
      // could be an array for select-multiple or a string, both are fine this way
      if ( dom.nodeName.toLowerCase() === 'select' ) { 
        length = (dom.value || '').length;
      } else if ( helper.isCheckable(input) ) {
        length = helper.getLength( input ); type = 'selection';
      } 
      else {
        length = helper._trim( dom.value, true ).length;
        if ( input.attr('type')==='hidden' ) { type = 'selection'; }
        if ( ! length && param==='visible' ) {
          var h = node.prop('clientHeight');
          if ( ! h ) { length = 1; }
        }
      }

      return length > 0 ? '' : helper.getErrorMessage( type+'_required', null, node );    
    },

    _verifyMinlength : function( input, param ) {
      var node = $( input ), value = helper._trim( node.prop('value'), true );
      var length = value.length;
      return ! length || ! param || length >= param ? '' : 
        helper.getErrorMessage( 'required_at_least', param, node );
    },

    _verifyMaxlength : function( input, param ) {
      var node = $( input ), value = helper._trim( node.prop('value'), true );
      var length = value.length, id = node.attr('id'), rule = opt.map[id] || {}; 

      if ( typeof(rule.amount) !== 'undefined'        ||  
        typeof(rule.telephone) !== 'undefined'        ||
        typeof(rule.mobile) !== 'undefined'           ||
        typeof(rule.creditcardnumber) !== 'undefined' ||
        typeof(rule.accountnumber) !== 'undefined'    ||
        typeof(rule.personnumber) !== 'undefined'
      ) { length = (value||'').replace(/\s+/g,'').length; } 

      return ! length || ! param || length <= param ? '' : 
        helper.getErrorMessage( 'field_max_character', param, node );
    },

    _verifyRule : function ( input, reg ) {
      var node = $( input ), value = helper._trim( node.prop('value'), true ); 
      var id   = node.attr('id'), rule = opt.map[id] || {}; 
  
      if ( typeof(rule.amount) !== 'undefined'        ||  
        typeof(rule.telephone) !== 'undefined'        ||
        typeof(rule.mobile) !== 'undefined'           ||
        typeof(rule.creditcardnumber) !== 'undefined' ||
        typeof(rule.accountnumber) !== 'undefined'    ||
        typeof(rule.personnumber) !== 'undefined'
      ) { value = (value||'').replace(/\s+/g,''); } 

      return ! value || ! reg || value.match( reg ) ? true : false; 
    },

    _verifyEmail : function( input, param ) {
      var vr = 'validation_rule';
      return helper._verifyRule( input, opt[vr].email ) ? '' :
        helper.getErrorMessage( 'invalid_email', param, $(input) );
    },

    _verifyUrl : function( input, param ) {
      var vr = 'validation_rule';
      return helper._verifyRule( input, opt[vr].url ) ? '' :
        helper.getErrorMessage( 'invalid_url', param, $(input) );
    },

    _verifyNumber : function( input, param ) {
      var vr = 'validation_rule';
      return helper._verifyRule( input, opt[vr].number ) ? '' :
        helper.getErrorMessage( 'invalid_number', param, $(input) );
    },

    _verifyText : function( input, param ) {
      var node = $( input ), value = helper._trim( node.prop('value'), true );
      return value.match( /[<>\!\"\#\¤\%\&\/\(\)\=\?\`\|\^\@\£\$\€\{\[\]\}\´\¨\~\;\,\:\§\'\d]/ ) ?  
        helper.getErrorMessage( 'invalid_text', param, $(input) ) : '';
    },

    _verifyInterval : function( input, param ) {
      var test = helper._verifyNumber( input, param );
      if ( test ) { return test; }

      var node = $( input ), value = helper._trim( node.prop('value'), true );
      value = parseFloat( value.replace(/\s+/g,'') );
      if ( typeof(param[0])!=='number' && typeof(param[1])!=='number') { 
        return '';
      }
      if ( typeof(param[0])==='number' && typeof(param[1])==='number') {
        if ( input.is(':focus') ) {

        }
        else if ( value<param[0] || value>param[1] ) { 
          return helper.getErrorMessage( 'field_interval_between', param, $(input) );
        }
      }
      else if ( typeof(param[0])!=='number' && typeof(param[1])==='number') {
        if ( value>param[1] ) { 
          return helper.getErrorMessage( 'field_interval_less_than', param[1], $(input) );
        }
      }
      else if ( typeof(param[0])==='number' && typeof(param[1])!=='number') {
        if ( value<param[0] ) { 
          return helper.getErrorMessage( 'field_interval_greater_than', param[0], $(input) );
        }
      }

      return '';
    },  

    _verifyDate : function( input, param, format ) {
      var node = $(input), vr = 'validation_rule';
      var test = helper._verifyRule( input, opt[vr].date );
      if ( typeof(format) === 'boolean' && test ) {        
        var value = node.prop('value') || '', l = [], f = false;
        var matched = value.match( opt[vr].date ) || [];
        for ( var i=1; i<matched.length; i+=2 ) {
          if ( matched[i].match(/\d+/) ) {
            var v = parseInt( matched[i] );
            l.push( (v<10 ? '0':'')+v+(matched[i+1] ?matched[i+1] :'') );
          } else { f = true; }
        }

        if ( ! f ) { node.prop( 'value', l.join('') ); }
      }

      return test ? '' : helper.getErrorMessage( 'invalid_date', param, node );
    },

    _verifyDay : function( input, param ) {
      var node = $(input), id = node.attr('id'), rule = opt.map[id];
      if ( ! rule ) { return; }

      var msg = 'invalid_day', day = helper._getNumber( node );
      if ( isNaN(day) || day > 31 ) { 
        return helper.getErrorMessage( msg, param, node );
      }
      var vr = 'validation_rule', pt = 'parent_target';
      var wrapper = helper._getParentTarget( node, rule[pt], opt.main );
      var month   = wrapper.find('._rule_month');

      if ( month.size() ) {
        var number = helper._getNumber( month );
        if ( isNaN(number) ) { return; }

        var max = opt[vr].monthCountDay[number] || -1;
        if ( day > max ) {
          if ( number === 2 ) {
            var year = wrapper.find('._rule_year');
            if ( year.size() ) {
              number = helper._getNumber( year );
              if ( ! isNaN(number) && (((number-2000)%4)===0) && day<=(max+1) ) { 
                msg = '';
              }
            }
          }
          return helper.getErrorMessage( msg, param, node );
        }
      }
      return;
    },

    _verifyMonth : function( input, param ) {
      var number = helper._getNumber( input ),vr = 'validation_rule';
      return isNaN(number) || number < 1 || 
        number >= opt[vr].monthCountDay.length ? 
          helper.getErrorMessage( 'invalid_month', param, $(input) ) : '';
    },

    _verifyYear : function( input, param ) {
      return '';
    },

    _verifyPostnumber : function( input, param ) {
      var vr = 'validation_rule';
      return helper._verifyRule( input, opt[vr].postnumber ) ? '' :
        helper.getErrorMessage( 'invalid_post_number', param, $(input) );      
    },

    _verifyPersonnumber : function( input, param, focus, keyup ) {
      var node = $(input), value = node.prop('value') || '';  
      if ( ! value ) { return; }

      var text   = value.replace(/\s+/g,''), mode = 'force_to_prettify';
      var number = helper._getNumber( node ), vr = 'validation_rule';
      var force  = keyup ? node.hasClass( mode ) : false;

      if ( typeof(focus) === 'boolean' || force ) {
        var pos = helper._getCursorPosition( node );
        if ( keyup && focus && pos !== value.length ) { 
          return node.addClass( mode );
        }

        node.removeClass( mode ); 
        var out = [text.substring(0,6),text.substring(6)];
        node.prop('value', out.join(' ').replace(/\s+/g,' ').replace(/\s+$/g,''));
        if ( typeof(focus) === 'boolean' || ! force ) { return; }
      }

      if ( text.length < 11 ) {
        return helper.getErrorMessage('invalid_person_number_length',param,node);
      }

      var invalid = ! text.match( opt[vr].personnumber ) || isNaN(number);
      if ( ! invalid && ! (param || '').match(/simple/) ) {
        var sum = function(tNumber, factors){
          var s = 0, i = 0, l = factors.length;
          for ( i; i<l; ++i ){ s += parseInt(tNumber.charAt(i),10)*factors[i]; }
          return s;
        };

        var cSum1 = 11 - (sum(text, [3, 7, 6, 1, 8, 9, 4, 5, 2]) % 11);
        if (cSum1 === 11) { cSum1 = 0; }

        var cSum2 = 11 - (sum(text, [5, 4, 3, 2, 7, 6, 5, 4, 3, 2]) % 11);
        if (cSum2 === 11) { cSum2 = 0; }
        invalid = ! ( 
          cSum1 === parseInt(text.charAt(9), 10) && cSum2 === parseInt(text.charAt(10), 10) 
        );
      }
      return invalid ? helper.getErrorMessage('invalid_person_number',param,node) : '';  
    },

    _verifyAccountnumber : function( input, param, focus, keyup ) {
      var node = $(input), value = node.prop('value') || '';  
      if ( ! value ) { return; }

      var text   = value.replace(/\s+/g,''), mode = 'force_to_prettify';
      var number = helper._getNumber( node ), vr = 'validation_rule';
      var force  = keyup ? node.hasClass( mode ) : false;

      if ( typeof(focus) === 'boolean' || force ) {
        var pos = helper._getCursorPosition( node );
        if ( keyup && focus && pos !== value.length ) { 
          return node.addClass( mode );
        }
        node.removeClass( mode ); 
        var out = [text.substring(0,4),text.substring(4,6),text.substring(6)];
        node.prop('value', out.join(' ').replace(/\s+/g,' ').replace(/\s+$/g,''));
        if ( typeof(focus) === 'boolean' || ! force ) { return; }
      }

      if ( text.length < 11 ) { 
        return helper.getErrorMessage('invalid_account_number_length',param,node);
      }

      var invalid = ! text.match( opt[vr].accountnumber ) || isNaN(number);
      if ( ! invalid && param && param.match(/no/i) ) {
        var controlDigi = function (input) { // mod11OfNumberWithControlDigit 
          var number = 2, sum = 0, i = input.length - 2;
          for ( i; i >= 0; --i ) {
            sum += input.charAt(i) * number;
            if (++number > 7) { number = 2; }
          }
          var result = (11 - sum % 11);
          return result === 11 ? 0 : result;
        };

        invalid = ! (
          parseInt(text.charAt(text.length - 1), 10) === controlDigi(text)
        );
      }
      return invalid ? helper.getErrorMessage('invalid_account_number',param,node) : '';
    },
    
    /*
    _verifyPersonnumber : function( input, param, focus, keyup ) {
      var node = $(input), value = node.prop('value') || '';  
      if ( ! value ) { return; }

      var text   = value.replace(/\s+/g,''), mode = 'force_to_prettify';
      var number = helper._getNumber( node ), vr = 'validation_rule';
      var force  = keyup ? node.hasClass( mode ) : false;

      if ( typeof(focus) === 'boolean' || force ) {
        var pos = helper._getCursorPosition( node );
        if ( keyup && focus && pos !== value.length ) { 
          return node.addClass( mode );
        }

        node.removeClass( mode ); 
        var out = [text.substring(0,6),text.substring(6)];
        node.prop('value', out.join(' ').replace(/\s+/g,' ').replace(/\s+$/g,''));
        if ( typeof(focus) === 'boolean' || ! force ) { return; }
      }

      var invalid = ! text.match( opt[vr].personnumber );
      if ( invalid || isNaN(number) ) { 
        return helper.getErrorMessage('invalid_person_number',param,node);  
      }
      return text.length < 11 ? 
        helper.getErrorMessage('invalid_person_number_length',param,node) : '';
    },

    _verifyAccountnumber : function( input, param, focus, keyup ) {
      var node = $(input), value = node.prop('value') || '';  
      if ( ! value ) { return; }

      var text   = value.replace(/\s+/g,''), mode = 'force_to_prettify';
      var number = helper._getNumber( node ), vr = 'validation_rule';
      var force  = keyup ? node.hasClass( mode ) : false;

      if ( typeof(focus) === 'boolean' || force ) {
        var pos = helper._getCursorPosition( node );
        if ( keyup && focus && pos !== value.length ) { 
          return node.addClass( mode );
        }
        node.removeClass( mode ); 
        var out = [text.substring(0,4),text.substring(4,6),text.substring(6)];
        node.prop('value', out.join(' ').replace(/\s+/g,' ').replace(/\s+$/g,''));
        if ( typeof(focus) === 'boolean' || ! force ) { return; }
      }

      var invalid = ! text.match( opt[vr].accountnumber );
      if ( invalid || isNaN(number) ) { 
        return helper.getErrorMessage('invalid_account_number',param,node);  
      }

      return text.length < 11 ? 
        helper.getErrorMessage('invalid_account_number_length',param,node) : '';
    },
    */

    _verifyAmount : function( input, param, focus ) {
      var node = $(input), text = (node.prop('value') || '').replace(/\s+/g,'');
      if ( ! text ) { return; }

      var number = helper._getNumber( node ), vr = 'validation_rule', descimal = '';
      if ( typeof(focus) === 'boolean' ) {
        if ( ! focus ) { 
          var reg = /((\.|\,)(\d+))/, matched = text.match( reg );
          if ( matched ) {
            descimal = matched[1];
            text = text.replace( reg, '' );
          }
          text = helper._splitText( text, 3 ).join(' '); 
        }
        return node.prop('value', text+descimal);
      }

      var invalid = ! text.match( opt[vr].number ) || 
        (isNaN(number) && param !== 'allow_zero_as_empty');

      return invalid ? helper.getErrorMessage('invalid_amount',param,node) : ( 
          number < 0 ? helper.getErrorMessage('amount_has_to_be_great_than_zero',param,node) : ''
      );
    },

    _verifyTelephone : function( input, param, focus, keyup ) {
      var node = $(input), value = node.prop('value') || '';
      if ( ! value ) { return; }

      var text   = value.replace(/\s+/g,''), mode = 'force_to_prettify';
      var number = helper._getNumber( node ), plus = text.match(/^\+/) ? '+' : '';
      var force  = keyup ? node.hasClass( mode ) : false, vr = 'validation_rule';

      if ( typeof(focus) === 'boolean' || force ) {
        var rule = opt.map[node.attr('id') || '_'] || {};
        if ( rule['telephone']==='none' ) { return; }

        var pos = helper._getCursorPosition( node );
        if ( keyup && focus && pos !== value.length ) {  
          return node.addClass( mode );
        }
        node.removeClass( mode );
        if ( plus ) { 
          text = text.replace( /^\+/, '');
          var splited = text.split('');
          if ( splited.length > 2 ) {
            plus += splited.shift() + splited.shift() + ' ';
            text = splited.join('');
          }
        }
        node.prop('value', plus+helper._splitText( text, 2 ).join(' '));
        if ( typeof(focus) === 'boolean' || ! force ) { return; }
      }

      var invalid = ! text.match( opt[vr].phonenumber );
      if ( invalid || isNaN(number) ) { 
        return helper.getErrorMessage('invalid_telephone_number',param,node);    
      }
      if ( plus ) { text = text.replace( /^\+\d{1,2}/, '' ); }
  
      return text.length < 8 ? 
        helper.getErrorMessage('invalid_telephone_number_length',param,node) : '';
      //return invalid || isNaN(number) || (number+'').length !== 8 ? 
      //  helper.getErrorMessage('invalid_telephone_number',param,node) : '';
    },

    _verifyMobile : function( input, param, focus, keyup ) {
      var node = $(input), value = node.prop('value') || '';  
      if ( ! value ) { return; }

      var text   = value.replace(/\s+/g,''), mode = 'force_to_prettify';
      var number = helper._getNumber( node ),  plus = text.match(/^\+/) ? '+' : '';
      var force  = keyup ? node.hasClass( mode ) : false, vr = 'validation_rule';

      if ( typeof(focus) === 'boolean' || force ) {
        var rule = opt.map[node.attr('id') || '_'] || {};
        if ( rule['mobile']==='none' ) { return; }

        var pos = helper._getCursorPosition( node );
        if ( keyup && focus && pos !== value.length ) {
          return node.addClass( mode );
        }

        node.removeClass( mode );        
        if ( plus ) { 
          text = text.replace( /^\+/, '');
          var splited = text.split('');
          if ( splited.length > 2 ) {
            plus += splited.shift() + splited.shift() + ' ';
            text = splited.join('');
          }
        }

        var list = [], a = text.split(''), t = 3, j = 0;
        for ( var i=0; i<a.length; i++ ) {
          if ( ! list[j] ) { list[j] = ''; }
          list[j] += (a[i]+'');
          if ( --t === 0 ) {
            t = list[j].length === 3 ? 2 : 3; 
            j = j+1;
          }
        } 
        node.prop('value', plus+list.join(' '));
        if ( typeof(focus) === 'boolean' || ! force ) { return; }
      }

      var invalid = ! text.match( opt[vr].phonenumber );
      if ( invalid || isNaN(number) ) { 
        return helper.getErrorMessage('invalid_mobile_number',param,node);    
      }
      if ( plus ) { text = text.replace( /^\+\d{1,2}/, '' ); }
      return text.length < 8 ? 
        helper.getErrorMessage('invalid_mobile_number_length',param,node) : '';

      //return invalid || isNaN(number) ? 
      //  helper.getErrorMessage('invalid_mobile_number',param,node) : '';
    },

    _verifyCreditcardnumber : function( input, param, focus, keyup ) {
      var node = $(input), value = node.prop('value') || '';  
      if ( ! value ) { return; }

      var text   = value.replace(/\s+/g,''), mode = 'force_to_prettify';
      var number = helper._getNumber( node ), vr = 'validation_rule';
      var force  = keyup ? node.hasClass( mode ) : false;

      if ( typeof(focus) === 'boolean' || force ) {
        var pos = helper._getCursorPosition( node );
        if ( keyup && focus && pos !== value.length ) { 
          return node.addClass( mode );
        }
        node.removeClass( mode );          
        node.prop('value', helper._splitText( text, 4 ).join(' '));
        if ( typeof(focus) === 'boolean' || ! force ) { return; }
      }

      var invalid = ! text.match( opt[vr].number );
      return invalid || isNaN(number) || (number+'').length !== 16 ? 
        helper.getErrorMessage('invalid_credit_card_number',param,node) : '';
    },

    _verifyCreditcardexpiration : function( input, param, focus, keyup ) {
      var node = $(input), value = node.prop('value') || '';  
      if ( ! value ) { return; }

      var text = value.replace(/\s+/g,''), vr = 'validation_rule';
      var matched = text.match(opt[vr].creditcardexpiration);
      if ( ! matched ) {
        return helper.getErrorMessage('invalid_credit_card_expiration',param,node);
      }

      var now = new Date();
      var nowYear = (now.getFullYear() + '').substring(2);
      var nowMonth = now.getMonth() + 1;
      var month = parseFloat( matched[1].replace(/\s+/g,'').replace(/^0+/,'') );
      var year  = parseFloat( matched[2].replace(/\s+/g,'').replace(/^0+/,'') );
      if ( isNaN(month) || isNaN(year) || month < 1 || month > 12) {
        return helper.getErrorMessage('invalid_credit_card_expiration',param,node);
      }

      if ( year < nowYear || (nowYear === year && month < nowMonth) ) {
        return helper.getErrorMessage('invalid_credit_card_is_expired',param,node);
      }
      return '';
    },

    _verifyRepeatpassword : function( input, param, focus, keyup ) {
      var node = $(input), value = node.prop('value') || '';  
      if ( ! value ) { return; }

      var id = node.attr('id'), rule = opt.map[id] || {}, password = '';
      if ( rule.repeatpassword ) {
        var field = opt.all.filter('#'+rule.repeatpassword);
        if ( field.length ) { password = field.val(); }
      }

      return password !== value ? 
        helper.getErrorMessage('repeat_password_is_not_matched',param,node) : '';
    },

    _verifyPhoneprefix : function( input, param, focus ) {
      var node = $(input), value = node.prop('value') || '';  
      if ( ! value ) { return ''; }

      var test    = (value+'').replace(/^\+/,'');
      var invalid = test.length < 2 || test.length > 3 || test.match(/\D/);
      if ( ! invalid && value != ('+'+test) ) { node.val('+'+test); }

      return invalid ? helper.getErrorMessage( 'invalid_phoneprefix', param, node ) : '';
    },

    _verifyKidormsg : function( input, param, focus ) {
      var node = $(input), value = node.prop('value') || '';  
      if ( ! value ) { return ''; }

      var invalid = helper._verifyMinlength( input, 2 );
      if ( invalid ) { return invalid; }

      if ( value.match(/^\d{2}/) ) { 
        invalid = ! value.match( /^[0-9]+$/ );
      }

      return invalid ? helper.getErrorMessage( 'invalid_kidormsg', param, node ) : '';
    },

    _verifyAtleastoption : function( input, param, focus ) {
      if ( ! param || param <= 0 ) { return ''; }

      var node = $(input), id = node.attr('id'), rule = opt.map[id] || {};
      var /*mode = 'form_on_validating_at_least',*/ pt = 'parent_target';
      var parent = opt.map._node[id] || helper._getParentTarget(node,rule[pt]);
      //if ( parent.hasClass(mode) ) return '';

      //parent.addClass( mode );
      //setTimeout( function() { parent.removeClass(mode); }, 200 );

      var list = helper._getAtLeastOption(node,parent) || [], selected = [];
      for ( var i=0; i<list.length; i++ ) {
        if ( ! helper._verifyRequired(list[i]) ) { 
          selected.push( node ); 
        }
      }

      return selected.length >= param ? '' : 
        helper.getErrorMessage( 'at_least_option_not_meet_requirement', param, node );
    },

    _getCursorPosition: function( input ) {
      var position = 0, dom = input ? $( input ).get( 0 ) : null;
      if ( dom ) {
        if ( 'selectionStart' in dom ) {
            // Standard-compliant browsers
          position = dom.selectionStart;
        } 
        else if ( document.selection ) {
          var sel = document.selection.createRange();
          var selLen = document.selection.createRange().text.length;
          sel.moveStart('character', -dom.value.length);
          position =  sel.text.length - selLen;
        }
      }
      return position;
    },

    _getScrollPosition: function(){
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
      ] : [0,0];
    },

    _getWindowSize : function() {
      var size = [0, 0];
      if ( ! window.innerWidth ) { // IE 
        //if ( !(document.documentElement.clientWidth === 0) ){
        if ( ! document.documentElement.clientWidth ){
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

      if ( size[0] ) { size[0] -= 20; }
      return size;
    },


    _verifyTab : function( node, startup, nodeRule ) {
      var rule  = nodeRule || (node ? helper._getRule(node) || {} : {});
      var tt    = 'tabpanel_target', panel = rule[tt] ? $(rule[tt]) : null;

      if ( ! panel || ! panel.size() ) { return; }

      if ( node.prop('checked') ) {
        panel.attr('aria-hidden', 'false').addClass('-active');
      } else {
        panel.attr('aria-hidden', 'true').removeClass('-active');
      }
    },    
    /*
    _verifyTab : function( node, startup, nodeRule ) {

      var rule  = nodeRule || (node ? helper._getRule(node) || {} : {});
      var tt    = 'tabpanel_target', panel = rule[tt] ? $(rule[tt]) : null;
      if ( ! panel || ! panel.size() ) { return; }

      if ( ! node.prop('checked') ) {
        return panel.attr('aria-hidden', 'true').removeClass('active');
      }

      var duration = helper.getDuration( panel );
      if ( ! duration ) {
        return panel.attr('aria-hidden', 'false').addClass('active');
      }

      var style  = 'position:absolute;visibility:hidden;top:0;max-height:none;display:block;overflow:hidden;';
      var height = panel.attr('style',style).prop('clientHeight');
      var top    = panel.attr('style', 'height:1px;position:relative;').offset().top+100;
      var width  = panel.prop('clientWidth');

      var render = function() {
        panel.attr('style','overflow:hidden;max-height:'+height+'px').
          attr('aria-hidden', 'false').addClass('active');
        setTimeout( function() { panel.removeAttr('style'); }, duration );
      };

      if ( startup || isNaN(width) || ! width ) { return render(); }
      var scrolled = helper._getScrollPosition(), size = helper._getWindowSize();
      var view = [scrolled[1], scrolled[1]+size[1]];

      if ( view[0]<top && view[1]>top ) { 
        return setTimeout( render, 20 );
      }

      var nTop = node.offset().top, distance = top-nTop;
      if ( (nTop+distance) >= (nTop+size[1]) ) { 
        return setTimeout( render, 20 );
      }

      top = scrolled[1] + (top-view[1]);
      $('html, body').animate({'scrollTop':top+'px'}, duration||300,render);
    },    
    */

    _none : function() {}
  };

  var method = {};
  for ( var k in helper ) {
    if ( ! k.match(/^(init|setup|_)/i) ) { method[k] = helper[k]; }
  }
  
  this.FormValidation = method;
  setTimeout( helper.init, 100 );
  return this;
}; })( jQuery );
