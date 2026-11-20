import React from "react";
import { AcademySection } from "../components/academy/AcademySection";

interface AcademyModalProps {
  onClose: () => void;
}

export const AcademyModal: React.FC<AcademyModalProps> = ({ onClose }) => {
  return (
    <div className="academy-modal-content">
      <div className="academy-modal-body">
        <AcademySection onClose={onClose} />
      </div>
    </div>
  );
};
