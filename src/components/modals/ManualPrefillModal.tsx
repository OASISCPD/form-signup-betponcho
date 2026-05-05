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
        <div className="brand-modal-icon" aria-hidden="true">
          !
        </div>
        <h3 className="font-display review-pending-title">Carga manual</h3>
        <p className="review-pending-text">
          No pudimos completar tus datos personales automaticamente.
        </p>
        <p className="review-pending-text">
          Podes continuar y cargarlos manualmente para no perder esta sesion.
        </p>
        <button
          type="button"
          className="primary-cta"
          onClick={onClose}
          style={{
            ...primaryButton,
            width: "min(260px, 100%)",
            minWidth: 180,
            minHeight: 44,
            borderRadius: 999,
            padding: "10px 16px",
          }}
        >
          Entendido
        </button>
      </div>
    </div>
  );
}
