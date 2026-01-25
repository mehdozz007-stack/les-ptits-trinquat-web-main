import { motion } from "framer-motion";
import { ReactNode } from "react";

interface AnimatedFormProps {
  children: ReactNode;
  isOpen: boolean;
}

export function AnimatedFormContainer({ children, isOpen }: AnimatedFormProps) {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0, y: -20 }}
      animate={
        isOpen
          ? { opacity: 1, height: "auto", y: 0 }
          : { opacity: 0, height: 0, y: -20 }
      }
      exit={{ opacity: 0, height: 0, y: -20 }}
      transition={{ type: "spring", stiffness: 300, damping: 25, duration: 0.4 }}
      className="overflow-hidden"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={isOpen ? { opacity: 1 } : { opacity: 0 }}
        transition={{ delay: 0.15 }}
        className="pt-4"
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

// Staggered container for form fields
export function FormFieldsContainer({ children }: { children: ReactNode }) {
  return (
    <motion.div
      className="space-y-4"
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.08,
            delayChildren: 0.1,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

// Animated form field
export function AnimatedFormField({ children }: { children: ReactNode }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 10 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { type: "spring", stiffness: 300, damping: 20 },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

// Bouncy button animation
export function AnimatedSubmitButton({ children, isLoading = false }: { children: ReactNode; isLoading?: boolean }) {
  return (
    <motion.button
      whileHover={!isLoading ? { scale: 1.05 } : {}}
      whileTap={!isLoading ? { scale: 0.98 } : {}}
      animate={isLoading ? { scale: [1, 1.05, 1] } : {}}
      transition={isLoading ? { duration: 1.5, repeat: Infinity } : {}}
      className="w-full"
      disabled={isLoading}
    >
      {children}
    </motion.button>
  );
}
