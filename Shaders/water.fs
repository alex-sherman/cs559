precision highp float;
varying vec3 fNormal;
varying vec3 fTexCoord;
varying vec3 fPosition;
uniform vec3 lightDir;
uniform sampler2D reflectionTexture;
uniform sampler2D refractionTexture;

void main()
{
    float base = 0.4;
    gl_FragColor = vec4(1,0,1,1);
    vec3 fuck= fTexCoord / fTexCoord.z / 2.0 + 0.5;
    gl_FragColor.a = 1.0;
    gl_FragColor.xyz = vec3(0);
    gl_FragColor.xyz += texture2D(reflectionTexture, vec2(fuck.x, fuck.y)).xyz / 2.0;
}