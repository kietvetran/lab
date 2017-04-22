/****
 * 
 */
// ;(function(a,b){function c(a,b){var c=a.x-b.x,d=a.y-b.y;return c*c+d*d}function d(a,b,c){var d=b.x,e=b.y,f=c.x-d,g=c.y-e,h;if(f!==0||g!==0)h=((a.x-d)*f+(a.y-e)*g)/(f*f+g*g),h>1?(d=c.x,e=c.y):h>0&&(d+=f*h,e+=g*h);return f=a.x-d,g=a.y-e,f*f+g*g}function e(a,b){var d,e=a.length,f,g=a[0],h=[g];for(d=1;d<e;d++)f=a[d],c(f,g)>b&&(h.push(f),g=f);return g!==f&&h.push(f),h}function f(a,c){var e=a.length,f=typeof Uint8Array!=b+""?Uint8Array:Array,g=new f(e),h=0,i=e-1,j,k,l,m,n=[],o=[],p=[];g[h]=g[i]=1;while(i){k=0;for(j=h+1;j<i;j++)l=d(a[j],a[h],a[i]),l>k&&(m=j,k=l);k>c&&(g[m]=1,n.push(h),o.push(m),n.push(m),o.push(i)),h=n.pop(),i=o.pop()}for(j=0;j<e;j++)g[j]&&p.push(a[j]);return p}"use strict";var g=typeof exports!=b+""?exports:a;g.simplify=function(a,c,d){var g=c!==b?c*c:1;return d||(a=e(a,g)),a=f(a,g),a}})(window);

;(function($) { $.fn.Signature = function( config ) {
  if ( ! config ) { config = {}; }

  /****************************************************************************
    === CONFIGURATION OPTION === 
  ****************************************************************************/
  var opt = {
    'main'         : this,
    'points'       : [],
    'events'       : [],
    'collection'   : [],
    'index'        : 0,
    'sAngle'       : 0,
    'eAngle'       : (2 * Math.PI),
    'canvas'       : config.canvas   || null,
    'bgColor'      : config.bgColor  || 'rgba(0,0,0,0)',
    'penColor'     : config.penColor || '#000',
    'dotSize'      : config.dotSize  || 1.5,
    'endCallback'  : config.endCallback    || null,
    'beginCallback': config.beginCallback  || null,
    'underline'    : config.underline|| null,
    'velocityFilterWeight' : config.velocityFilterWeight || 0.7
  };

  var helper = {
    /*************************************************************************
      === Initialization ===
    **************************************************************************/
    init : function() {
      var main = opt.main;
      
      //opt.delay = 3;
      //opt.delay = helper.isAndroid() ? 20 : 0;
      //debug('Delay: '+opt.delay);

      if ( ! opt.canvas ) {
        if ( main.is('canvas') ) { opt.canvas = main.get(0); }
        else {
          opt.canvas = main.find('canvas');
          opt.canvas = opt.canvas.size() ? opt.canvas.get(0) :
            $('<canvas></canvas>').appendTo( main ).get(0);
        }
      } 

      helper.clear();
      helper._handleMouseEvents();
      helper._handleTouchEvents();
    },

    /*************************************************************************
      === PUBLIC FUNCTIOn ===
    **************************************************************************/
    clear : function() {
      opt.ratio         = helper.getRatio();
      opt.canvas.width  = opt.canvas.offsetWidth * opt.ratio;
      opt.canvas.height = opt.canvas.offsetHeight * opt.ratio;
      opt.canvas.getContext('2d').scale(opt.ratio, opt.ratio);
      opt.ctx = opt.canvas.getContext('2d');

      opt.ctx.fillStyle = opt.bgColor;
      opt.ctx.clearRect(0, 0, opt.canvas.width, opt.canvas.height);
      opt.ctx.fillRect(0, 0, opt.canvas.width, opt.canvas.height);

      opt.collection = [];
      opt.index      = 0;
      opt.events     = [];

      helper._reset();
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

      var data = JSON.parse(JSON.stringify(opt.collection));
      if ( opt.underline ) { 
        if ( opt.underline.svg.line ) { data.push( opt.underline.svg.line ); }
        if ( opt.underline.svg.text ) { data.push( opt.underline.svg.text ); }
      }
      return helper._generateSVG( data );
    },

    isEmpty : function() { return opt.isEmpty; },

    getSize : function() {
      return opt.canvas ? [opt.canvas.clientWidth,opt.canvas.clientHeight] : [0,0]; 
    },

    getCanvas : function() { return opt.canvas; },

    getRatio : function() {
      return Math.max(window.devicePixelRatio || 1, 1);
    },

    generatePoint : function( x, y, time ) {
      var point = {'x':x||0, 'y':y||0, 'time':time||(new Date()).getTime()};

      point.velocityFrom = function ( start ) {
        return (this.time !== start.time) ? this.distanceTo(start) / (this.time - start.time) : 1;
      };

      point.distanceTo = function ( start ) {
        return Math.sqrt(Math.pow(this.x - start.x, 2) + Math.pow(this.y - start.y, 2));
      };

      return point;
    },

    generateBezier : function( startPoint, control1, control2, endPoint ) {
      var bezier = {
        'startPoint' : startPoint, 'endPoint': endPoint,
        'control1': control1, 'control2': control2
      };

      // Returns approximated length.
      bezier.length = function () {
        var steps = 10, length = 0;
        var i, t, cx, cy, px, py, xdiff, ydiff;

        for (i = 0; i <= steps; i++) {
          t = i / steps;
          cx = this._point(t, this.startPoint.x, this.control1.x, this.control2.x, this.endPoint.x);
          cy = this._point(t, this.startPoint.y, this.control1.y, this.control2.y, this.endPoint.y);
          if ( i>0 ) {
            xdiff = cx - px;
            ydiff = cy - py;
            length += Math.sqrt(xdiff * xdiff + ydiff * ydiff);
          }
          px = cx;
          py = cy;
        }
        return length;
      };

      bezier._point = function (t, start, c1, c2, end) {
        return start * (1.0 - t) * (1.0 - t)  * (1.0 - t)
          + 3.0 *  c1    * (1.0 - t) * (1.0 - t)  * t
          + 3.0 *  c2    * (1.0 - t) * t          * t
          +        end   * t         * t          * t;
      };
      return bezier;
    },

    isIE : function() {
      var m = null;
      if ( (navigator.appName).match('Microsoft Internet Explorer') ) {
        m = (navigator.appVersion).match(/MSIE\s([\d\.]+)/);
      } else if ( (navigator.appName).match('Netscape') ) {
        m = (navigator.appVersion).match( /rv:([\d\.]+)/);
      }
      return m && m[1] ? parseFloat( m[1] ) : 0; 
    },

    isChrome : function() {
      if ( ! window.chrome || navigator.userAgent.indexOf('Chrome') == -1 ) {
        return 0;
      }
      var m = (navigator.userAgent).match( /Chrome\/([\d\.]+)/);
      return m && m[1] ? parseFloat( m[1] ) : 0; 
    },

    isSafari : function() {
      if ( navigator.userAgent.indexOf('Safari/') == -1 ) { return 0; }
      var m = navigator.userAgent.match( /Version\/([\d\.]+)/ );
      return m && m[1] ? parseInt( m[1] ) || 1 : 1;
    },

    isIpad : function() { 
      return navigator.userAgent.match(/iPad/i) != null;
    },

    isMobile : function() { 
      if ( ! (navigator.appVersion.indexOf('Mobile') > -1) ) {
        return false;
      }
      return ! ( navigator.userAgent.match(/iPad/i) != null );
    },

    isAndroid : function() { 
      var ua = navigator.userAgent.toLowerCase();
      var m = ua.match( /android(\s+)?([1-9\.]+)/i );
      return m ? parseFloat( m[m.length -1] ) : 0;
    },

    isMobileAndroid : function() {
      if ( ! helper.isMobile() ){ return 0; }
      return helper.isAndroid();
    },

    isMobileWindow : function() {
      if ( ! helper.isMobile() ) { return 0; }
      var ua = navigator.userAgent.toLowerCase();
      var m = ua.match( /windows(\s+)?phone(\s+)?os(\s+)?([1-9\.]+)/i );  
      return m ? parseFloat( m[m.length-1] ) : 0;
    },

    isMobileIphone : function() {
      if ( ! helper.isMobile() ) { return 0; }
      var ua = navigator.userAgent.toLowerCase();
      m = ua.match( /iphone(\s+)?os(\s+)?([1-9\.]+)/i );
      return m ? parseFloat( m[m.length-1] ) : 0;
    },

    isWindowsNT : function() {
      if ( ! (navigator.appName).match('Microsoft Internet Explorer') ) { return 0; }
      var m = (navigator.appVersion).match( /Windows\s+NT\s([\d\.]+)/ );
      return m && m[1] ? parseFloat( m[1] ) : 0; 
    },

    /*************************************************************************
      === INTERNAL FUNCTIOn ===
    **************************************************************************/
    _handleResize : function( event ) {
      if ( opt.resizeTimer ) { clearTimeout(opt.resizeTimer); }
      opt.resizeTimer = setTimeout( function() {
        if ( opt.resizeOnRender ) { return; }
        
        var list = JSON.parse( JSON.stringify(opt.events||'[]'));
        var loop = list.length, i = 0;
        helper.clear();
        if ( ! loop ) { return; }

        opt.resizeOnRender    = true; 
        opt.resizeRenderTimer = setInterval(function() {
          var e = list[i++], handler = e.type.match(/down|start/i) ? 
            '_strokeBegin' : ( e.type.match(/move/i) ? '_strokeUpdate': '_strokeEnd'); 

          if ( typeof(helper[handler])==='function' ) { helper[handler]( e ); }
          if ( i===loop ) {
            opt.resizeOnRender = false; 
            clearInterval( opt.resizeRenderTimer );
            opt.events = list;
          }
        }, 5 );
      }, 1000 ); 
    },

    _handleMouseEvents : function () {
      opt.mouseButtonDown = false;
      opt.canvas.addEventListener("mousedown", helper._handleMouseDown);
      opt.canvas.addEventListener("mousemove", helper._handleMouseMove);
      document.addEventListener("mouseup", helper._handleMouseUp);
      window.addEventListener("resize", helper._handleResize);
    },

    _handleTouchEvents : function () {
      // Pass touch events to canvas element on mobile IE.
      opt.canvas.style.msTouchAction = 'none';
      opt.canvas.addEventListener("touchstart", helper._handleTouchStart);
      opt.canvas.addEventListener("touchmove", helper._handleTouchMove);
      document.addEventListener("touchend", helper._handleTouchEnd);
    },

    _handleMouseDown : function (event) {
      if ( event.which === 1 ) {
        opt.mouseButtonDown = true;
        helper._addEvent( event );
        helper._strokeBegin( event );
      }
    },

    _handleMouseMove : function (event) {
      if ( opt.mouseButtonDown ) {
        helper._addEvent( event );
        helper._strokeUpdate( event );
      }
    },

    _handleMouseUp : function (event) {
      if ( event.which === 1 && opt.mouseButtonDown ) {
        opt.mouseButtonDown = false;
        helper._addEvent( event );
        helper._strokeEnd( event );
      }
    },

    _handleTouchStart : function (event) {
      var touch = event.changedTouches[0];
      helper._addEvent( touch );
      helper._strokeBegin( touch );
    },

    _handleTouchMove : function (event) {
      event.preventDefault(); // Prevent scrolling

      var touch = event.changedTouches[0];
      helper._addEvent( touch );
      helper._strokeUpdate( touch );
    },

    _handleTouchEnd : function (event) {
      var wasCanvasTouched = event.target === opt.canvas;
      if ( wasCanvasTouched ) {
        helper._addEvent( event );
        helper._strokeEnd( event );
      }
    },

    /*************************************************************************/
    _addEvent : function ( e, mode ) {
      opt.events.push({'type':e.type,'clientX':e.clientX,'clientY':e.clientY});
    },

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

    /*
    _strokeUpdate : function( e ) {
      var point = helper._createPoint( e );
      helper._addPoint( point );    _updateUnderline : function() {
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
    },
    */
    _strokeUpdate : function( e ) {
      var point = helper._createPoint( e ), x = point.x, y = point.y;
      helper._addPoint( point );
    
      setTimeout( function() {
        if ( ! opt.collection[opt.index] ) { 
          opt.collection[opt.index] = {'x':[],'y':[]}; 
        }
        opt.collection[opt.index].x.push( x );
        opt.collection[opt.index].y.push( y );
      }, 10);
    },

    _strokeBegin : function( e ) {
      helper._reset();
      helper._strokeUpdate( e );
      if ( typeof(opt.beginCallback) === 'function') { opt.beginCallback(e); }
      opt.index++;
    },

    _strokeDraw : function( point ) {
      opt.ctx.beginPath();
      helper._drawPoint( point.x, point.y );
      opt.ctx.closePath();
      opt.ctx.fill();
    },

    _strokeEnd : function( e ) {
      var curve = opt.points.length > 2, point = opt.points[0];
      if ( ! curve && point ) { helper._strokeDraw( point ); }
      if (typeof(opt.endCallback) === 'function') { opt.endCallback( e ); }
    },

    _reset : function() {
      opt.points        = [];
      opt.isEmpty       = true;
      opt.ctx.fillStyle = opt.penColor;
    },

    _createPoint : function( e ) {
      var rect = opt.canvas.getBoundingClientRect();
      return helper.generatePoint( (e.clientX-rect.left), (e.clientY-rect.top) );
    },

    _addPoint : function( point ) {
      var points = opt.points, c2 = null, c3 = null, curve = null, tmp = null;
      points.push(point);
      if (points.length > 2) {
        if (points.length === 3) { points.unshift(points[0]); }

        tmp = helper._calculateCurveControlPoints(points[0], points[1], points[2]);
        c2  = tmp.c2;
        tmp = helper._calculateCurveControlPoints(points[1], points[2], points[3]);
        c3  = tmp.c1;

        curve = helper.generateBezier( points[1], c2, c3, points[2] );
        helper._drawCurve( curve );
        /*
        opt.delay ? setTimeout( function() {
          helper._drawCurve( curve );
        }, opt.delay ) : helper._drawCurve( curve );

        /*
        opt.delay ? setTimeout( function() {
          helper._addCurve(curve);
        }, opt.delay ) : helper._addCurve(curve);
        */
        //helper._addCurve(curve);
        //setTimeout( function() { helper._addCurve(curve); }, 20);
        points.shift();
      }
    },

    _calculateCurveControlPoints : function( s1, s2, s3 ) {
      var dx1 = s1.x - s2.x, dy1 = s1.y - s2.y;
      var dx2 = s2.x - s3.x, dy2 = s2.y - s3.y;

      var m1 = {'x': (s1.x + s2.x) / 2.0, 'y': (s1.y + s2.y) / 2.0};
      var m2 = {'x': (s2.x + s3.x) / 2.0, 'y': (s2.y + s3.y) / 2.0};

      var l1 = Math.sqrt(dx1*dx1 + dy1*dy1);
      var l2 = Math.sqrt(dx2*dx2 + dy2*dy2);

      var dxm = (m1.x - m2.x);
      var dym = (m1.y - m2.y);

      var k  = l2 / (l1 + l2);
      var cm = {'x': m2.x + dxm*k, 'y': m2.y + dym*k};

      var tx = s2.x - cm.x;
      var ty = s2.y - cm.y;

      return {
        'c1': helper.generatePoint( (m1.x+tx), (m1.y+ty) ),
        'c2': helper.generatePoint( (m2.x+tx), (m2.y+ty) )
      };
    },

    _drawPoint : function( x, y ) {
      opt.ctx.moveTo( x, y );
      opt.ctx.arc(x, y, opt.dotSize, opt.sAngle, opt.eAngle, false);
      opt.isEmpty = false;
    },

    _drawCurve : function( curve ) {
      var i, t, tt, ttt, u, uu, uuu, x, y;

      var drawSteps = Math.floor(curve.length());
      opt.ctx.beginPath();
      for ( i=0; i<drawSteps; i++ ) {
        // Calculate the Bezier (x, y) coordinate for this step.
        t   = i / drawSteps;
        tt  = t * t;
        ttt = tt * t;

        u   = 1 - t;
        uu  = u * u;
        uuu = uu * u;

        x  = uuu * curve.startPoint.x;
        x += 3 * uu * t * curve.control1.x;
        x += 3 * u * tt * curve.control2.x;
        x += ttt * curve.endPoint.x;

        y  = uuu * curve.startPoint.y;
        y += 3 * uu * t * curve.control1.y;
        y += 3 * u * tt * curve.control2.y;
        y += ttt * curve.endPoint.y;

        helper._drawPoint(x, y);
      }
      opt.ctx.closePath();
      opt.ctx.fill();
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
