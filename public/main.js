$(function () {
  var socket = io();

  // drawing utensils
  var canvas = document.getElementsByClassName('whiteboard')[0];
  var context = canvas.getContext('2d');
  var colors = document.getElementsByClassName('color');
  var thicknesses = document.getElementsByClassName('thickness');

  var current = {
    color: 'black',
    thickness: 10
  };
  var drawing = false;

  canvas.addEventListener('mousedown', onMouseDown);
  canvas.addEventListener('mouseup', onMouseUp);
  canvas.addEventListener('mouseout', onMouseUp);
  canvas.addEventListener('mousemove', throttle(onMouseMove, 10));

  for (var i = 0; i < colors.length; i++){
    colors[i].addEventListener('click', onColorUpdate);
  }


  for (var i = 0; i < thicknesses.length; i++){
    thicknesses[i].addEventListener('click', onThicknessUpdate);
  }

  socket.on('drawing', onDrawingEvent);


  // Set resize event - needed to adjust the canvas size
  window.addEventListener('resize', onResize, false);
  onResize();

  function drawLine(x0, y0, x1, y1, color, thickness, emit){
    context.beginPath();
    context.moveTo(x0, y0);
    context.lineTo(x1, y1);
    context.lineCap = 'round';
    context.strokeStyle = color;
    context.lineWidth = thickness;
    context.stroke();
    context.closePath();

    if (!emit) { return; }
    var w = canvas.width;
    var h = canvas.height;

    socket.emit('drawing', {
      x0: x0 / w,
      y0: y0 / h,
      x1: x1 / w,
      y1: y1 / h,
      color: color,
      thickness: thickness
    });
  }

  function onMouseDown(e){
    drawing = true;
    current.x = e.clientX;
    current.y = e.clientY;
  }

  function onMouseUp(e){
    if (!drawing) { return; }
    drawing = false;
    drawLine(current.x, current.y, e.clientX, e.clientY, current.color, current.thickness, true);
  }

  function onMouseMove(e){
    if (!drawing) { return; }
    drawLine(current.x, current.y, e.clientX, e.clientY, current.color, current.thickness, true);
    current.x = e.clientX;
    current.y = e.clientY;
  }

  // limit the number of events per second
  function throttle(callback, delay) {
    var previousCall = new Date().getTime();
    return function() {
      var time = new Date().getTime();

      if ((time - previousCall) >= delay) {
        previousCall = time;
        callback.apply(null, arguments);
      }
    };
  }

  function onDrawingEvent(data) {
    var w = canvas.width;
    var h = canvas.height;
    drawLine(data.x0 * w, data.y0 * h, data.x1 * w, data.y1 * h, data.color, data.thickness);
  }

  function onColorUpdate(e) {
    color = e.target.className.split(' ')[1];
    for (var i = 0; i < thicknesses.length; i++){
      thicknesses[i].style.backgroundColor = color;
    }
    
    current.color = color;
  }

  function onThicknessUpdate(e) {
    width = parseInt($(e.target).css('width'), 10);
    current.thickness = width;
  }

  function onResize() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }

  //chat message bit below
  $('form').submit(function(){
    socket.emit('chat message', $('#m').val());
    $('#m').val('');
    return false;
  });
  socket.on('chat message', function(msg){
    $('#messages').append($('<li>').text(msg));
  });
});