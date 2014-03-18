Template.select_image.rendered = function(){
	document.getElementById('image-input').addEventListener('change', newUpload, false);
  window.onresize = resizeCanvas;
  // Obtain a canvas drawing surface from fabric.js
  window.canvas = new fabric.Canvas('insta-canvas');
  var canvasHeight = $(window).height()-$('#insta-footer').height()-$('#instacase-header').height()-14
  if (canvasHeight > 484){
  	canvas.setHeight(canvasHeight);
  } else {
  	canvas.setHeight(484);
  }
	canvas.setWidth($('#canvas-container').width());

  // Create a text object. 
  // Does not display it-the canvas doesn't 
  // know about it yet.
  /* var hi = new fabric.Text('hello, world.', {
      left: canvas.getWidth() / 2,
      top: canvas.getHeight() / 2        
  }); */

  /*var rect = new fabric.Rect({
	  left: canvas.getWidth() / 2,
    top: canvas.getHeight() / 2,   
    stroke: 'red',
	  fill: 'none',
	  width: 210,
	  height: 420,
	  rx: 20,
	  ry: 20,
	  selectable: true,
	});*/

	/*var rect2 = new fabric.Rect({
	  left: canvas.getWidth() / 2,
    top: canvas.getHeight() / 2,   
    stroke: 'black',
	  fill: 'none',
	  width: 254,
	  height: 464,
	  rx: 36,
	  ry: 36,
	  selectable: true
	});*/

	var cwidth = canvas.getWidth() / 2 - 1000;
	var cheight = canvas.getHeight() / 2 - 500;

  /*fabric.Image.fromURL('http://agileimpact.org/wp-content/uploads/2014/03/TwWc21Ai.jpeg', function(oImg) {
	  canvas.add(oImg), {left: iwidth, top: iheight}
	});*/

	canvas.setOverlayImage('/images/overlay.png', 
		canvas.renderAll.bind(canvas), 
		{overlayImageLeft: cwidth, overlayImageTop: cheight});
	


  // Attach it to the canvas object, then (re)display
  // the canvas.    
  // canvas.add(hi);

  //canvas.add(rect2);
  //canvas.add(rect);
  //canvas.sendBackward(oImg);
        
};
Template.select_image.events({
	'click #upload-icon': function(event){
		$('#image-input').click();
	}
});
function newUpload(evt) {
	/*URL = 'http://agileimpact.org/wp-content/uploads/2014/03/TwWc21Ai.jpeg'
  fabric.Image.fromURL(URL, function(oImg) {
	  canvas.add(oImg), {left: 100, top: 100}
	});*/
	var reader = new FileReader();
	reader.onload = function(event) { console.log ('loading reader');
		var imgObj = new Image()
		imgObj.src = event.target.result;
		imgObj.onload = function(){
			// start fabricJS stuff

			var image = new fabric.Image(imgObj);
			image.set({
				left: 150,
				top: 150,
				padding: 10,
				cornersize: 10
			});

			canvas.add(image);
		}

	}
	reader.readAsDataURL(evt.target.files[0]);
	
};
function resizeCanvas(){
	canvas.setHeight($('#canvas-container').height());
	canvas.setWidth($('#canvas-container').width());
	canvas.overlayImage = null;
	canvas.renderAll.bind(canvas);
	var cwidth = canvas.getWidth() / 2 - 1000;
	var cheight = canvas.getHeight() / 2 - 500;
	canvas.setOverlayImage('/images/overlay.png', 
		canvas.renderAll.bind(canvas), 
		{overlayImageLeft: cwidth, overlayImageTop: cheight});
};
