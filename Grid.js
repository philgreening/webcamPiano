class Grid {
  /////////////////////////////////
  constructor(_w, _h) {
    this.gridWidth = _w;
    this.gridHeight = _h;
    this.noteSize = 40;
    this.notePos = [];
    this.noteState = [];
    //arrays to hold notes
    this.keys = [ 'C', 'D', 'E', 'F', 'G', 'A', 'B'];
    this.octaves = [2, 3, 4,];

    // initalise grid structure and state
    for (var x=0;x<_w;x+=this.noteSize){
      var posColumn = [];
      var stateColumn = [];
      for (var y=0;y<_h;y+=this.noteSize){
        posColumn.push(createVector(x+this.noteSize/2,y+this.noteSize/2));
        stateColumn.push(0);
      }
      this.notePos.push(posColumn);
      this.noteState.push(stateColumn);
    }
  }
  /////////////////////////////////
  run(img) {
    img.loadPixels();
    this.findActiveNotes(img);
    this.drawActiveNotes(img);
  }
  /////////////////////////////////
  drawActiveNotes(img){
    fill(255);
    noStroke();
    for (var i=0;i<this.notePos.length;i++){
      for (var j=0;j<this.notePos[i].length;j++){
        var x = this.notePos[i][j].x;
        var y = this.notePos[i][j].y;
        if (this.noteState[i][j]>0) {
          var alpha = this.noteState[i][j] * 200;
          //noise and random used to randomise flashing colours
          var n = noise(x,y);
          var mapN = map(n, 0, 1, 0, 255);
          var c1 = color(mapN,random(0,255),random(0,255),alpha);
          var c2 = color(random(0,255),mapN, random(0.255),alpha);
          var mix = lerpColor(c1, c2, map(i, 0, this.notePos.length, 0, 1));
          fill(mix);
          var s = this.noteState[i][j];
          //maps keys and octaves to x and y positions
          var key = floor(map(x , 0, width/2, 0, this.keys.length ));
          var octave = floor(map(y, 0, height, 0, this.octaves.length));
          //builds note
          var note = (this.keys[key] + this.octaves[octave]);
          //Draws square and decays the size
          square(x, y, this.noteSize*s);
          //calls note to play
          this.playNote(note);
        }
        this.noteState[i][j]-=0.05;
        this.noteState[i][j]=constrain(this.noteState[i][j],0,1);
      }
    }
  }
  /////////////////////////////////
  findActiveNotes(img){
    for (var x = 0; x < img.width; x += 1) {
        for (var y = 0; y < img.height; y += 1) {
            var index = (x + (y * img.width)) * 4;
            var state = img.pixels[index + 0];
            if (state==0){ // if pixel is black (ie there is movement)
              // find which note to activate
              var screenX = map(x, 0, img.width, 0, this.gridWidth);
              var screenY = map(y, 0, img.height, 0, this.gridHeight);
              var i = int(screenX/this.noteSize);
              var j = int(screenY/this.noteSize);
              this.noteState[i][j] = 1;
            }
        }
    }
  }
  /////////////////////////////////
  playNote(note){
    //starts audio in browser
    userStartAudio();
    synth.play(note, 0.5, 0.1, 0.5);
  }
}
