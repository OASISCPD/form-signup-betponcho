const ERROR_TEXT = "#ffb4b4";

type EditablePrefillFieldProps = {
  label: string;
  value: string;
  placeholder: string;
  type?: React.HTMLInputTypeAttribute;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  maxLength?: number;
  error?: string;
  onChange: (value: string) => void;
};

export function EditablePrefillField({
  label,
  value,
  placeholder,
  type = "text",
  inputMode,
  maxLength,
  error,
  onChange,
}: EditablePrefillFieldProps) {
  return (
    <label className="editable-prefill-label">
      <small className="editable-prefill-caption">{label}</small>
      <input
        className={`editable-prefill-input ${error ? "editable-prefill-input-error" : ""}`}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        type={type}
        inputMode={inputMode}
        maxLength={maxLength}
        placeholder={placeholder}
      />
      {error ? <small style={{ color: ERROR_TEXT }}>{error}</small> : null}
    </label>
  );
}
