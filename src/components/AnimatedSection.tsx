import { motion } from "framer-motion";
import { ReactNode } from "react";

interface AnimatedSectionProps {
  children: ReactNode;
  title: string;
  emoji?: string;
  count?: number;
  total?: number;
}

export function AnimatedSection({
  children,
  title,
  emoji = "✨",
  count,
  total,
}: AnimatedSectionProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 300,
        damping: 20,
      },
    },
  };

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className="mb-6"
      >
        <motion.h3
          className="text-2xl font-bold text-foreground flex items-center gap-3 mb-2"
          whileHover={{ x: 5 }}
        >
          <motion.span
            className="text-3xl"
            animate={{
              rotate: [0, 10, -10, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatType: "loop" as const,
            }}
          >
            {emoji}
          </motion.span>
          {title}
          {count !== undefined && (
            <span className="text-sm font-normal text-muted-foreground">
              ({count})
            </span>
          )}
        </motion.h3>
        {total !== undefined && (
          <motion.p
            className="text-muted-foreground text-sm"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
          >
            {count} sur {total} {count === 1 ? "item" : "items"}
          </motion.p>
        )}
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <motion.div variants={itemVariants}>{children}</motion.div>
      </motion.div>
    </div>
  );
}

// Animated empty state
export function AnimatedEmptyState({
  emoji = "😊",
  title,
  message,
  action,
}: {
  emoji?: string;
  title: string;
  message: string;
  action?: ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-16"
    >
      <motion.div
        className="text-6xl mb-4"
        animate={{
          y: [0, -10, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatType: "loop" as const,
        }}
      >
        {emoji}
      </motion.div>
      <motion.h3
        className="text-2xl font-bold mb-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {title}
      </motion.h3>
      <motion.p
        className="text-muted-foreground mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        {message}
      </motion.p>
      {action && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          {action}
        </motion.div>
      )}
    </motion.div>
  );
}

// Staggered grid animation
export function AnimatedGrid({
  children,
  cols = 4,
}: {
  children: ReactNode;
  cols?: number;
}) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 300,
        damping: 20,
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      className={`grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-${cols} xl:grid-cols-${cols}`}
    >
      {children}
    </motion.div>
  );
}
