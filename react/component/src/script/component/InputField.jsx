var React = require('react');
var Addons = require('react-addons');

var InputField = React.createClass({
	/*************************************************************************
	=== Initialization ===
	*************************************************************************/
	initial : function() {
  		//console.log('init..');
	},

	getDefaultProps : function() {
  		//console.log('getDefaultProps..');
	},

	getInitialState: function() {
  		//console.log('getInitialState..');
		return { 
			'focus': false,
			'value': this.props.value,
			'error': ''
		};
	},

	componentWillMount  : function() {
  		//console.log('componentWillMount..');
	},

	render : function() {
  		//console.log('render..');
    	var cx = Addons.classSet, classes = cx({
			'input-field': true,
			'-has-value'  : this.state.value ? true : false,
			'-has-error'  : this.state.error ? true : false,
			'-on-focus'  : this.state.focus
		});

		var input = (
			<input name={this.props.name} type={this.props.type} defaultValue={this.state.value}
				onBlur={this.onBlur} onKeyUp={this.onKeyup} onFocus={this.onFocus}
				ref="input" id={this.props.id} className={classes} spellCheck="false" autoComplete="off"/> 
		);
		return input;
	},

  	componentDidMount : function() {
  		var self = this, target = self.refs.input;
  		if ( ! target ) return;

  		if ( this.props.required ) {
  			target.setAttribute('required','true');
  			target.setAttribute('aria-required','true');
  		}

  		if ( this.props.maxlength ) {
  			var length = this.props.maxlength;
  			if ( this.props.validation.personnumber     ) length += 1;
  			if ( this.props.validation.accountnumber    ) length += 2;
  			if ( this.props.validation.creditcardnumber ) length += 3;
  			target.setAttribute('maxlength',length);
  		}

  		if ( this.props.minlength ) 
  			target.setAttribute('minlength',this.props.minlength);

  		if ( this.props.disalbed ) 
  			target.setAttribute('disabled','true');

  		if ( this.state.error ) 
  			target.setAttribute('aria-invalid','true');

		target.addEventListener('change-state', function(e) {
  			if ( e.detail ) self.setState( e.detail );
		}, false );

		target.addEventListener('get-state', function(e) {
			if ( e.detail && typeof(e.detail.callback) == 'function' )
				e.detail.callback( self.state );
		}, false );

		/*
		target.addEventListener('get-validation', function(e) {
			if ( e.detail && typeof(e.detail.callback) == 'function' )
				e.detail.callback( self.props.validation || {} );
		}, false );
		*/
  	},

	/*************************************************************************
	=== State Changes ===
	*************************************************************************/
	shouldComponentUpdate: function(nextProps, nextState){
    	return true; // return a boolean value
    	//console.log('');
	},

	componentWillUpdate: function(nextProps, nextState){
	    // perform any preparations for an upcoming update
    	//console.log('');
	},

	componentDidUpdate: function(prevProps, prevState){
  		var target = this.refs.input;
  		if ( ! target ) return;

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

	onBlur: function( e ) {
    	this.setState({value: e.target.value, 'focus':false});
    	this._calling( e );
  	},

	onKeyup: function( e ) {
    	this.setState({value: e.target.value});
    	this._calling( e );
  	},

	onFocus: function( e ) {
    	this.setState({'focus':true});
    	this._calling( e );
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

module.exports = InputField;