precision highp float;
varying vec3 fNormal;
varying vec2 fTexCoord;
varying vec3 fPosition;
uniform vec3 lightDir;
uniform sampler2D diffuseTexture;
uniform bool diffuseTextureEnabled;


void main()
{
  float base = 0.4;
  gl_FragColor = vec4(1,0,1,1);
  if(diffuseTextureEnabled) {
    gl_FragColor = texture2D(diffuseTexture, vec2(fTexCoord.x, fTexCoord.y));
  }
  vec3 normal = normalize(fNormal);
  gl_FragColor.xyz *= base + clamp(dot(normal, -lightDir), 0.0, 1.0 - base);
}