import React from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Button } from "react-bootstrap";

interface ReportExporterProps {
  targetId: string;
  filename?: string;
  label?: string;
}

const ReportExporter: React.FC<ReportExporterProps> = ({
  targetId,
  filename = "reporte.pdf",
  label = "Descargar PDF",
}) => {
  const exportToPDF = async () => {
    const input = document.getElementById(targetId);
    if (!input) return;

    const canvas = await html2canvas(input, {
      scale: 2,
      useCORS: true,
      windowWidth: input.scrollWidth,
      windowHeight: input.scrollHeight,
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    const imgProps = pdf.getImageProperties(imgData);
    const imgWidth = pdfWidth;
    const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

    let heightLeft = imgHeight;
    let position = 0;

    // Primera página
    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pdfHeight;

    // Páginas adicionales
    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;
    }

    pdf.save(filename);
  };

  return (
    <Button onClick={exportToPDF} className="mb-4">
      {label}
    </Button>
  );
};

export default ReportExporter;
