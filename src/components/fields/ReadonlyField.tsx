type ReadonlyFieldProps = {
  label: string;
  value: string;
};

export function ReadonlyField({ label, value }: ReadonlyFieldProps) {
  return (
    <div style={{ display: "grid", gap: 4, opacity: 0.86 }}>
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
      <div
        aria-readonly="true"
        style={{
          borderRadius: 12,
          border: "1px solid rgba(150, 176, 224, 0.34)",
          background:
            "linear-gradient(165deg, rgba(68, 78, 98, 0.42) 0%, rgba(45, 54, 72, 0.45) 100%)",
          minHeight: 44,
          display: "grid",
          alignItems: "center",
          padding: "0 12px",
          color: "rgba(232, 236, 244, 0.78)",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)",
          cursor: "not-allowed",
          userSelect: "none",
        }}
      >
        {value}
      </div>
    </div>
  );
}
