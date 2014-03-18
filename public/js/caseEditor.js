$(function() {
    // Convert a canvas into a ballin' FabricJS canvas object
    var canvas = new fabric.Canvas('fabric');
    var $canvasContainer = $('#fabric-container');
    canvas.setDimensions({
        width: $canvasContainer.width(),
        height: $canvasContainer.height()
    });

    // Create a random text object
    var wut = new fabric.Text('wut the wutness', {
        originX: 'center',
        left: canvas.getWidth() / 2,
        top: canvas.getHeight() / 2
    });

    // Throw it on the canvas
    canvas.add(wut);
});
