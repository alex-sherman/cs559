precision highp float;
attribute vec3 POSITION;
attribute vec3 NORMAL;
attribute vec2 TEXCOORD0;
attribute vec4 BLENDWEIGHT0;
uniform mat3 normalMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;
uniform mat4 worldMatrix;
uniform float time;
varying vec3 fNormal;
varying vec3 fPosition;
varying vec2 fTexCoord;
varying vec4 fBlendWeight;

void main()
{
  fNormal = normalMatrix * NORMAL;
  fPosition = (worldMatrix * vec4(POSITION, 1)).xyz;
  gl_Position =  projectionMatrix * vec4(fPosition, 1);
  fBlendWeight = BLENDWEIGHT0;
  fTexCoord = TEXCOORD0;
}