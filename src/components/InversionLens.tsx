'use client';

import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { vertexShader, fragmentShader } from '@/lib/shaders';

interface InversionLensProps {
  src: string;
  className?: string;
  initialRadius?: number;
  turbulenceIntensity?: number;
  animationSpeed?: number;
}

const InversionLens: React.FC<InversionLensProps> = ({
  src,
  className = '',
  initialRadius = 0.35,
  turbulenceIntensity = 0.08,
  animationSpeed = 0.7,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.OrthographicCamera | null>(null);
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);
  const mousePosition = useRef<{ x: number; y: number }>({ x: -10, y: -10 }); // Start off-screen
  const [textureLoaded, setTextureLoaded] = useState(false);
  const [isInteracting, setIsInteracting] = useState(false);
  const imageAspect = useRef<number>(1);
  const [deviceSize, setDeviceSize] = useState({ width: 0, height: 0 });
  const [responsiveRadius, setResponsiveRadius] = useState(initialRadius);

  // Calculate responsive radius based on screen size
  const calculateResponsiveRadius = () => {
    if (!containerRef.current) return initialRadius;
    
    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;
    
    // Base value for standard desktop screens (around 1920x1080)
    const baseScreenWidth = 1920;
    
    // Calculate scale factor based on screen width
    // We use a non-linear scaling to prevent the radius from becoming too small on mobile
    // or too large on very big screens
    const scaleFactor = Math.pow(width / baseScreenWidth, 0.7);
    
    // Apply scale factor to initial radius
    let newRadius = initialRadius * scaleFactor;
    
    // Set minimum and maximum values to prevent extremes
    newRadius = Math.max(newRadius, 0.15); // Minimum radius
    newRadius = Math.min(newRadius, 0.5);  // Maximum radius
    
    return newRadius;
  };

  // Initialize Three.js scene
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Set initial device size
    setDeviceSize({
      width: containerRef.current.clientWidth,
      height: containerRef.current.clientHeight
    });
    
    // Calculate responsive radius
    const newRadius = calculateResponsiveRadius();
    setResponsiveRadius(newRadius);
    
    // Create renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Create scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Create camera (orthographic for 2D effect)
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    cameraRef.current = camera;

    // Load texture
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(
      src,
      (texture) => {
        imageAspect.current = texture.image.width / texture.image.height;
        
        // Create material with shaders
        const material = new THREE.ShaderMaterial({
          vertexShader,
          fragmentShader,
          uniforms: {
            u_texture: { value: texture },
            u_mouse: { value: new THREE.Vector2(0.5, 0.5) },
            u_time: { value: 0 },
            u_resolution: { value: new THREE.Vector2(
              containerRef.current?.clientWidth || 1, 
              containerRef.current?.clientHeight || 1
            )},
            u_radius: { value: newRadius }, // Use responsive radius
            u_speed: { value: animationSpeed },
            u_imageAspect: { value: imageAspect.current },
            u_turbulenceIntensity: { value: turbulenceIntensity }
          },
          transparent: true
        });
        materialRef.current = material;

        // Create plane geometry that fills the view
        const geometry = new THREE.PlaneGeometry(2, 2);
        
        // Create mesh and add to scene
        const mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);
        
        setTextureLoaded(true);
      },
      undefined,
      (error) => console.error('Error loading texture:', error)
    );

    // Cleanup
    return () => {
      if (rendererRef.current && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
      }
      rendererRef.current?.dispose();
    };
  }, [src, initialRadius, turbulenceIntensity, animationSpeed]);

  // Handle mouse/touch interactions
  useEffect(() => {
    if (!containerRef.current) return;

    const handleMovement = (clientX: number, clientY: number) => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      // Calculate normalized coordinates (0 to 1)
      const x = (clientX - rect.left) / rect.width;
      const y = 1.0 - (clientY - rect.top) / rect.height; // Invert Y for WebGL coordinates
      
      mousePosition.current = { x, y };
    };

    const handleMouseMove = (e: MouseEvent) => {
      setIsInteracting(true);
      handleMovement(e.clientX, e.clientY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      setIsInteracting(true);
      if (e.touches.length > 0) {
        handleMovement(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    const handleMouseEnter = () => {
      setIsInteracting(true);
    };

    const handleMouseLeave = () => {
      setIsInteracting(false);
      // Move effect off-screen when not interacting
      mousePosition.current = { x: -10, y: -10 };
    };

    const handleTouchStart = (e: TouchEvent) => {
      setIsInteracting(true);
      if (e.touches.length > 0) {
        handleMovement(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    const handleTouchEnd = () => {
      setIsInteracting(false);
      // Move effect off-screen when not interacting
      mousePosition.current = { x: -10, y: -10 };
    };

    // Add event listeners
    containerRef.current.addEventListener('mousemove', handleMouseMove);
    containerRef.current.addEventListener('mouseenter', handleMouseEnter);
    containerRef.current.addEventListener('mouseleave', handleMouseLeave);
    containerRef.current.addEventListener('touchmove', handleTouchMove, { passive: false });
    containerRef.current.addEventListener('touchstart', handleTouchStart);
    containerRef.current.addEventListener('touchend', handleTouchEnd);

    return () => {
      // Remove event listeners
      containerRef.current?.removeEventListener('mousemove', handleMouseMove);
      containerRef.current?.removeEventListener('mouseenter', handleMouseEnter);
      containerRef.current?.removeEventListener('mouseleave', handleMouseLeave);
      containerRef.current?.removeEventListener('touchmove', handleTouchMove);
      containerRef.current?.removeEventListener('touchstart', handleTouchStart);
      containerRef.current?.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (!containerRef.current || !rendererRef.current || !cameraRef.current || !materialRef.current) return;
      
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      
      // Update device size state
      setDeviceSize({ width, height });
      
      // Calculate new responsive radius
      const newRadius = calculateResponsiveRadius();
      setResponsiveRadius(newRadius);
      
      // Update material uniform
      if (materialRef.current) {
        materialRef.current.uniforms.u_radius.value = newRadius;
      }
      
      rendererRef.current.setSize(width, height);
      materialRef.current.uniforms.u_resolution.value.set(width, height);
    };

    window.addEventListener('resize', handleResize);
    
    // Also handle orientation changes specifically for mobile devices
    window.addEventListener('orientationchange', () => {
      // Short timeout to ensure dimensions have updated after orientation change
      setTimeout(handleResize, 100);
    });
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  // Animation loop
  useEffect(() => {
    if (!textureLoaded) return;
    
    let animationId: number;
    const clock = new THREE.Clock();
    
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      
      if (materialRef.current && sceneRef.current && cameraRef.current && rendererRef.current) {
        // Update uniforms
        materialRef.current.uniforms.u_time.value = clock.getElapsedTime();
        materialRef.current.uniforms.u_mouse.value.set(
          mousePosition.current.x,
          mousePosition.current.y
        );
        
        // Render
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };
    
    animate();
    
    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [textureLoaded]);

  return (
    <div ref={containerRef} className={`inversion-lens-container ${className}`}>
      {/* Canvas will be added here by Three.js */}
    </div>
  );
};

export default InversionLens;