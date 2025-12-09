import { useMemo, useState, ChangeEventHandler } from 'react';

interface UseAuthFormOptions {
    validatePasswordLength?: boolean;
    minPasswordLength?: number;
    maxPasswordLength?: number;
}

export function useAuthForm(options: UseAuthFormOptions = {}) {
    const {
        validatePasswordLength = false,
        minPasswordLength = 6,
        maxPasswordLength = 64,
    } = options;

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [emailError, setEmailError] = useState<string | null>(null);
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const [generalError, setGeneralError] = useState<string | null>(null);

    const emailPattern = useMemo(() => /[^\s@]+@[^\s@]+\.[^\s@]+/, []);

    const resetErrors = () => {
        setEmailError(null);
        setPasswordError(null);
        setGeneralError(null);
    };

    const validate = () => {
        resetErrors();
        let valid = true;

        if (!emailPattern.test(email)) {
            setEmailError('Проверьте адрес');
            valid = false;
        }

        if (validatePasswordLength) {
            if (password.length < minPasswordLength || password.length > maxPasswordLength) {
                setPasswordError(
                    `Пароль должен содержать от ${minPasswordLength} до ${maxPasswordLength} символов`
                );
                valid = false;
            }
        }

        return valid;
    };

    const handleEmailChange: ChangeEventHandler<HTMLInputElement> = (e) => {
        setEmail(e.target.value);
        if (emailError) setEmailError(null);
        if (generalError) setGeneralError(null);
    };

    const handlePasswordChange: ChangeEventHandler<HTMLInputElement> = (e) => {
        setPassword(e.target.value);
        if (passwordError) setPasswordError(null);
        if (generalError) setGeneralError(null);
    };

    return {
        email,
        password,
        emailError,
        passwordError,
        generalError,
        setEmailError,
        setPasswordError,
        setGeneralError,
        handleEmailChange,
        handlePasswordChange,
        validate,
        resetErrors,
    };
}
