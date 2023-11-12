import type { UseFormRegisterReturn } from "react-hook-form";

interface InputProps {
  label: string;
  name: string;
  kind?: "text" | "password";
  type: string;
  register: UseFormRegisterReturn;
  required?: boolean;
  placeholder?: string;
  error?: any;
}

export default function Input({
  label,
  name,
  kind = "text",
  register,
  type,
  required = false,
  placeholder,
  error,
}: InputProps) {
  return (
    <div>
      <label
        className="mb-1 block text-sm font-medium text-gray-700"
        htmlFor={name}
      >
        {label}
      </label>
      {kind === "text" ? (
        <div className="rounded-md relative flex  items-center shadow-sm">
          <input
            id={name}
            required={required}
            {...register}
            type={type}
            placeholder={placeholder}
            className="appearance-none w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
          />
          {error && <p className="text-red-400">{error.message}</p>}
        </div>
      ) : null}
    </div>
  );
}
