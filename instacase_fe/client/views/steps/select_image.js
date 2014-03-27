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

	// Resize function on resizing the window
  window.onresize = resizeCanvas;

  // Obtain a canvas drawing surface from fabric.js
  window.canvas = new fabric.Canvas('insta-canvas');
  window.f = fabric.Image.filters;
  window.filters = {};

  window.cWidth = canvas.getWidth() + 0.0;
	window.cHeight = canvas.getHeight() + 0.0;

	// Setting canvas Height and setting minimums
  var canvasHeight = $(window).height()-$('#instacase-header').height()-14
  if (canvasHeight > 484){
  	canvas.setHeight(canvasHeight);
  } else {
  	canvas.setHeight(484);
  }
	canvas.setWidth($('#canvas-container').width());


	// Background of the case
  var rect = new fabric.Rect({
	  originY: "top",
	  originX: "center",
	  left: canvas.getWidth() / 2+1,
    top: 20,  
	  fill: 'white',
	  width: 250,
	  height: 460,
	  rx: 46,
	  ry: 46,
	  selectable: false,

	});

	
	// Set iPhone case outlines
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


	// Initializing color pickers
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

  canvas.add(rect);

  // Adding clipart on clicks
  $('#clipart-box img').click(function(){
  	var imgElement = this;
		var image = new fabric.Image(imgElement, {
		  left: 100,
		  top: 100,
		  borderColor: '#2c3e50',
    	cornerColor: '#2980b9',
    	transparentCorners: false,
    	originX: 'center',
			originY: 'center',
		});
		canvas.add(image);
		image.center();
		image.setCoords();
		canvas.setActiveObject(image);
  });

  // Change case color
  $('.selectpicker').selectpicker()
	.change(function() {
	    $('#outside-edge').css('border-color', $('.selectpicker').selectpicker('val'));
	});

	// Events triggered on object selection
  canvas.on('object:selected', function(options) {
	  var obj = canvas.getActiveObject();
	  $('#options-box').removeClass("hidden");
	  try{
	  	switch(obj.type)
		  {
		  	case "text":
		  		$('#clipart-box').addClass('hidden');
		  		$('#background-box').addClass('hidden');
		  		$('#image-box').addClass('hidden');
		  	  $('#font-box').removeClass("hidden");
		  	  getFontInfo();
		  	  break;
		  	case "image":
		  	  $('#clipart-box').addClass('hidden');
		  		$('#background-box').addClass('hidden');
		  		$('#font-box').addClass('hidden');
		  	  $('#image-box').removeClass("hidden");
		  	  break;
		  	default:
		  		$('#clipart-box').addClass('hidden');
		  		$('#background-box').addClass('hidden');
		  		$('#font-box').addClass('hidden');
		  	  $('#image-box').addClass("hidden");
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

	// Events triggered on object rotation
	canvas.on('object:rotating', function(options) {
	  
	  moveButtons();

	});

	// Events triggered on object modification
	canvas.on('object:modified', function(options) {
	  
	  moveButtons();

	});

	// Events triggered on object move
	canvas.on('object:moving', function(options) {

		moveButtons();

	});

	// Events triggered on object clear
	canvas.on('selection:cleared', function(options) {
	  var obj = canvas.getActiveObject();

	  $('#options-box').addClass("hidden");
	  $('#font-box').addClass("hidden");
	  $('#image-box').addClass("hidden");
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
    	originX: 'center',
			originY: 'center',
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
		$('#image-box').addClass('hidden');
		$('#clipart-box').removeClass('hidden');
		$('#background-box').addClass('hidden');
	},
	'click #background-icon': function(event){
		$('#font-box').addClass('hidden');
		$('#image-box').addClass('hidden');
		$('#clipart-box').addClass('hidden');
		$('#background-box').removeClass('hidden');
	},
	'click .close-button': function(event){
		$('#clipart-box').addClass('hidden');
		$('#background-box').addClass('hidden');
	},
	'click #order-edges': function(event){
		$('#outside-edge').toggleClass('hidden')
	},
	'click #move-up-icon': function(event){
		var obj = canvas.getActiveObject();
	  var numIndex = canvas.getObjects().length - 1;
	  canvas.moveTo(obj, numIndex);

	  var index = canvas.getObjects().indexOf(obj);

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
	},
	'click #move-down-icon': function(event){
		var obj = canvas.getActiveObject();
	  canvas.moveTo(obj, 1);

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
	},

	// Image Filters

	'click #filter-Grayscale': function(event){
		var obj = canvas.getActiveObject();
	  applyFilter(0, new f.Grayscale());
	},
	'click #filter-Sepia2': function(event){
		var obj = canvas.getActiveObject();
	  applyFilter(1, new f.Sepia2());
	},
	'click #filter-Sepia': function(event){
		var obj = canvas.getActiveObject();
	  applyFilter(2, new f.Sepia());
	},
	'click #filter-Blur': function(event){
		var obj = canvas.getActiveObject();
	  applyFilter(3, new f.Convolute({
      matrix: [ 1/9, 1/9, 1/9,
                1/9, 1/9, 1/9,
                1/9, 1/9, 1/9 ]
    }));
	},
	'click #filter-Sharpen': function(event){
		var obj = canvas.getActiveObject();
	  applyFilter(4, new f.Convolute({
      matrix: [  0, -1,  0,
                -1,  5, -1,
                 0, -1,  0 ]
    }));
	},
	'click #filter-Emboss': function(event){
		var obj = canvas.getActiveObject();
	  applyFilter(5, new f.Convolute({
      matrix: [ 1,   1,  1,
                1, 0.7, -1,
               -1,  -1, -1 ]
    }));
	},

});

function newUpload(evt) {

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
	var	rX = (obj.currentWidth / 2);
	var	rY = (obj.currentHeight / 2);
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
	obj.setCoords();

};
function resizeCanvas(){
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

// Show Font Editor
function showEditor(){
	$('#font-box').removeClass("hidden");
	getFontInfo();
}

// Apply Filter to Object
function applyFilter(index, filter) {
  var obj = canvas.getActiveObject();
  obj.filters[index] = filter;
  obj.applyFilters(canvas.renderAll.bind(canvas));
}

// Apply Filter Value to Object
function applyFilterValue(index, prop, value) {
  var obj = canvas.getActiveObject();
  if (obj.filters[index]) {
    obj.filters[index][prop] = value;
    obj.applyFilters(canvas.renderAll.bind(canvas));
  }
}
