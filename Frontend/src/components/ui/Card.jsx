import React from 'react';

const Card = ({ children, className = '' }) => {
    return (
        <div className={`bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 shadow-xl p-6 ${className}`}>
            {children}
        </div>
    );
};

export default Card;
