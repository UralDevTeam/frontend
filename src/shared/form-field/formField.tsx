import React from 'react';
import '../../pages/auth/Login.css';

interface FormFieldProps {
    label: React.ReactNode;
    type?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    disabled?: boolean;
    error?: string | null;
    required?: boolean;
    name?: string;
    autoComplete?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
                                                        label,
                                                        type = 'text',
                                                        value,
                                                        onChange,
                                                        placeholder,
                                                        disabled,
                                                        error,
                                                        required,
                                                        name,
                                                        autoComplete,
                                                    }) => {
    return (
        <label className="login-form__label">
            {typeof label === 'string' ? (
                <span className="login-form__label-text">{label}</span>
            ) : (
                label
            )}

            <input
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                disabled={disabled}
                required={required}
                name={name}
                autoComplete={autoComplete}
                className={`login-form__input ${
                    error ? 'login-form__input--error' : ''
                }`}
                aria-invalid={Boolean(error)}
            />

            {error && (
                <p className="login-form__hint login-form__hint--error">
                    {error}
                </p>
            )}
        </label>
    );
};
