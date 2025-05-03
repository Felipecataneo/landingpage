// lib/shaders.ts

// Vertex shader remains the same
export const vertexShader = `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

// Helper functions for noise and turbulence
const glslNoiseHelpers = `
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
      u.y
    );
  }

  // FBM (Fractal Brownian Motion) for more organic turbulence
  float fbm(vec2 p) {
    float sum = 0.0;
    float amp = 1.0;
    float freq = 1.0;
    // 5 octaves
    for(int i = 0; i < 5; i++) {
      sum += amp * noise(p * freq);
      amp *= 0.5;
      freq *= 2.0;
    }
    return sum;
  }
`;

// Updated fragment shader with pulsating effect
export const fragmentShader = `
  uniform sampler2D u_texture;
  uniform vec2 u_mouse;
  uniform float u_time;
  uniform vec2 u_resolution;
  uniform float u_radius;
  uniform float u_speed;
  uniform float u_imageAspect;
  uniform float u_turbulenceIntensity;

  varying vec2 vUv;

  ${glslNoiseHelpers}

  void main() {
    // Use vUv for texture lookup
    vec4 tex = texture2D(u_texture, vUv);

    // Calculate grayscale and inverted grayscale
    float gray = dot(tex.rgb, vec3(0.299, 0.587, 0.114));
    vec3 invertedGray = vec3(1.0 - gray);

    // Calculate screen aspect ratio
    float screenAspect = u_resolution.x / u_resolution.y;

    // Correct UV and mouse coordinates for aspect ratio
    vec2 correctedUV = vUv;
    correctedUV = correctedUV * 2.0 - 1.0; // Scale UV from [0, 1] range to [-1, 1]
    correctedUV.x *= screenAspect;

    vec2 correctedMouse = u_mouse;
    correctedMouse = correctedMouse * 2.0 - 1.0;
    correctedMouse.x *= screenAspect;

    // Calculate distance from corrected mouse position
    float dist = distance(correctedUV, correctedMouse);
    
    // Pulsating radius effect
    // Base radius is increased and we add a sin wave for pulsation
    float pulsatingRadius = u_radius * 1.8 + sin(u_time * 1.5) * 0.15;
    
    // More complex turbulence using FBM
    float noiseVal = fbm(vUv * 15.0 + u_time * u_speed * 0.5);
    
    // Add more turbulence at the edges of the cloud
    float edgeTurbulence = fbm(vUv * 30.0 + u_time * (u_speed + 0.2));
    float turbulenceFactor = u_turbulenceIntensity * 2.0;
    
    // Jagged distance incorporating layered noise
    float jaggedDist = dist + (noiseVal - 0.5) * turbulenceFactor + 
                      (edgeTurbulence - 0.5) * turbulenceFactor * (1.0 - smoothstep(0.0, 0.2, dist));
    
    // Smoother transition using smoothstep instead of hard step
    float mask = smoothstep(pulsatingRadius - 0.05, pulsatingRadius + 0.1, jaggedDist);
    
    // Blend between inverted grayscale and original color
    vec3 finalColor = mix(invertedGray, tex.rgb, mask);

    // Set the final pixel color
    gl_FragColor = vec4(finalColor, 1.0);
  }
`;