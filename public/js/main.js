(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*!
  * domready (c) Dustin Diaz 2014 - License MIT
  */
!function (name, definition) {

  if (typeof module != 'undefined') module.exports = definition()
  else if (typeof define == 'function' && typeof define.amd == 'object') define(definition)
  else this[name] = definition()

}('domready', function () {

  var fns = [], listener
    , doc = document
    , hack = doc.documentElement.doScroll
    , domContentLoaded = 'DOMContentLoaded'
    , loaded = (hack ? /^loaded|^c/ : /^loaded|^i|^c/).test(doc.readyState)


  if (!loaded)
  doc.addEventListener(domContentLoaded, listener = function () {
    doc.removeEventListener(domContentLoaded, listener)
    loaded = 1
    while (listener = fns.shift()) listener()
  })

  return function (fn) {
    loaded ? setTimeout(fn, 0) : fns.push(fn)
  }

});

},{}],2:[function(require,module,exports){
'use strict';

var _bubble_boy2 = require('./bubble_boy.jsx');

var domready = require('domready');

var _width = 1900;
var _height = 900;

var renderer = PIXI.autoDetectRenderer(_width, _height);
var stage = new PIXI.Container(0xfffffff, true);

var rate = 500;

var spacing = 400;
var minRate = 200;
var maxRate = 600;

var time = 0;

stage.interactive = true;

domready(function () {
  //var canvas = document.getElementById('sketch');
  document.body.appendChild(renderer.view);

  var bubble_boys = [];
  var bubble_boy;
  var maxBubbleBoys = 4;

  PIXI.loader.add('json/half_bubble_00.json').add('json/half_bubble_01.json').add('json/half_bubble_02.json').add('json/half_bubble_03.json').add('json/half_bubble_04.json').add('json/half_bubble_05.json').load(onAssetsLoaded);

  function onAssetsLoaded() {
    var i = 0;

    while (i < maxBubbleBoys) {
      bubble_boy = new _bubble_boy2.BubbleBoy(stage);

      bubble_boy.loadFrames();
      bubble_boy.addListeners();
      bubble_boy.speed = 0.4;
      bubble_boy.movie.play();

      bubble_boys.push(bubble_boy);

      var yOff = i % 2;
      var xOff = ~ ~(i / 2);
      console.log(xOff, yOff);

      bubble_boy.displayObject.position.set(xOff * spacing, yOff * spacing);

      bubble_boy.rate = ~ ~Math.max(minRate + Math.random() * 100, Math.random() * maxRate);

      ++i;
    }

    animate();
  }

  var countText = new PIXI.Text('Bubbles caught = ', { font: '24px Arial', fill: 0xffffff, align: 'left' });
  var missedText = new PIXI.Text('Bubbles popped = ', { font: '24px Arial', fill: 0xffffff, align: 'left' });

  stage.addChild(countText);
  stage.addChild(missedText);

  countText.position.set(10, _height - 60);
  missedText.position.set(10, _height - 30);

  function updateText(count, missed) {
    countText.text = 'Bubbles caught = ' + count;
    missedText.text = 'Bubbles missed = ' + missed;
  }

  function animate() {
    time++;

    var count = 0;
    var missed = 0;

    for (var _b in bubble_boys) {
      var _bubble_boy = bubble_boys[_b];

      if (time % _bubble_boy.rate === 0) {
        if (_bubble_boy.state == 'idle') _bubble_boy.blow();
      }

      count += _bubble_boy.popped;
      missed += _bubble_boy.missed;

      _bubble_boy.update();
    }

    updateText(count, missed);
    renderer.render(stage);

    window.requestAnimationFrame(animate);
  }

  var isStopped = false;
});

},{"./bubble_boy.jsx":3,"domready":1}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BubbleBoy = function () {
  function BubbleBoy(stage) {
    _classCallCheck(this, BubbleBoy);

    this.stage = stage;
  }

  _createClass(BubbleBoy, [{
    key: 'loadFrames',
    value: function loadFrames() {
      //return
      var frames = [];
      var _sequence;
      var val;

      var _rect = new PIXI.Rectangle(0, 0, 500, 500);

      this.displayObject = new PIXI.Container();
      this.displayObject.interactive = true;
      this.displayObject.hitArea = _rect;

      for (var i = 1; i < 200; i++) {
        val = i < 10 ? '0' + i : i;
        _sequence = i < 100 ? 'GumBoss_00' : 'GumBoss_0';

        frames.push(PIXI.Texture.fromFrame(_sequence + val + '.png'));
      }

      this.movie = new PIXI.extras.MovieClip(frames);
      //this.movie.setInteractive( true );

      this.displayObject.addChild(this.movie);
      this.stage.addChild(this.displayObject);

      this.displayObject.position.set(100);
    }
  }, {
    key: 'addListeners',
    value: function addListeners() {
      var _this = this;

      this.displayObject.mousedown = function () {
        _this.action();
      };
      this.displayObject.touchstart = function () {
        _this.action();
      };
    }
  }, {
    key: 'action',
    value: function action() {
      if (this.state == 'blowing' || this.state == 'deflating') this.pop();
    }
  }, {
    key: 'idle',
    value: function idle() {
      console.log('now idle');
      this.state = 'idle';
      this.movie.gotoAndPlay(this.IDLE_START_FRAME);

      this.movie.animationSpeed = this.movie.animationSpeed < 0 ? this.movie.animationSpeed * -1 : this.movie.animationSpeed;
    }
  }, {
    key: 'blow',
    value: function blow() {
      console.log('now blowing');
      this.state = 'blowing';
      this.movie.gotoAndPlay(this.BLOWING_START_FRAME);
    }
  }, {
    key: 'pop',
    value: function pop() {
      console.log('now popped');
      this.state = 'popped';
      this.popped++;
      this.movie.gotoAndPlay(this.POP_START_FRAME);
      //this.movie.animationSpeed *= -1;
    }
  }, {
    key: 'deflate',
    value: function deflate() {
      console.log('now deflating');
      this.state = 'deflating';
      this.movie.gotoAndPlay(this.DEFLATING_START_FRAME);
      //this.movie.animationSpeed *= -1;
    }
  }, {
    key: 'update',
    value: function update() {
      switch (this.state) {
        case 'idle':
          if (this.movie.currentFrame > this.IDLE_END_FRAME) {
            this.movie.gotoAndPlay(this.IDLE_START_FRAME);
          }
          break;

        case 'blowing':
          if (this.movie.currentFrame > this.BLOWING_END_FRAME) {
            this.deflate();
          }
          break;

        case 'popped':
          if (this.movie.currentFrame > this.POP_END_FRAME) {
            console.log('greater');
            this.idle();
          }
          break;

        case 'deflating':
          console.log(this.movie.currentFrame);
          if (this.movie.currentFrame > this.DEFLATING_END_FRAME) {
            this.missed++;
            this.idle();
          }
          break;

        default:
          break;
      }
    }
  }, {
    key: 'play',
    value: function play() {
      this.movie.play();this.isPlaying = true;
    }
  }, {
    key: 'stop',
    value: function stop() {
      this.movie.stop();this.isPlaying = false;
    }
  }, {
    key: 'speed',
    set: function set(_speed) {
      this.movie.animationSpeed = _speed;
    },
    get: function get() {
      return this.movie.animationSpeed;
    }
  }]);

  return BubbleBoy;
}();

var proto = BubbleBoy.prototype;

proto.isReversed = false;
proto.state = 'idle';

proto.popped = 0;
proto.missed = 0;

proto.IDLE_START_FRAME = 1;
proto.IDLE_END_FRAME = 68;

proto.BLOWING_START_FRAME = 80;
proto.BLOWING_END_FRAME = 100;

proto.POP_START_FRAME = 103;
proto.POP_END_FRAME = 120;

proto.DEFLATING_START_FRAME = 175;
proto.DEFLATING_END_FRAME = 188;

exports.BubbleBoy = BubbleBoy;

},{}]},{},[2,3]);
