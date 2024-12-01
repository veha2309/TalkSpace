"use client"

// components/TypewriterText.tsx
import React from 'react';
import { Typewriter } from 'react-simple-typewriter';

interface TypewriterTextProps{
    text : string;
}

const TypewriterText: React.FC<TypewriterTextProps> = ({
    text
}) => {
  return (
    <div style={{ fontSize: '24px', fontWeight: 'bold' , fontFamily : "monospace"}}>
      <Typewriter
        words={[text]}
        loop={0} // Number of loops (0 for infinite)
        cursor
        cursorStyle="_"
        typeSpeed={70}
        deleteSpeed={50}
        delaySpeed={1000}
      />
    </div>
  );
};

export default TypewriterText;
