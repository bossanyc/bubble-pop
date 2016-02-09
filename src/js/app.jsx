var domready = require('domready');

const _width = 1900;
const _height = 900;

const renderer = PIXI.autoDetectRenderer( _width, _height);
const stage = new PIXI.Container();

var movie;

domready( function(){
  //var canvas = document.getElementById('sketch');
  document.body.appendChild( renderer.view );

  PIXI.loader
      .add('json/fighter.json')
      .load(onAssetsLoaded);


  function onAssetsLoaded(){
    //return
    var frames = [];
    var _sequence = 'rollSequence00'

    for ( var i = 0; i < 30; i++){
      var val = i < 10 ? '0' + i : i;

      frames.push( PIXI.Texture.fromFrame( _sequence + val + '.png' ) );
    }

    movie = new PIXI.extras.MovieClip( frames );

    movie.position.set( 300 );
    movie.anchor.set( 0.5 );
    movie.animationSpeed = 0.5;

    movie.play();

    stage.addChild( movie );

    animate();
  }

  function animate() {
    //movie.rotation += 0.01;

    renderer.render( stage );
    window.requestAnimationFrame( animate );
  }

  var isStopped = false;

  window.addEventListener( 'mousedown', ()=>{

    if(isStopped){
      movie.play();
      isStopped = false;
    }else{
      movie.stop();
      isStopped = true;
    }
  });

});


