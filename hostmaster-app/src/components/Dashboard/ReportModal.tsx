// components/ReportModal.tsx
import React from "react";
import { Modal } from "react-bootstrap";

interface ReportModalProps {
  show: boolean;
  onHide: () => void;
  title: string;
  children: React.ReactNode;
}

const ReportModal: React.FC<ReportModalProps> = ({
  show,
  onHide,
  title,
  children,
}) => {
  return (
    <Modal show={show} onHide={onHide} size="xl" centered backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="bg-dark text-white">{children}</Modal.Body>
    </Modal>
  );
};

export default ReportModal;
