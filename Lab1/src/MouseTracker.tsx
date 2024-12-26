import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState, useEffect } from 'react';

const MouseTracker: React.FC = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    function handleMove(e: MouseEvent) {
      setPosition({
        x: e.clientX + window.scrollX, 
        y: e.clientY + window.scrollY,
      });
    }

    window.addEventListener('pointermove', handleMove);
    return () => {
      window.removeEventListener('pointermove', handleMove);
    };
  }, []);

  return (
    <div
      style={{
        position: 'absolute',
        backgroundColor: 'pink',
        borderRadius: '50%',
        opacity: 0.6,
        pointerEvents: 'none',
        width: 40,
        height: 40,
        left: position.x - 20, 
        top: position.y - 20,  
      }}
    />
  );
};

export default MouseTracker;
