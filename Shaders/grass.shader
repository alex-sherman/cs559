if(typeof Shaders === 'undefined')
    var Shaders = {}
Shaders.grass = {
    vertex: "\
precision highp float;\
attribute vec3 POSITION;\
attribute vec3 NORMAL;\
attribute vec2 TEXCOORD0;\
uniform mat3 normalMatrix;\
uniform mat4 viewMatrix;\
uniform mat4 projectionMatrix;\
uniform mat4 worldMatrix;\
uniform vec3 offset;\
uniform float time;\
varying vec3 fNormal;\
varying vec2 fTexCoord;\
\
void main()\
{\
  fNormal = normalMatrix * NORMAL;\
  gl_Position =  projectionMatrix * worldMatrix * vec4(offset + POSITION + vec3(0,0,POSITION.y * sin(time)/10.0), 1);\
  fTexCoord = TEXCOORD0;\
}\
",
    fragment: "\
precision highp float;\
varying vec3 fNormal;\
varying vec2 fTexCoord;\
uniform vec3 lightDir;\
uniform sampler2D diffuse;\
\
void main()\
{\
  float base = 0.4;\
  vec4 color = texture2D(diffuse, vec2(fTexCoord.x, fTexCoord.y));\
  if(color.a < 0.5)\
    discard;\
  gl_FragColor = color;\
}\
"
}