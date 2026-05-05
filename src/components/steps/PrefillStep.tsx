import { ERROR_TEXT, primaryButton, selectBase } from "../../app/constants";
import type { NosisData, ProfileForm } from "../../app/types";
import { LoadingButton } from "../LoadingButton";
import { EditablePrefillField } from "../fields/EditablePrefillField";
import { ReadonlyField } from "../fields/ReadonlyField";

type PrefillStepProps = {
  nosis: NosisData | null;
  profile: ProfileForm;
  errors: Record<string, string>;
  isSubmitting: boolean;
  onFirstNameChange: (value: string) => void;
  onLastNameChange: (value: string) => void;
  onBirthDateChange: (value: string) => void;
  onDniChange: (value: string) => void;
  onCuilChange: (value: string) => void;
  onGenderChange: (value: ProfileForm["gender"]) => void;
  onDireccionChange: (value: string) => void;
  onCiudadChange: (value: string) => void;
  onProvinciaChange: (value: string) => void;
  onPepChange: (value: ProfileForm["pep"]) => void;
  onEstadoCivilChange: (value: ProfileForm["estadoCivil"]) => void;
  onOcupacionChange: (value: ProfileForm["ocupacion"]) => void;
  onContinue: () => void;
  onBack: () => void;
};

type IdentitySectionProps = {
  nosis: NosisData | null;
  profile: ProfileForm;
  errors: Record<string, string>;
  onFirstNameChange: (value: string) => void;
  onLastNameChange: (value: string) => void;
  onBirthDateChange: (value: string) => void;
  onDniChange: (value: string) => void;
  onCuilChange: (value: string) => void;
  onGenderChange: (value: ProfileForm["gender"]) => void;
};

type AddressSectionProps = {
  profile: ProfileForm;
  errors: Record<string, string>;
  onDireccionChange: (value: string) => void;
  onCiudadChange: (value: string) => void;
  onProvinciaChange: (value: string) => void;
  onPepChange: (value: ProfileForm["pep"]) => void;
};

type ProfileDetailsSectionProps = {
  profile: ProfileForm;
  errors: Record<string, string>;
  onEstadoCivilChange: (value: ProfileForm["estadoCivil"]) => void;
  onOcupacionChange: (value: ProfileForm["ocupacion"]) => void;
};

type FormSelectProps<T extends string> = {
  label: string;
  value: T;
  error?: string;
  options: readonly { value: T; label: string }[];
  onChange: (value: T) => void;
  minWidth: number;
  hasErrorBorder?: boolean;
};

const optionStyle: React.CSSProperties = {
  color: "#fff",
  background: "#050505",
};

const pepLabelStyle: React.CSSProperties = {
  cursor: "pointer",
};

const occupationOptions = [
  { value: "", label: "Seleccionar" },
  { value: "Industria", label: "Industria" },
  { value: "Comercio", label: "Comercio" },
  { value: "Profesional", label: "Profesional" },
] as const satisfies readonly { value: ProfileForm["ocupacion"]; label: string }[];

const civilStatusOptions = [
  { value: "", label: "Seleccionar" },
  { value: "Casado", label: "Casado" },
  { value: "Soltero", label: "Soltero" },
  { value: "Viudo", label: "Viudo" },
  { value: "Union Civil", label: "Union Civil" },
] as const satisfies readonly { value: ProfileForm["estadoCivil"]; label: string }[];

const genderOptions = [
  { value: "", label: "Seleccionar" },
  { value: "M", label: "Masculino" },
  { value: "F", label: "Femenino" },
] as const satisfies readonly { value: ProfileForm["gender"]; label: string }[];

function FormSelect<T extends string>({
  label,
  value,
  error,
  options,
  onChange,
  minWidth,
  hasErrorBorder = false,
}: FormSelectProps<T>) {
  return (
    <label className="prefill-row">
      <span>{label}</span>
      <select
        className="prefill-select"
        value={value}
        onChange={(event) => onChange(event.target.value as T)}
        style={{
          ...selectBase,
          border: hasErrorBorder && error
            ? "1px solid rgba(255, 110, 110, 0.85)"
            : "1px solid rgba(236, 106, 106, 0.45)",
          minWidth,
        }}
      >
        {options.map((option) => (
          <option key={option.value || "empty"} value={option.value} style={optionStyle}>
            {option.label}
          </option>
        ))}
      </select>
      {error ? <small style={{ color: ERROR_TEXT }}>{error}</small> : null}
    </label>
  );
}

function IdentitySection({
  nosis,
  profile,
  errors,
  onFirstNameChange,
  onLastNameChange,
  onBirthDateChange,
  onDniChange,
  onCuilChange,
  onGenderChange,
}: IdentitySectionProps) {
  if (nosis) {
    return (
      <>
        <ReadonlyField
          label="Nombre y apellido"
          value={`${nosis.nombre} ${nosis.apellido}`.trim()}
        />
        <ReadonlyField label="DNI" value={nosis.dni} />
        <ReadonlyField label="CUIL/CUIT" value={nosis.cuil} />
        <ReadonlyField label="Genero" value={nosis.genero} />
      </>
    );
  }

  return (
    <>
      <EditablePrefillField
        label="Nombre"
        value={profile.firstName}
        placeholder="Ej: Juan"
        error={errors.firstName}
        onChange={onFirstNameChange}
      />
      <EditablePrefillField
        label="Apellido"
        value={profile.lastName}
        placeholder="Ej: Perez"
        error={errors.lastName}
        onChange={onLastNameChange}
      />
      <EditablePrefillField
        label="Fecha nacimiento"
        value={profile.birthDate}
        placeholder=""
        type="date"
        error={errors.birthDate}
        onChange={onBirthDateChange}
      />
      <EditablePrefillField
        label="DNI"
        value={profile.dni}
        placeholder="Ej: 12345678"
        inputMode="numeric"
        maxLength={8}
        error={errors.dni}
        onChange={onDniChange}
      />
      <EditablePrefillField
        label="CUIL/CUIT"
        value={profile.cuil}
        placeholder="Ej: 20123456789"
        inputMode="numeric"
        maxLength={11}
        error={errors.cuil}
        onChange={onCuilChange}
      />
      <FormSelect
        label="Genero"
        value={profile.gender}
        error={errors.gender}
        options={genderOptions}
        onChange={onGenderChange}
        minWidth={180}
        hasErrorBorder
      />
    </>
  );
}

function PepSelector({
  pep,
  error,
  onPepChange,
}: {
  pep: ProfileForm["pep"];
  error?: string;
  onPepChange: (value: ProfileForm["pep"]) => void;
}) {
  return (
    <div className="prefill-row prefill-pep-row">
      <small className="editable-prefill-caption">
        Persona Expuesta Politicamente (PEP)
      </small>
      <div className={`pep-selector-group ${error ? "pep-selector-group-error" : ""}`}>
        <label
          className={`pep-radio-chip pep-selector-chip ${pep === "Si" ? "pep-radio-chip-active" : ""}`}
          style={pepLabelStyle}
        >
          <input
            className="pep-radio-input"
            type="radio"
            name="pep"
            value="Si"
            checked={pep === "Si"}
            onChange={(event) => onPepChange(event.target.value as ProfileForm["pep"])}
          />
          <span>Si</span>
        </label>
        <label
          className={`pep-radio-chip pep-selector-chip ${pep === "No" ? "pep-radio-chip-active" : ""}`}
          style={pepLabelStyle}
        >
          <input
            className="pep-radio-input"
            type="radio"
            name="pep"
            value="No"
            checked={pep === "No"}
            onChange={(event) => onPepChange(event.target.value as ProfileForm["pep"])}
          />
          <span>No</span>
        </label>
      </div>
      {error ? <small style={{ color: ERROR_TEXT }}>{error}</small> : null}
    </div>
  );
}

function AddressSection({
  profile,
  errors,
  onDireccionChange,
  onCiudadChange,
  onProvinciaChange,
  onPepChange,
}: AddressSectionProps) {
  return (
    <>
      <EditablePrefillField
        label="Direccion"
        value={profile.direccion}
        placeholder="Ej: Av. Belgrano 143"
        error={errors.direccion}
        onChange={onDireccionChange}
      />
      <EditablePrefillField
        label="Ciudad"
        value={profile.ciudad}
        placeholder="Ej: La Plata"
        error={errors.ciudad}
        onChange={onCiudadChange}
      />
      <EditablePrefillField
        label="Provincia"
        value={profile.provincia}
        placeholder="Ej: Buenos Aires"
        error={errors.provincia}
        onChange={onProvinciaChange}
      />
      <PepSelector
        pep={profile.pep}
        error={errors.pep}
        onPepChange={onPepChange}
      />
    </>
  );
}

function ProfileDetailsSection({
  profile,
  errors,
  onEstadoCivilChange,
  onOcupacionChange,
}: ProfileDetailsSectionProps) {
  return (
    <>
      <FormSelect
        label="Estado civil"
        value={profile.estadoCivil}
        error={errors.estadoCivil}
        options={civilStatusOptions}
        onChange={onEstadoCivilChange}
        minWidth={220}
      />
      <FormSelect
        label="Ocupacion"
        value={profile.ocupacion}
        error={errors.ocupacion}
        options={occupationOptions}
        onChange={onOcupacionChange}
        minWidth={220}
      />
    </>
  );
}

export function PrefillStep({
  nosis,
  profile,
  errors,
  isSubmitting,
  onFirstNameChange,
  onLastNameChange,
  onBirthDateChange,
  onDniChange,
  onCuilChange,
  onGenderChange,
  onDireccionChange,
  onCiudadChange,
  onProvinciaChange,
  onPepChange,
  onEstadoCivilChange,
  onOcupacionChange,
  onContinue,
  onBack,
}: PrefillStepProps) {
  return (
    <div className="prefill-page identity-shell">
      <header className="identity-brand-header">
        <img
          src="/images/logo.png"
          alt="BetPoncho"
          className="identity-brand-logo"
        />
      </header>

      <div className="brand-hero-art prefill-hero">
        <img
          src="/images/hero.png"
          alt="Bienvenido a BetPoncho"
          className="brand-hero-image brand-hero-image-standard"
        />
      </div>

      <nav className="prefill-flow-nav" aria-label="Progreso del registro">
        <button type="button" onClick={onBack} className="prefill-back-button">
          &lt; Volver
        </button>
        {[
          { number: "✓", label: "Ingresar datos", done: true },
          { number: "2", label: "Confirmar", active: true },
          { number: "3", label: "Crear cuenta" },
        ].map((item) => (
          <div
            key={item.label}
            className={`identity-step-chip ${
              item.active ? "identity-step-chip-active" : ""
            } ${item.done ? "identity-step-chip-done" : ""}`}
          >
            <span className="identity-step-chip-number">{item.number}</span>
            <span>{item.label}</span>
          </div>
        ))}
      </nav>

      <div className="prefill-shell">
        <section className="prefill-card">
          <div className="prefill-card-head">
            <div className="prefill-step-badge">2</div>
            <h2 className="font-display">Confirmar datos</h2>
          </div>
          <div className="prefill-grid">
            <IdentitySection
              nosis={nosis}
              profile={profile}
              errors={errors}
              onFirstNameChange={onFirstNameChange}
              onLastNameChange={onLastNameChange}
              onBirthDateChange={onBirthDateChange}
              onDniChange={onDniChange}
              onCuilChange={onCuilChange}
              onGenderChange={onGenderChange}
            />
            <AddressSection
              profile={profile}
              errors={errors}
              onDireccionChange={onDireccionChange}
              onCiudadChange={onCiudadChange}
              onProvinciaChange={onProvinciaChange}
              onPepChange={onPepChange}
            />
            <ProfileDetailsSection
              profile={profile}
              errors={errors}
              onEstadoCivilChange={onEstadoCivilChange}
              onOcupacionChange={onOcupacionChange}
            />
          </div>
          <LoadingButton
            type="button"
            onClick={onContinue}
            className="primary-cta prefill-submit"
            style={primaryButton}
            isLoading={isSubmitting}
            loadingLabel="Guardando datos..."
          >
            Confirmar y continuar
          </LoadingButton>
          {errors.confirmationApi ? (
            <small style={{ color: ERROR_TEXT }}>{errors.confirmationApi}</small>
          ) : null}
        </section>
      </div>

      <div className="identity-footer-wrap" aria-hidden="true">
        <img src="/images/footer.png" alt="" className="identity-footer-image" />
      </div>
    </div>
  );
}
