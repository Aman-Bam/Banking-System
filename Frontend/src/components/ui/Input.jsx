import React from 'react';

const Input = ({ label, type = 'text', id, value, onChange, placeholder, required = false, className = '', error }) => {
    return (
        <div className={`space-y-2 ${className}`}>
            {label && (
                <label htmlFor={id} className="block text-sm font-medium text-white/80 ml-1">
                    {label}
                </label>
            )}
            <input
                type={type}
                id={id}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                className={`
          w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40
          focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 focus:bg-white/10
          transition-all duration-200 backdrop-blur-sm
          ${error ? 'border-red-500/50 focus:ring-red-500/50' : ''}
        `}
            />
            {error && <p className="text-red-400 text-xs ml-1">{error}</p>}
        </div>
    );
};

export default Input;
