import type { ChangeEvent } from "react";
import { useState } from "react";

interface PasswordInputProps {
  name: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  id?: string;
  className?: string;
}

function PasswordInput({
  name,
  value,
  onChange,
  placeholder,
  id,
  className = "",
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={`password-input-wrapper ${className}`}>
      <input
        id={id}
        type={showPassword ? "text" : "password"}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />

      <button
        type="button"
        className="password-eye"
        onClick={() => setShowPassword(!showPassword)}
        aria-label={showPassword ? "Hide password" : "Show password"}
      >
        {showPassword ? (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3 3L21 21"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />

            <path
              d="M10.58 10.58C10.21 10.95 10 11.46 10 12C10 13.1 10.9 14 12 14C12.54 14 13.05 13.79 13.42 13.42"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />

            <path
              d="M9.88 5.09C10.56 4.9 11.26 4.8 12 4.8C16.5 4.8 20.18 7.65 21.5 12C21.05 13.48 20.3 14.78 19.35 15.85"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />

            <path
              d="M6.61 6.61C4.98 7.75 3.7 9.62 3 12C4.32 16.35 8 19.2 12 19.2C13.17 19.2 14.29 18.98 15.32 18.58"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        ) : (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M2.5 12C3.8 7.65 7.5 4.8 12 4.8C16.5 4.8 20.2 7.65 21.5 12C20.2 16.35 16.5 19.2 12 19.2C7.5 19.2 3.8 16.35 2.5 12Z"
              stroke="currentColor"
              strokeWidth="2"
            />

            <circle
              cx="12"
              cy="12"
              r="3"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>
        )}
      </button>
    </div>
  );
}

export default PasswordInput;

