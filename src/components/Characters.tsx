import React, { useEffect, useRef } from "react";
import gsap from "gsap";

interface CharactersProps {
  mousePosition: { x: number; y: number };
  isTyping: boolean;
  showPassword: boolean;
}

const Characters: React.FC<CharactersProps> = ({
  mousePosition,
  showPassword,
}) => {
  const purpleRef = useRef<SVGGElement>(null);
  const blackRef = useRef<SVGGElement>(null);
  const yellowRef = useRef<SVGGElement>(null);
  const orangeRef = useRef<SVGGElement>(null);
  const orangePathRef = useRef<SVGPathElement>(null);

  // Password show/hide animation effect
  useEffect(() => {
    const allElements = [purpleRef, blackRef, yellowRef, orangeRef];

    allElements.forEach((ref) => {
      if (ref.current) {
        const element = ref.current;
        const eyesGroup = element.querySelector(".eyes");

        const animConfig = {
          duration: 0.35,
          ease: "power2.inOut",
        };

        if (showPassword) {
          gsap.to(element, {
            x: -15,
            skewX: 8,
            transformOrigin: "bottom",
            ...animConfig,
          });

          if (eyesGroup) {
            gsap.to(eyesGroup, {
              x: -8,
              ...animConfig,
            });

            if (ref === yellowRef) {
              const noseLine = element.querySelector(".nose-line");
              if (noseLine) {
                gsap.to(noseLine, {
                  attr: {
                    x1: 252,
                    x2: 232,
                  },
                  ...animConfig,
                });
              }
            }
          }
        } else {
          gsap.to(element, {
            x: 0,
            skewX: 0,
            ...animConfig,
          });

          if (eyesGroup) {
            gsap.to(eyesGroup, {
              x: 0,
              ...animConfig,
            });

            if (ref === yellowRef) {
              const noseLine = element.querySelector(".nose-line");
              if (noseLine) {
                gsap.to(noseLine, {
                  attr: {
                    x1: 245,
                    x2: 225,
                  },
                  ...animConfig,
                });
              }
            }
          }
        }
      }
    });
  }, [showPassword]);

  // Mouse movement tracking and character animation
  useEffect(() => {
    const upperElements = [purpleRef, blackRef, yellowRef];

    upperElements.forEach((ref) => {
      if (ref.current) {
        const element = ref.current;
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const dx = mousePosition.x - centerX;
        const dy = mousePosition.y - centerY;
        const distance = Math.sqrt(dx * dx + dy * dy) || 1;

        const maxLean = 12;
        const scale = Math.min(distance / 300, 1);
        const leanX = (dx / distance) * maxLean * scale;

        gsap.to(element, {
          skewX: -leanX,
          transformOrigin: "bottom",
          duration: 0.5,
          ease: "power2.out",
        });

        // Handle yellow character's special animations
        if (ref === yellowRef) {
          const eyesGroup = element.querySelector(".eyes");
          const noseLine = element.querySelector(".nose-line");
          if (eyesGroup && noseLine) {
            const moveX = leanX * 0.5;
            
            // Move eyes
            gsap.to(eyesGroup, {
              x: moveX,
              duration: 0.5,
              ease: "power2.out",
            });

            // Move nose in opposite direction
            const baseX1 = 245;
            const baseX2 = 225;
            // When eyes move right (positive moveX), nose should move left and vice versa
            const noseMove = moveX * 1.5; // Proportional movement, no need for negative
            
            gsap.to(noseLine, {
              attr: {
                x1: baseX1 - noseMove, // Subtract to move opposite to eyes
                x2: baseX2 - noseMove,
              },
              duration: 0.5,
              ease: "power2.out",
            });
          }
        } else {
          const eyesGroup = element.querySelector(".eyes");
          if (eyesGroup) {
            gsap.to(eyesGroup, {
              x: leanX * 0.5,
              duration: 0.5,
              ease: "power2.out",
            });
          }
        }
      }
    });

    // Animate orange semi-circle character
    if (orangePathRef.current) {
      const pathElement = orangePathRef.current;
      const rect = pathElement.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const dx = mousePosition.x - centerX;
      const dy = mousePosition.y - centerY;
      const distance = Math.sqrt(dx * dx + dy * dy) || 1;
      const maxExpansion = 40;
      const scale = Math.min(distance / 200, 1);

      const startX = 20;
      const startY = 150;
      const endX = 180;
      const endY = 150;
      const baseControlY = startY - 130;

      const controlX =
        (startX + endX) / 2 + (dx / distance) * maxExpansion * scale;
      const controlY = baseControlY + (dy / distance) * maxExpansion * scale;

      const newPath = `M ${startX},${startY} Q ${controlX},${controlY} ${endX},${endY}`;

      // Animate orange character parts
      const eyesGroup = orangeRef.current?.querySelector(".eyes");
      const mouth = orangeRef.current?.querySelector(".mouth");

      if (eyesGroup && mouth) {
        const eyeMoveX = (dx / distance) * 8 * scale;
        const eyeMoveY = (dy / distance) * 3 * scale;

        const animConfig = {
          duration: 0.5,
          ease: "power2.out",
        };

        gsap.to(pathElement, {
          attr: { d: newPath },
          ...animConfig,
        });

        gsap.to(eyesGroup, {
          x: eyeMoveX,
          y: -eyeMoveY,
          skewX: -eyeMoveX * 0.5,
          ...animConfig,
        });

        gsap.to(mouth, {
          x: eyeMoveX,
          y: -eyeMoveY,
          ...animConfig,
        });

        const baseMouthX = 90;
        const baseMouthY = 115;
        const mouthCurve = Math.abs(eyeMoveX) * 0.3;
        const newMouthPath = `M ${
          baseMouthX - 10
        },${baseMouthY} Q ${baseMouthX},${baseMouthY + mouthCurve} ${
          baseMouthX + 10
        },${baseMouthY}`;

        gsap.to(mouth, {
          attr: { d: newMouthPath },
          ...animConfig,
        });
      }
    }
  }, [mousePosition]);

  return (
    <svg width="400" height="400" viewBox="0 0 280 200">
      {/* Purple Character */}
      <g ref={purpleRef}>
        <rect x="110" y="0" width="60" height="150" fill="#7C3AED" rx="1" />
        <g className="eyes">
          <g className="eye" transform="translate(125, 20)">
            <circle r="6" fill="white" />
            <circle className="pupil" r="3" fill="black" />
          </g>
          <g className="eye" transform="translate(155, 20)">
            <circle r="6" fill="white" />
            <circle className="pupil" r="3" fill="black" />
          </g>
        </g>
        {/* Nose as a straight vertical line */}
        <line
          x1="140"
          y1="20"
          x2="140"
          y2="35"
          stroke="black"
          strokeWidth="3"
        />
      </g>

      {/* Black Character */}
      <g ref={blackRef}>
        <rect x="155" y="50" width="45" height="100" fill="#111827" rx="1" />
        <g className="eyes">
          <g className="eye" transform="translate(165, 70)">
            <circle r="6" fill="white" />
            <circle className="pupil" r="3" fill="black" />
          </g>
          <g className="eye" transform="translate(190, 70)">
            <circle r="6" fill="white" />
            <circle className="pupil" r="3" fill="black" />
          </g>
        </g>
      </g>

      {/* Yellow Character */}
      <g ref={yellowRef}>
        <defs>
          <clipPath id="yellow-clip">
            <rect x="190" y="92.5" width="45" height="57.5" />
            <circle cx="212.5" cy="92.5" r="22.5" />
          </clipPath>
        </defs>

        <g clipPath="url(#yellow-clip)">
          <rect x="190" y="70" width="45" height="80" fill="#FCD34D" />
        </g>

        <g className="eyes">
          <g className="eye" transform="translate(212.5,80)">
            <circle className="pupil" r="3" fill="black" />
          </g>
          <line
            className="nose-line"
            x1="245"
            y1="90"
            x2="225"
            y2="90"
            stroke="black"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </g>
      </g>

      {/* Orange Character (Semi-circle) */}
      <g ref={orangeRef}>
        <path
          ref={orangePathRef}
          d="M 20,200 Q 70,70 180,200"
          fill="#F97316"
          strokeLinecap="round"
        />
        <g className="eyes" transform="translate(0, 0)">
          {/* Left eye */}
          <g className="eye" transform="translate(70, 105)">
            <circle className="pupil" r="3" fill="black" />
          </g>
          {/* Right eye */}
          <g className="eye" transform="translate(110, 105)">
            <circle className="pupil" r="3" fill="black" />
          </g>
        </g>
        <path
          className="mouth"
          d="M 80,115 Q 90,120 100,115"
          fill="none"
          stroke="black"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
};

export default Characters;
