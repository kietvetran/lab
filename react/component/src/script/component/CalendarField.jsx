var React = require('react');
var Addons = require('react-addons');

var CalendarField = React.createClass({
	/*************************************************************************
	=== Initialization ===
	*************************************************************************/
	opt : {
		'keyupTimer':0, 'hideTimer':0, 'reg':null,	'interval': [], 'controller': 2,	
		'aDay' : 24*60*60*1000,
		'pattern' : /^(0?[1-9]|[12][0-9]|3[01])([\/\-\.])(0?[1-9]|1[012])([\/\-\.])(\d{4})$/,
        'month' : ['Januar','Februar','Mars','April','Mai','Juni','Juli','August','September','Oktober','November','Desember'],
        'week'  : ['Søndag','Mandag','Tirsdag','Onsdag','Torsdag','Fredag','Lørdag']
	},

	initial : function() {
  		//console.log('init..');
	},

	getDefaultProps : function() {
		return {
			'id': 'cf-'+(new Date()).getTime()+'-'+Math.floor((Math.random()*10000)+1)
		};
	},

	getInitialState: function() {
		return { 
			'focus': false,
			'value': this.props.value,
			'interval': [],
			'mode': this.props.mode === 'multiple' ? 'multiple' : 'single',
      'date': new Date(),
      'tabindex': '-1',
			'error': ''
		};
	},

	componentWillMount  : function() {
		var self = this;

    self.opt.view   = typeof(self.props.view)==='number' ?
        (new Date(config.view)) : null;
    self.opt.now    = typeof(self.props.now)==='number' ?
        (new Date(self.props.now)) : (new Date());

    self.opt.nowYear  = self.opt.now.getFullYear();
    self.opt.nowMonth = self.opt.now.getMonth();
    self.opt.nowDate  = self.opt.now.getDate();
    self.opt.now      = new Date( self.opt.nowYear,self.opt.nowMonth, self.opt.nowDate,0,0,0,0,0);
    self.opt.nowTime  = self.opt.now.getTime();
    self.opt.nowDay   = self.opt.now.getDay();
    self.opt.max      = self.props.max || new Date();
    self.opt.min      = self.props.min;
    self.opt.maxTime  = self.opt.max ? self.opt.max.getTime() : -1;
    self.opt.minTime  = self.opt.min ? self.opt.min.getTime() : -1; 
    self.opt.interval = self.props.interval || [null,null];

    var value = (self.props.value || '').split(';'), length = value.length;

		/*
		document.body.addEventListener('mousedown', function(){
			if ( self.state.open ) self.hideList();
		});
		*/
	},

	render : function() {
    	var cx = Addons.classSet, classes = cx({
			'calendar-field': true,
			'-has-value' : this.state.value ? true : false,
			'-has-error' : this.state.error ? true : false,
			'-on-focus'  : this.state.focus
		});

		var id = this.props.id, idWrapper = id+'-cf-wrapper';
		var idA = id+'-inputA', idB = id+'-inputB', inputClass = [
			cx({
				'input-field -calendar-input': true,
				'-has-value' : this.state.value ? true : false,
				'-has-error' : this.state.error ? true : false,
				'-on-focus'  : this.state.focus
			}), cx({
				'input-field -calendar-input': true,
				'-has-value' : this.state.value ? true : false,
				'-has-error' : this.state.error ? true : false,
				'-on-focus'  : this.state.focus
			})
		];
		var table = this.getCalendar(), input = (
			<div id={idWrapper} className={classes}>
				<input name={this.props.name} type="text" defaultValue=""
					onBlur={this.onBlur} onKeyUp={this.onKeyup} onFocus={this.onFocus} maxlength="10"
					ref="inputA" id={idA} className={inputClass[0]} spellcheck="false" autocomplete="off"/>
				<input name={this.props.name} type="text" defaultValue=""
					onBlur={this.onBlur} onKeyUp={this.onKeyup} onFocus={this.onFocus} maxlength="10"
					ref="inputB" id={idB} className={inputClass[1]} spellcheck="false" autocomplete="off"/> 
				<div className="calendar-field-widget" onClick={this.onClickCalendarWidget} tabIndex={this.state.tabindex} onBlur={this.onBlur} onFocus={this.onFocus}>{table}</div>
			</div> //
		);
		return input;
	},

  	componentDidMount : function() {
  		var self = this, target = self.refs.input;
  		if ( ! target ) return;

  		console.log( target );

  		/*
  		if ( this.props.required ) {
  			target.setAttribute('required','true');
  			target.setAttribute('aria-required','true');
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
    var self = this;
    clearTimeout( self.opt.hideTimer );
    self.opt.hideTimer = setTimeout( function() {
    	self.hideCalendar();
    	//self._calling( e );
    }, 200);
	},

	onKeyup: function( e ) {
    var self = this, field = e.target, index = self.opt.focusTarget;
    clearTimeout( self.opt.keyupTimer );
    setTimeout( function() {
      var date = self._convertTextToDate( field.value );
      if ( ! date || isNaN(index) ) { return; }

      var time = date.getTime();
      if ( self.opt.minTime > -1 && time < self.opt.minTime )      { date = null; }
      else if ( self.opt.maxTime > -1 && time > self.opt.maxTime ) { date = null; }

      self._updateInterval( date, index );
    }, 100);
  	//this._calling( e );
	},

	onFocus: function( e ) {
    var self = this, target = e.currentTarget; 

    if ( self._hasClass(target,'-calendar-input') ) {
      var id = target.getAttribute( 'id' );
      var input = self.refs.inputA, aId = input.getAttribute('id');
      self.opt.focusTarget = id === aId ? 0 : 1;
    }

    self.showCalendar();
    clearTimeout( self.opt.hideTimer );

    self._calling( e );
	},

  onClickCalendarWidget : function( e ) {
    e.preventDefault();
    var type = 'calendar-field-item', target = e.target;
    var item = this._getClosestParent( target, type );
    if ( item  ) { 
      return this._hasClass(item,'-out-of-month') ? null : 
        this._clickCalendarDate( item ); 
    }

    type = 'calendar-field-navigation';
    item = this._getClosestParent( target, type );
    if ( item ) {
      return this._hasClass(item,'-disabled') ? null : 
        this._clickCalendarNavigation( item );      
    }

  },

  hideCalendar : function() {
    this.setState({'focus':false});
    this.opt.focusTarget = null;
  },

  showCalendar : function() {
    var state = { 'focus': true };
    if ( ! this.state.focus ) { state.tabindex = '-1'; }

    this.setState( state );
  },

	getCalendar : function() {
		var date = this.state.date || new Date(), data = this._getCalendarData( date );
    var table = this._getCalendarTable( data );

		return (
      <div className="calendar-field-view">
        <div className="calendar-field-header" role="">
          <div className="calendar-feild-name">{data.name}</div>
          <a href="" className="calendar-field-navigation -previous" title={data.minAria} data-stamp={data.minStamp}>
            <span className="invisible">{data.minAria}</span>
          </a>
          <a href="" className="calendar-field-navigation -next" title={data.maxAria} data-stamp={data.maxStamp}>
            <span className="invisible">{data.maxAria}</span>
          </a>
        </div>
        {table}
      </div> //
    );
	},

  _getCalendarData : function( date ) {
      if ( ! date ) { return ''; }
      var d = this._getDateAsList( date ), c = null, f = new Date(d[0],d[1],1,0,0,0,0);
      var monthTimestamp = f.getTime(), row = [], count = 0, day = this.opt.aDay;
      var current = this.opt.nowTime || 0, i = 0, j = 0;
      var active = this.opt.active || {}, min = this.opt.minTime || -1, max = this.opt.maxTime || -1;
      var focus  = this.opt.focusItem || {};

      if ( f.getDay() ) {
          f.setDate( 1-(f.getDay()-1) );
      } else {
          f.setDate( 1-6 );
      }

      var minStamp = f.getTime()-day-1000;
      var minMode  = min > -1 ? (f.getTime() <= min ? 'disabled' : '') : '';

      for ( i=0; i<6; i++ ) {
        var column = [];
        for ( j=0; j<7; j++ ) {
          c = new Date( f.getTime() );
          c.setDate( c.getDate()+ (count++) );

          var t = c.getTime(), n = this._getDateAsList(c), mode = ''+
            (max > -1 ? (max<t ? ' -disabled': '') : '' ) +
            (min > -1 ? (min>t ? ' -disabled': '') : '' ) +
            (n[1] === d[1] ? '' : ' -out-of-month') +
            (current>=t && current<(t+day) ? ' -is-today' : '') +
            (active && active[t] ? ' -selected' : '')+
            (focus && focus[t] ? ' -focus' : '' ) +
            ( j===0 || j===6 ? ' -end-column' : '' );

          column.push({
            'row'   : i+1,
            'aria'  : this._getCalendarDateAriaText( c ),
            'name'  : c.getDate(),
            'mode'  : mode,
            'off'   : mode.match( /out-of-month|disabled/) ? true: false,
            'stamp' : t,
            'date'  : this._convertDateToText(c,''),
            'selected': active && active[t] ? true : false
          });
        }
        row.push({'column':column});
      }

      c.setDate(1);
      if ( c.getMonth() === d[1] ) { c.setMonth(d[1]+1); }

      var maxStamp = c.getTime()+day;
      var maxMode  = max > -1 ? (max<c.getTime() ? 'disabled' : '') : '';

      var loop = this.opt.week.length, week = [];
      for ( i=0; i<loop; i++ ) {
        j = i===0 ? (loop-1) : i-1;
        week[j] = {
          'aria':this.opt.week[i],
          'name':this.opt.week[i].substring(0,2)
        };
      }

      var name  = (this.opt.month[d[1]] + ' ' +d[0]);
      if ( f.getMonth() === d[1] ) { f.setMonth(d[1]-1); }

      var aPrevious = 'Vis '+this._getCalendarDateAriaText( f, true ).toLowerCase();
      var aNext     = 'Vis '+this._getCalendarDateAriaText( c, true ).toLowerCase();

      return {
          'name'      : name,
          'minMode'   : minMode,
          'minStamp'  : minStamp,
          'minAria'   : aPrevious,
          'maxMode'   : maxMode,
          'maxStamp'  : maxStamp,
          'maxAria'   : aNext,
          'week'      : week,
          'row'       : row,
          'monthStamp': monthTimestamp
      };
  },

	_getCalendarTable : function( data ) {
		if ( ! data ) return;

		var week = data.week.map( function(item, i){
			return (
				<th role="presentation" key={i+'-h'}>
			    <span className="invisible">{item.aria}</span>
                  <span className="week-name" aria-hidden="true">{item.name}</span>  				
				</th> //
			);
		});

		var out = data.row.map( function(row, i){
			var column = row.column.map( function(item, j){
				var type = 'calendar-field-item at-row'+i+ 
					(item.mode ? ' '+item.mode : '') +
					(item.selected ? ' selected' : '');

				return (
					<td key={j+'-c'} className={item.off ? 'off':'on'}>
						<a href="#" className={type} aria-selected={item.selected} data-stamp={item.stamp} tabIndex={item.off ? '-1': ''}>
                <span className="invisible">{item.aria}</span>
                <span aria-hidden="true">{item.name}</span>
            </a>
					</td> //
				);
			});
			return (<tr role="presentation" key={i+'t'}>{column}</tr>);//
		});

		return (
		    <table className="calendar-table" aria-label="Kalender" role="application">
		        <thead><tr class="calendar-table-header calendar-weak" role="presentation">{week}</tr></thead>
		        <tbody>{out}</tbody>
		    </table>//
		);
	},

  _getDateAsList : function( date ) {
      return [
          date.getFullYear(),date.getMonth(),date.getDate(),
          date.getHours(),date.getMinutes(),date.getSeconds()
      ];
  },

  _getCalendarDateAriaText: function ( date, onlyMonthAndYear ) {
      if ( ! date ) { return ''; }
      var day   = this.opt.week[ date.getDay() ];
      var month = this.opt.month[date.getMonth()];
      return onlyMonthAndYear ? month +' '+date.getFullYear() :
          day + ', '+date.getDate()+'. '+month +' '+date.getFullYear();
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

  _clickCalendarNavigation : function( item ) {
    var stamp = item ? parseFloat( item.getAttribute('data-stamp') ) : 0; 
    if ( ! stamp || isNaN(stamp) ) { return; }
    var date = new Date( stamp );
    this.setState({'date': date});
  },

  _clickCalendarDate : function( item ) {
    var stamp = item ? parseFloat( item.getAttribute('data-stamp') ) : 0; 
    if ( ! stamp || isNaN(stamp) ) { return; }

    var self = this, isSelected = self._hasClass( item, 'selected' ); 
    var index = null, toggler = false, date = new Date( stamp ); 
    var controller = self.opt.controller, interval = self.opt.interval || [];

    if ( interval.length === 1 ) {
      index = 0;
    }
    else if ( controller === 2 && interval.length === 2 ) {
      index = isNaN(self.opt.focusTarget) ?  -1 : self.opt.focusTarget;
      if ( index  === -1 ) {
        index = 0;
        //index = controller.eq(0).is(':focus') ? 0 : 1;
      } else if ( index < 0 ) {
        index = 0;
      } else if ( index > 1 ) {
        index = 1;
      }

      //index = controller.eq(0).is(':focus') ? 0 : 1;
      if ( isSelected && interval[index] === stamp ) { date = null; }
    }
    /*
    else if ( controller === 1 && interval.length === 2 ) {
      toggler = true;
      if ( interval[0]===null ) {
        index = 0;
      } else if ( interval[0]===stamp && isSelected ) {
        index = 0; date = null;
      } else if ( interval[1]===stamp && isSelected ) {
        index = 1; date = null;
      } else if ( interval[0] && interval[1]===null ) {
        index = 1;
      } else if ( interval[0]<stamp && stamp<interval[1] ) {
        index = (stamp-interval[0]) < (interval[1]-stamp) ? 0 : 1;
      } else if ( interval[0]>stamp  ) {
        index = 0;
      } else if ( interval[1]<stamp  ) {
        index = 1;
      }
    }
    */

    self._updateInterval( date, index );
    self._updateField();


    //self._renewCalendarTable();
    /*
    if ( hideCalendar ) {
        self.field.focus();
        setTimeout( function(){ self.hideCalendar( true ); }, 100 );
    }
    */
  },

  _updateInterval : function( stamp, where ) {
    var self = this, interval = self.opt.interval || [], index = where;
    if ( stamp !== null && typeof(stamp)==='object') {
        stamp = stamp.getTime();
    }

    interval[index] = stamp; 
    self.opt.active = {};
    if ( interval.length === 1 ) {
        if      ( interval[0] < self.opt.minTime ) { interval[0] = self.opt.minTime; }
        else if ( interval[0] > self.opt.maxTime ) { interval[0] = self.opt.maxTime; }
        self.opt.active[ interval[0] ] = true;
    }
    else if ( interval[0] === null && interval[1] ) {
        if ( interval[1] > self.opt.maxTime ) { interval[1] = self.opt.maxTime; }
        self.opt.active[ interval[1] ] = true;
    }
    else if ( interval[0] && interval[1] === null ) {
        if ( interval[0] < self.opt.minTime ) { interval[0] = self.opt.minTime; }
        self.opt.active[ interval[0] ] = true;
    }

    if ( interval[0] && interval[1] ) {
        if ( interval[0] < self.opt.minTime ) { interval[0] = self.opt.minTime; }
        if ( interval[1] > self.opt.maxTime ) { interval[1] = self.opt.maxTime; }

        var count = 0;
        if ( interval[0] > interval[1] ) {
            var holder  = interval[1];
            interval[1] = interval[0];
            interval[0] = holder;
        }
        var a = new Date(interval[0]);
        var b = new Date(interval[1]);
        while ( a.getTime()<=b.getTime() && count<1000 ) {
            self.opt.active[a.getTime()] = true;
            a.setDate( a.getDate()+1 );
            count++;
        }
    }

    self.setState({'interval':interval,'tabindex':'0'});
    console.log( self.state );
  
    /*
    if ( self.SCwrapper ) {
        var item = self.SCwrapper.find('> .calendar-shortcut-item');
        item.removeClass('active');
        if ( interval && (interval[0]||interval[1]) ) {
            var s = [interval[0]||interval[1], interval[1]||interval[0]];
            item.filter('.TIMESTAMP'+s.join('-')).addClass('active');
        }
    }
    */
  },

  _updateField : function() {
    var self = this, interval = self.opt.interval || [];
    var field = [self.refs.inputA, self.refs.inputB];
    for ( var i=0; i<field.length; i++ ) {
      if ( ! field[i] ) { continue; }

      var text = ! interval[i] ? '' :
        self._convertDateToText( new Date(interval[i]) );
      field[i].value = text;
    }
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

module.exports = CalendarField;