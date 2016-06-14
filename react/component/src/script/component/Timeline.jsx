var React = require('react');
var Addons = require('react-addons');

var Timeline = React.createClass({
	/*************************************************************************
	=== Initialization ===
	*************************************************************************/
  opt : {
    'timer'      : 0,
    'slider'     : null,
    'list'       : [],
    'touchRender': 0,
    'setting'    : {}
  },

	initial : function() {
		//console.log('init..');
	},

	getDefaultProps : function() {
	},

	getInitialState: function() {
		return { 
		};
	},

	componentWillMount  : function() {
    var self = this, verify = function( e ) {
      if ( ! self.opt.slider ) return;

      e.preventDefault();
      if  ( e.type === 'mouseup'   || e.type === 'touchend'   ) {
        self.opt.slider = null;
        if ( e.type === 'touchend' ) {
          self.opt.touchRender = (opt.touchRender || 0)+1;
          setTimeout( function() { self.opt.touchRender = 0; }, 50 );
        }
      }
      else if ( e.type === 'mousemove' || e.type === 'touchmove'  ) {
        self._render( e, self.opt.slider );
        if ( e.type === 'touchmove' ) { self.opt.touchRender = 1; }
      }
    };

    document.addEventListener('mouseup',   verify, false);
    document.addEventListener('mousemove', verify, false);
    document.addEventListener('touchend',  verify, false);
    document.addEventListener('touchmove', verify, false);

    var list = this.props.list || [], length = list.length;
    for ( var i=0; i<length; i++ ) {
      var data = JSON.parse( JSON.stringify(list[i]) );
      data.time = typeof(data.date) === 'number' ? (new Date(data.date) ) :
        this._convertTextToDate( data.date );
      if ( data.time ) { this.opt.list.push( data ); }
    }

    this.opt.list = this.opt.list.sort( function(a,b) {
      var x = a.time.getTime(), y = b.time.getTime();
      return ((x > y) ? 1 : ((x < y) ? -1 : 0));
    });
	},

	render : function() {
		var pin = this._getTimePin(), input = (
      <div role="application" className="timeline-wrapper" ref="wrapper">
        <div className="timeline-view" ref="view">
          <div className="timeline-slider" ref="slider" onMouseDown={this.onStart} onTouchStart={this.onStart}>
            {pin}
            <div className="timeline-line" ref="liner"></div>
          </div>
        </div>
      </div>
		); //
		return input;
	},

  componentDidMount : function() {
    var slider = this.refs.slider, wrapper = this.refs.wrapper, liner = this.refs.liner;
    if ( ! slider || ! wrapper || ! liner ) { return; }

    var item = slider.children || [], count = item.length-1, i = 0;
    if ( ! count ) { return; }

    var setting     = this.opt.setting || {};
    setting.pin     = [item[0].clientWidth, item[0].clientHeight];
    setting.wrapper = [wrapper.clientWidth, wrapper.clientHeight];

    var itemMax = (setting.pin[0]*count)+setting.pin[0];
    var width   = itemMax > setting.wrapper[0] ? itemMax : 
      setting.wrapper[0];

    setting.slider = [width, 0];
    setting.limit  = [0, width-setting.wrapper[0]];

    liner.innerHTML = '<span>&nbsp;</span>';
    setting.space = liner.children[0].clientWidth;

    var line = [], length = parseInt(width/setting.space)+1;
    for (i=0; i<length; i++ ) {
      line.push('<span>'+i+'</span>');
    }
    liner.innerHTML = line.join('');

    var j = 0, h = 10, level = parseInt(setting.pin[0] / setting.space);
    for ( i=0; i<count; i++ ) {
      item[i].style.marginLeft = (setting.space*i)+'px';
      if ( level ) {
        item[i].style.marginTop  = (setting.pin[1]*j) + (j ? (h*j) : 0) + 'px';
        j = level === j ? 0 : (j+1);
      }
    }

    wrapper.style.height = (level*setting.pin[1])+(setting.pin[1]*2)+(h*level)+'px';
    this.opt.setting = setting;
  },

	/*************************************************************************
	=== Other functions ===
	*************************************************************************/
  onStart : function( e ) {
    if ( e ) e.preventDefault();
    this.opt.slider = this.refs.slider;
  },

  getOffset : function( dom ) {
    var size = [0,0];
    do {
      size[0] += dom.offsetLeft || 0;
      size[1] += dom.offsetTop  || 0;
      dom = dom.offsetParent;
    } while( dom );
    return size;
  },

  getWindowSize : function (){
    var size = [0, 0];
    if( ! window.innerWidth ) { // IE 
      if( !(document.documentElement.clientWidth == 0) ){
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
    return size;
  },

  /*************************************************************************
  === Other functions ===
  *************************************************************************/  
  _getEventPosition : function( e, touch ) {
    if ( ! e ) { e = window.event; }
    var target = (e.targetTouches || e.changedTouches || [])[0], pos = [
      e.clientX || e.pageX || (touch && target ? target.pageX : 0),  
      e.clientY || e.pageY || (touch && target ? target.pageY : 0)
    ];

    if ( pos[0]===0 && pos[1]===0 ) {
      try {
        pos =[e.originalEvent.touches[0].pageX,e.originalEvent.touches[0].pageY];
      } catch(error) { pos = [0,0]; } 
    }
    return pos;
  },

  _getTrackPercent : function( e ) {
    if ( ! e ) return 0;  
    var track  = this.refs.wrapper; 
    var offset = this.getOffset( track ), left = offset[0];
    var where = [left, left+track.clientWidth]; 
    var x     = this._getEventPosition(e, e.type.match(/touch/i) )[0];

    if ( x < where[0] || x > where[1] ) return x < where[0] ? 0 : 100; 
    return parseFloat( (x-where[0])/(where[1]-where[0]) )*100;
  },

  _render : function( e, slider ) {
    if ( ! slider ) return;

    var self = this, percent = 0, size = [self.state.min, self.state.max];
    if ( typeof(force)==='number' ) {
      if ( ! size ) return;       
      percent = parseFloat((force-size[0]) / (size[1]-size[0]))*100;
    } else if ( e ) {
      percent = self._getTrackPercent( e );
    }
    console.log('P: '+percent);
  },

  _getTimePin : function( ) {
    var out = [], list = this.opt.list || [];
    for ( var i=0; i<list.length; i++ ) {
      var data = list[i];
      if ( ! data ) { continue; }

      var date = this._convertDateToText( data.time );    
      var key = data.time.getTime() + '-'+i;

      out.push(       
        <a key={key} href="" className="timeline-pin">
          <div className="timeline-pin-date">{i} ==== {date}</div>
          <div className="timeline-pin-title">{data.title}</div>
          <div className="timeline-pin-text">{data.text}</div>
        </a>
      );
    }
    return out;
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

module.exports = Timeline;