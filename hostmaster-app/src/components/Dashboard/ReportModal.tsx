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
      <Modal.Body className=" text-white p-0" style={{ height: "80hv" }}>
        <div
          style={{
            height: "100%",
            width: "100%",
            padding: "1rem",
            color: "#3a3a3a ",
          }}
        >
          {children}
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ReportModal;
