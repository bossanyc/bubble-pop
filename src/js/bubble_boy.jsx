class BubbleBoy{
  constructor( stage ){
    this.stage = stage;
  }

  loadFrames(){
    //return
    var frames = [];
    var _sequence;
    var val;

    const _rect = new PIXI.Rectangle( 0, 0, 500, 500 );

    this.displayObject = new PIXI.Container();
    this.displayObject.interactive = true;
    this.displayObject.hitArea = _rect;

    for ( var i = 1; i < 200; i++){
      val = i < 10 ? '0' + i : i;
      _sequence = ( i < 100 ) ? 'GumBoss_00' : 'GumBoss_0';

      frames.push( PIXI.Texture.fromFrame( _sequence + val + '.png' ) );
    }

    this.movie = new PIXI.extras.MovieClip( frames );
    //this.movie.setInteractive( true );

    this.displayObject.addChild( this.movie );
    this.stage.addChild( this.displayObject );

    this.displayObject.position.set( 100 );
  }

  addListeners(){
    this.displayObject.mousedown = ()=> { this.action() };
    this.displayObject.touchstart = ()=> { this.action() };
  }

  action(){
    if( this.state == 'blowing' && this.movie.currentFrame < 102 ) this.pop();
  }

  idle(){
    console.log('now idle');
    this.state = 'idle';
    this.movie.gotoAndPlay( this.IDLE_START_FRAME );

    this.movie.animationSpeed = (this.movie.animationSpeed < 0) ? this.movie.animationSpeed * -1 : this.movie.animationSpeed;
  }

  blow(){
    console.log('now blowing');
    this.state = 'blowing';
    this.movie.gotoAndPlay( this.BLOWING_START_FRAME );
  }

  pop(){
    console.log('now popped');
    this.state = 'popped';
    this.popped++;
    this.movie.gotoAndPlay( this.POP_START_FRAME );
    //this.movie.animationSpeed *= -1;
  }
  deflate(){
    console.log('now deflating');
    this.state = 'deflating';
    this.missed++;
    this.movie.gotoAndPlay( this.DEFLATING_START_FRAME );
    //this.movie.animationSpeed *= -1;
  }


  update(){
    switch( this.state ){
      case('idle'):
        if (this.movie.currentFrame > this.IDLE_END_FRAME ){
          this.movie.gotoAndPlay( this.IDLE_START_FRAME );
        }
        break;

      case('blowing'):
        if (this.movie.currentFrame > this.BLOWING_END_FRAME ){
          this.deflate();
        }
        break;

      case('popped'):
        if (this.movie.currentFrame > this.POP_END_FRAME){
          console.log('greater');
          this.idle();
        }
        break;

      case('deflating'):
        console.log(this.movie.currentFrame);
        if (this.movie.currentFrame > this.DEFLATING_END_FRAME){
          this.idle();
        }
        break;
        
      default:
        break;
    }
  }

  play(){ this.movie.play(); this.isPlaying = true; }
  stop(){ this.movie.stop(); this.isPlaying = false; }

  set speed( _speed ){
    this.movie.animationSpeed = _speed;
  }

  get speed(){ return this.movie.animationSpeed }
}

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
proto.DEFLATING_END_FRAME = 196;

export { BubbleBoy };

