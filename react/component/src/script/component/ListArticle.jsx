var React = require('react');
var Article = require('./Article.jsx');

var TYPE = ['Trading','Buying','Gift','Saling'];
var TEXT = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla sed vehicula lorem. Cras quis tellus at arcu imperdiet mollis ac non turpis. Sed fermentum dui lorem, id imperdiet diam imperdiet sit amet. Aenean sollicitudin lectus vel justo semper aliquam. Phasellus suscipit massa eu tempus tempor. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed augue ligula, condimentum facilisis fringilla non, aliquet in tellus. Sed sed augue consectetur, dapibus urna eget, blandit mauris. Sed fringilla congue finibus. Curabitur suscipit vestibulum tortor ut suscipit. Sed id mi non est aliquet condimentum ut sed mi. Ut eu nisl consectetur, molestie orci id, suscipit erat. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.';
var TEMP = TEXT.split(' ');
var JSON = [];
var TIME = (new Date()).getTime();

for ( var i=0; i<100; i++ ) {
	var data = {'id':'j-'+i}, max = TYPE.length, interval = [0,0], tmp = [], x = 0;
	data.type  = TYPE[ Math.floor(Math.random() * max) ];
	data.stamp = TIME - (Math.floor(Math.random() * 10000000) * 1000);

	max = TEMP.length - 1;
	while( (interval[1]-interval[0]) <= 0 || (interval[1]-interval[0]) > 10 ) {
		interval = [ Math.floor(Math.random() * max), Math.floor(Math.random() * max) ];
		if ( interval[1]<interval[0] ) {
			x = interval[0];
			interval[0] = interval[1];
			interval[1] = x;
		}
	}
	for ( interval[0]; interval[0]<interval[1]; interval[0]++ ) {
		tmp.push( TEMP[interval[0]] );
	}
	data.title = tmp.join(' ');

	interval = [1,0]; tmp = [];
	while( (interval[1]-interval[0]) < 0 ) {
		interval = [ Math.floor(Math.random() * max), Math.floor(Math.random() * max) ];
		if ( interval[1]<interval[0] ) {
			x = interval[0];
			interval[0] = interval[1];
			interval[1] = x;
		}
	}
	for ( interval[0]; interval[0]<interval[1]; interval[0]++ ) {
		tmp.push( TEMP[interval[0]] );
	}
	data.summary = tmp.join(' ');

	interval = [0,0]; tmp = [];
	while( (interval[1]-interval[0]) <= 0 ) {
		interval = [ Math.floor(Math.random() * max), Math.floor(Math.random() * max) ];
		if ( interval[1]<interval[0] ) {
			x = interval[0];
			interval[0] = interval[1];
			interval[1] = x;
		}
	}
	for ( interval[0]; interval[0]<interval[1]; interval[0]++ ) {
		tmp.push( TEMP[interval[0]] );
	}
	data.text = tmp.join(' ');
	JSON.push( data );
}

var ListArticle = React.createClass({
	getInitialState: function() {
		return { items: [] };
	},

	handleClick:  function( e, article ) {
		var data = article ? article.state.data : null;
		if ( ! data ) { return; }

		console.log('yes...');
		if ( article && typeof(article.recall)==='function') { article.recall(); }
	},

	componentWillMount  : function() {
		var self = this;

		/*
		document.body.addEventListener('mousedown', function(){
			if ( self.state.open ) self.hideList();
		});
		*/
	},

	render: function() {
		var self = this, tmp = [];
		var list = JSON.map(function(data, i){
			var item = (
				<li key={data.id} className="article-item">
					<Article clickCallback={self.handleClick} data={data}/>
				</li>
			);
			self.state.items.push(item);
			return item;
		});	
		return (<ol className="article-list">{list}</ol>); //
	}
});

module.exports = ListArticle;