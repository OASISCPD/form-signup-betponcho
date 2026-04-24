const ERROR_TEXT = "#ffb4b4";

type EditablePrefillFieldProps = {
  label: string;
  value: string;
  placeholder: string;
  error?: string;
  onChange: (value: string) => void;
};

export function EditablePrefillField({
  label,
  value,
  placeholder,
  error,
  onChange,
}: EditablePrefillFieldProps) {
  return (
    <label style={{ display: "grid", gap: 4, opacity: 0.96 }}>
      <small
        style={{
          opacity: 0.72,
          letterSpacing: "0.04em",
          textTransform: "uppercase",
          fontSize: 11,
          color: "rgba(228, 234, 245, 0.72)",
        }}
      >
        {label}
      </small>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        type="text"
        placeholder={placeholder}
        style={{
          borderRadius: 12,
          border: error
            ? "1px solid rgba(255, 110, 110, 0.85)"
            : "1px solid rgba(236, 106, 106, 0.45)",
          background:
            "linear-gradient(165deg, rgba(82, 90, 108, 0.42) 0%, rgba(56, 63, 78, 0.45) 100%)",
          minHeight: 44,
          padding: "0 12px",
          color: "rgba(232, 236, 244, 0.94)",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)",
          outline: "none",
          fontSize: 16,
          width: "100%",
        }}
      />
      {error ? <small style={{ color: ERROR_TEXT }}>{error}</small> : null}
    </label>
  );
}
