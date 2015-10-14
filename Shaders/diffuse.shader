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
uniform mat3 boneTransformsN[64];\
uniform mat3 normalMatrix;\
uniform mat4 viewMatrix;\
uniform mat4 projectionMatrix;\
uniform mat4 worldMatrix;\
varying vec3 fNormal;\
varying vec3 color;\
\
void main()\
{\
  mat4 boneTransform;\
  mat3 normalTransform;\
  boneTransform += (boneTransforms[int(BLENDWEIGHT0.x)] * BLENDWEIGHT0.y);\
  boneTransform += (boneTransforms[int(BLENDWEIGHT1.x)] * BLENDWEIGHT1.y);\
  boneTransform += (boneTransforms[int(BLENDWEIGHT2.x)] * BLENDWEIGHT2.y);\
  boneTransform += (boneTransforms[int(BLENDWEIGHT3.x)] * BLENDWEIGHT3.y);\
  boneTransform += (boneTransforms[int(BLENDWEIGHT4.x)] * BLENDWEIGHT4.y);\
  boneTransform += (boneTransforms[int(BLENDWEIGHT5.x)] * BLENDWEIGHT5.y);\
  boneTransform += (boneTransforms[int(BLENDWEIGHT6.x)] * BLENDWEIGHT6.y);\
  boneTransform += (boneTransforms[int(BLENDWEIGHT7.x)] * BLENDWEIGHT7.y);\
  boneTransform += (boneTransforms[int(BLENDWEIGHT8.x)] * BLENDWEIGHT8.y);\
  boneTransform += (boneTransforms[int(BLENDWEIGHT9.x)] * BLENDWEIGHT9.y);\
  boneTransform += (boneTransforms[int(BLENDWEIGHT10.x)] * BLENDWEIGHT10.y);\
  boneTransform += (boneTransforms[int(BLENDWEIGHT11.x)] * BLENDWEIGHT11.y);\
  boneTransform += (boneTransforms[int(BLENDWEIGHT12.x)] * BLENDWEIGHT12.y);\
\
  normalTransform += (boneTransformsN[int(BLENDWEIGHT0.x)] * BLENDWEIGHT0.y);\
  normalTransform += (boneTransformsN[int(BLENDWEIGHT1.x)] * BLENDWEIGHT1.y);\
  normalTransform += (boneTransformsN[int(BLENDWEIGHT2.x)] * BLENDWEIGHT2.y);\
  normalTransform += (boneTransformsN[int(BLENDWEIGHT3.x)] * BLENDWEIGHT3.y);\
  normalTransform += (boneTransformsN[int(BLENDWEIGHT4.x)] * BLENDWEIGHT4.y);\
  normalTransform += (boneTransformsN[int(BLENDWEIGHT5.x)] * BLENDWEIGHT5.y);\
  normalTransform += (boneTransformsN[int(BLENDWEIGHT6.x)] * BLENDWEIGHT6.y);\
  normalTransform += (boneTransformsN[int(BLENDWEIGHT7.x)] * BLENDWEIGHT7.y);\
  normalTransform += (boneTransformsN[int(BLENDWEIGHT8.x)] * BLENDWEIGHT8.y);\
  normalTransform += (boneTransformsN[int(BLENDWEIGHT9.x)] * BLENDWEIGHT9.y);\
  normalTransform += (boneTransformsN[int(BLENDWEIGHT10.x)] * BLENDWEIGHT10.y);\
  normalTransform += (boneTransformsN[int(BLENDWEIGHT11.x)] * BLENDWEIGHT11.y);\
  normalTransform += (boneTransformsN[int(BLENDWEIGHT12.x)] * BLENDWEIGHT12.y);\
  gl_Position =  projectionMatrix * boneTransform * vec4(POSITION, 1);\
  fNormal = normalMatrix * normalTransform * NORMAL;\
  color = vec3(0,1,0);\
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
  gl_FragColor = vec4(color * dot(lightDir, fNormal), 1.0);\
}\
"
}