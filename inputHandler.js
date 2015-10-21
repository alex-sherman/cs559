//Adapted from a tutorial I found somewhere, I can't find the original source
//but I won't claim it as my own

var keyboardState = {};
var mouseState = {buttons: {left: false, midde: false, right: false}, position: vec2.create(), delta: vec2.create(), wheelDelta: 0};
function updateInputState() {
    mouseState.delta[0] = 0;
    mouseState.delta[1] = 0;
    mouseState.wheelDelta = 0;
}
function initMouseHandling() {
    var mouseCaptured = false;
    var allowedKeys = [116];
    $(document).keydown(function(event) {
        keyboardState[event.which] = true;
        if(allowedKeys.indexOf(event.which) == -1)
            event.preventDefault();
    });
    $(document).keyup(function(event) {
        keyboardState[event.which] = false;
        if(allowedKeys.indexOf(event.which) == -1)
            event.preventDefault();
    });

    function moveCallbackCaller(event) {
        mouseState.buttons.left = event.buttons & 1;
        mouseState.buttons.middle = event.buttons & 3;
        mouseState.buttons.right = event.buttons & 2;
        mouseState.delta[0] += event.movementX ||
                event.mozMovementX ||
                0;
 
        mouseState.delta[1] += event.movementY ||
                event.mozMovementY ||
                0;
        mouseState.position[0] = event.pageX;
        mouseState.position[1] = event.pageY;
        mouseState.wheelDelta += event.wheelDelta || 0;
    }
    document.addEventListener("mousemove", moveCallbackCaller, false);
    document.addEventListener("click", moveCallbackCaller, false);
    document.addEventListener("mousewheel", moveCallbackCaller, false);
}