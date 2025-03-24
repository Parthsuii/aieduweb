import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import Tilt from 'react-parallax-tilt';

const SubjectPlanet = ({ subject, onSelect }) => {
  const cardRef = useRef(null);

  useEffect(() => {
    if (cardRef.current) {
      // Glowing effect
      gsap.to(cardRef.current, {
        boxShadow: `0 0 15px ${subject.color}`,
        repeat: -1,
        yoyo: true,
        duration: 1.5,
      });

      // Floating animation
      gsap.to(cardRef.current, {
        y: -15,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: Math.random() * 2, // Random delay for staggered effect
      });
    }
  }, [subject.color]);

  return (
    <Tilt
      tiltMaxAngleX={15}
      tiltMaxAngleY={15}
      perspective={1000}
      scale={1.05}
      transitionSpeed={300}
      glareEnable={true}
      glareMaxOpacity={0.3}
      glareColor={subject.color}
      glarePosition="all"
    >
      <div
        ref={cardRef}
        className="subject-card"
        style={{
          background: `linear-gradient(135deg, ${subject.color}22, #0d0b1e)`,
          border: `2px solid ${subject.color}`,
        }}
        onClick={onSelect}
      >
        <h3>{subject.name}</h3>
      </div>
    </Tilt>
  );
};

export default SubjectPlanet;