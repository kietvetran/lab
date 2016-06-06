var React = require('react');
var SelectBox  = require('./SelectBox.jsx');
var InputField = require('./InputField.jsx');
var InputRadio = require('./InputRadio.jsx');
var InputCheckbox = require('./InputCheckbox.jsx');
var DropdownMenu = require('./DropdownMenu.jsx');
var CalendarField = require('./CalendarField.jsx');

var FormRow = React.createClass({
	/*************************************************************************
	=== Initialization ===
	*************************************************************************/
	getInitialState: function() {
		return { 
			'focus': false, 
			'error': '', 
			'value': this.props.value,
			'show' : this.props.show ? true : false
		};
	},

	render : function() {
		var iId = this.props.id || this.generateId(), cId = this.generateId();
		var type = this.props.type || '';

		var clickable = type.match(/radio|checkbox/i) !== null;
		var callback  = clickable || type.match(/select/i) ? {
			'change': this.verify,
			'changeState': this.changeState
		} : {
			'keyup': this.verify, 
			'blur' : this.verify, 
			'focus': this.verify,
			'changeState': this.changeState
		};

    	return (
			<div className="form-row" ref="row">
				{ 
					clickable ?
						<fieldset>
							{this._getLabelWrapper(iId,cId,callback,clickable)}
							{this._getInfoWrapper(iId,cId,callback,clickable)}  
							{this._getInputWrapper(iId,cId,callback,clickable)}
						</fieldset> //
						: 
						<div>
							{this._getLabelWrapper(iId,cId,callback,clickable)}
							{this._getInfoWrapper(iId,cId,callback,clickable)}  
							{this._getInputWrapper(iId,cId,callback,clickable)}
						</div> //
				}				
			</div> //
		);
	},

	_getLabelWrapper : function( iId, cId, callback, clickable ) {
		var infoBtn = this.props.info && this.props.text ? (
			<a aria-controls={cId} href="" className="info-btn" role="button" onClick={this.toggleInformation}>
				Informasjon om {this.props.info}
			</a> //
		) : null;
					
		return ( clickable ?
			<legend className="row-content -label-wrapper">
				{infoBtn} {this.props.legend || this.props.label}
			</legend> //
			:
			<div className="row-content -label-wrapper">
				{infoBtn} <label htmlFor={iId}>{this.props.legend|| this.props.label}</label>
			</div>	
		);
	},

	_getInfoWrapper : function( iId, cId, callback, clickable ) {
		return this.props.info && this.props.text ? (
			<div id={cId} className="row-content -info-wrapper" role="region" aria-expanded={this.state.show} aria-live="polite">
				<div className="content-holder">
					<div className="text-holder">{this.props.text}</div>
				</div>
			</div> //
		) : null;
	},

	_getInputWrapper : function( iId, cId, callback, clickable ) {
		var self = this, list = [];

		if ( clickable ) {
			list = (self.props.input || []).map(function(data, i){
				var input = null;
				if ( self.props.type === 'radio' )
					input = <InputRadio {...self.props} {...data} id={data.id || iId+'-'+i} calling={callback} ref="input" key={iId+'-'+cId+'-'+i} /> //
				else if ( self.props.type === 'checkbox' )
					input = <InputCheckbox {...self.props} {...data} id={data.id || iId+'-'+i} calling={callback} ref="input" key={iId+'-'+cId+'-'+i} /> //
			 	return input;
			});
		} else if ( (self.props.type || '').match(/select/i) ) {			
			list.push( <SelectBox {...self.props} id={iId} calling={callback} ref="input" key={iId+'-'+cId}/> ); //
		} else if ( (self.props.type || '').match(/dropdown\-menu/i) ) {			
			list.push( <DropdownMenu {...self.props} id={iId} calling={callback} ref="input" key={iId+'-'+cId}/> ); //
		} else if ( (self.props.type || '').match(/calendar/i) ) {			
			list.push( <CalendarField {...self.props} id={iId} calling={callback} ref="input" key={iId+'-'+cId}/> ); //
		} else {
			list.push( <InputField {...self.props} id={iId} calling={callback} ref="input" key={iId+'-'+cId}/> ); //
		}

		return (
			<div className="row-content -input-wrapper">
				{list}
				<div className="info-message -error -hide" aria-hidden="true" role="alert" ref="message"></div>
			</div>
		);
	},

	/*************************************************************************
	=== Other functions ===
	*************************************************************************/
	verify : function( data ) {		
		if ( typeof(this.props.verify) === 'function' )
			this.props.verify( data );
	},

	changeState : function( state ) {		
		var target = this.refs.row, data = {
			'-has-value'  : state.value ? true : false,
			'-has-error'  : state.error ? true : false,
			'-on-focus'   : state.focus
		};

		for ( var type in data ) {
			data[type] ? this.addClass( target, type ) :
				this.removeClass( target, type );
		}

		var message = this.refs.message || '';
		if ( state.error ) {
			this.removeClass( message, '-hide' );
			message.removeAttribute('aria-hidden');
		} else {
			this.addClass( message, '-hide' );
			message.setAttribute('aria-hidden','true');
		}
		message.innerHTML = state.error;
	},

	toggleInformation : function( e ) {		
		if ( e ) e.preventDefault();

		var target = this.refs.row, mode = '-show-information'; 
		var has = this.hasClass( target, mode );
		if ( has ) {
			this.removeClass( target, mode );
		} else {
			this.addClass( target, mode );
		}

		//this.setState({'show': ! this.state.show }); 
	},

	generateId : function () {
		return 'a-'+(new Date()).getTime()+'-'+Math.floor((Math.random()*10000)+1);
	},

	hasClass : function( target, type ){	
		if ( ! target ) return;
		var v = target && target.tagName ? (target.getAttribute('class') || '') : '';
		var r = new RegExp( '(^|\\s+)'+type+'($|\\s+)', 'g' );
		return v.match( r ) != null;
	},

	removeClass : function( target, type ){	
		if ( ! target ) return;
		
		var v = target.getAttribute('class');
		if ( ! v ) return;

		var r = new RegExp( '(^|\\s+)'+type+'($|\\s+)', 'g' );
		if ( v.match( r ) ) 
			target.setAttribute( 'class', this.trim((v.split(r)).join(' '), true) );
	},

	addClass : function( target, type ){
		if ( ! target ) return;

		var v = target.getAttribute('class');
		if ( ! v  ) return target.setAttribute('class', type); 

		var r = new RegExp( '(^|\\s+)'+type+'($|\\s+)', 'g' );
		if ( ! v.match( r ) ) target.setAttribute('class',  this.trim(v+' '+type,true));
	},

	trim : function( text, multipleWhiteSpace ) {
		var out = (text || '').replace( /^\s+/, '').replace( /\s+$/g, '');
		return multipleWhiteSpace ? out.replace( /\s+/g, ' ' ) : out;
	}

});

module.exports = FormRow;