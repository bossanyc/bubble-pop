var domready = require('domready');

import { BubbleBoy } from './bubble_boy.jsx'

const _width = 1900;
const _height = 900;

const renderer = PIXI.autoDetectRenderer( _width, _height);
const stage = new PIXI.Container(0xfffffff, true);

const rate = 500;

const spacing = 400;
const minRate = 200;
const maxRate = 600;

let time = 0;


stage.interactive = true;

domready( function(){
  //var canvas = document.getElementById('sketch');
  document.body.appendChild( renderer.view );

  let bubble_boys = [];
  var bubble_boy;
  var maxBubbleBoys = 6;

  PIXI.loader
      .add('json/half_bubble_00.json')
      .add('json/half_bubble_01.json')
      .add('json/half_bubble_02.json')
      .add('json/half_bubble_03.json')
      .add('json/half_bubble_04.json')
      .add('json/half_bubble_05.json')
      .load(onAssetsLoaded);


  function onAssetsLoaded(){
    let i = 0;
    
    while( i < maxBubbleBoys ) {
      bubble_boy = new BubbleBoy( stage );

      bubble_boy.loadFrames();
      bubble_boy.addListeners();
      bubble_boy.speed = 0.4;
      bubble_boy.movie.play();

      bubble_boys.push( bubble_boy );

      var yOff = i % 2;
      var xOff = ~~(i / 2);
      console.log(xOff, yOff);

      bubble_boy.displayObject.position.set( xOff * spacing, yOff * spacing );

      bubble_boy.rate = ~~Math.max( minRate + (Math.random() * 100), Math.random() * maxRate );

      ++i
    }

    animate();
  }

  var countText = new PIXI.Text('Bubbles caught = ',{font : '24px Arial', fill : 0xffffff, align : 'left'});
  var missedText = new PIXI.Text('Bubbles popped = ',{font : '24px Arial', fill : 0xffffff, align : 'left'});

  stage.addChild( countText );
  stage.addChild( missedText );

  countText.position.set( 10, _height - 60 );
  missedText.position.set( 10, _height - 30 );

  function updateText( count, missed ){
    countText.text = 'Bubbles caught = ' + count;
    missedText.text = 'Bubbles missed = ' + missed;
  }

  function animate() {
    time++;
    
    let count = 0;
    let missed = 0;

    for( var _b in bubble_boys) {
      var _bubble_boy = bubble_boys[_b];

      if( time % _bubble_boy.rate === 0 ){
        if( _bubble_boy.state !== 'blowing' ) _bubble_boy.blow();
      }

      count += _bubble_boy.popped;
      missed += _bubble_boy.missed;

      _bubble_boy.update();
    }

    updateText( count, missed );
    renderer.render( stage );

    window.requestAnimationFrame( animate );
  }

  var isStopped = false;
});


