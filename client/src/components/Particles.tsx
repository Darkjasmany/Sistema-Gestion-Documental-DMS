import { useEffect, useState } from "react";

type Particle = {
  top: number;
  left: number;
  size: number;
  duration: number;
};

const Particles = () => {
  // Generar posiciones aleatorias para partículas
  const [particles, setParticles] = useState<Particle[]>([]);
  useEffect(() => {
    const generated: Particle[] = Array.from({ length: 18 }).map(() => ({
      top: Math.random() * 100,
      left: Math.random() * 100,
      size: Math.random() * 4 + 2,
      duration: Math.random() * 8 + 8,
    }));
    setParticles(generated);
  }, []);
  return (
    <div className="absolute inset-0 overflow-hidden">
      {particles.map((p, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-sky-400/20 blur-sm animate-float"
          style={{
            top: `${p.top}%`,
            left: `${p.left}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            animationDuration: `${p.duration}s`,
          }}
        ></span>
      ))}
    </div>
  );
};

export default Particles;
