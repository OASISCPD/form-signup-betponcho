import { ERROR_TEXT, panelBase, primaryButton, selectBase } from "../../app/constants";
import type { NosisData, ProfileForm } from "../../app/types";
import { EditablePrefillField } from "../fields/EditablePrefillField";
import { ReadonlyField } from "../fields/ReadonlyField";

const pepFieldsetBaseStyle: React.CSSProperties = {
  margin: 0,
  padding: "10px 12px",
  borderRadius: 12,
  display: "grid",
  gap: 8,
  width: "100%",
  maxWidth: 240,
};

type PrefillStepProps = {
  nosis: NosisData;
  profile: ProfileForm;
  errors: Record<string, string>;
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
  onDireccionChange,
  onCiudadChange,
  onProvinciaChange,
  onPepChange,
  onEstadoCivilChange,
  onOcupacionChange,
  onContinue,
}: PrefillStepProps) {
  return (
    <div style={{ display: "grid", gap: 14 }}>
      <h2 className="font-display" style={{ margin: 0, fontSize: 34 }}>
        Confirmar datos
      </h2>
      <div
        style={{
          borderRadius: 16,
          border: "1px solid rgba(150, 176, 224, 0.34)",
          background: "rgba(255,255,255,0.06)",
          padding: 14,
          display: "grid",
          gap: 10,
        }}
      >
        <div
          style={{
            display: "grid",
            gap: 10,
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          }}
        >
          <ReadonlyField label="Nombre" value={nosis.nombre} />
          <ReadonlyField label="Apellido" value={nosis.apellido} />
          <ReadonlyField label="Fecha nacimiento" value={nosis.fechaNacimiento} />
          <ReadonlyField label="DNI" value={nosis.dni} />
          <ReadonlyField label="CUIL/CUIT" value={nosis.cuil} />
          <ReadonlyField label="Género" value={nosis.genero} />
        </div>
      </div>

      <div
        style={{
          ...panelBase,
          padding: 14,
          display: "grid",
          gap: 10,
          border: "1px solid rgba(236, 106, 106, 0.34)",
        }}
      >
        <div
          style={{
            display: "grid",
            gap: 10,
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          }}
        >
          <EditablePrefillField
            label="Dirección"
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
            <fieldset
              style={{
                ...pepFieldsetBaseStyle,
                border: errors.pep
                  ? "1px solid rgba(255, 110, 110, 0.85)"
                  : "1px solid rgba(236, 106, 106, 0.45)",
              }}
            >
              <legend style={{ padding: "0 6px", fontSize: 14 }}>
                Persona Expuesta Politicamente (PEP)
              </legend>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <label
                  className={`pep-radio-chip ${profile.pep === "Si" ? "pep-radio-chip-active" : ""}`}
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
                  className={`pep-radio-chip ${profile.pep === "No" ? "pep-radio-chip-active" : ""}`}
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
            </fieldset>
          </div>
        </div>
      </div>

      <div
        style={{
          ...panelBase,
          padding: 14,
          display: "grid",
          gap: 10,
          border: "1px solid rgba(236, 106, 106, 0.34)",
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
