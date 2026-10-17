import { useState, type InputHTMLAttributes } from "react";
import { Input } from "@/components/ui/input";

type PasswordInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  error?: string;
};

// A password field with a Show/Hide button so people can check what they typed.
export function PasswordInput({ error, ...props }: PasswordInputProps) {
  const [visible, setVisible] = useState(false);

  function toggleVisible() {
    setVisible((current) => !current);
  }

  return (
    <div className="relative">
      <Input type={visible ? "text" : "password"} error={error} className="pr-16" {...props} />
      {/* The button is as tall as the input (46px) so it stays centered when an error appears below. */}
      <button
        type="button"
        onClick={toggleVisible}
        aria-pressed={visible}
        aria-label="Show password"
        className="absolute top-0 right-0 flex h-[46px] cursor-pointer items-center px-3 text-sm font-semibold text-towel hover:text-ink"
      >
        {visible ? "Hide" : "Show"}
      </button>
    </div>
  );
}
