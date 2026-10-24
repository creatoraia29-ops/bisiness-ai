"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import styles from "./ParallaxRings.module.css";

export default function ParallaxRings() {
  const ref = useRef(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 180]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, 280]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 24]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);

  const content = (
    <>
      <div className={`${styles.ring} ${styles.ringA}`} />
      <div className={`${styles.ring} ${styles.ringB}`} />
      <div className={`${styles.ring} ${styles.ringC}`} />
      <svg className={styles.veins} viewBox="0 0 600 600" aria-hidden="true">
        <path
          d="M300 80c40 70 70 120 70 200s-20 140-70 220"
          className={styles.vein}
        />
        <path
          d="M300 100c-55 65-95 130-95 210s35 145 95 210"
          className={styles.vein}
        />
        <path
          d="M180 220c50 20 90 40 120 90s40 110 20 170"
          className={styles.veinSoft}
        />
        <circle cx="300" cy="300" r="4" className={styles.node} />
        <circle cx="370" cy="220" r="3" className={styles.node} />
        <circle cx="230" cy="250" r="3" className={styles.node} />
        <circle cx="340" cy="390" r="3" className={styles.node} />
      </svg>
    </>
  );

  if (reduceMotion) {
    return (
      <div className={styles.wrap} aria-hidden="true">
        {content}
      </div>
    );
  }

  return (
    <div ref={ref} className={styles.wrap} aria-hidden="true">
      <motion.div className={styles.layer} style={{ y: y1, rotate, scale }}>
        <div className={`${styles.ring} ${styles.ringA}`} />
      </motion.div>
      <motion.div className={styles.layer} style={{ y: y2 }}>
        <div className={`${styles.ring} ${styles.ringB}`} />
        <svg className={styles.veins} viewBox="0 0 600 600">
          <path
            d="M300 80c40 70 70 120 70 200s-20 140-70 220"
            className={styles.vein}
          />
          <path
            d="M300 100c-55 65-95 130-95 210s35 145 95 210"
            className={styles.vein}
          />
          <path
            d="M180 220c50 20 90 40 120 90s40 110 20 170"
            className={styles.veinSoft}
          />
        </svg>
      </motion.div>
      <motion.div className={styles.layer} style={{ y: y3 }}>
        <div className={`${styles.ring} ${styles.ringC}`} />
        <span className={styles.spore} />
        <span className={`${styles.spore} ${styles.sporeB}`} />
        <span className={`${styles.spore} ${styles.sporeC}`} />
      </motion.div>
    </div>
  );
}
