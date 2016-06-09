var React = require('react');
var Addons = require('react-addons');

var DropdownMenu = React.createClass({
	/*************************************************************************
	=== Initialization ===
	*************************************************************************/
	opt : {
		'searchTimer':0, 'hideTimer':0, 'reg':null
	},

	initial : function() {
	},

	getDefaultProps : function() {
		return {
			'id': 'dd-'+(new Date()).getTime()+'-'+Math.floor((Math.random()*10000)+1)
		};
	},

	getInitialState: function() {
  		//console.log('getInitialState..');
		return { 
			'focus': false,
			'value': '',
			'label': '',
			'error': '',
			'list' : [],
			'selected': [],
			'matched': null,
		};
	},

	componentWillMount  : function() {
		var self = this, storage = {}, i = 0;
		var value = (self.props.value || '').split(';'), length = value.length;
		for ( i=0; i<length; i++ ) { storage[value[i]] = 1; }

		var list = self.props.list || self.props.input || [];
		length = list.length;

		for ( i=0; i<length; i++ ) {
		 	if ( ! list[i].value && ! list[i].label ) continue;

		 	if ( ! list[i].value ) list[i].value = list[i].label;
		 	if ( ! list[i].label ) list[i].label = list[i].value;
		 	if ( storage[list[i].value] ) list[i].selected = true;

		 	list[i].index = self.state.list.length;
		 	self.state.list.push( list[i] );

		 	if ( list[i].selected ) self.state.selected.push( list[i] );
		}

		var view = self.getDropdownBtnView();
		self.setState( view );

		document.body.addEventListener('mousedown', function(){
			if ( self.state.open ) self.hideList();
		});
	},

	render : function() {
    	var cx = Addons.classSet, classes = cx({
			'dropdown-menu': true,
			'-has-value' : this.state.value ? true : false,
			'-has-error' : this.state.error ? true : false,
			//'-on-focus'  : this.state.focus,
			'-open'      : this.state.open
		});

    	var id = this.props.id, placeholder = this.props.placeholder || '';
    	var idList = id+'-list', idSearch = id+'-search', idWrapper = id+'-dd-wrapper';
    	var title = this.props.title || this.state.title || '';
    	var value = this.state.label || this.state.value || '', label = value || '\u00A0';
    	var placeholder = this.props.placeholder || '';
    	var option = this.getOption();

    	return (
	        <div id={idWrapper} className={classes}>
	        	<input type="hidden" className="dropdown-menu-input" name={this.props.name} defaultValue={this.state.value} ref="input" />
	        	<a href="-1" className="dropdown-menu-button" role="presentation" aria-hidden="true" title="{title}" ref="button"
	        		onBlur={this.onBlur} onFocus={this.onFocus} onClick={this.onClick}>{label}</a>
	        	<div className="dropdown-menu-widget">
	        		<div className="dropdown-menu-search">
	                    <input type="text" className="input-field dropdown-menu-field" defaultValue={value} aria-owns={idList} role="combobox" aria-autocomplete="inline" 
    		                id={idSearch} placeholder={placeholder} spellcheck="false" autocomplete="off" ref="field"
    		                onFocus={this.onFocus} onBlur={this.onBlur} onKeyUp={this.onKeyUp} onKeyDown={this.onKeyDown}/>
    	            </div>
	                <ul className="dropdown-menu-list" role="listbox" id={idList} aria-expanded={this.state.open} 
	                	ref="list" onMouseOver={this.onMouseOver} onMouseOut={this.onMouseOut}>{option}</ul>
	            </div>
	        </div>//
		);
	},

  	componentDidMount : function() {  		
  		var self = this, target = self.refs.input, btn ;
  		if ( ! target ) return;

  		/*
  		if ( this.props.required ) {
  			target.setAttribute('required','true');
  			target.setAttribute('aria-required','true');
  		}

  		if ( this.props.disalbed ) 
  			target.setAttribute('disabled','true');

  		if ( this.props.selected ) 
  			target.setAttribute('checked','true');

  		if ( this.state.error ) 
  			target.setAttribute('aria-invalid','true');

		target.addEventListener('change-state', function(e) {
  			if ( e.detail ) self.setState( e.detail );
		}, false );

		target.addEventListener('get-state', function(e) {
			if ( e.detail && typeof(e.detail.callback) == 'function' )
				e.detail.callback( self.state );
		}, false );
		*/
  	},

	/*************************************************************************
	=== State Changes ===
	*************************************************************************/
	shouldComponentUpdate: function(nextProps, nextState){
    	return true; // return a boolean value
	},

	componentWillUpdate: function(nextProps, nextState){
	    // perform any preparations for an upcoming update
	},

	componentDidUpdate: function(prevProps, prevState){
  		var target = this.refs.input, button = this.refs.button;
  		if ( button ) {
  			this.state.open ? button.setAttribute('tabindex','-1') :
	  			button.removeAttribute('tabindex');
  		}

  		if ( target ) {
	  		this.state.error ? target.setAttribute('aria-invalid','true') :
	  			target.removeAttribute('aria-invalid');
	  	}

	  	if ( typeof((this.props.calling ||{}).changeState) === 'function' )
	  		this.props.calling.changeState( this.state );
	},

	/*************************************************************************
	=== Other functions ===
	*************************************************************************/
	getDropdownBtnView : function( selectedList ) {
		var selected = selectedList || this.state.selected || [];
		var value = [], label = '', length = selected.length;
		for ( var i=0; i<length; i++ ) {
			value.push( selected[i].value );
			label = selected[i].label;
		}

		return {
			'value': value.join(';'),
			'label': value.length < 2 ? label : (this.props.multipleLabel || 'Multiple')
		};
	},

	onMouseOver : function( e ) {
		var item = this._getClosestParent( e.target, 'item');
		this._toggleFocus( item );		
	},

	onMouseOut : function( e ) {
		this._toggleFocus();
	},

	onBlur : function( e ) {
		var self = this;
		self.hideList();
	},

	onFocus: function( e ) {
		var self = this;
		setTimeout( function() {
			self.showList();		
	    	//self._calling( e );
	    }, 100);
  	},

	onClick: function( e ) {
		e.preventDefault();
    	this._calling( e );
  	},

  	onKeyDown: function( e ) {
		if ( e.keyCode === 13 ) { e.preventDefault(); }
  	},

  	onKeyUp: function( e ) {
  		var self = this, field = e.currentTarget;
  		var code = e.keyCode, value = field.value || '';
  		if ( code === 13 || code === 9 ) { return self.selectFocusOption(); }

  		if ( self._isNoneCharacter(e) && value ) { return; }

  		clearTimeout( self.opt.searchTimer );
  		self.opt.searchTimer = setTimeout( function() {
  			self._filterList( value );

  			var option = (self.state.matched || [])[0];
  			if ( ! option ) return;

  			var text = option.label, interval = [value.length,text.length];
  			// Second text matche
  			var beginning = self._createRegexp( value, 1, 1, 2 );
  			if ( ! text.match(beginning) ) {
  				var reg = self._createRegexp( value+'.*',1,1,1);
  				var splited = text.split( reg );
  				if ( splited[2] ) {
  					splited.unshift( splited[2] );
  					splited[3] = null;
  					text = self._trim( splited.join(' ').replace( /\-/, ''), true);
  					interval = [value.length,text.length];
  				}	
  			}

  			field.value = text;
  			self._selectText(interval[0],interval[1],field);  			
  			self.opt.searchTimer = setTimeout(function(){
  				if ( self._getSelectText() ) return;
	  			self._selectText(interval[0],interval[1],field);  			
  			}, 35 );
  		}, 50 );
  	},

  	hideList : function( force ) {
  		var self = this;
    	clearTimeout( self.opt.hideTimer );

    	if ( force ) return self.setState({'open':false});

    	self.opt.hideTimer = setTimeout( function() {
			self.setState({'open':false});
    	}, 200 );
  	},	

  	showList : function() {
  		var self = this, field = self.refs.field;
  		if ( field && ! field.value ) {
  			if ( self.state.selected.length === 1 ) {
	  			field.value = self.state.selected[0].label;
	  		}
  		}

    	clearTimeout( self.opt.hideTimer );
    	if ( ! self.state.open ) {
    		self.opt.reg = null;
	    	self.setState({'open':true,'matched': null});
	    	setTimeout( function() { 
	    		var value = field.value || '';
	    		field.focus(); 
	    		self._selectText(0,value.length, field);
	    	}, 50);
	    }
  	},

  	getOption : function() {
  		var self = this, list = self.state.matched || self.state.list; 
  		var length = list.length, i = 0, out = [];

		for ( i; i<length; i++ ) {
			var label = list[i].label, type = 'item' + (list[i].selected ? ' -selected' : '') +
				(self.state.matched && ! i ? ' -focus' : '');
			if ( self.opt.reg ) label = self._highLightText(label, self.opt.reg);

			out.push(
				<li key={i}>
					<a className={type} href="" data-index={list[i].index} onClick={self.clickOption}  dangerouslySetInnerHTML={{__html: label}}></a>
				</li>
			);
		}
		return out;
  	},

  	clickOption : function( e ) {
  		e.preventDefault();
  		var target = e.currentTarget; 
  		var index = parseInt( target.getAttribute('data-index') );
  		if ( ! isNaN(index) ) this.selectOption( index );
  	},

  	selectOption : function( index ) {
  		var option = (this.state.list || [])[index];
  		if ( ! option || option.selected ) return;

  		// single mode
  		if ( this.state.selected[0] ) this.state.selected[0].selected = false;
  		option.selected = true;

  		var view = this.getDropdownBtnView( [option] );
  		view.selected = [option];
  		view.open     = false;
  		this.setState( view );
  	},

  	selectFocusOption : function() {
		var self = this, children = self.refs.list.children || [];
		var mode = '-focus', length = children.length;
		for ( var i=0; i<length; i++ ) {
			if ( self._hasClass(children[i].children[0],mode) ) { 
				return children[i].children[0].click();
			}
		}
  	},

	_toggleFocus : function( item ) {
		var self = this, children = self.refs.list.children || [];
		var mode = '-focus', length = children.length;
		for ( var i=0; i<length; i++ ) {
			self._removeClass( children[i].children[0], mode );
		}

		self._addClass( item, mode );
	},

  	_filterList: function( text ) {
  		if ( ! text ) {
  			this.opt.reg = null;
  			return this.setState({'matched': null});
  		}
  	
  		this.opt.reg = this._createRegexp( text, 1, 1, 1 );
  		var matched = [], list = this.state.list || [], length = list.length;
  		for ( var i=0; i<length; i++ ) {
  			if ( ! list[i].label.match(this.opt.reg) ) continue;
  			matched.push( list[i] );
  		}
  		this.setState({'matched': matched});	
  	},

  	_createRegexp : function( text, g, i, b, f ) {
		if ( text == '*' ) { return /.*/; }
		var v = text.replace( /\*/, '.*' ).replace( /\+/g, '\\+' );
		var m = (g && i) ? 'gi' : ( (g || i) ? (g ? 'g' : 'i') : '' );
		var s = b ? (b === 2 ? '^' : '(^|\/|\\s+)') : '';
		var e = f ? (f === 2 ? '$' : '($|\/|\\s+)') : '';
		return new RegExp( s+'('+v+')'+e, m );
  	},

  	_highLightText : function ( text, reg, all ) {
		if ( text.match( /<([\w]+)[^>]*>(.*?)<\/\1>/ ) ) return text;

		return ! all ? text.replace( reg, function( $0 ) {
			var s = '', t = $0;
			if ( t.match(/^\s/ ) ) {
				s = ' '; 
				t = t.replace( /^\s/, '');
			}
			return s + '<span class="highLigth">'+ t +'</span>';
		}) : ('<span class="highLigth">'+(text||'')+'</span>');
	},

	_getSelectText : function () {
		var text = '';
		if (window.getSelection) {
			text = window.getSelection().toString();
		} else if (document.selection && document.selection.type != 'Control') {
			text = document.selection.createRange().text;
		}
		return text;
	},

	_selectText : function( start, end, field ) {
		if ( ! field ) return;

		var value = field.value || '';
		if ( isNaN(end) ) { end = value.length; }

		var interval = [isNaN(start) ? 0 : start, isNaN(end) ? 0 : end];
		if ( ! isNaN(interval[0]) && ! isNaN(interval[1]) ) {
			if (field.setSelectionRange) { // Firefox and other gecko based browsers
				field.setSelectionRange(interval[0], interval[1]);
			}
			else if (field.createTextRange) { // Internet Explorer
				var range = field.createTextRange();
				range.collapse(true);
				range.moveEnd('character', interval[0]);
				range.moveStart('character', interval[1]);
				range.select();
			}
			else if (field.selectionStart) { // Other browsers
				field.selectionStart = interval[0];
				field.selectionEnd   = interval[1];
			}
		}
	},

    _isNoneCharacter: function ( e ) {
        var code = e ? e.keyCode || 0 : 0;
        if ( ! code || e.shiftKey || e.ctrlKey ) { return true; }

        var test = {
        	'9' : true,  // tab
        	'13': true,  // enter	
        	'8' : true   // back
        };

        return (code>=16 && code<=18) || test[code] || (code>=35 && code<=40) ?
            true : false;
    },

	_getClosestParent : function( dom, what, idTest ) {
		var self = this, verify = function( parent, type, specific ) {
			if ( ! parent || (parent.tagName||'').match(/^html/i) ) { return; }

			if ( specific ) {
				var t = parent.getAttribute('id')==type;
				return t ? parent : verify( parent.parentNode, type, specific );
			}		
			return self._hasClass(parent,type) ? parent : 
				verify( parent.parentNode, type, specific );
		};
		return what ? verify( dom, what, idTest ) : null;
	},

	_hasClass: function( target, type ){	
		if ( ! target ) { return; }
		var v = target && target.tagName ? (target.getAttribute('class') || '') : '';
		var r = new RegExp( '(^|\\s+)'+type+'($|\\s+)', 'g' );
		return v.match( r ) != null;
	},

	_addClass: function( target, type ){
		if ( ! target ) { return; }

		var v = target.getAttribute('class');
		if ( ! v  ) return target.setAttribute('class', type); 

		var r = new RegExp( '(^|\\s+)'+type+'($|\\s+)', 'g' );
		if ( ! v.match(r) ) { target.setAttribute('class',  this._trim(v+' '+type,true)); }
	},

	_removeClass : function( target, type ){	
		if ( ! target ) { return; }
		
		var v = target.getAttribute('class');
		if ( ! v ) { return; }

		var r = new RegExp( '(^|\\s+)'+type+'($|\\s+)', 'g' );
		if ( v.match( r ) ) {
			target.setAttribute( 'class', this._trim((v.split(r)).join(' '), true) );
		}
	},

	_trim : function ( text, multipleWhiteSpace ) {
		var out = (text || '').replace( /^\s+/, '').replace( /\s+$/g, '');
		return multipleWhiteSpace ? out.replace( /\s+/g, ' ' ) : out;
	},

	_calling : function( e, callback ) {
		var calling = (this.props.calling || {})[e.type];
		if ( typeof(calling) === 'function' ) {
			calling({
				'event':e, 'component': this, 'callback':callback, 
				'validation': this.props.validation
			});
		}
	}
});

module.exports = DropdownMenu;