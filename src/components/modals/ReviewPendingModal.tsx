import { useEffect, useId, useRef } from "react";
import { primaryButton } from "../../app/constants";

type ReviewPendingModalProps = {
  onProceed: () => void;
};

export function ReviewPendingModal({ onProceed }: ReviewPendingModalProps) {
  const titleId = useId();
  const descriptionId = useId();
  const proceedButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    proceedButtonRef.current?.focus();
  }, []);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      className="review-pending-overlay"
    >
      <div className="review-pending-card">
        <div className="review-pending-icon" aria-hidden="true">
          !
        </div>
        <h3 id={titleId} className="font-display review-pending-title">
          Registro en revision
        </h3>
        <p id={descriptionId} className="review-pending-text">
          Tu registro quedo sujeto a revision. Este proceso puede demorar hasta
          72 horas. Te avisaremos por email cuando este listo para que puedas
          comenzar a jugar.
        </p>
        <button
          ref={proceedButtonRef}
          type="button"
          onClick={onProceed}
          style={{
            ...primaryButton,
            width: "auto",
            minWidth: 180,
            minHeight: 44,
            padding: "10px 16px",
          }}
        >
          Ir a BetPoncho
        </button>
      </div>
    </div>
  );
}
