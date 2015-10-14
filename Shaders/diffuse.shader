if(typeof Shaders === 'undefined')
    var Shaders = {}
Shaders.diffuse = {
    vertex: "\
precision highp float;\
attribute vec3 POSITION;\
attribute vec3 NORMAL;\
attribute vec2 BLENDWEIGHT0;\
attribute vec2 BLENDWEIGHT1;\
attribute vec2 BLENDWEIGHT2;\
attribute vec2 BLENDWEIGHT3;\
attribute vec2 BLENDWEIGHT4;\
attribute vec2 BLENDWEIGHT5;\
attribute vec2 BLENDWEIGHT6;\
attribute vec2 BLENDWEIGHT7;\
attribute vec2 BLENDWEIGHT8;\
attribute vec2 BLENDWEIGHT9;\
attribute vec2 BLENDWEIGHT10;\
attribute vec2 BLENDWEIGHT11;\
attribute vec2 BLENDWEIGHT12;\
uniform mat4 boneTransforms[64];\
uniform mat3 normalMatrix;\
uniform mat4 viewMatrix;\
uniform mat4 projectionMatrix;\
uniform mat4 worldMatrix;\
varying vec3 fNormal;\
varying vec3 color;\
\
void main()\
{\
  fNormal = NORMAL;\
  vec4 transformedPos = vec4(0);\
  transformedPos += (boneTransforms[int(BLENDWEIGHT0.x)] * vec4(POSITION, 1)) * BLENDWEIGHT0.y;\
  transformedPos += (boneTransforms[int(BLENDWEIGHT1.x)] * vec4(POSITION, 1)) * BLENDWEIGHT1.y;\
  transformedPos += (boneTransforms[int(BLENDWEIGHT2.x)] * vec4(POSITION, 1)) * BLENDWEIGHT2.y;\
  transformedPos += (boneTransforms[int(BLENDWEIGHT3.x)] * vec4(POSITION, 1)) * BLENDWEIGHT3.y;\
  transformedPos += (boneTransforms[int(BLENDWEIGHT4.x)] * vec4(POSITION, 1)) * BLENDWEIGHT4.y;\
  transformedPos += (boneTransforms[int(BLENDWEIGHT5.x)] * vec4(POSITION, 1)) * BLENDWEIGHT5.y;\
  transformedPos += (boneTransforms[int(BLENDWEIGHT6.x)] * vec4(POSITION, 1)) * BLENDWEIGHT6.y;\
  transformedPos += (boneTransforms[int(BLENDWEIGHT7.x)] * vec4(POSITION, 1)) * BLENDWEIGHT7.y;\
  transformedPos += (boneTransforms[int(BLENDWEIGHT8.x)] * vec4(POSITION, 1)) * BLENDWEIGHT8.y;\
  transformedPos += (boneTransforms[int(BLENDWEIGHT9.x)] * vec4(POSITION, 1)) * BLENDWEIGHT9.y;\
  gl_Position =  projectionMatrix * transformedPos;\
  color = vec3((BLENDWEIGHT0.y + BLENDWEIGHT1.y + BLENDWEIGHT2.y + BLENDWEIGHT3.y) - 1.9,0,0);\
}\
",
    fragment: "\
precision highp float;\
uniform float time;\
uniform vec3 lightDir;\
varying vec3 fNormal;\
varying vec3 color;\
\
void main()\
{\
  gl_FragColor = vec4(color, 1.0);\
}\
"
}