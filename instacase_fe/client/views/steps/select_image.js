Template.select_image.rendered = function(){

        
        // Obtain a canvas drawing surface from fabric.js
        var canvas = new fabric.Canvas('insta-canvas');
        canvas.setHeight($('#canvas-container').height());
				canvas.setWidth($('#canvas-container').width());
 
        // Create a text object. 
        // Does not display it-the canvas doesn't 
        // know about it yet.
        var hi = new fabric.Text('hello, world.', {
            left: canvas.getWidth() / 2,
            top: canvas.getHeight() / 2        
        });

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

				var cwidth = canvas.getWidth() / 2 - 500;
				var cheight = canvas.getHeight() / 2 - 500;

        fabric.Image.fromURL('http://agileimpact.org/wp-content/uploads/2014/03/TwWc21Ai.jpeg', function(oImg) {
				  canvas.add(oImg);
				});

				canvas.setOverlayImage('/images/overlay.png', 
					canvas.renderAll.bind(canvas), 
					{overlayImageLeft: cwidth, overlayImageTop: cheight});
				

    
        // Attach it to the canvas object, then (re)display
        // the canvas.    
        canvas.add(hi);

        canvas.add(rect2);
        canvas.add(rect);
        canvas.sendBackward(oImg);
        
};
Template.select_image.events({
	'click #upload-icon': function(event){
		$('#image-input').click();
	},
});
