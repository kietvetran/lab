var React = require('react');
var ListItem = require('./ListItem.jsx');

var ingredients = [{'id':'1','text':'Chicken'},{'id':'2','text':'Cheese'},{'id':'3','text':'Bread'}];

var List = React.createClass({
	getInitialState: function() {
		return { items: [] };
	},

	handleClick:  function( e, index ) {
		alert('callback : '+ index);
		var item = this.state.items[ index ];
		if ( item && typeof(item.recall)==='function')
			item.recall();
	},

	render: function() {
		var self = this, tmp = [];
		var list = ingredients.map(function(item, i){
			var item = <ListItem key={item.id} text={item.text} clickCallback={self.handleClick} index={i}/>; //
			self.state.items.push(item);
			return item;
		});	
		return (<ul className="test-list">{list}</ul>); //
	}
});

module.exports = List;