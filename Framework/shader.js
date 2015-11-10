
function LoadShaderPart(url, type, program) {
    var glShader = gl.createShader(type);
    var source = null;
    return $.ajax({
      url: url,
      dataType: 'text'
    }).done(function(source) {
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
    });
}

function CreateShader(shaderObj, name, url) {
    var program = gl.createProgram();
    program.uniforms = {};
    var waitfor = [];
    waitfor.push(LoadShaderPart(url + ".vs", gl.VERTEX_SHADER, program));
    waitfor.push(LoadShaderPart(url + ".fs", gl.FRAGMENT_SHADER, program));
    waitfor = $.when.apply(null, waitfor);
    waitfor.done(function() {
        gl.linkProgram(program);
        var numUniforms = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
        for(var i = 0; i < numUniforms; i++) {
            var uniformInfo = gl.getActiveUniform(program, i);
            var uniName = uniformInfo.name;
            if(uniName.substr(-3) === "[0]") {
                uniName = uniName.substr(0, uniName.length - 3);
                for(var j = 0; j < uniformInfo.size; j++) {
                    var subName = uniName + "[" + j + "]"
                    program.uniforms[subName] = gl.getUniformLocation(program, subName) ;
                }
            }
            else
                program.uniforms[uniName] = gl.getUniformLocation(program, uniformInfo.name);
        }
        shaderObj[name] = program;
    })
    return waitfor;
}