if(typeof Shaders === 'undefined')
    var Shaders = {}
Shaders.grass = {
    vertex: "\
precision highp float;\
attribute vec3 POSITION;\
attribute vec3 NORMAL;\
attribute vec2 TEXCOORD0;\
uniform mat3 normalMatrix;\
uniform mat4 projectionMatrix;\
uniform mat4 worldMatrix;\
uniform vec3 offset;\
uniform float time;\
varying vec3 worldPos;\
varying vec3 fNormal;\
varying vec2 fTexCoord;\
\
void main()\
{\
  fNormal = normalMatrix * NORMAL;\
  worldPos = (worldMatrix * vec4(offset + POSITION + vec3(0,0,POSITION.y * sin(time)/10.0), 1)).xyz;\
  gl_Position =  projectionMatrix * vec4(worldPos, 1.0);\
  fTexCoord = TEXCOORD0;\
}\
",
    fragment: "\
precision highp float;\
varying vec3 fNormal;\
varying vec2 fTexCoord;\
uniform vec3 lightDir;\
uniform sampler2D diffuse;\
uniform vec3 cameraPosition;\
varying vec3 worldPos;\
\
void main()\
{\
  float base = 0.4;\
  vec4 color = texture2D(diffuse, vec2(fTexCoord.x, fTexCoord.y));\
  vec2 viewDir = normalize(cameraPosition.xz - worldPos.xz);\
  vec2 normal = normalize(fNormal.xz);\
  color.a *= clamp(abs(dot(normal, viewDir)) * 8.0 - 0.0, 1.0, 1.0);\
  if(color.a < 0.5)\
    discard;\
  gl_FragColor = color;\
}\
"
}