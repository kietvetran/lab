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
;(function($) { $.fn.AccordionMenu = function ( config ) {
  if ( ! config ) { config = {}; }

  /****************************************************************************
    === CONFIGURATION OPTION === 
  ****************************************************************************/
  var opt = {
    'main'     : this,
    'list'     : [],
    'language' : config.language  || 'nb',
    'single'   : config.appending || config.wizard ? true : config.single,
    'summary'  : config.appending || config.wizard ? true : config.summary,
    'wizard'   : config.appending || config.wizard,
    'appending': config.appending || null,
    'open'     : config.open, 
    'fixed'    : config.fixed,
    'formNode' : config.formNode,
    'step'     : config.step,
    'nextClickCallback' : config.nextClickCallback,
    'validation' : config.validation || {
      'language' : config.language || 'nb'
    },
    'mode' : {
      'active'   : 'accordion_active',
      'inactive' : 'accordion_inactive',
      'off'      : 'accordion_disabled', 
      'wait'     : 'accordion_wait', 
      'view'     : 'on_view',
      'settled'  : 'accordion_settled',
      'passed'   : 'accordion_passed_step',
      'warning'  : 'accordion_warning',   
      'error'    : 'accordion_error'   
    }
  };

  var helper = {
    /*************************************************************************
      === Initialization ===
    **************************************************************************/
    init : function() {
      opt.tab     = opt.main.find('.accordion_tab');
      opt.panel   = opt.main.find('.accordion_panel');
      opt.nextBtn = opt.main.find('.accordion_next_btn');
      opt.confirm = opt.main.find('.accordion_confirmation_holder');

      opt.tab.each(function(i,dom) {
        var t = $(dom), p = opt.panel.eq(i);
        t.attr('aria-controls',helper._generateId(p));
        opt.list.push({'tab':t,'panel':p,'nextBtn':p.find('.accordion_next_btn')});
      });

      opt.tab.off( 'click', helper._click ).on( 'click', helper._click );
      opt.nextBtn.off( 'click', helper._click ).on( 'click', helper._click );

      if ( opt.step && ! opt.step.size() ) { 
        opt.step = null; 
      } else {
        opt.step.off( 'click', helper._clickStepLink ).on( 'click', helper._clickStepLink );
      }

      if ( opt.confirm.size() ) { 
        opt.confirm.off( 'click', helper._click ).on( 'click', helper._click );
      }

      if ( opt.wizard ) { opt.main.addClass('accordion_wizard'); }

      if ( ! opt.single ) { return opt.main.addClass('initialized'); }
     
      var active = opt.mode.active, current = opt.tab.filter('.'+active);
      if ( current.size() ) {
        if ( current.size() > 1 ) { 
          current.removeClass( active ).addClass( active );
        }
      } 
      else if ( opt.wizard ) {
        if ( opt.appending ) { 
          var type = 'wizard_appending' + 
            (opt.appending==='vertical'   ? ' appending_vertical'   : '')+
            (opt.appending==='horizontal' ? ' appending_horizontal' : '')+
            (opt.appending==='opacity'    ? ' appending_opacity'    : '')+
            (opt.appending==='paging'     ? ' appending_paging'     : '');

          if ( type !== 'wizard_appending' ) { opt.appending = 'animation'; }
            
          opt.tab.addClass( type ); 
          opt.panel.addClass( type ); 
          if ( opt.step ) { opt.step.addClass( type ); }
        }

        opt.tab.eq(0).addClass( active );
        opt.formNode = opt.formNode === null || typeof(opt.formNode)==='undefined' ? 
          opt.main.closest('form') : (typeof(opt.formNode)==='string' ?
            opt.main.closest( opt.formNode ) : null
          );
        if ( opt.formNode && opt.formNode.size() ) {
          try {
            opt.formNode.FormValidation( opt.validation );
          } catch( error ) { 
            opt.formNode = null;
          }
        }
      }

      var duration = helper.getDuration( opt.panel.eq(0) );
      helper.updateTabPanelMode(null, (duration*-1)+20, null, null, true );
    },

    /*************************************************************************
      === PUBLIC FUNCTIOn ===
    **************************************************************************/
    getFormValidation : function() { return opt.formNode; },

    updateTabPanelMode : function( callback, delay, fStep, lStep, startup ) {
      clearTimeout( opt.timer || 0 );
      opt.timer = setTimeout( function() {
        helper._renderUpdateTabPanelMode( callback, delay, fStep, lStep, startup );
        if ( startup ) { 
          opt.main.addClass('initialized'); 
          if ( opt.open ) {
            opt.tab.removeClass( opt.mode.off );
            opt.tab.removeClass( opt.mode.inactive );
            opt.tab.addClass( opt.mode.passed );

            opt.panel.removeClass( opt.mode.off );
            opt.panel.removeClass( opt.mode.inactive );
            opt.panel.addClass( opt.mode.passed );

            if ( opt.step ) {
              opt.step.removeClass( opt.mode.off );
              opt.step.removeClass( opt.mode.inactive );
              opt.step.addClass( opt.mode.passed );
            }
          }
        }
      }, 20 );
    },

    updateConfirmation : function() {
      if ( ! opt.confirm || ! opt.confirm.size() ) { return; }

      var change = opt.editLabel || 'Endre';
      setTimeout( function() {
        var list = [], pin = {}, counter = 0;
        opt.main.find('.display_accordion_confirmation').each( function(i,input) {
          var node  = $(input), id = helper._generateId( node );
          var value = node.attr('data-value') || node.val() || node.text() || '';   
          var unit  = node.attr('data-unit')  || '';
          var label = node.attr('data-label') || opt.main.find('label[for="'+id+'"]').text();
          var range = parseInt(node.attr('data-range'));
          if ( typeof(pin[label])==='number' ) {
            var t = $( '<div>'+list[pin[label]]+'</div>');
            var n = t.find('.confirm_value');
            n.html( n.text() +' '+value );
            list[pin[label]] = t.html();
          }
          else {
            var temp = '<div class="accordion_confirmation_item">' + 
              '<div class="head_lead">'+label+'</div>'+
              '<div class="body_content">'+
                '<span class="confirm_value">'+value+'</span>'+
                (unit ? ' <span class="confirm_unit">'+unit+'</span>': '')+
                '<a href="#" class="edit_accordion_confirmation" data-rule="'+id+'">'+change+'</a>'+
              '</div>'+
            '</div>';

            if ( isNaN(range) ) {
              pin[label] = counter;
              list[counter++] = temp;
            }
            else {
              pin[label] = range;
              list[range] = temp;
            }
          }
        });

        var html = list.length ? '<ul class="accordion_confirmation_list"><li>'+
          list.join('</li><li>')+
        '</li></ul>' : '';
        opt.confirm.html( html );
      }, 100 );
    },

    updateSummary : function( data ) {
      if ( ! data || ! data.tab || ! data.panel || opt.appending ) { return; }

      setTimeout( function() {
        var type ='accordion_summary', holder = data.tab.find('> .'+type);
        if ( ! holder.size() ) {
          if ( ! opt.summary ) { return; }
          holder = $('<div class="'+type+'"></div>').appendTo( data.tab );
        }

        var check = ['form_validation_has_error', 'value_comfirm'];
        var out   = [], input = data.panel.find('.display_accordion_summary');
        var loop  = input.size(), i = 0, pin = {};
        for ( i; i<loop; i++ ) {
          var node = input.eq(i), value = helper._trim( node.prop('value') );
          if ( helper.isCheckable(node) && ! node.prop('checked') ) {
            value = '';
          }

          if ( ! value ) { continue; }

          var id = node.attr('id');
          if ( pin[id] ) { continue; }
          pin[id] = true;

          var unit = node.attr('data-unit') || '', legend = null;
          if ( unit ) { unit = ' '+unit; }

          //debug('N: '+ node.attr('name') + ' == ' + helper.isRadio(node) );

          if ( helper.isRadio(node) ) {
            var set = node.closest('fieldset');
            legend = set.size() ? set.find('legend') : null;
          }

          var kind = ['text_item'], lead = '', label = legend || 
            (id ?  data.panel.find('label[for="'+id+'"]') : null);

          if ( label && label.size() ) {
            lead = label.attr('data-shortname') || label.text() || '';
            if ( lead ) { lead = helper._capitaliseFirstLetter( lead ) + ': '; }
          } 

          if ( node.hasClass(check[0]) ) { kind.push( check[0] ); }
          if ( node.hasClass(check[1]) ) { kind.push( check[1] ); }
          out.push('<span class="'+kind.join(' ')+'">'+(lead||'')+value+unit+'</span>');
        }
        holder.html( out.length ? out.join(', ') : '&nbsp;' );
      }, 100);
    },

    setFocusOnAccordionInput : function( id ) {
      var input = id ? $( '#'+id ) : null;
      if ( ! input || ! input.size() ) { return; }

      var panel = input.closest('.accordion_panel');
      var allP  = helper.getPanel(), allT = helper.getTab();
      var index = allP.index( panel );
      if ( index < 0 ) { return; }

      var last = helper.getIndexLastPassedTab()+1;
      var top  = allT.eq(0).offset().top-10;
      $('html, body').animate({ 'scrollTop': top+'px' }, 300, function(){
        helper.updateTabPanelMode( function(source) {
          if ( ! source ) { source = {}; }
          var id = input.attr('id'), label = $('label[for="'+id+'"]');
          top = label.size() ? label.offset().top : input.offset().top;
          setTimeout( function() {
            $('html, body').animate({ 'scrollTop': (top-15)+'px' }, 300, function(){
              input.focus();
            });
          }, source.duration || 300 );
        }, 100, index, last );          
      });

    },

    getDuration : function( node ) {
      var v = node && node.size() ? 
        (node.css('transition-duration') || 0) : 0;
      if ( v ) { v = parseFloat( v ) * 1000; }
      return isNaN(v) ? 0 : v;
    },

    getIndexLastNotDisabled : function() {
      var off = opt.tab.filter('.'+opt.mode.off);
      return (off.size() ? opt.tab.index( off.eq(0) ) : opt.tab.size()) - 1;
    },

    getIndexLastPassedTab : function() {
      var passed = opt.tab.filter('.'+opt.mode.passed);
      return opt.tab.index( passed.last() );      
    },

    getPanel : function() { return opt.panel; },
    getTab   : function() { return opt.tab;   },

    scrollTop : function ( node, duration, callback, force ) {
      if ( opt.onScrolling ) { return; }
      var now = helper._getScrollPosition(), test = !force && 
        ( !node || (opt.appending==='animation' && !now[1]) );

      //debug('N:'+now[1] + ' T:'+test);
      if ( test ) {return typeof(callback) === 'function' ? callback() : null;}
      
      if ( opt.appending === 'opacity') { opt.onScrolling = true; }

      var fixed = opt.fixed && typeof(opt.fixed)==='object' ? 
        opt.fixed.prop('clientHeight') : 0;
      var top = node.offset().top - 10 - fixed;
      $('html, body').animate({'scrollTop': top+'px' }, duration || 250, callback);
      setTimeout( function() { opt.onScrolling = false; }, 1000 );
    },

    isRadio : function( input ) {
      return opt.formNode ? opt.formNode.FormValidation.isRadio( input ) :
        ($(input).attr('type') || '').match(/radio/i) !== null;
    },

    isCheckable: function( input ) {
      return opt.formNode ? opt.formNode.FormValidation.isCheckable( input ) :
        ($(input).attr('type') || '').match(/radio|checkbox/i) !== null;
    },

    expandTab : function ( what ) {
      if ( typeof(what)==='undefined' ) { return; }
      
      var node = null, index = -1;
      if ( typeof(what) === 'number' ) {
        node = opt.tab.eq( what ); index = what;
      } else {
        index = opt.tab.index( what ); node = what;
      }

      if ( node && node.size() && index>-1 ) {
        if ( opt.appending ) {
          helper.scrollTop( node );
        } else { helper._clickOnTab( node, index ); }
      }
    },

    /*************************************************************************
      === INTERNAL FUNCTION ===
    **************************************************************************/
    _renderUpdateTabPanelMode : function( callback, delay, fStep, lStep, startup ) {
      var list = opt.list, loop = list.length, mode = opt.mode, step = opt.wizard ? (
        typeof(fStep)==='number' ? fStep : (helper.getIndexLastPassedTab()+1)
      ) : -1;

      //var counter = [0,0], duration = ! opt.single ? 0 : helper.getDuration( list[0].panel );
      var link    = opt.step;
      var counter = [0,0], duration = helper.getDuration( list[0].panel );

      opt.panel.filter('.'+mode.active).addClass( mode.view ); 

      var isActive = false, i = 0, pin = {}; 
      for ( i=0; i<loop; i++ ) {
        var id  = list[i].panel.attr('id');
        pin[id] = list[i].panel.prop('clientHeight');
        if ( duration && ! opt.appending ) { 
          if ( ! pin[id] || opt.wizard ) { 
            list[i].panel.addClass( mode.wait ); 
          }
          list[i].tab.addClass( mode.wait );
          if ( link ) { link.eq(i).addClass( mode.wait ); }
        }

        if ( ! opt.appending ) {
          list[i].panel.removeClass( mode.settled );
        }

        helper.updateSummary( list[i] );
        helper.updateConfirmation( list[i] );
        isActive = list[i].tab.hasClass(mode.active);

        if ( (step<0 && isActive) || (step>=0 && step===i) ) {
          list[i].panel.removeClass(mode.inactive);
          list[i].panel.addClass(mode.active).attr('aria-hidden','false');
          list[i].tab.addClass(mode.active);
          if ( link ) { link.eq(i).addClass( mode.active ); }
          counter[0]++;

          if ( opt.appending ) {
            list[i].tab.removeClass(mode.inactive);
            list[i].panel.removeClass(mode.inactive); 
            if ( link ) { link.eq(i).removeClass(mode.inactive); }
          }
        }
        else {
          if ( opt.appending ) {
            if ( i < step ) { 
              list[i].tab.removeClass(mode.active);
              list[i].panel.addClass(mode.passed);

              if ( opt.appending==='animation' ) {
                list[i].tab.addClass(mode.inactive);
                list[i].panel.addClass(mode.inactive);
                if ( link ) { link.eq(i).addClass(mode.inactive); }              
              }
  
              if ( link ) { 
                link.eq(i).addClass( mode.passed ).removeClass(mode.active); 
              } 
            }
            else if ( i > step ) {
              if ( opt.appending==='animation' ) {
                list[i].tab.addClass(mode.inactive);
                list[i].panel.addClass(mode.inactive);
                if ( link ) { link.eq(i).addClass(mode.inactive); }              
              }
            }
          } else {
            list[i].panel.removeClass(mode.active);
            list[i].panel.addClass(mode.inactive).attr('aria-hidden','true'); 
            list[i].tab.removeClass(mode.active);
            if ( link ) { 
              link.eq(i).removeClass( mode.active );
              if ( i > step ) { link.eq(i).removeClass( mode.passed ); }
              else  { link.eq(i).addClass( mode.passed ); }
            }
          }
          counter[1]++;
        }
        if ( ! opt.wizard ) { continue; }

        if ( i<=step || (typeof(lStep)==='number' && i<=lStep) ) {
          list[i].tab.removeClass( mode.off ).attr('aria-disabled','false');
          list[i].panel.removeClass( mode.off ).attr('aria-disabled','false');
          if ( link ) { 
            link.eq(i).removeClass( mode.off ).attr('aria-disabled','false');
          }          
        }
        else {
          list[i].tab.addClass( mode.off ).attr('aria-disabled','true');
          list[i].panel.addClass( mode.off ).attr('aria-disabled','true');
          if ( link ) { 
            link.eq(i).addClass( mode.off ).attr('aria-disabled','true');
          }          
        }
      }

      if ( ! duration || (!counter[0] && !counter[1]) ) { 
        if ( ! opt.appending && ! startup ) {
          return typeof(callback) === 'function' ? callback() : null;
        }
      }

      var wSize  = helper._getWindowSize(), scrolled = helper._getScrollPosition();
      var render = function( current ) {
        if ( link ) { link.eq( opt.tab.index(current) ).removeClass(mode.wait);}
        current.removeClass( mode.wait );
        opt.panel.filter( '.'+mode.active ).each( function(i,dom){
          var node = $(dom), height = pin[node.attr('id')];
          if ( height && height > 5 ) { return; }

          height = node.addClass('on_verify').prop('clientHeight');
          if ( height > wSize[1] ) { height = wSize[1]; }

          node.removeClass('on_verify').find('.error_summary_holder.on_hidden').remove();
          setTimeout( function() {       
            node.removeClass(mode.wait);
            if ( height ) { node.attr('style','max-height:'+height+'px'); }
            setTimeout( function() { 
              node.removeAttr('style').addClass( mode.settled ); 
            }, duration );
          }, 20 );
        });

        if ( opt.appending && ! startup ) { helper.scrollTop( current ); } 
        if ( typeof(callback) === 'function' ) { callback({'duration':duration}); }
      };

      var action = function() {
        var current = opt.tab.filter('.'+mode.active).last();
        var top = opt.wizard && ! startup && current.size() ? 
          current.offset().top-10 : -1;         

        return ! opt.appending && helper._needScroll(null,top,scrolled,wSize) ?
          helper.scrollTop( current, null, function(){ render(current); }) : 
          render( current );
      };

      var verify = function() {
        var s = 'max-height:'+wSize[1]+'px;', a = opt.panel.filter( '.'+mode.inactive );
        var w = a.filter('.'+mode.view), top = w.size() ? w.offset().top : 0;
        if ( top && (top>(scrolled[1]+wSize[1]) || top<scrolled[1]) ) {
          s = 'max-height:0;';
          duration = -1;
        }

        w.attr('style',s);
        setTimeout( function() {
          a.removeClass( mode.wait ).removeClass( mode.view );
          var os = a.removeAttr('style').filter('.'+mode.off).size();
          if ( os === a.size() || duration <= 0 || ! opt.wizard ) {  
            action(); 
          } else {
            setTimeout( action, duration + (delay || 0) );
          }
        }, 20 );
      };

      if ( counter[0] && ! counter[1] ) {
        opt.tab.filter( '.'+mode.active ).removeClass( mode.wait );
        opt.panel.filter( '.'+mode.active ).removeClass( mode.wait );
        if ( link ) {
          link.filter( '.'+mode.active ).removeClass( mode.wait );
        }        
      }
      else if ( ! counter[0] && counter[1] ) {        
        opt.panel.filter( '.'+mode.inactive )
          .removeAttr('style').removeClass( mode.wait +' '+mode.view );
        opt.tab.filter( '.'+mode.inactive ).removeClass( mode.wait );
        if ( link ) {
          link.filter( '.'+mode.inactive ).removeClass( mode.wait );
        }
      }
      else {
        verify(); 
      }
    },

    _clickStepLink : function( e ) {
      e.preventDefault();
      var index = opt.step.index( $(e.currentTarget) );
      if ( index < 0 ) { return; }

      var node = opt.tab.eq(index);
      if ( ! node.size() || node.hasClass(opt.mode.off) ) { return; }

      if ( opt.appending ) {
        if ( opt.appending==='animation' ) {
          var last = helper.getIndexLastPassedTab()+1;          
          helper.updateTabPanelMode( null, null, index, last ); 
        }
        helper.scrollTop( node );
      } else { helper._clickOnTab( node, index ); }
    },

    _click : function( e ) {
      e.preventDefault();
      var node = $(e.currentTarget), target = $(e.target);

      if ( target.hasClass('edit_accordion_confirmation') ) { 
        return helper.setFocusOnAccordionInput( target.attr('data-rule') );
      }

      var off = opt.mode.off;
      if ( node.hasClass(off) ) { return; }

      var isBtn = node.hasClass('accordion_next_btn');
      var index = isBtn ? opt.nextBtn.index( node ) : opt.tab.index( node );
      if ( index < 0 ) { return; }

      if ( isBtn ) {
        helper._clickOnFormNode( node, index );
        if ( typeof(opt.nextClickCallback)==='function') { 
          opt.nextClickCallback( e );
        }
      }
      else {
        helper._clickOnTab( node, index );        
      }
    },

    _clickOnTab : function ( node, index ) {
      var recall = null, delay = 0, force = null, last = null; 
      var mode = opt.mode, duration = helper.getDuration( opt.panel.eq(0) );
      
      if ( opt.wizard  ) {
        if ( opt.appending ) { return; }

        if ( node.hasClass(mode.active) ) { return; }
        var current = opt.tab.filter('.accordion_active');
        if ( ! current.size() ) { current = opt.tab.eq(0); }

        //var loop = opt.list.length;
        force = index; delay = 100;
        last  = helper.getIndexLastNotDisabled();
        var cIndex  = opt.tab.index( current );
        if ( cIndex !== last ) {
          if ( helper._validatePanelInput( cIndex ) ) { return; }
        }

        for ( var i=cIndex+1; i<last; i++ ) {
          if ( helper._validatePanelInput(i,true) ) {
            force = i;
            i = last;
          }
        }

        var top = current.offset().top - 10;
        return opt.wizard && helper._needScroll( null, top ) ?
          helper.scrollTop( current, duration || 500, function() {
             helper.updateTabPanelMode(recall, delay, force, last );
          }) : helper.updateTabPanelMode(recall, delay, force, last );
      }
      else if ( opt.single  ) {
        opt.tab.removeClass( mode.active );
        node.addClass( mode.active );
        delay = 100;
      }       
      else { 
        delay = (duration*-1) + 20;
        node.toggleClass( mode.active ); 
      }

      helper.updateTabPanelMode(recall, delay, force, last );
    },

    _clickOnFormNode : function ( node, index ) {
      var error = isNaN(index) ? 0 : helper._validatePanelInput( index );
      if ( error || ! opt.wizard ) { return; }

      var list = opt.list, data = list[index], loop = list.length;
      var last = helper.getIndexLastNotDisabled();

      for ( var i=0; i<loop; i++ ) { 
        if ( i<=index ) { 
          list[i].tab.addClass( opt.mode.passed );
        }
        else { 
          list[i].tab.removeClass( opt.mode.passed );
        }
      }

      var top =  data.tab.offset().top-10;
      return ! opt.appending && opt.wizard && helper._needScroll( null, top ) ?
        helper.scrollTop( data.tab, 500, function() {
          helper.updateTabPanelMode(null,null,null,last);
        }) : helper.updateTabPanelMode(null,null,null,last);
      /*
      return ! opt.appending && opt.wizard && helper._needScroll( null, top ) ?
        $('html, body').animate({ 'scrollTop': top+'px' }, 500, function(){
          helper.updateTabPanelMode(null,null,null,last);
        }) : helper.updateTabPanelMode(null,null,null,last);
      */
    },

    _validatePanelInput : function ( index, ignorFocus ) {
      var data = opt.list[index], error = 0; 
      var type = 'error_summary_holder', sum = '<div class="'+type+'"></div>';

      if ( opt.formNode && data && data.panel ) {
        var input = data.panel.find('input:not([type="submit"]):not([type="reset"])');
        try {
          opt.formNode.FormValidation.validate( input );
          error = input.filter('.form_validation_has_error').size();
          if ( error ) {
            data.panel.find('.error_summary_holder').remove();
            var row = data.panel.find('.form_row');
            if ( row.size() ) { row = row.eq(0).find('.row_content').eq(0); }
     
            $( sum ).insertBefore( (row.size() ? row : data.panel).children().first() );
            $( sum ).insertBefore( data.nextBtn.first() );
            opt.formNode.FormValidation.showSummary( data.panel.find('.'+type), ignorFocus );
          }
        } catch( failed ) {}
      }
      return error;
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

    _generateId : function( node ) {
      var id = node.attr('id');
      if ( ! id ) {
        id = 'auto_'+(new Date()).getTime()+'_'+Math.floor((Math.random()*1000)+1);
        node.attr('id',id);
      }
      return id;
    },

    _needScroll : function( node, top, scrolled, size ) {
      if ( ! top && node && node.size() ) { 
        top = node.offset().top;
      }
      if ( ! top || top<0 ) { return false; }


      if ( ! scrolled ) { scrolled = helper._getScrollPosition(); } 
      if ( ! size     ) { size     = helper._getWindowSize();     }

      return ! (scrolled[1]<top && top<(scrolled[1]+size[1]));
    },

    _capitaliseFirstLetter : function(text){
      return text ? (text.charAt(0).toUpperCase()+text.slice(1).toLowerCase()): '';
    },

    _trim : function( text, multipleWhiteSpace ) {
      var out = (text || '').replace(/^\s+/, '').replace(/\s+$/g, '');
      return multipleWhiteSpace ? out.replace( /\s+/g, ' ' ) : out;
    },

    _none : function() {}
  };


  var method = {};
  for ( var k in helper ) {
    if ( ! k.match(/^(init|setup|_)/i) ) { method[k] = helper[k]; }
  }

  this.AccordionMenu = method;
  setTimeout( helper.init, 100 );
  return this;
}; })( jQuery );
