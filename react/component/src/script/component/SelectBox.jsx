var React = require('react');
var Addons = require('react-addons');

var SelectBox = React.createClass({
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
    	var cx = Addons.classSet, classes = cx({
			'select-box': true,
			'-has-value' : this.state.value ? true : false,
			'-has-error' : this.state.error ? true : false,
			'-on-focus'  : this.state.focus
		});

    	var id   = this.props.id || (new Date()).getTime();
    	var list = (this.props.input || []).map( function(data,i) {
    		var value = data.value || '', label = data.label || value;    		 
    		return (<option value={value} key={id+' '+i}>{label}</option>); //

    	});

    	return (
			<select name={this.props.name} onChange={this.onChange} id={id} className={classes} onFocus={this.onFocus} ref="input">
				{list}
			</select> //
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

module.exports = SelectBox;