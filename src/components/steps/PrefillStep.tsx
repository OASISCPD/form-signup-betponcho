import { ERROR_TEXT, panelBase, primaryButton, selectBase } from "../../app/constants";
import type { NosisData, ProfileForm } from "../../app/types";
import { EditablePrefillField } from "../fields/EditablePrefillField";
import { ReadonlyField } from "../fields/ReadonlyField";

type PrefillStepProps = {
  nosis: NosisData | null;
  profile: ProfileForm;
  errors: Record<string, string>;
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
};

export function PrefillStep({
  nosis,
  profile,
  errors,
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
}: PrefillStepProps) {
  const isManualMode = !nosis;

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <h2 className="font-display" style={{ margin: 0, fontSize: 34 }}>
        Confirmar datos
      </h2>
      <div
        style={{
          borderRadius: 16,
          border: isManualMode
            ? "1px solid rgba(236, 106, 106, 0.55)"
            : "1px solid rgba(140, 176, 232, 0.58)",
          background: isManualMode
            ? "linear-gradient(165deg, rgba(62, 25, 35, 0.65) 0%, rgba(33, 23, 40, 0.68) 100%)"
            : "linear-gradient(165deg, rgba(30, 43, 68, 0.64) 0%, rgba(20, 30, 52, 0.7) 100%)",
          padding: 16,
          display: "grid",
          gap: 12,
        }}
      >
        {isManualMode ? (
          <div
            style={{
              display: "grid",
              gap: 12,
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            }}
          >
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
            <label style={{ display: "grid", gap: 8 }}>
              <span>Genero</span>
              <select
                value={profile.gender}
                onChange={(e) => onGenderChange(e.target.value as ProfileForm["gender"])}
                style={{
                  ...selectBase,
                  border: errors.gender
                    ? "1px solid rgba(255, 110, 110, 0.85)"
                    : "1px solid rgba(236, 106, 106, 0.45)",
                }}
              >
                <option value="" style={{ color: "#111", background: "#fff" }}>
                  Seleccionar
                </option>
                <option value="M" style={{ color: "#111", background: "#fff" }}>
                  Masculino
                </option>
                <option value="F" style={{ color: "#111", background: "#fff" }}>
                  Femenino
                </option>
              </select>
              {errors.gender ? <small style={{ color: ERROR_TEXT }}>{errors.gender}</small> : null}
            </label>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gap: 12,
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            }}
          >
            <ReadonlyField label="Nombre" value={nosis.nombre} />
            <ReadonlyField label="Apellido" value={nosis.apellido} />
            <ReadonlyField label="Fecha nacimiento" value={nosis.fechaNacimiento} />
            <ReadonlyField label="DNI" value={nosis.dni} />
            <ReadonlyField label="CUIL/CUIT" value={nosis.cuil} />
            <ReadonlyField label="Genero" value={nosis.genero} />
          </div>
        )}
      </div>

      <div
        style={{
          ...panelBase,
          padding: 16,
          display: "grid",
          gap: 12,
          border: "1px solid rgba(236, 106, 106, 0.55)",
          background:
            "linear-gradient(165deg, rgba(64, 24, 35, 0.68) 0%, rgba(28, 25, 44, 0.72) 100%)",
        }}
      >
        <div
          style={{
            display: "grid",
            gap: 12,
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          }}
        >
          <EditablePrefillField
            label="Direccion"
            value={profile.direccion}
            placeholder="Ej: Av. Lopez 143"
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
          <div style={{ display: "grid", gap: 8 }}>
            <small className="editable-prefill-caption">
              Persona Expuesta Politicamente (PEP)
            </small>
            <div className={`pep-selector-group ${errors.pep ? "pep-selector-group-error" : ""}`}>
              <label
                className={`pep-radio-chip pep-selector-chip ${profile.pep === "Si" ? "pep-radio-chip-active" : ""}`}
                style={{ cursor: "pointer" }}
              >
                <input
                  className="pep-radio-input"
                  type="radio"
                  name="pep"
                  value="Si"
                  checked={profile.pep === "Si"}
                  onChange={(e) => onPepChange(e.target.value as ProfileForm["pep"])}
                />
                <span>Si</span>
              </label>
              <label
                className={`pep-radio-chip pep-selector-chip ${profile.pep === "No" ? "pep-radio-chip-active" : ""}`}
                style={{ cursor: "pointer" }}
              >
                <input
                  className="pep-radio-input"
                  type="radio"
                  name="pep"
                  value="No"
                  checked={profile.pep === "No"}
                  onChange={(e) => onPepChange(e.target.value as ProfileForm["pep"])}
                />
                <span>No</span>
              </label>
            </div>
            {errors.pep ? <small style={{ color: ERROR_TEXT }}>{errors.pep}</small> : null}
          </div>
        </div>
      </div>

      <div
        style={{
          ...panelBase,
          padding: 16,
          display: "grid",
          gap: 12,
          border: "1px solid rgba(236, 106, 106, 0.55)",
          background:
            "linear-gradient(165deg, rgba(64, 24, 35, 0.68) 0%, rgba(28, 25, 44, 0.72) 100%)",
        }}
      >
        <div
          style={{
            display: "grid",
            gap: 12,
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          }}
        >
          <label style={{ display: "grid", gap: 8 }}>
            <span>Estado civil</span>
            <select
              value={profile.estadoCivil}
              onChange={(e) => onEstadoCivilChange(e.target.value as ProfileForm["estadoCivil"])}
              style={{
                ...selectBase,
                border: "1px solid rgba(236, 106, 106, 0.45)",
              }}
            >
              <option value="" style={{ color: "#111", background: "#fff" }}>
                Seleccionar
              </option>
              <option value="Casado" style={{ color: "#111", background: "#fff" }}>
                Casado
              </option>
              <option value="Soltero" style={{ color: "#111", background: "#fff" }}>
                Soltero
              </option>
              <option value="Viudo" style={{ color: "#111", background: "#fff" }}>
                Viudo
              </option>
              <option value="Union Civil" style={{ color: "#111", background: "#fff" }}>
                Union Civil
              </option>
            </select>
            {errors.estadoCivil ? (
              <small style={{ color: ERROR_TEXT }}>{errors.estadoCivil}</small>
            ) : null}
          </label>
          <label style={{ display: "grid", gap: 8 }}>
            <span>Ocupacion</span>
            <select
              value={profile.ocupacion}
              onChange={(e) => onOcupacionChange(e.target.value as ProfileForm["ocupacion"])}
              style={{
                ...selectBase,
                border: "1px solid rgba(236, 106, 106, 0.45)",
              }}
            >
              <option value="" style={{ color: "#111", background: "#fff" }}>
                Seleccionar
              </option>
              <option value="Industria" style={{ color: "#111", background: "#fff" }}>
                Industria
              </option>
              <option value="Comercio" style={{ color: "#111", background: "#fff" }}>
                Comercio
              </option>
              <option value="Profesional" style={{ color: "#111", background: "#fff" }}>
                Profesional
              </option>
            </select>
            {errors.ocupacion ? (
              <small style={{ color: ERROR_TEXT }}>{errors.ocupacion}</small>
            ) : null}
          </label>
        </div>
      </div>
      <button type="button" onClick={onContinue} className="primary-cta" style={primaryButton}>
        Continuar con datos de contacto
      </button>
      {errors.confirmationApi ? (
        <small style={{ color: ERROR_TEXT }}>{errors.confirmationApi}</small>
      ) : null}
    </div>
  );
}
