import type { ButtonHTMLAttributes, ReactNode } from "react";

type LoadingButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  isLoading?: boolean;
  loadingLabel?: string;
  children: ReactNode;
};

export function LoadingButton({
  isLoading = false,
  loadingLabel,
  children,
  disabled,
  style,
  ...props
}: LoadingButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled || isLoading}
      style={style}
    >
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
        }}
      >
        {isLoading ? (
          <span
            aria-hidden="true"
            style={{
              width: 16,
              height: 16,
              borderRadius: "50%",
              border: "2px solid rgba(255,255,255,0.3)",
              borderTopColor: "#fff",
              animation: "spin 1s linear infinite",
              flexShrink: 0,
            }}
          />
        ) : null}
        <span>{isLoading ? (loadingLabel ?? children) : children}</span>
      </span>
    </button>
  );
}
