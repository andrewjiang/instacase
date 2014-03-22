Template.select_image.rendered = function(){
	document.getElementById('image-input').addEventListener('change', newUpload, false);


	if(jQuery.browser.mobile) {
	 	window.OverlayImg = '/images/overlay_m.png';
	 	window.isMobile = true;
	} else {
		window.OverlayImg = '/images/overlay.png';
		window.isMobile = false;
	};


  window.onresize = resizeCanvas;
  // Obtain a canvas drawing surface from fabric.js
  window.canvas = new fabric.Canvas('insta-canvas');
  window.json = JSON.stringify(canvas.toJSON());

  window.cWidth = canvas.getWidth() + 0.0;
	window.cHeight = canvas.getHeight() + 0.0;

  var canvasHeight = $(window).height()-$('#instacase-header').height()-14
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

	if (isMobile){
		var cwidth = canvas.getWidth() / 2 - 960;
		var cheight = canvas.getHeight() / 2 - 540;
	} else {
		var cwidth = canvas.getWidth() / 2 - 1000;
		var cheight = canvas.getHeight() / 2 - 500;
	}
	

  /*fabric.Image.fromURL('http://agileimpact.org/wp-content/uploads/2014/03/TwWc21Ai.jpeg', function(oImg) {
	  canvas.add(oImg), {left: iwidth, top: iheight}
	});*/
	
	
	
	canvas.setOverlayImage(OverlayImg, 
		canvas.renderAll.bind(canvas), 
		{overlayImageLeft: cwidth, overlayImageTop: cheight});
	


  // Attach it to the canvas object, then (re)display
  // the canvas.    
  // canvas.add(hi);

  //canvas.add(rect2);
  //canvas.add(rect);
  //canvas.sendBackward(oImg);
  canvas.on('object:selected', function(options) {
	  var obj = canvas.getActiveObject();
	  try{
	  	switch(obj.type)
		  {
		  	case "image":
		  	  $('#image-box').removeClass("hidden");
		  	  break;
		  	case "text":
		  	  $('#text-box').removeClass("hidden");
		  	  $('#font-box').removeClass("hidden");
		  	  getFontInfo();
		  	  break;
		  	default:
		  		$('#image-box').removeClass("hidden");
		  	  break;
		  };
	  }
	  catch(err){}
	  
	  
	  moveButtons();

	});
	canvas.on('object:rotating', function(options) {
	  
	  moveButtons();

	});
	canvas.on('object:modified', function(options) {
	  
	  moveButtons();

	});
	canvas.on('object:moving', function(options) {

		moveButtons();

	  /*var obj = canvas.getActiveObject();

	  var cCenLeft = (canvas.getWidth() + 0.0) / 2;
		var cCenTop = (canvas.getHeight() + 0.0) / 2;
		var offL = obj.left - cCenLeft;
		var offT = obj.top - cCenTop; 

		obj.offLeft = offL;
		obj.offTop = offT;
		json = JSON.stringify(canvas.toJSON(['offTop', 'offLeft']));*/

	});
	canvas.on('selection:cleared', function(options) {
	  var obj = canvas.getActiveObject();

	  $('#image-box').addClass("hidden");
	  
	  $('#text-box').addClass("hidden");
	  $('#font-box').addClass("hidden");

	  
	});
};

Template.select_image.events({
	'click #upload-icon': function(event){
		$('#image-input').click();
	},
	'click #text-remove-icon': function(event){
		canvas.remove(canvas.getActiveObject());
	},
	'click #img-remove-icon': function(event){
		canvas.remove(canvas.getActiveObject());
	},
	'click #copy-icon': function(event){
		var obj = canvas.getActiveObject();
		var clone = obj.clone();
		canvas.add(clone);
		clone.set({
			top: obj.top + 5,
			left: obj.left + 5,
		})
		canvas.renderAll();
	},
	'click #text-icon': function(event){
		

	  var cCenLeft = (canvas.getWidth() + 0.0) / 2;
		var cCenTop = (canvas.getHeight() + 0.0) / 2;

		var newText = window.prompt("Your text","");

		var text = new fabric.Text(newText, { left: cCenLeft, top: cCenTop });
		canvas.setActiveObject(text);
		canvas.add(text);

	},
	'click #edit-icon': function(event){
		
		var obj = canvas.getActiveObject(); 

	  var cCenLeft = (canvas.getWidth() + 0.0) / 2;
		var cCenTop = (canvas.getHeight() + 0.0) / 2;

		var newText = window.prompt("Your text","");

		var text = new fabric.Text(newText, { left: cCenLeft, top: cCenTop });
		canvas.setActiveObject(text);
		canvas.add(text);


		/*var offL = text.left - cCenLeft;
		var offT = text.top - cCenTop; 

		text.offLeft = offL;
		text.offTop = offT;
		json = JSON.stringify(canvas.toJSON(['offTop', 'offLeft']));*/

	},
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
				originX: 'center',
				originY: 'center',
				left: 0,
				top: 0,
				offLeft: 0,
				offTop: 0
			});
			image.set({
				scaleY: 260 / (image.width),
    		scaleX: 260/ (image.width),
			});			
			canvas.add(image);
			image.center();
			image.setCoords();
			canvas.setActiveObject(image);
		
		}
	$("#image-input").val('');
	}
	reader.readAsDataURL(evt.target.files[0]);
	
};
function moveButtons(){
	var obj = canvas.getActiveObject();
	var	rX = (obj.currentWidth / 2)
	var	rY = (obj.currentHeight / 2)
	var X = obj.left - rX;
	var Y = obj.top - rY;
	var r = Math.pow(Math.pow(rX, 2) + Math.pow(rY, 2), 0.5) + 20;
	var theta = ((obj.angle) * Math.PI / 180) + Math.atan(rY/rX);

  var IconX = obj.left - r * Math.cos(theta) - 12;
  var IconY = obj.top - r * Math.sin(theta) - 34;

	try{
		switch(obj.type)
	  {
	  	case "image":
	  	  $('#image-box').css("left", IconX);
		  	$('#image-box').css("top", IconY);
		  	$('#image-box').css("transform", "rotate(" + obj.angle + "deg)");
	  	  break;
	  	case "text":
	  	  $('#text-box').css("left", IconX);
		  	$('#text-box').css("top", IconY);
		  	$('#text-box').css("transform", "rotate(" + obj.angle + "deg)");
	  	  break;
	  	default:
	  		$('#text-box').css("left", IconX);
		  	$('#text-box').css("top", IconY);
		  	$('#text-box').css("transform", "rotate(" + obj.angle + "deg)");
	  	  break;
	  };
	}
	catch(err){
		$('#text-box').css("left", IconX);
  	$('#text-box').css("top", IconY);
  	$('#text-box').css("transform", "rotate(" + obj.angle + "deg)");
	}
 

  console.log(obj);
};
function resizeCanvas(){
	canvas.loadFromJSON(json);
	//resetting size of Canvas
	var canvasHeight = $(window).height()-$('#instacase-header').height()-14
  if (canvasHeight > 484){
  	canvas.setHeight(canvasHeight);
  } else {
  	canvas.setHeight(484);
  }
	canvas.setWidth($('#canvas-container').width());

	//setting OverLay Image
	canvas.overlayImage = null;


	//set Canvas Height and Width
	cWidth = canvas.getWidth() + 0.0;
	cHeight = canvas.getHeight() + 0.0;
	var oWidth = cWidth / 2 - 1000;
	var oHeight = cHeight / 2 - 500;
	var cCenterTop = cHeight / 2;
	var cCenterLeft = cWidth / 2;

	/*objects = JSON.parse(JSON.stringify(canvas));

	for (var i=0; i <= objects.objects.length-1; i++){
		var nTop = cCenterTop + canvas.item(i).offTop;
		var nLeft = cCenterLeft + canvas.item(i).offLeft;

		canvas.item(i).set({
			top: nTop,
			left: nLeft,
		});
	};

	json = JSON.stringify(canvas.toJSON(['offTop', 'offLeft']));*/
	

	canvas.setOverlayImage(OverlayImg, 
		canvas.renderAll.bind(canvas), 
		{overlayImageLeft: oWidth, overlayImageTop: oHeight});

};
function getFontInfo(){
	var obj = canvas.getActiveObject();
	var font = obj.fontFamily;
	var text = obj.text;
	var text = obj.text;
	$('#font-selector').val(font);
	$('#font-textarea').val(text);
	var color = obj.fill.match(/\((\d+),(\d+),(\d+)\)/);
	$('#color-selector').val(rgbToHex(color[1], color[2], color[3]));
};
function rgbToHex(R,G,B) {
	return toHex(R)+toHex(G)+toHex(B)
};
function toHex(n) {
 n = parseInt(n,10);
 if (isNaN(n)) return "00";
 n = Math.max(0,Math.min(n,255));
 return "0123456789ABCDEF".charAt((n-n%16)/16)
      + "0123456789ABCDEF".charAt(n%16);
};