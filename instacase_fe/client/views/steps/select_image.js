Template.select_image.rendered = function(){
	document.getElementById('image-input').addEventListener('change', newUpload, false);

	$(window).keydown(function(event){
    if(event.keyCode == 13) {
      event.preventDefault();
      return false;
    }
  });

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

	var containerWidth = $('#canvas-container').width();
	window.oriContWidth = containerWidth;
	window.canvasOffset = 0;


	// Setting canvas Height and setting minimums
  var canvasHeight = $(window).height()-$('#instacase-header').height()-14
  if (canvasHeight > 484){
  	canvas.setHeight(canvasHeight);
  } else {
  	canvas.setHeight(484);
  }
	canvas.setWidth(2000);


	// Background of the case
  var phoneBkg = new fabric.Rect({
	  originY: "top",
	  originX: "center",
	  left: containerWidth / 2,
    top: 20,  
	  fill: 'none',
	  width: 250,
	  height: 460,
	  rx: 46,
	  ry: 46,
	  selectable: false,
	});

	var phoneCase = new fabric.Rect({
	  originY: "top",
	  originX: "center",
	  left: containerWidth / 2,
    top: 20,  
	  fill: 'white',
	  width: 250,
	  height: 460,
	  rx: 46,
	  ry: 46,
	  selectable: false,
	});

	canvas.add(phoneCase);
	canvas.add(phoneBkg);

	// Initializing color pickers
	$("#colorpicker").spectrum({

	    color: "#111",
	    flat: true,
    	showInput: true,
    	clickoutFiresChange: true,
    	showAlpha: true,
    	showPalette: true,
	    palette: [
	        ['black', 'white', '#1abc9c', '#16a085', '#2ecc71','#27ae60','#f1c40f','#f39c12','#e67e22'],
	        ['#d35400','#e74c3c','#c0392b','#3498db','#2980b9','#34495e','#2c3e50','#9b59b6','#8e44ad']
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
	        ['black', 'white', '#1abc9c', '#16a085', '#2ecc71','#27ae60'],
	        ['#f1c40f','#f39c12','#e67e22','#d35400','#e74c3c','#c0392b'],
	        ['#3498db','#2980b9','#34495e','#2c3e50','#9b59b6','#8e44ad']
	    ],
	    showButtons: false,
	    preferredFormat: "hex",
	    move: function(color) {
    		var color = color.toRgbString();
    		phoneBkg.fill = color;
    		canvas.renderAll();
			}

	});

  // Adding clipart on clicks
  $('#clipart-box img').click(function(){
  	var imgElement = this;
  	var containerWidth = $('#canvas-container').width();
		var image = new fabric.Image(imgElement, {
		  left: containerWidth/2 - canvasOffset,
		  top: 240,
    	transparentCorners: true,
    	originX: 'center',
			originY: 'center',
			hasBorders: false,
  		lockUniScaling: true,
  		hasCorners: false,
  		borderColor: 'rgba(0,0,0,0)',
  		cornerColor: 'rgba(0,0,0,0)',
  		cornerSize: 20,
		});
		canvas.add(image);
		image.setCoords();
		canvas.setActiveObject(image);
  });

  // Change case color
  $('.selectpicker').selectpicker()
	.change(function() {
	    $('#outside-edge').css('border-color', $('.selectpicker').selectpicker('val'));
	    phoneCase.fill = $('.selectpicker').selectpicker('val');
	    canvas.renderAll();
	});

	// Events triggered on object selection
  canvas.on('object:selected', function(options) {
	  var obj = canvas.getActiveObject();
	  $('#options-box').removeClass("hidden");
	  $('#object-box').removeClass("hidden");
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

	  if(index<numIndex && index>2){
	  	$('#move-up-icon').removeClass("hidden");
	  	$('#move-down-icon').removeClass("hidden");
	  } else if (index==numIndex && index>2){
	  	$('#move-up-icon').addClass("hidden");
	  	$('#move-down-icon').removeClass("hidden");
	  } else if (index==2 && index<numIndex){
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
	  $('#object-box').addClass("hidden");
	  $('#font-box').addClass("hidden");
	  $('#image-box').addClass("hidden");
	  $('#move-up-icon').addClass("hidden");
	  $('#move-down-icon').addClass("hidden");

	});


	// Listen for text area changes and change font with it
	$('#font-textarea').bind('input propertychange', function() {
		var obj = canvas.getActiveObject();
		obj.text = $('#font-textarea').val();
		canvas.renderAll();
		moveButtons();
	});

	// Set initial price
	setPrice(1);

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
		
		var containerWidth = $('#canvas-container').width();
		var text = new fabric.Text("", { 
			left: containerWidth/2 - canvasOffset,
			top: 240,
			fontFamily: "Lato",
			fontSize: 24,
			lockUniScaling: true,
			hasBorders: false,
			hasCorners: false,
			transparentCorners: true,
			originX: 'center',
			originY: 'center',
			borderColor: 'rgba(0,0,0,0)',
			cornerColor: 'rgba(0,0,0,0)',
			cornerSize: 20
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
		$('#font-textarea').css('font-family', $('#font-selector').val());
		obj.fontFamily = $('#font-selector').val();
		canvas.renderAll();
		moveButtons();
		

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

	// Object mpve to front / back options
	'click #move-up-icon': function(event){
		var obj = canvas.getActiveObject();
	  var numIndex = canvas.getObjects().length - 1;
	  canvas.moveTo(obj, numIndex);

	  var index = canvas.getObjects().indexOf(obj);

	  if(index<numIndex && index>2){
	  	$('#move-up-icon').removeClass("hidden");
	  	$('#move-down-icon').removeClass("hidden");
	  } else if (index==numIndex && index>2){
	  	$('#move-up-icon').addClass("hidden");
	  	$('#move-down-icon').removeClass("hidden");
	  } else if (index==2 && index<numIndex){
	  	$('#move-up-icon').removeClass("hidden");
	  	$('#move-down-icon').addClass("hidden");
	  } else{
	  	$('#move-up-icon').addClass("hidden");
	  	$('#move-down-icon').addClass("hidden");
	  };
	},
	'click #move-down-icon': function(event){
		var obj = canvas.getActiveObject();
	  canvas.moveTo(obj, 2);

	  var index = canvas.getObjects().indexOf(obj);
	  var numIndex = canvas.getObjects().length - 1;

	  if(index<numIndex && index>2){
	  	$('#move-up-icon').removeClass("hidden");
	  	$('#move-down-icon').removeClass("hidden");
	  } else if (index==numIndex && index>2){
	  	$('#move-up-icon').addClass("hidden");
	  	$('#move-down-icon').removeClass("hidden");
	  } else if (index==2 && index<numIndex){
	  	$('#move-up-icon').removeClass("hidden");
	  	$('#move-down-icon').addClass("hidden");
	  } else{
	  	$('#move-up-icon').addClass("hidden");
	  	$('#move-down-icon').addClass("hidden");
	  };
	},

	// Image Filters

	'click #filter-Grayscale': function(event){
      var enabled = toggleFilterButton(event.currentTarget);
	  applyFilter(0, enabled && new f.Grayscale());
	},
	'click #filter-Sepia2': function(event){
      var enabled = toggleFilterButton(event.currentTarget);
	  applyFilter(1, enabled && new f.Sepia2());
	},
	'click #filter-Sepia': function(event){
      var enabled = toggleFilterButton(event.currentTarget);
	  applyFilter(2, enabled && new f.Sepia());
	},
	'click #filter-Blur': function(event){
      var enabled = toggleFilterButton(event.currentTarget);
	  applyFilter(3, enabled && new f.Convolute({
      matrix: [ 1/9, 1/9, 1/9,
                1/9, 1/9, 1/9,
                1/9, 1/9, 1/9 ]
    }));
	},
	'click #filter-Sharpen': function(event){
      var enabled = toggleFilterButton(event.currentTarget);
	  applyFilter(3, enabled && new f.Convolute({
      matrix: [  0, -1,  0,
                -1,  5, -1,
                 0, -1,  0 ]
    }));
	},
	'click #filter-Emboss': function(event){
      var enabled = toggleFilterButton(event.currentTarget);
	  applyFilter(4, enabled && new f.Convolute({
      matrix: [ 1,   1,  1,
                1, 0.7, -1,
               -1,  -1, -1 ]
    }));
	},
  'click #filter-tint-color': function(event){
      var element = event.currentTarget;
      applyFilter(5, element.checked && new f.Tint({
          color: document.getElementById('filter-tint-color-intensity').value,
          opacity: parseFloat(document.getElementById('filter-tint-color-opacity').value)
      }));
  },
  'change #filter-tint-color-intensity': function(event){
      var element = event.currentTarget;
      applyFilterValue(5, 'color', element.value);
  },
  'change #filter-tint-color-opacity': function(event){
      var element = event.currentTarget;
      applyFilterValue(5, 'opacity', element.value);
  },
  'click #filter-brighten': function(event){
      var enabled = toggleFilterButton(event.currentTarget);
      applyFilter(6, enabled && new f.Brightness({
          brightness: parseInt(document.getElementById('filter-brighten-intensity').value, 10)
      }));
  },
  'change #filter-brighten-intensity': function(event){
      var element = event.currentTarget;
      applyFilterValue(6, 'brightness', parseInt(element.value, 10));
  },
  'click #filter-pixelate': function(event){
      var element = event.currentTarget;
      applyFilter(8, element.checked && new f.Pixelate({
          blocksize: parseInt(document.getElementById('filter-pixelate-intensity').value, 10)
      }));
  },
  'change #filter-pixelate-intensity': function(event){
      var element = event.currentTarget;
      applyFilterValue(8, 'blocksize', parseInt(element.value, 10));
  },

	// Order Options
	'change #order-quantity': function(event){
		var quantity = $('#order-quantity').val();
		console.log(quantity);
		setPrice(quantity);
	},

	'click #order-checkout': function(event){
		console.log(JSON.stringify(canvas));
	}

});

function newUpload(evt) {
	var reader = new FileReader();
	var containerWidth = $('#canvas-container').width();
	reader.onload = function(event) { console.log ('loading reader');
		var imgObj = new Image()

		imgObj.src = event.target.result;
		imgObj.onload = function(){
			// start fabricJS stuff

			var image = new fabric.Image(imgObj);
			image.set({
				originX: 'center',
				originY: 'center',
				left: containerWidth/2 - canvasOffset,
				top: 240,
				offLeft: 0,
				offTop: 0,
				angle: 0,
    		transparentCorners: true,
    		hasBorders: false,
    		lockUniScaling: true,
    		hasCorners: false,
    		borderColor: 'rgba(0,0,0,0)',
  			cornerColor: 'rgba(0,0,0,0)',
    		cornerSize: 20,
			});
			image.set({
				scaleY: 260 / (image.width),
    		scaleX: 260/ (image.width),
			});			
			canvas.add(image);
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
	var r = Math.pow(Math.pow(rX, 2) + Math.pow(rY, 2), 0.5) + 30;
	var theta = ((obj.angle) * Math.PI / 180) + Math.atan(rY/rX);

	var optionsH = $('#options-box').height();
	var optionsW = $('#options-box').width();

  var IconX = obj.left - r * Math.cos(theta) - optionsW/2;
  var IconY = obj.top - r * Math.sin(theta) - optionsH/2;

  $('#options-box').css("left", IconX + canvasOffset);
	$('#options-box').css("top", IconY);
	$('#options-box').css("transform", "rotate(" + obj.angle + "deg)");
	obj.setCoords();

	$('#object-box').css("width", rX*2);
	$('#object-box').css("height", rY*2);
	$('#object-box').css("left", X + canvasOffset);
	$('#object-box').css("top", Y);
	$('#object-box').css("transform", "rotate(" + obj.angle + "deg)");
	obj.setCoords();

};
function resizeCanvas(){

	canvasOffset = -(oriContWidth - $('#canvas-container').width())/2;

	$('.canvas-container').css("left", canvasOffset);

	if(canvas.getActiveObject()){
		moveButtons();
	};

	//resetting size of Canvas
	/*var canvasHeight = $(window).height()-$('#instacase-header').height()-14
  if (canvasHeight > 484){
  	canvas.setHeight(canvasHeight);
  } else {
  	canvas.setHeight(484);
  }*/


	// canvas.setWidth($('#canvas-container').width());

	//setting OverLay Image
	//canvas.overlayImage = null;


	//set Canvas Height and Width
	/*var cWidth = canvas.getWidth() + 0.0;

	var phoneBkg = canvas.item(1);
	var phoneCase = canvas.item(0);
	var cCenterLeft = cWidth / 2;

	var outsideW = $('#outside-border').width();
	var outsideH = $('#outside-border').width();
	var insideW = $('#inside-border').width();
	var insideH = $('#inside-border').width();

	phoneBkg.set({
		left: cCenterLeft+1,
	});
	phoneCase.set({
		left: cCenterLeft+1,
	});
	canvas.renderAll(); */

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

/**
 * Toggles the given filter button on or off
 * @param {HTMLElement} button The button to toggle
 * @return {boolean} the new toggle status of the button
 */
function toggleFilterButton(button) {
    var $button = $(button);
    $button.toggleClass('filter-enabled');
    return $button.hasClass('filter-enabled');
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

// Set Total Price
function setPrice(value) {
	var total = value * 10;
	$('#order-value').html(total);
}
