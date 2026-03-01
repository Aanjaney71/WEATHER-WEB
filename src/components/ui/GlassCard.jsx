import React from 'react';
import { motion } from 'framer-motion';

const GlassCard = ({ children, className = '', delay = 0, ...props }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay, ease: 'easeOut' }}
            className={`glass-panel rounded-2xl p-6 ${className}`}
            {...props}
        >
            {children}
        </motion.div>
    );
};

export default GlassCard;
