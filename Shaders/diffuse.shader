if(typeof Shaders === 'undefined')
    var Shaders = {}
Shaders.diffuse = {
    vertex: "\
precision highp float;\
attribute vec3 POSITION;\
attribute vec3 NORMAL;\
attribute vec2 TEXCOORD0;\
uniform mat3 normalMatrix;\
uniform mat4 viewMatrix;\
uniform mat4 projectionMatrix;\
uniform mat4 worldMatrix;\
uniform float time;\
varying vec3 fNormal;\
varying vec2 fTexCoord;\
\
void main()\
{\
  fNormal = normalMatrix * NORMAL;\
  gl_Position =  projectionMatrix * vec4(POSITION, 1);\
  fTexCoord = TEXCOORD0;\
}\
",
    fragment: "\
precision highp float;\
\
void main()\
{\
  gl_FragColor = vec4(0,1,0,1);\
}\
"
}