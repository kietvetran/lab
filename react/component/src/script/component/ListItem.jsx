var React = require('react');
var ListItem = React.createClass({
	getInitialState: function() {
		return { mode: false };
	},

	recall: function() {
		alert( 'recall' );
	},

	toggleItem : function( e ) {
		e.preventDefault();
		this.setState({'mode': ! this.state.mode });
		if ( typeof(this.props.clickCallback) === 'function' ) 
			this.props.clickCallback( e, this.props.index );
	},

	render : function() {
		return (
			<li class="item" className={this.state.mode ? 'yes' : 'no'}>
				<a href="#" onClick={this.toggleItem}>{this.props.text}</a>
			</li>
		);
	}
});

module.exports = ListItem;