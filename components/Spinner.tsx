import React from 'react';

interface SpinnerProps {
    small?: boolean;
}

const Spinner: React.FC<SpinnerProps> = ({ small = false }) => {
    const sizeClasses = small ? 'h-6 w-6' : 'h-12 w-12';
    const borderClasses = small ? 'border-2' : 'border-4';

    return (
        <div 
            className={`${sizeClasses} ${borderClasses} border-amber-400 border-t-transparent rounded-full animate-spin`}
            role="status"
        >
            <span className="sr-only">Loading...</span>
        </div>
    );
};

export default Spinner;
