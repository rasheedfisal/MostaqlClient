"use client";
import React, { MouseEventHandler } from "react";
import { motion, AnimatePresence } from "framer-motion";
type BackdropProps = {
  isOpen: boolean;
  handleClick: MouseEventHandler;
};
function Backdrop({ isOpen, handleClick }: BackdropProps) {
  // <!-- Backdrop -->
  //   @click="isSettingsPanelOpen = false"
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.5 }}
      transition={{ ease: "easeInOut", duration: 0.5 }}
      exit={{ opacity: 0 }}
      className={`fixed inset-0 z-10 bg-primary-darker ${!isOpen && "hidden"}`}
      style={{ opacity: "0.5" }}
      aria-hidden="true"
      onClick={handleClick}
    />
  );
}

export default Backdrop;
