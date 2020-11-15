precision lowp float;

// The time in seconds
uniform float iTime;

// The screen resolution in pixel
uniform vec2 iResolution;

void main() 
{
    // Screen coordinate the pixel
    vec2 fragCoord = gl_FragCoord.xy;
    
    // UV coordinate of the pixel
    vec2 uv = (fragCoord.xy - 0.5 * iResolution.xy) / iResolution.y;

    // Some math to get beautifull color x)
    vec3 col = 0.5 + 0.5 * cos(0.8 + uv.xyx + vec3(0, 2, 4));
    
    gl_FragColor = vec4(col, 1.0);
}