// frontend/src/components/Toast.js
import React, { useEffect, useState } from 'react';
import './Toast.css';

const CHECK_ICON = '✔️';
const CROSS_ICON = '✖️';

function Toast({ message, type, duration = 3000, onDismiss, toastCallback }) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (message) {
            setIsVisible(true);
            if (type !== 'confirm') { 
                const timer = setTimeout(() => {
                    setIsVisible(false);
                    if (onDismiss) {
                        onDismiss();
                    }
                }, duration);
                return () => clearTimeout(timer);
            }
        } else {
            setIsVisible(false);
        }
    }, [message, type, duration, onDismiss]);

    if (!isVisible) {
        return null;
    }

    const getIcon = () => {
        switch (type) {
            case 'success': return '✅';
            case 'error': return '❌';
            case 'warning': return '⚠️';
            case 'info': return 'ℹ️';
            case 'confirm': return '❓'; 
            default: return '💬';
        }
    };

    const handleConfirmAction = () => {
        setIsVisible(false); 
        if (toastCallback) {
            toastCallback(true); 
        }
        onDismiss(); 
    };

    const handleCancelAction = () => {
        setIsVisible(false); 
        if (toastCallback) {
            toastCallback(false); 
        }
        onDismiss(); 
    };

    return (
        <div className={`toast-notification ${type} ${isVisible ? 'show' : ''}`}>
            <span className="toast-icon">{getIcon()}</span>
            <span className="toast-message-text">{message}</span>
            {type === 'confirm' && ( 
                <div className="toast-actions">
                    <button className="btn toast-confirm-btn" onClick={handleConfirmAction}>
                        {CHECK_ICON} تأكيد
                    </button>
                    <button className="btn toast-cancel-btn" onClick={handleCancelAction}>
                        {CROSS_ICON} لا
                    </button>
                </div>
            )}
        </div>
    );
}

export default Toast;