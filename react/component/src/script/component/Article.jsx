var React = require('react');
var Addons = require('react-addons');

var Article = React.createClass({
	getInitialState: function() {
		return { 
			'data': this.props.data || {},
			'id': 'article-'+(new Date()).getTime()+'-'+Math.floor((Math.random()*10000)+1)
		};
	},

	render : function() {
	    var data = this.state.data;

	    var kind    = (data.type || '').toLowerCase().split(',');
	    var type    = 'article -' + (kind.length === 1 ? kind[0] : 'multiple');
	    var date    = data.stamp ? new Date(parseInt(data.stamp)) : null;
	    var title   = <h1 className="article-title">{data.title}</h1>; //
	    var summary = data.summary ? <p className="lead article-summary">{data.summary}</p> : null; //
	    var text    = data.text ? <div className="article-text">{data.text}</div> : null; //
	    var time    = date ? this._convertDateToText( date ) : '-';
	    var banner  = (
	    	<div className="article-banner">
	    		<div className="article-date">{time}</div>
	    		<div className="article-type">{data.type}</div>
	    	</div>
	    ); //

		return (
			<a id={this.state.id} href="" className={type} onClick={this.onClick}>
				{banner} {title} {summary} {text}
			</a>
		);//
	},

	/*************************************************************************
	=== State Changes ===
	*************************************************************************/
	recall: function() {
		console.log('article reacal...');
	},

	onClick : function( e ) {
		e.preventDefault();
		if ( typeof(this.props.clickCallback) === 'function' ) {
			this.props.clickCallback( e, this );
		}
	},

	_convertDateToText : function ( date, separator ) {
	      var l = [date.getDate(),date.getMonth()+1,date.getFullYear()];
	      for ( var i=0; i<l.length; i++ ) {
	          if ( l[i] < 10 ) { l[i] = '0'+l[i]; }
	      }
	      return l.join( typeof(separator)==='undefined' ? '.' : separator );
	},

	_convertTextToDate : function ( text, separator ) {
	    var r = (text ||'').replace( /^\s+/,'').replace( /\s+$/,'');
	    if ( ! r.match( this.opt.pattern ) ) { return null; }

	    var s = r.split( typeof(separator)==='undefined' ? '.' : separator );
	    for ( var i=0; i<s.length; i++ ) {
	      s[i] = parseInt( s[i].replace( /^0/, '' ));
	    }
	    return new Date(s[2],s[1]-1,s[0],0,0,0,0);
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

module.exports = Article;