
var keyboardState = {};

function initMouseHandling(canvas, moveCallback) {
    document.addEventListener('pointerlockchange', changeCallback, false);
    document.addEventListener('mozpointerlockchange', changeCallback, false);
    document.addEventListener('webkitpointerlockchange', changeCallback, false);
    var canvasElement = canvas.get()[0];

    $(document).keydown(function(event) {
        keyboardState[event.which] = true;
    });
    $(document).keyup(function(event) {
        keyboardState[event.which] = false;
    });

    canvas.click(function () {
        canvasElement.requestPointerLock = canvasElement.requestPointerLock ||
                canvasElement.mozRequestPointerLock ||
                canvasElement.webkitRequestPointerLock;

        // Ask the browser to lock the pointer)
        canvasElement.requestPointerLock();
    });

    var firstMoveCallback = false;

    function moveCallbackCaller(event) {
        if(firstMoveCallback) {
            firstMoveCallback = false;
            return;
        }
        var movementX = event.movementX ||
                event.mozMovementX ||
                event.webkitMovementX ||
                0;
 
        var movementY = event.movementY ||
                event.mozMovementY ||
                event.webkitMovementY ||
                0;
        moveCallback(movementX, movementY);
    }

    function changeCallback(e) {
        if (document.pointerLockElement === canvasElement ||
                document.mozPointerLockElement === canvasElement ||
                document.webkitPointerLockElement === canvasElement) {

            // we've got a pointerlock for our element, add a mouselistener
            document.addEventListener("mousemove", moveCallbackCaller, false);
            firstMoveCallback = true;
        } else {

            // pointer lock is no longer active, remove the callback
            document.removeEventListener("mousemove", moveCallbackCaller, false);

            // and reset the entry coordinates
            entryCoordinates = {x:-1, y:-1};
        }
    };
}