import React, { useState } from 'react';

const ExportButton = ({ data }) => {
  const [xmlData, setXmlData] = useState('');

  const createXML = (data) => {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<hospitalBills>\n';
    data.forEach((bill) => {
      xml += '  <bill>\n';
      xml += `    <id>${bill.id}</id>\n`;
      xml += `    <patientName>${bill.patientName}</patientName>\n`;
      xml += `    <amount>${bill.amount}</amount>\n`;
      xml += `    <date>${bill.date}</date>\n`;
      xml += '  </bill>\n';
    });
    xml += '</hospitalBills>';
    return xml;
  };

  const exportToXML = () => {
    const xml = createXML(data);
    setXmlData(xml);

    const blob = new Blob([xml], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'hospital_bills.xml');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <button onClick={exportToXML}>Export to XML</button>
      {xmlData && (
        <div>
          <h3>XML Preview:</h3>
          <pre>{xmlData}</pre>
        </div>
      )}
    </div>
  );
};

export default ExportButton;
