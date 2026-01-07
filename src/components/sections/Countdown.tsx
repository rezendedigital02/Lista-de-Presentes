"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getTimeRemaining } from "@/lib/utils";

interface CountdownProps {
  targetDate: Date;
}

export function Countdown({ targetDate }: CountdownProps) {
  const [timeRemaining, setTimeRemaining] = useState(getTimeRemaining(targetDate));
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => {
      setTimeRemaining(getTimeRemaining(targetDate));
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  if (!mounted) {
    return (
      <div className="flex justify-center gap-4 md:gap-8 py-6">
        {["Dias", "Horas", "Min", "Seg"].map((label) => (
          <div key={label} className="text-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 md:p-6 min-w-[70px] md:min-w-[90px]">
              <span className="text-3xl md:text-5xl font-bold">--</span>
            </div>
            <span className="text-sm md:text-base text-white/70 mt-2 block">
              {label}
            </span>
          </div>
        ))}
      </div>
    );
  }

  const timeUnits = [
    { value: timeRemaining.days, label: "Dias" },
    { value: timeRemaining.hours, label: "Horas" },
    { value: timeRemaining.minutes, label: "Min" },
    { value: timeRemaining.seconds, label: "Seg" },
  ];

  return (
    <div className="flex justify-center gap-4 md:gap-8 py-6">
      {timeUnits.map((unit, index) => (
        <motion.div
          key={unit.label}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
          className="text-center"
        >
          <motion.div
            key={unit.value}
            initial={{ rotateX: -90 }}
            animate={{ rotateX: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white/10 backdrop-blur-sm rounded-lg p-4 md:p-6 min-w-[70px] md:min-w-[90px] border border-white/20"
          >
            <span className="text-3xl md:text-5xl font-bold text-white">
              {String(unit.value).padStart(2, "0")}
            </span>
          </motion.div>
          <span className="text-sm md:text-base text-white/70 mt-2 block font-medium">
            {unit.label}
          </span>
        </motion.div>
      ))}
    </div>
  );
}
