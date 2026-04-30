type ReadonlyFieldProps = {
  label: string;
  value: string;
};

export function ReadonlyField({ label, value }: ReadonlyFieldProps) {
  return (
    <div className="readonly-prefill-field">
      <small className="readonly-prefill-caption">{label}</small>
      <div aria-readonly="true" className="readonly-prefill-value">
        {value}
      </div>
    </div>
  );
}
