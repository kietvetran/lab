/****
 * 
 */
;(function($) { $.fn.Signature = function( config ) {
  if ( ! config ) { config = {}; }

  /****************************************************************************
    === CONFIGURATION OPTION === 
  ****************************************************************************/
  var opt = {
    'main'         : this,
    'points'       : [],
    'events'       : [],
    'index'        : 0,
    'sAngle'       : 0,
    'eAngle'       : (1 * Math.PI),
    'canvas'       : config.canvas   || null,
    'bgColor'      : config.bgColor  || 'rgba(0,0,0,0)',
    'penColor'     : config.penColor || '#000',
    'dotSize'      : config.dotSize  || 1.5,
    'endCallback'  : config.endCallback    || null,
    'beginCallback': config.beginCallback  || null,
    'underline'    : config.underline      || null,
    'offset'       : [],
    'mouse'        : {'x':0,'y':0},
    'counter'      : 0,
    'drawTimer'    : 0,
    'resize'       : config.resize
  };

  var helper = {
    /*************************************************************************
      === Initialization ===
    **************************************************************************/
    init : function() {
      var main = opt.main;
      opt.android = helper.isAndroid();

      if ( ! opt.canvas ) {
        if ( main.is('canvas') ) { opt.canvas = main.get(0); }
        else {
          opt.canvas = main.find('canvas');
          opt.canvas = opt.canvas.size() ? opt.canvas.get(0) :
            $('<canvas></canvas>').appendTo( main ).get(0);
        }
      } 
      opt.ctx     = opt.canvas.getContext('2d');
      opt._canvas = document.createElement('canvas');
      opt._ctx    = opt._canvas.getContext('2d');
      opt.canvas.parentNode.appendChild(opt._canvas);
      opt._canvas.setAttribute('style', 'position:absolute;left:0;top:0;width:100%;heigth:100%;');

      helper.setupEvent();
      helper.setupSize();
      helper.clear();
    },

    setupEvent : function() {
      if ( opt.resize !== false ) {
        window.addEventListener('resize', helper._resize, false);
      }
      window.addEventListener('scroll', helper._scroll, false);

      if ( ! helper.isTouchDevice() ) {
        opt._canvas.addEventListener('mousemove', helper._onMove, false);
        opt._canvas.addEventListener('mousedown', helper._onDown, false);
        opt._canvas.addEventListener('mouseup', helper._onUp, false);
        return;
      }

      opt._canvas.addEventListener('touchmove', function(e){
        helper.unsetCanvasMouseEvent();
        e.preventDefault(); // Prevent scrolling
        if ( !e.changedTouches[0].type ) { e.changedTouches[0].type = e.type; }
        helper._onMove( e.changedTouches[0], true );
      }, false);
      opt._canvas.addEventListener('touchstart', function(e){
        helper.unsetCanvasMouseEvent();
        if ( !e.changedTouches[0].type ) { e.changedTouches[0].type = e.type; }
        helper._onDown( e.changedTouches[0], true );
      }, false);
      opt._canvas.addEventListener('touchend', function(e) {
        helper.unsetCanvasMouseEvent();
        if ( !e.changedTouches[0].type ) { e.changedTouches[0].type = e.type; }
        helper._onUp( e.changedTouches[0], true );
      }, false);
    },

    setupSize : function() {
      opt.canvasSize     = [opt.canvas.clientWidth, opt.canvas.clientHeight];
      opt.canvas.width   = opt.canvasSize[0];
      opt.canvas.height  = opt.canvasSize[1];      
      opt._canvas.width  = opt.canvasSize[0];
      opt._canvas.height = opt.canvasSize[1];
    },

    /*************************************************************************
      === PUBLIC FUNCTIOn ===
    **************************************************************************/
    unsetCanvasMouseEvent : function() {
      opt._canvas.onmousedown = null;
      opt._canvas.onmouseup   = null;
      opt._canvas.onmousemove = null;
    },

    clear : function() {
      opt.ctx.clearRect(0, 0, opt.canvasSize[0], opt.canvasSize[1]);  // Clearing tmp canvas    
      opt.points  = [];    // Emptying up Pencil Points
      opt.isEmpty = true;
      opt.events  = [], 
      helper._updateUnderline();      
    },

    getPNG  : function() { return opt.canvas.toDataURL('image/png', 1.0);  },
    getJPEG : function() { return opt.canvas.toDataURL('image/jpeg', 1.0); },

    getSVGimagePNG : function() {
      var png    = helper.getPNG(), size = helper.getSize();
      var w3svg  = 'http://www.w3.org/2000/svg';
      var w3link = 'http://www.w3.org/1999/xlink';

      var img = document.createElementNS( w3svg, 'image' );
      img.setAttributeNS( w3link, 'xlink:href', png ); //CREATE SVG IMAGE OBJECT
      img.setAttributeNS( null, 'width', size[0] );    //CENTER OF THE CIRCLE Y
      img.setAttributeNS( null, 'height', size[1] );   //CENTER OF THE CIRCLE Y

      return '<svg xmlns:xlink="'+w3link+'" xmlns="'+w3svg+'" id="SVG_signature">'+
        img.outerHTML +'</svg>';
    },

    getSVG : function() {
      /*
      var data = [{
        "x":[195,203,205,208,211,216,221,227,233,239,245,250,255,259,261,263,266,268,272],
        "y":[181,173,169,167,164,160,154,146,139,130,123,117,109,104,98,95,91,86,82]
      }];

      data = [{"x":[358],"y":[194]}];
      data = [{"x":[307,308,309],"y":[213,209,205]}];
      */
      //var data = JSON.parse(JSON.stringify(opt.collection));
      var data = helper._getCollection();
      if ( opt.underline ) { 
        if ( opt.underline.svg.line ) { data.push( opt.underline.svg.line ); }
        if ( opt.underline.svg.text ) { data.push( opt.underline.svg.text ); }
      }
      return helper._generateSVG( data );
    },

    isEmpty : function() { return opt.isEmpty; },

    isTouchDevice : function(){
      var test =  !!('ontouchstart' in window) // works on most browsers 
        || !!('onmsgesturechange' in window); // works on ie10 
      
      if ( test && isIE() > 10 )
        test = !!(navigator.msMaxTouchPoints);
      return test;
    },

    isAndroid : function() {
      var ua = navigator.userAgent.toLowerCase();
      var m = ua.match( /android(\s+)?([1-9\.]+)/i );
      return m ? parseFloat( m[m.length -1] ) : 0;
    },

    getSize : function() {
      return opt.canvas ? [opt.canvas.clientWidth,opt.canvas.clientHeight] : [0,0]; 
    },

    getCanvas : function() { return opt.canvas; },

    getRatio : function() {
      return Math.max(window.devicePixelRatio || 1, 1);
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
    
    getScrollPosition : function( force ) {
      var size = opt.scrollPosition;
      if ( ! size || force ) {
        size = [0,0];
        if (typeof window.pageYOffset != 'undefined') {
          size = [window.pageXOffset, window.pageYOffset];
        } else if (
          typeof document.documentElement.scrollTop != 'undefined' && 
          document.documentElement.scrollTop > 0
        ) { 
          size = [ 
            document.documentElement.scrollLeft,
            document.documentElement.scrollTop
          ];
        } else if (typeof document.body.scrollTop != 'undefined') {
          size = [document.body.scrollLeft, document.body.scrollTop];
        }
        opt.scrollPosition = size;
      }
      return size;
    },

    /*************************************************************************/
    _addEvent : function ( e ) {
      opt.events.push({'type': e.type,'clientX':e.clientX,'clientY':e.clientY});
    },

    _scroll : function() {
      if ( opt.scrollTimer ) { clearTimeout(opt.scrollTimer); }
      opt.scrollTimer = setTimeout( function() {
        helper.getScrollPosition( true );
      }, 100 );
    },

    _resize : function( ) {
      if ( opt.resizeTimer ) { clearTimeout(opt.resizeTimer); }
      opt.resizeTimer = setTimeout( function() {
        helper.getScrollPosition( true );
        var test  = [opt.canvas.clientWidth, opt.canvas.clientHeight]; 
        if ( ! test[0] || ! test[1] ) { return; }//The error occurs when the canvas is displaying none

        var list  = JSON.parse(JSON.stringify(opt.events||'[]')); 
        var oSize = JSON.parse(JSON.stringify(opt.canvasSize));
        var loop  = list.length, i = 0; 

        helper.setupSize();
        helper.clear();
        if ( ! loop ) { return; }

        var ratio = parseFloat( (oSize[0]/oSize[1])*(opt.canvasSize[1]/opt.canvasSize[0]));
        var timer = setInterval( function() {
          var e = list[i++];
          if ( e ) {
            if ( oSize[0] != opt.canvasSize[0] ) { e.clientX /= ratio; }
            if ( oSize[1] != opt.canvasSize[1] ) { e.clientY /= ratio; }

            if ( e.type.match(/move/i) ) {
              helper._onMove( e, true );
              helper._drawPaint();
            }
            else if ( e.type.match(/start|down/i) ) {
              helper._onDown( e, true );
            }
            else if ( e.type.match(/end|up/i) ) {
              helper._onUp( e, true );
            }
          }
          if ( i >= loop ) { clearInterval(timer); }
        }, 1 );
      }, 500 ); 
    },

    _onMove : function( e, touch ) {
      if ( opt.points.length ) { helper._addEvent( e ); }
      opt.mouse.x = e.clientX - (opt.offset[0] || 0);
      opt.mouse.y = e.clientY - (opt.offset[1] || 0);
      if ( ! touch ) e.preventDefault(); 
      if ( opt.points.length ) { helper._drawPaint(); }
    },

    _onDown : function( e, touch ) {
      helper._addEvent( e );
      opt.offset = helper.getOffset( opt._canvas );
      opt.scroll = helper.getScrollPosition();
      opt.offset[1] -= opt.scroll[1];

      opt.mouse.x = e.clientX - (opt.offset[0] || 0);
      opt.mouse.y = e.clientY - (opt.offset[1] || 0);

      opt.points.push({'x': opt.mouse.x, 'y': opt.mouse.y});    
      helper._drawPaint( true );
      if ( typeof(opt.beginCallback) === 'function') { opt.beginCallback(e); }
    },

    _onUp : function( e, touch ) {
      helper._addEvent( e );
      
      opt.ctx.drawImage(opt._canvas, 0, 0); // Writing down to real canvas now
      opt._ctx.clearRect(0, 0, opt.canvasSize[0], opt.canvasSize[1] );  // Clearing tmp canvas    
      opt.points = [];    // Emptying up Pencil Points
      opt.counter= 0;

      if (typeof(opt.endCallback) === 'function') { opt.endCallback( e ); }
    },

    _drawPaint : function( force ) {
      // Saving all the points in an array
      opt.points.push({'x': opt.mouse.x, 'y': opt.mouse.y});
      
      var render = function() {
        clearTimeout( opt.drawTimer );
        if ( ! opt.points.length ) {

        } else if (opt.points.length < 3) {
          var b = opt.points[0];
          opt._ctx.beginPath();
          opt._ctx.arc(b.x, b.y, opt.dotSize, opt.sAngle, opt.eAngle, !0);
          opt._ctx.fill();
          opt._ctx.closePath();        
        } else {          
          opt._ctx.clearRect(0, 0, opt.canvasSize[0], opt.canvasSize[1]);
          opt._ctx.beginPath();
          opt._ctx.moveTo(opt.points[0].x, opt.points[0].y);
          opt._ctx.lineWidth   = opt.dotSize;
          opt._ctx.lineJoin    = 'round';
          opt._ctx.lineCap     = 'round';
          opt._ctx.strokeStyle = opt.penColor;
          opt._ctx.fillStyle   = opt.penColor;
         
          opt.stop = false;
          var i = 0, pt = opt.points, loop = pt.length-2;
          while ( ++i < loop ) {
            if ( opt.stop ) { return; }
            var c = (pt[i].x + pt[i + 1].x) / 2;
            var d = (pt[i].y + pt[i + 1].y) / 2;  
            opt._ctx.quadraticCurveTo(pt[i].x, pt[i].y, c, d);
          }
          opt._ctx.quadraticCurveTo(pt[i].x,pt[i].y,pt[i+1].x,pt[i+1].y);
          opt._ctx.stroke();
          opt.isEmpty = false;      
        }
      };

      opt.stop = true;
      clearTimeout( opt.drawTimer );
      if ( force===true || (++opt.counter%2) ) {
        render();      
      } else {     
        //opt.drawTimer = setTimeout( render, 1000/15 );
        opt.drawTimer = setTimeout( render, 50 );
      }
    },
    //*/
    _updateUnderline : function() {
      var note = opt.underline;
      if ( ! note ) return;

      var size = helper.getSize(); 
      var text = (note.text || '').replace(/\s+/g,' ');
      var gap  = [15,50], px = size[0]-gap[0], py = size[1]-gap[1]; 
      var dash = note.lineDash || [5,10];

      opt.ctx.strokeStyle = note.lineColor || '#000';
      opt.ctx.setLineDash( dash );
      opt.ctx.beginPath();
      opt.ctx.moveTo( gap[0],py );
      opt.ctx.lineTo( px, py);
      opt.ctx.stroke();

      opt.underline.svg = {'line': {
        'x':[gap[0],px],'y':[py,py],'p':[[gap[0],py],[px,py]], 
        'penColor':opt.ctx.strokeStyle,'dash': dash
      }};

      if ( text ) {        
        var font = note.textFont || 'Verdana', pixel = note.textSize || 18;
        var top  = size[1] + (pixel+10) - gap[1], length = text.length;
        var left = note.textAlign !== 'right' ? (gap[0]+5) : 
          (size[0] - (pixel*(length/2)) - (gap[0]*3) );

        opt.ctx.font = pixel+'px '+font;
        opt.ctx.fillStyle = note.textColor || '#000';
        opt.ctx.fillText( text, left, top ); 

        opt.underline.svg.text = {
          'font':font,'size':pixel,'top':top,'left':left,'text':text,
          'color':opt.ctx.fillStyle, 'penColor': opt.bgColor, 'stroke':'0', 
          'x':[left-gap[0],px],'y':[top,top],'p':[[left,top],[px,top]]
        };
      }
    },

    _getCollection : function() {
      var out  = [], list = opt.events || [], loop = list.length, index = 0;
      var rect = opt.canvas.getBoundingClientRect();

      for ( var i=0; i<loop; i++ ) {
        if ( ! out[index] ) { out[index] = {'x':[],'y':[]}; }
        out[index].x.push( list[i].clientX-rect.left );
        out[index].y.push( list[i].clientY-rect.top );
        if ( list[i].type.match( /up|end/i ) ) { index++; }
      } 
      return out;
    },

    _generateSVG : function ( data ){

      /*********** SIMPLIFY.js  ***********/
      var getSqDist = function (p1, p2) {
        var dx = p1.x - p2.x, dy = p1.y - p2.y;
        return dx * dx + dy * dy;
      };

      var getSqSegDist = function (p, p1, p2) {
        var x = p1.x, y = p1.y, dx = p2.x - x, dy = p2.y - y;
 
        if (dx !== 0 || dy !== 0) {
          var t = ((p.x - x) * dx + (p.y - y) * dy) / (dx * dx + dy * dy);
          if (t > 1) {
            x = p2.x; y = p2.y;
          } else if (t > 0) {
            x += dx * t;
            y += dy * t;
          }
        }

        dx = p.x - x;
        dy = p.y - y;
        return dx * dx + dy * dy;
      };

      var simplifyRadialDist = function(points, sqTolerance) {
        var prevPoint = points[0], newPoints = [prevPoint], point = null;

        for (var i = 1, len = points.length; i < len; i++) {
          point = points[i];
          if (getSqDist(point, prevPoint) > sqTolerance) {
            newPoints.push(point);
            prevPoint = point;
          }
        }

        if (prevPoint !== point) newPoints.push(point);
        return newPoints;
      };

      var simplifyDPStep = function(points, first, last, sqTolerance, simplified) {
        var maxSqDist = sqTolerance, index = null;

        for (var i = first + 1; i < last; i++) {
          var sqDist = getSqSegDist(points[i], points[first], points[last]);
          if (sqDist > maxSqDist) {
            index = i;
            maxSqDist = sqDist;
          }
        }

        if (maxSqDist > sqTolerance) {
          if (index - first > 1) { simplifyDPStep(points, first, index, sqTolerance, simplified); }
          simplified.push(points[index]);
          if (last - index > 1) { simplifyDPStep(points, index, last, sqTolerance, simplified); }
        }
      };

      var simplifyDouglasPeucker = function (points, sqTolerance) {
        var last = points.length - 1;
        var simplified = [points[0]];

        simplifyDPStep(points, 0, last, sqTolerance, simplified);
        simplified.push(points[last]);

        return simplified;
      };

      var simplify = function (points, tolerance, highestQuality) {
        if (points.length <= 2) return points;

        var sqTolerance = tolerance !== undefined ? tolerance * tolerance : 1;

        points = highestQuality ? points : simplifyRadialDist(points, sqTolerance);
        points = simplifyDouglasPeucker(points, sqTolerance);

        return points;
      };

      /*********** END SIMPLIFY.js  ***********/

      var Vector = function(x,y){
        this.x = x;
        this.y = y;
        this.reverse = function(){
          return new this.constructor( this.x * -1, this.y * -1);
        };

        this._length = null;
        this.getLength = function(){
          if ( !this._length ){
            this._length = Math.sqrt( Math.pow(this.x, 2) + Math.pow(this.y, 2) );
          }
          return this._length;
        };
        
        var polarity = function (e){ return Math.round(e / Math.abs(e)); };
        this.resizeTo = function(length){
          // proportionally changes x,y such that the hypotenuse (vector length) is = new length
          if (this.x === 0 && this.y === 0){
            this._length = 0;
          } else if (this.x === 0){
            this._length = length;
            this.y = length * polarity(this.y);
          } else if(this.y === 0){
            this._length = length;
            this.x = length * polarity(this.x);
          } else {
            var proportion = Math.abs(this.y / this.x);
            var x = Math.sqrt(Math.pow(length, 2) / (1 + Math.pow(proportion, 2)));
            var y = proportion * x;
            this._length = length;
            this.x = x * polarity(this.x);
            this.y = y * polarity(this.y);
          }
          return this;
        };
        
        this.angleTo = function(vectorB) {
          var divisor = this.getLength() * vectorB.getLength();
          if (divisor === 0) { return 0; }
          return Math.acos(
            Math.min( 
              Math.max( 
                ( this.x * vectorB.x + this.y * vectorB.y ) / divisor
                , -1.0
              )
              , 1.0
            )
          ) / Math.PI;
        };
      };

      var Point = function(x,y){
        this.x = x;
        this.y = y;
        
        this.getVectorToCoordinates = function (x, y) {
          return new Vector(x - this.x, y - this.y);
        };
        this.getVectorFromCoordinates = function (x, y) {
          return this.getVectorToCoordinates(x, y).reverse();
        };
        this.getVectorToPoint = function (point) {
          return new Vector(point.x - this.x, point.y - this.y);
        };
        this.getVectorFromPoint = function (point) {
          return this.getVectorToPoint(point).reverse();
        };
      };

      var round = function (number, position){
        var tmp = Math.pow(10, position);
        return Math.round( number * tmp ) / tmp;
      };

      var segmentToCurve = function(stroke, positionInStroke, lineCurveThreshold){
        positionInStroke += 1        
        var Cpoint = new Point(stroke.x[positionInStroke-1], stroke.y[positionInStroke-1]);
        var Dpoint = new Point(stroke.x[positionInStroke], stroke.y[positionInStroke]);
        var CDvector = Cpoint.getVectorToPoint(Dpoint);
        var Bpoint = new Point(stroke.x[positionInStroke-2], stroke.y[positionInStroke-2]);
        var BCvector = Bpoint.getVectorToPoint(Cpoint);
        var ABvector = null, rounding = 2;
        
        if ( BCvector.getLength() > lineCurveThreshold ){
          if(positionInStroke > 2) {
            ABvector = (new Point(stroke.x[positionInStroke-3], stroke.y[positionInStroke-3])).getVectorToPoint(Bpoint);
          } else {
            ABvector = new Vector(0,0);
          }

          var minlenfraction = 0.05;
          var maxlen = BCvector.getLength() * 0.35;
          var ABCangle = BCvector.angleTo(ABvector.reverse());
          var BCDangle = CDvector.angleTo(BCvector.reverse());
          var BtoCP1vector = new Vector(ABvector.x + BCvector.x, ABvector.y + BCvector.y).resizeTo(
            Math.max(minlenfraction, ABCangle) * maxlen
          );
          var CtoCP2vector = (new Vector(BCvector.x + CDvector.x, BCvector.y + CDvector.y)).reverse().resizeTo(
            Math.max(minlenfraction, BCDangle) * maxlen
          );
          var BtoCP2vector = new Vector(BCvector.x + CtoCP2vector.x, BCvector.y + CtoCP2vector.y);
          
          // returing curve for BC segment
          // all coords are vectors against Bpoint
          return [
            'c' // bezier curve
            , round( BtoCP1vector.x, rounding )
            , round( BtoCP1vector.y, rounding )
            , round( BtoCP2vector.x, rounding )
            , round( BtoCP2vector.y, rounding )
            , round( BCvector.x, rounding )
            , round( BCvector.y, rounding )
          ];
        } else {
          return [
            'l' // line
            , round( BCvector.x, rounding )
            , round( BCvector.y, rounding )
          ];
        }
      };

      var lastSegmentToCurve = function(stroke, lineCurveThreshold){
        var positionInStroke = stroke.x.length - 1;
        
        // there must be at least 2 points in the stroke.for us to work. Hope calling code checks for that.
        var Cpoint = new Point(stroke.x[positionInStroke], stroke.y[positionInStroke]);
        var Bpoint = new Point(stroke.x[positionInStroke-1], stroke.y[positionInStroke-1]);
        var BCvector = Bpoint.getVectorToPoint(Cpoint);
        var rounding = 2;
        
        if (positionInStroke > 1 && BCvector.getLength() > lineCurveThreshold){
          // we have at least 3 elems in stroke
          var ABvector = (new Point(stroke.x[positionInStroke-2], stroke.y[positionInStroke-2])).getVectorToPoint(Bpoint);
          var ABCangle = BCvector.angleTo(ABvector.reverse());
          var minlenfraction = 0.05;
          var maxlen = BCvector.getLength() * 0.35;
          var BtoCP1vector = new Vector(ABvector.x + BCvector.x, ABvector.y + BCvector.y).resizeTo(
            Math.max(minlenfraction, ABCangle) * maxlen
          );
          
          return [
            'c' // bezier curve
            , round( BtoCP1vector.x, rounding )
            , round( BtoCP1vector.y, rounding )
            , round( BCvector.x, rounding ) // CP2 is same as Cpoint
            , round( BCvector.y, rounding ) // CP2 is same as Cpoint
            , round( BCvector.x, rounding )
            , round( BCvector.y, rounding )
          ];
        } else {
          // Since there is no AB leg, there is no curve to draw. This is just line
          return [
            'l' // simple line
            , round( BCvector.x, rounding )
            , round( BCvector.y, rounding )
          ];
        }
      };

      var simplifystroke  =  function(stroke){
        var d = [], newstroke = {'x':[], 'y':[]}, i = 0, l = 0;
        if ( stroke ) {
          for ( i=0, l=stroke.x.length; i<l; i++ ) {
            d.push({'x':stroke.x[i], 'y':stroke.y[i]});
          }

          d = simplify(d, 0.7, true);
          for ( i=0, l=d.length; i<l; i++ ){
            newstroke.x.push(d[i].x);
            newstroke.y.push(d[i].y);
          }   
        }
        return newstroke;
      };

      var addstroke = function (stroke, shiftx, shifty){
        var lineCurveThreshold = 1, i = 0, lines = [
          'M', round( (stroke.x[0] - shiftx), 2), round( (stroke.y[0] - shifty), 2)
        ], l = stroke.x.length - 1;
        
        for( i=1; i<l; i++ ) {
          lines.push.apply(lines, segmentToCurve(stroke, i, lineCurveThreshold));
        }

        if ( l>0 ) {
          lines.push.apply(lines, lastSegmentToCurve(stroke, i, lineCurveThreshold))
        } else if ( l===0 ) {
          lines.push.apply(lines, ['l' , 1, 1]);
        }
        return lines.join(' ');
      };

      var answer  = [], i = 0, l = (data || []).length, stroke = null;
      var xlimits = [], ylimits = [], simplifieddata = [], padding = 1;
      var sizex   = 0, sizey = 0, shiftx = 0, shifty = 0;
      var minx    = 0, maxx = 0, miny = 0, maxy = 0 ;
      

      if( l !== 0 ){
        for( i=0; i<l; i++ ){
          stroke = simplifystroke( data[i] );
          simplifieddata.push(stroke);
          xlimits = xlimits.concat(stroke.x);
          ylimits = ylimits.concat(stroke.y);
        }
         
        minx = Math.min.apply(null, xlimits) - padding;
        maxx = Math.max.apply(null, xlimits) + padding;
        miny = Math.min.apply(null, ylimits) - padding;
        maxy = Math.max.apply(null, ylimits) + padding;
        shiftx = minx < 0? 0 : minx;
        shifty = miny < 0? 0 : miny;
        sizex = maxx - minx;
        sizey = maxy - miny;
      }

      //var view  = '0 0 '+sizex+' '+sizey;
      var view  = '0 0 '+opt.canvas.clientWidth+' '+opt.canvas.clientHeight;
      var style = 'background:'+opt.bgColor, attr = [], note = null;
      var w3svg  = 'http://www.w3.org/2000/svg';
      var w3link = 'http://www.w3.org/1999/xlink';

      for( i=0, l=simplifieddata.length; i<l; i++ ){
        stroke = simplifieddata[i];
        if ( ! stroke || ! stroke.x.length || ! stroke.y.length ) { continue; }

        note = data[i] || {}, attr = [
          'stroke="'+ (note.penColor || opt.penColor)+'"', 
          'stroke-dasharray="'+(note.dash || [1,1]).join(',')+'"',
          'fill="none"', 
          'stroke-width="'+(note.stroke || '2')+'"', 
          'stroke-linecap="round"', 'stroke-linejoin="round"','id="s_path'+i+'"'
        ];
        
        answer.push('  <path '+attr.join(' ')+' d="'+addstroke(stroke, shiftx, shifty)+'"/>');
        if ( ! note.text ) { continue; }

        attr = [
          'fill="'+(note.color || opt.penColor)+'"',
          'font-family="'+(note.font || 'Verdana')+'"',
          'font-size="'+(note.size || '18')+'"',
        ];

        answer.push(
          '<text '+attr.join(' ')+'>'+
            '<textPath xlink:href="#s_path'+i+'">'+note.text+'</textPath>'+
          '</text>'
        );
      }

      return '<svg xmlns:xlink="'+w3link+'" xmlns="'+w3svg+'" version="1.1" viewbox="'+view+'" style="'+style+'">'+"\n"+
        answer.join("\n") +"\n"+ '</svg>';

      //return '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="'+sizex+'" height="'+sizey+'">'+"\n"+
      //  answer.join('') +"\n"+ '</svg>';

      /*
      return '<?xml version="1.0" encoding="UTF-8" standalone="no"?>'+ "\n"+
        '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">'+"\n"+
        '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="'+ sizex.toString() +'" height="'+ sizey.toString() + '">'+"\n"+
          answer.join('') +"\n"+
        '</svg>';
      */
    },

    _none : function() {}
  };

  var method = {};
  for ( var k in helper ) {
    if ( ! k.match(/^(init|setup|_)/i) ) { method[k] = helper[k]; }
  }

  this.Signature = method;
  setTimeout( helper.init, 100 );
  return this;
}; })( jQuery );
