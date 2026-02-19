import React from 'react';

const Button = ({ children, onClick, type = 'button', className = '', disabled = false, variant = 'primary' }) => {
    const baseStyles = "w-full py-3 px-4 rounded-xl font-semibold transition-all duration-200 transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl flex items-center justify-center gap-2";

    const variants = {
        primary: "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white",
        secondary: "bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-sm",
        danger: "bg-gradient-to-r from-red-500 to-pink-600 text-white",
        ghost: "bg-transparent hover:bg-white/10 text-white/80 hover:text-white"
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`${baseStyles} ${variants[variant]} ${className}`}
        >
            {children}
        </button>
    );
};

export default Button;
