precision highp float;
attribute vec3 POSITION;
attribute vec3 NORMAL;
attribute vec2 TEXCOORD0;
uniform mat3 normalMatrix;
uniform mat4 viewProjection;
uniform mat4 worldMatrix;
uniform vec3 offset;
uniform float time;
varying vec3 worldPos;
varying vec3 fNormal;
varying vec2 fTexCoord;

void main()
{
  fNormal = normalMatrix * NORMAL;
  worldPos = (worldMatrix * vec4(offset + POSITION + vec3(0,0,POSITION.y * sin(time)/2.0), 1)).xyz;
  gl_Position =  viewProjection * vec4(worldPos, 1.0);
  fTexCoord = TEXCOORD0;
}