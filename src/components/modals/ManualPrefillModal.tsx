import { primaryButton } from "../../app/constants";

type ManualPrefillModalProps = {
  onClose: () => void;
};

export function ManualPrefillModal({ onClose }: ManualPrefillModalProps) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Carga manual de datos"
      className="review-pending-overlay"
    >
      <div className="review-pending-card">
        <div className="review-pending-icon" aria-hidden="true">
          !
        </div>
        <h3 className="font-display review-pending-title">Carga manual</h3>
        <p className="review-pending-text">
          No pudimos completar tus datos personales. 
        </p>
                <p className="review-pending-text">
          Podés continuar y cargando manualmente para no perder esta sesión.
        </p>
        <button
          type="button"
          onClick={onClose}
          style={{
            ...primaryButton,
            width: "auto",
            minWidth: 180,
            minHeight: 44,
            padding: "10px 16px",
          }}
        >
          Entendido
        </button>
      </div>
    </div>
  );
}
