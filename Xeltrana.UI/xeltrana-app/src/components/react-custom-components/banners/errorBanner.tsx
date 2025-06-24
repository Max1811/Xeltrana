import React, { useEffect, useState } from "react";
import "./errorBanner.css";

type Props = {
  message: string;
  visible: boolean;
  autoHideDuration?: number;
  onClose?: () => void;
};

const ErrorBanner: React.FC<Props> = ({
  message,
  visible,
  autoHideDuration = 3000,
  onClose,
}) => {
  const [isVisible, setIsVisible] = useState(visible);

  useEffect(() => {
    setIsVisible(visible);

    if (visible && autoHideDuration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose?.();
      }, autoHideDuration);

      return () => clearTimeout(timer);
    }
  }, [visible, autoHideDuration, onClose]);

  return (
    <div className={`error-banner ${isVisible ? "visible" : ""}`}>
      {message}
    </div>
  );
};

export default ErrorBanner;
