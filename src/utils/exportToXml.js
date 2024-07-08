// src/utils/exportToXml.js
import { create } from "xmlbuilder2";

export const exportToXml = (data) => {
  const root = create({ version: "1.0" }).ele("root");

  data.forEach((item) => {
    const itemEle = root.ele("item");
    Object.keys(item).forEach((key) => {
      itemEle.ele(key).txt(item[key]);
    });
  });

  const xml = root.end({ prettyPrint: true });

  const blob = new Blob([xml], { type: "application/xml" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "data.xml";
  link.click();
};

export const generateXmlData = (formData) => {
  const root = create({ version: "1.0" }).ele("MedicalReport");

  const patientInfo = root.ele("PatientInfo");
  patientInfo.ele("HN").txt(formData.hn);
  patientInfo.ele("HMAIN").txt(formData.hmain);
  patientInfo.ele("TreatmentRights").txt(formData.treatmentRights);
  patientInfo.ele("PatientName").txt(formData.patientName);
  patientInfo.ele("Code").txt(formData.code);
  patientInfo.ele("Date").txt(formData.date);
  patientInfo.ele("Time").txt(formData.time);

  const condition = root.ele("Condition");
  condition.ele("NewCase").txt(formData.newCase);
  condition.ele("RepeatA").txt(formData.repeatA);
  condition.ele("RepeatC").txt(formData.repeatC);
  condition.ele("Referral").txt(formData.referral);

  const items = root.ele("Items");
  formData.items.forEach((item) => {
    const itemEle = items.ele("Item");
    itemEle.ele("TMTCode").txt(item.tmtCode);
    itemEle.ele("Name").txt(item.name);
    itemEle.ele("Quantity").txt(item.quantity);
    itemEle.ele("UnitPrice").txt(item.unitPrice);
    itemEle.ele("TotalPrice").txt(item.totalPrice);
  });

  const diagnosis = root.ele("Diagnosis");
  diagnosis.ele("Description").txt(formData.diagnosisDescription);
  diagnosis.ele("ICD10Code").txt(formData.icd10Code);

  const procedure = root.ele("Procedure");
  procedure.ele("Description").txt(formData.procedureDescription);
  procedure.ele("Code").txt(formData.procedureCode);

  const otherFees = root.ele("OtherFees");
  otherFees.ele("HospitalServiceFee").txt(formData.hospitalServiceFee);
  otherFees.ele("MedicalPersonnelFee1").txt(formData.medicalPersonnelFee1);
  otherFees.ele("MedicalPersonnelFee2").txt(formData.medicalPersonnelFee2);
  otherFees.ele("MedicalPersonnelFee3").txt(formData.medicalPersonnelFee3);
  otherFees.ele("MedicalPersonnelFee4").txt(formData.medicalPersonnelFee4);

  const totals = root.ele("Totals");
  totals.ele("SubTotal").txt(formData.subTotal);
  totals.ele("GrandTotal").txt(formData.grandTotal);

  const user = root.ele("User");
  user.ele("FullName").txt(formData.userFullName);
  user.ele("Position").txt(formData.userPosition);
  user.ele("PhoneNumber").txt(formData.userPhoneNumber);

  return root.end({ prettyPrint: true });
};

export const generateAndDownloadXml = (formData) => {
  const root = create({ version: '1.0' }).ele('MedicalReport');

  const patientInfo = root.ele('PatientInfo');
  patientInfo.ele('HN').txt(formData.hn);
  patientInfo.ele('HMAIN').txt(formData.hmain);
  patientInfo.ele('TreatmentRights').txt(formData.treatmentRights);
  patientInfo.ele('PatientName').txt(formData.patientName);
  patientInfo.ele('Code').txt(formData.code);
  patientInfo.ele('Date').txt(formData.date);
  patientInfo.ele('Time').txt(formData.time);

  const condition = root.ele('Condition');
  condition.ele('NewCase').txt(formData.newCase);
  condition.ele('RepeatA').txt(formData.repeatA);
  condition.ele('RepeatC').txt(formData.repeatC);
  condition.ele('Referral').txt(formData.referral);

  const items = root.ele('Items');
  formData.items.forEach(item => {
    const itemEle = items.ele('Item');
    itemEle.ele('TMTCode').txt(item.tmtCode);
    itemEle.ele('Name').txt(item.name);
    itemEle.ele('Quantity').txt(item.quantity);
    itemEle.ele('UnitPrice').txt(item.unitPrice);
    itemEle.ele('TotalPrice').txt(item.totalPrice);
  });

  const diagnosis = root.ele('Diagnosis');
  diagnosis.ele('Description').txt(formData.diagnosisDescription);
  diagnosis.ele('ICD10Code').txt(formData.icd10Code);

  const procedure = root.ele('Procedure');
  procedure.ele('Description').txt(formData.procedureDescription);
  procedure.ele('Code').txt(formData.procedureCode);

  const otherFees = root.ele('OtherFees');
  otherFees.ele('HospitalServiceFee').txt(formData.hospitalServiceFee);
  otherFees.ele('MedicalPersonnelFee1').txt(formData.medicalPersonnelFee1);
  otherFees.ele('MedicalPersonnelFee2').txt(formData.medicalPersonnelFee2);
  otherFees.ele('MedicalPersonnelFee3').txt(formData.medicalPersonnelFee3);
  otherFees.ele('MedicalPersonnelFee4').txt(formData.medicalPersonnelFee4);

  const totals = root.ele('Totals');
  totals.ele('SubTotal').txt(formData.subTotal);
  totals.ele('GrandTotal').txt(formData.grandTotal);

  const user = root.ele('User');
  user.ele('FullName').txt(formData.userFullName);
  user.ele('Position').txt(formData.userPosition);
  user.ele('PhoneNumber').txt(formData.userPhoneNumber);

  const xml = root.end({ prettyPrint: true });

  const blob = new Blob([xml], { type: 'application/xml' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'MedicalReport.xml';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
