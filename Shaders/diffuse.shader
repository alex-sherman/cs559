if(typeof Shaders === 'undefined')
    var Shaders = {}
Shaders.diffuse = {
    vertex: "\
precision highp float;\
attribute vec3 POSITION;\
attribute vec3 NORMAL;\
uniform mat3 normalMatrix;\
uniform mat4 viewMatrix;\
uniform mat4 projectionMatrix;\
uniform mat4 worldMatrix;\
varying vec3 fNormal;\
varying vec3 fPosition;\
\
void main()\
{\
  fNormal = NORMAL;\
  vec4 pos = vec4(POSITION, 1.0);\
  fPosition = pos.xyz;\
  gl_Position = projectionMatrix * pos;\
}\
",
    fragment: "\
precision highp float;\
uniform float time;\
uniform vec2 resolution;\
varying vec3 fPosition;\
varying vec3 fNormal;\
\
void main()\
{\
  gl_FragColor = vec4(fNormal, 1.0);\
}\
"
}