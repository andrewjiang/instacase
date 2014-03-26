Template.select_image.rendered = function(){
	document.getElementById('image-input').addEventListener('change', newUpload, false);

	//start Bootstrap Select Picker
	$('.selectpicker').selectpicker();

	if(jQuery.browser.mobile) {
	 	//window.OverlayImg = '/images/overlay_m.png';
	 	window.isMobile = true;
	} else {
		//window.OverlayImg = '/images/overlay.png';
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

  var rect = new fabric.Rect({
	  originY: "top",
	  left: canvas.getWidth() / 2+1,
    top: 20,  
	  fill: 'white',
	  width: 250,
	  height: 460,
	  rx: 46,
	  ry: 46,
	  selectable: false,
	});

	if (isMobile){

	} else {

	}
	
	//Center Overlay Divs

	var cWidth = canvas.getWidth();
	var cHeight = canvas.getHeight();

	var outsideW = $('#outside-border').width();
	var outsideH = $('#outside-border').width();
	var insideW = $('#inside-border').width();
	var insideH = $('#inside-border').width();

	$('#outside-edge').css('left', cWidth/2 - outsideW/2);
	$('#outside-border').css('left', cWidth/2 - outsideW/2);
	$('#inside-border').css('left', cWidth/2 - insideW/2);
	$('#camera-border').css('left', cWidth/2 - insideW/2 + 14);

	$("#colorpicker").spectrum({



	    color: "#111",
	    flat: true,
    	showInput: true,
    	clickoutFiresChange: true,
    	showAlpha: true,
    	showPalette: true,
	    palette: [
	        ['black', 'white', 'blanchedalmond'],
	        ['rgb(255, 128, 0);', 'hsv 100 70 50', 'lightyellow']
	    ],
	    showButtons: false,
	    preferredFormat: "hex",
	    move: function(color) {
	    	var obj = canvas.getActiveObject();
    		var color = color.toRgbString();
    		obj.fill = color;
    		canvas.renderAll();
    		$('#font-textarea').css('color', color);
			}

	});

	$("#bkg-colorpicker").spectrum({



	    color: "#fff",
	    flat: true,
    	showInput: true,
    	clickoutFiresChange: true,
    	showPalette: true,
	    palette: [
	        ['black', 'white', 'blanchedalmond'],
	        ['rgb(255, 128, 0);', 'hsv 100 70 50', 'lightyellow']
	    ],
	    showButtons: false,
	    preferredFormat: "hex",
	    move: function(color) {
    		var color = color.toRgbString();
    		rect.fill = color;
    		canvas.renderAll();
			}

	});

  /*fabric.Image.fromURL('http://agileimpact.org/wp-content/uploads/2014/03/TwWc21Ai.jpeg', function(oImg) {
	  canvas.add(oImg), {left: iwidth, top: iheight}
	});*/
	
	
	
	/*canvas.setOverlayImage(OverlayImg, 
		canvas.renderAll.bind(canvas), 
		{overlayImageLeft: cwidth, overlayImageTop: cheight});*/
	


  // Attach it to the canvas object, then (re)display
  // the canvas.    
  // canvas.add(hi);
  canvas.add(rect);
  //canvas.sendBackward(oImg);

  $('#clipart-box img').click(function(){
  	var imgElement = this;
		var image = new fabric.Image(imgElement, {
		  left: 100,
		  top: 100,
		  borderColor: '#2c3e50',
    	cornerColor: '#2980b9',
    	transparentCorners: false,
		});
		canvas.add(image);
		image.center();
		image.setCoords();
		canvas.setActiveObject(image);
  });

  $('.selectpicker').selectpicker()
	.change(function() {
	    $('#outside-edge').css('border-color', $('.selectpicker').selectpicker('val'));
	});

  canvas.on('object:selected', function(options) {
	  var obj = canvas.getActiveObject();
	  $('#options-box').removeClass("hidden");
	  try{
	  	switch(obj.type)
		  {
		  	case "text":
		  		$('#clipart-box').addClass('hidden');
		  		$('#background-box').addClass('hidden');
		  	  $('#font-box').removeClass("hidden");
		  	  getFontInfo();
		  	  break;
		  	case "image":
		  	  $('#font-box').addClass("hidden");
		  	  break;
		  	default:
		  		$('#font-box').addClass("hidden");
		  	  break;
		  };
	  }
	  catch(err){}

	  var index = canvas.getObjects().indexOf(obj);
	  var numIndex = canvas.getObjects().length - 1;

	  if(index<numIndex && index>1){
	  	$('#move-up-icon').removeClass("hidden");
	  	$('#move-down-icon').removeClass("hidden");
	  } else if (index==numIndex && index>1){
	  	$('#move-up-icon').addClass("hidden");
	  	$('#move-down-icon').removeClass("hidden");
	  } else if (index==1 && index<numIndex){
	  	$('#move-up-icon').removeClass("hidden");
	  	$('#move-down-icon').addClass("hidden");
	  } else{
	  	$('#move-up-icon').addClass("hidden");
	  	$('#move-down-icon').addClass("hidden");
	  };
	  
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

	  $('#options-box').addClass("hidden");
	  $('#font-box').addClass("hidden");
	  $('#move-up-icon').addClass("hidden");
	  $('#move-down-icon').addClass("hidden");

	});


	//listen for text area changes and change font with it
	$('#font-textarea').bind('input propertychange', function() {
		var obj = canvas.getActiveObject();
		obj.text = $('#font-textarea').val();
		canvas.renderAll();
		moveButtons();
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

		var text = new fabric.Text("", { 
			left: cCenLeft, 
			top: cCenTop,
			fontFamily: "Arial",
			fontSize: 24,
			lockUniScaling: true,
			borderColor: '#2c3e50',
    	cornerColor: '#2980b9',
    	transparentCorners: false,
		});
		canvas.add(text);
		canvas.setActiveObject(text);
		showEditor();
		$('#font-textarea').focus();

	},
	'click #edit-icon': function(event){
		
		showEditor();

	},
	'click #align-left': function(event){
		var obj = canvas.getActiveObject(); 
		obj.textAlign = "left";
		canvas.renderAll();
		getFontInfo();
		$('#align-left').addClass('chosen');
		$('#align-center').removeClass('chosen');
		$('#align-right').removeClass('chosen');

	},
	'click #align-center': function(event){
		var obj = canvas.getActiveObject(); 
		obj.textAlign = "center";
		canvas.renderAll();
		getFontInfo();
		$('#align-left').removeClass('chosen');
		$('#align-center').addClass('chosen');
		$('#align-right').removeClass('chosen');
	},
	'click #align-right': function(event){
		var obj = canvas.getActiveObject(); 
		obj.textAlign = "right";
		canvas.renderAll();
		getFontInfo();
		$('#align-left').removeClass('chosen');
		$('#align-center').removeClass('chosen');
		$('#align-right').addClass('chosen');
	},
	'change #font-selector': function(event){
		var obj = canvas.getActiveObject(); 
		obj.fontFamily = $('#font-selector').val();
		canvas.renderAll();
		getFontInfo();
	},
	'click #clipart-icon': function(event){
		$('#font-box').addClass('hidden');
		$('#clipart-box').removeClass('hidden');
		$('#background-box').addClass('hidden');
	},
	'click #background-icon': function(event){
		$('#font-box').addClass('hidden');
		$('#clipart-box').addClass('hidden');
		$('#background-box').removeClass('hidden');
	},
	'click .close-button': function(event){
		$('#clipart-box').addClass('hidden');
		$('#background-box').addClass('hidden');
		$('#font-box').addClass('hidden');
	},
	'click #order-edges': function(event){
		$('#outside-edge').toggleClass('hidden')
	},
	'click #move-up-icon': function(event){
		var obj = canvas.getActiveObject();
	  var numIndex = canvas.getObjects().length - 1;
	  canvas.moveTo(obj, numIndex);
	},
	'click #move-down-icon': function(event){
		var obj = canvas.getActiveObject();
	  var index = canvas.getObjects().indexOf(obj);
	  canvas.moveTo(obj, 1);
	},
	/*'change #color-selector': function(event){
		var obj = canvas.getActiveObject(); 

		var color = $('#color-selector').val();

		var rgbcolor = hexToRgb(color);

		obj.fill = rgbcolor;

		canvas.renderAll();

		getFontInfo;
		

		//document.getElementById('color-selector').color.fromString(hexcolor);
		//obj.fontFamily = $('#font-selector').val();
		//canvas.renderAll();
		//getFontInfo();
	},*/
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
				offTop: 0,
				angle: 0,
				borderColor: '#2c3e50',
    		cornerColor: '#2980b9',
    		transparentCorners: false,
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

	var optionsH = $('#options-box').height();
	var optionsW = $('#options-box').width();

  var IconX = obj.left - r * Math.cos(theta) - optionsW/2;
  var IconY = obj.top - r * Math.sin(theta) - optionsH/2;

  $('#options-box').css("left", IconX);
	$('#options-box').css("top", IconY);
	$('#options-box').css("transform", "rotate(" + obj.angle + "deg)");

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
	//canvas.overlayImage = null;


	//set Canvas Height and Width
	cWidth = canvas.getWidth() + 0.0;
	cHeight = canvas.getHeight() + 0.0;
	var rect = canvas.item(0);
	var oWidth = cWidth / 2 - 1000;
	var oHeight = cHeight / 2 - 500;
	var cCenterTop = cHeight / 2;
	var cCenterLeft = cWidth / 2;

	var outsideW = $('#outside-border').width();
	var outsideH = $('#outside-border').width();
	var insideW = $('#inside-border').width();
	var insideH = $('#inside-border').width();

	$('#outside-border').css('left', cWidth/2 - outsideW/2);
	$('#inside-border').css('left', cWidth/2 - insideW/2);
	$('#outside-edge').css('left', cWidth/2 - outsideW/2);
	$('#camera-border').css('left', cWidth/2 - insideW/2 + 14);
	rect.set({
		left: cCenterLeft,
	});
	canvas.renderAll();
	/*canvas.setOverlayImage(OverlayImg, 
		canvas.renderAll.bind(canvas), 
		{overlayImageLeft: oWidth, overlayImageTop: oHeight});*/

};
function getFontInfo(){

	var obj = canvas.getActiveObject();
	var family = obj.fontFamily;
	var text = obj.text;
	var align = obj.textAlign;
	var color = obj.fill;

	/*var color = obj.fill.match(/\((\d+),(\d+),(\d+)\)/);
	var hexcolor = rgbToHex(color[1], color[2], color[3]);
	document.getElementById('color-selector').color.fromString(hexcolor);*/

	$('#font-selector').val(family);
	
	switch(align)
	{
		case "left":
			$('#align-left').addClass('chosen');
			$('#align-center').removeClass('chosen');
			$('#align-right').removeClass('chosen');
			break;
		case "center":
			$('#align-left').removeClass('chosen');
			$('#align-center').addClass('chosen');
			$('#align-right').removeClass('chosen');
			break;
		case "right":
			$('#align-left').removeClass('chosen');
			$('#align-center').removeClass('chosen');
			$('#align-right').addClass('chosen');
			break;
	};

	// Turn textarea into formatted text
	//$('#font-textarea').css('color', "#" + hexcolor);
	$('#font-textarea').val(text);
	$('#font-textarea').css('text-align', align);
	$('#font-textarea').css('font-family', family);
	$('#font-textarea').css('color', color);
	$('#colorpicker').spectrum("set", color);


};
/*function rgbToHex(R,G,B) {
	return toHex(R)+toHex(G)+toHex(B)
};
function toHex(n) {
 n = parseInt(n,10);
 if (isNaN(n)) return "00";
 n = Math.max(0,Math.min(n,255));
 return "0123456789ABCDEF".charAt((n-n%16)/16)
      + "0123456789ABCDEF".charAt(n%16);
};
function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return "rgb(" + parseInt(result[1], 16) +", "+ parseInt(result[2], 16) +", "+ parseInt(result[3], 16) + ")";
}*/
function showEditor(){
	$('#font-box').removeClass("hidden");
	getFontInfo();
}