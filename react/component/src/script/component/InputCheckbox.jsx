var React = require('react');
var Addons = require('react-addons');

var InputCheckbox = React.createClass({
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
			'input-checkbox': true,
			'-has-value' : this.state.value ? true : false,
			'-has-error' : this.state.error ? true : false,
			'-on-focus'  : this.state.focus
		});

		return (
			<div className="checkbox-holder">
				<input name={this.props.name} type={this.props.type} defaultValue={this.state.value}
					onFocus={this.onFocus} onChange={this.onChange}
					id={this.props.id} className={classes} ref="input"/> 
				<label htmlFor={this.props.id}>{this.props.label || this.props.value}</label>
			</div>
		);
	},

  	componentDidMount : function() {  		
  		var self = this, target = self.refs.input;
  		if ( ! target ) return;

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
	onChange: function( e ) {
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

module.exports = InputCheckbox;