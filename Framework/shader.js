
function LoadShaderPart(url, type, program) {
    glShader = gl.createShader(type);
    var source = null;
    $.ajax({
      url: url,
      async: false,
      dataType: 'text',
      success: function (response) {
        source = response;
      }
    });
    if(source == null)
        throw new Error("Failed to load shader " + url);
    gl.shaderSource(glShader, source);
    gl.compileShader(glShader);
    var compiled = gl.getShaderParameter(glShader, gl.COMPILE_STATUS);
    if(!compiled){
        gl.getError();
        throw new Error("Shader " + name + " compile error: " + gl.getShaderInfoLog(glShader));
    }
    gl.attachShader(program, glShader);
}

function CreateShader(url) {
    var program = gl.createProgram();
    LoadShaderPart(url + ".vs", gl.VERTEX_SHADER, program);
    LoadShaderPart(url + ".fs", gl.FRAGMENT_SHADER, program);
    gl.linkProgram(program);
    return program
}