Template.canvas.rendered = function(){

        
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

        var rect = new fabric.Rect({
				  left: 100,
				  top: 100,
				  fill: 'red',
				  width: 20,
				  height: 20,
				  angle: 45
				});

        fabric.Image.fromURL('http://theritebite.com/blog/wp-content/uploads/2011/06/Happy-Family.jpg', function(oImg) {
				  canvas.add(oImg);
				});
				
        // Attach it to the canvas object, then (re)display
        // the canvas.    
        canvas.add(hi);
        canvas.add(rect);
};