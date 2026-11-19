import React from "react";
import { FilmmakingInstitute } from "../components/castle/FilmmakingInstitute";

interface AcademyModalProps {
  onClose: () => void;
}

export const AcademyModal: React.FC<AcademyModalProps> = ({ onClose }) => {
  return (
    <div className="academy-modal-content">
      <div className="academy-modal-header">
        <div className="academy-modal-header-meta">
          <span className="modal-kicker font-mono">
            PEDAGOGICAL ARCHIVE // 30-DAY AUTEUR CURRICULUM
          </span>
          <h2 className="academy-modal-title">Zee Filmmaking Institute</h2>
        </div>
        <button
          type="button"
          className="glass-btn academy-close-btn"
          onClick={onClose}
          aria-label="Close Academy"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
          <span>CLOSE</span>
        </button>
      </div>

      <div className="academy-modal-body">
        <FilmmakingInstitute />
      </div>
    </div>
  );
};
