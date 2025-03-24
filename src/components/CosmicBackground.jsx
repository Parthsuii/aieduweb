import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const CosmicBackground = () => {
  const mountRef = useRef(null);
  const rendererRef = useRef(null);

  useEffect(() => {
    try {
      console.log('CosmicBackground: Mounting...');

      // Scene setup
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      rendererRef.current = renderer;

      if (!mountRef.current) {
        console.error('CosmicBackground: Mount ref is not available');
        return;
      }

      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setClearColor(0x0d0b1e, 1);
      mountRef.current.appendChild(renderer.domElement);

      // Check if WebGL is supported
      if (!renderer.getContext()) {
        console.error('CosmicBackground: WebGL is not supported');
        return;
      }

      // Add ambient light
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
      scene.add(ambientLight);

      // Add point light for glow effect
      const pointLight = new THREE.PointLight(0xffffff, 1, 100);
      pointLight.position.set(5, 5, 5);
      scene.add(pointLight);

      // Central planet (like Etheron)
      const centralGeometry = new THREE.SphereGeometry(5, 32, 32);
      const centralMaterial = new THREE.MeshPhongMaterial({
        color: 0x00f0ff,
        emissive: 0x00f0ff,
        emissiveIntensity: 0.3,
        shininess: 100,
      });
      const centralPlanet = new THREE.Mesh(centralGeometry, centralMaterial);
      centralPlanet.position.set(0, -2, 0);
      scene.add(centralPlanet);

      // Smaller orbiting planets (like Orionis and Lumera)
      const smallPlanets = [];
      const smallPlanetData = [
        { radius: 0.8, color: 0xff00ff, distance: 8, speed: 0.01 },
        { radius: 0.5, color: 0xff9900, distance: 10, speed: 0.015 },
        { radius: 0.3, color: 0x00ff99, distance: 9, speed: 0.012 },
      ];

      smallPlanetData.forEach((data, index) => {
        const geometry = new THREE.SphereGeometry(data.radius, 32, 32);
        const material = new THREE.MeshPhongMaterial({
          color: data.color,
          emissive: data.color,
          emissiveIntensity: 0.5,
          shininess: 100,
        });
        const planet = new THREE.Mesh(geometry, material);
        planet.userData = { distance: data.distance, speed: data.speed, angle: (index * 2 * Math.PI) / smallPlanetData.length };
        scene.add(planet);
        smallPlanets.push(planet);
      });

      // Starry background
      const starCount = 3000;
      const starGeometry = new THREE.BufferGeometry();
      const starPositions = new Float32Array(starCount * 3);
      const starColors = new Float32Array(starCount * 3);
      for (let i = 0; i < starCount; i++) {
        starPositions[i * 3] = (Math.random() - 0.5) * 2000;
        starPositions[i * 3 + 1] = (Math.random() - 0.5) * 2000;
        starPositions[i * 3 + 2] = (Math.random() - 0.5) * 2000;

        const color = Math.random() > 0.5 ? 0xffffff : Math.random() > 0.5 ? 0x00f0ff : 0xff00ff;
        starColors[i * 3] = (color >> 16) & 255 / 255;
        starColors[i * 3 + 1] = (color >> 8) & 255 / 255;
        starColors[i * 3 + 2] = color & 255 / 255;
      }
      starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
      starGeometry.setAttribute('color', new THREE.BufferAttribute(starColors, 3));
      const starMaterial = new THREE.PointsMaterial({
        size: 5,
        vertexColors: true,
        transparent: true,
        opacity: 0.9,
      });
      const stars = new THREE.Points(starGeometry, starMaterial);
      scene.add(stars);

      camera.position.z = 15;

      let animationFrameId;
      const animate = () => {
        animationFrameId = requestAnimationFrame(animate);

        // Rotate central planet
        centralPlanet.rotation.y += 0.002;

        // Orbit small planets
        smallPlanets.forEach((planet) => {
          planet.userData.angle += planet.userData.speed;
          planet.position.x = Math.cos(planet.userData.angle) * planet.userData.distance;
          planet.position.z = Math.sin(planet.userData.angle) * planet.userData.distance;
          planet.rotation.y += 0.01;
        });

        // Rotate stars
        stars.rotation.y += 0.0005;

        renderer.render(scene, camera);
      };
      animate();

      const handleResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      };
      window.addEventListener('resize', handleResize);

      console.log('CosmicBackground: Planets and stars should be visible');

      return () => {
        console.log('CosmicBackground: Cleaning up...');
        window.removeEventListener('resize', handleResize);
        cancelAnimationFrame(animationFrameId);

        if (mountRef.current && rendererRef.current && rendererRef.current.domElement) {
          if (mountRef.current.contains(rendererRef.current.domElement)) {
            mountRef.current.removeChild(rendererRef.current.domElement);
          }
        }

        if (rendererRef.current) {
          rendererRef.current.dispose();
        }
      };
    } catch (error) {
      console.error('CosmicBackground: Error during setup:', error);
    }
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        background: '#0d0b1e',
      }}
    />
  );
};

export default CosmicBackground;