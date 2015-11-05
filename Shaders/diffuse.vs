precision highp float;
attribute vec3 POSITION;
attribute vec3 NORMAL;
attribute vec2 TEXCOORD0;
uniform mat3 normalMatrix;
uniform mat4 viewMatrix;
uniform mat4 viewProjection;
uniform mat4 worldMatrix;
uniform float time;
varying vec3 fNormal;
varying vec3 fPosition;
varying vec2 fTexCoord;

void main()
{
  fNormal = normalMatrix * NORMAL;
  fPosition = (worldMatrix * vec4(POSITION, 1)).xyz;
  gl_Position =  viewProjection * vec4(fPosition, 1);
  fTexCoord = TEXCOORD0;
}