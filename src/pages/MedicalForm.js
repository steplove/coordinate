import React, { useState, useEffect } from "react";
import { BASE_URL } from "../constants/constants";
import {
  Grid,
  TextField,
  Typography,
  Button,
  Card,
  Box,
  Table,
  TableBody,
  Autocomplete,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  IconButton,
  Modal,
} from "@mui/material";
import DeleteForeverSharpIcon from "@mui/icons-material/DeleteForeverSharp";
import Swal from "sweetalert2";
import axios from "axios";

function MedicalForm() {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [open1, setOpen1] = useState(false);
  const handleOpen1 = () => setOpen1(true);
  const handleClose1 = () => setOpen1(false);
  // useEffect(() => {
  //   handleOpen();
  // }, []);
  const [clinic, setClinic] = useState("");
  const [station, setStation] = useState("");
  const [doctor, setDoctor] = useState({
    Doctor_No: "",
    DoctorName: "",
  });
  // const [billNumber, setBillNumber] = useState(1);
  const [invoiceData, setInvoiceData] = useState("");
  const [invNo, setInvNo] = useState("");
  const [serv_date, setServ_date] = useState("");
  const [medications, setMedications] = useState([]);
  const [medication, setMedication] = useState({
    ItemName: "",
    ItemCode: "",
    TMTCode: "",
    DoseCode: "",
    ThItemName: "",
    quantity: "",
    unitPrice: "",
    totalPrice: "",
  });
  console.log(medication);
  const [doseCodes1, setDoseCodes1] = useState({
    DoseCode: "",
    ThItemName: "",
  });

  const [desICDs, setDesICDs] = useState([]);
  const [desICD, setDesICD] = useState({
    des: "",
    code: "",
  });
  const [procedures, setProcedures] = useState([]);
  const [procedure, setProcedure] = useState({
    des: "",
    code: "",
  });
  console.log(procedure);
  const [icdOptions, setIcdOptions] = useState([]);
  const [icdOperation, setICDOperation] = useState([]);
  const [stockMaster, setStockMaster] = useState([]);
  const [doseCodes, setDoseCodes] = useState([]);
  const [idCardNumber, setIdCardNumber] = useState("");
  const [patientData, setPatientData] = useState(null);
  useEffect(() => {
    const fetchMedicationOperation = async () => {
      if (medication && medication.TMTCode && medication.TMTCode.length > 1) {
        try {
          const response = await fetch(
            `${BASE_URL}/api/medication/search?query=${medication.TMTCode}`
          );
          const data = await response.json();
          setStockMaster(data);
        } catch (error) {
          console.error("Error fetching medication operation data:", error);
        }
      }
    };

    fetchMedicationOperation();
  }, [medication]);

  useEffect(() => {
    const fetchDoseCode = async () => {
      if (medication && medication.DoseCode && medication.DoseCode.length > 0) {
        try {
          const response = await fetch(
            `${BASE_URL}/api/dose/search?query=${medication.DoseCode}`
          );
          const data = await response.json();
          setDoseCodes(data);
          // console.log(data);
        } catch (error) {
          console.error("Error fetching dose code data:", error);
        }
      }
    };

    fetchDoseCode();
  }, [medication]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMedication((prev) => ({
      ...prev,
      [name]: value,
    }));
    setDoseCodes1((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleChangeIDCard = (event) => {
    setIdCardNumber(event.target.value);
  };

  const handleChangeDes = (e) => {
    const { name, value } = e.target;
    setDesICD((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddMedication = () => {
    const totalPrice =
      parseFloat(medication.quantity) * parseFloat(medication.unitPrice);

    setMedications((prevMedications) => [
      ...prevMedications,
      { ...medication, totalPrice: totalPrice.toFixed(2) },
    ]);
    setMedication({
      ItemName: "",
      ItemCode: "",
      TMTCode: "",
      quantity: "",
      unitPrice: "",
      totalPrice: "",
    });
    setDoseCodes1({
      DoseCode: "",
      ThItemName: "",
    });
    setStockMaster([]);
    setDoseCodes([]);
  };

  useEffect(() => {
    const fetchICDOptions = async () => {
      if (desICD.code.length > 1) {
        try {
          const response = await fetch(
            `${BASE_URL}/api/ICD/search?query=${desICD.code}`
          );
          const data = await response.json();
          setIcdOptions(data);
        } catch (error) {
          console.error("Error fetching ICD data:", error);
        }
      }
    };
    fetchICDOptions();
  }, [desICD.code]);

  const handleAddDesICD = () => {
    setDesICDs((prev) => [...prev, desICD]);
    setDesICD({
      des: "",
      code: "",
    });
  };
  const handleDeleteDesICD = (index) => {
    const updatedDesICDs = [...desICDs];
    updatedDesICDs.splice(index, 1);
    setDesICDs(updatedDesICDs);
  };
  const handleDeleteMedications = (index) => {
    const updatedDesICDs = [...medications];
    updatedDesICDs.splice(index, 1);
    setMedications(updatedDesICDs);
  };
  const handleDeleteDesprocedures = (index) => {
    const updatedDesICDs = [...procedures];
    updatedDesICDs.splice(index, 1);
    setProcedures(updatedDesICDs);
  };
  const handleICDSelect = (event, value) => {
    if (value) {
      setDesICD({ code: value.ICDCode, des: value.ICD_Name });
    } else {
      setDesICD({ code: "", des: "" });
    }
  };
  const handleMedicationSelect = (event, value) => {
    if (value) {
      setMedication({
        TMTCode: value.TMTCode,
        ItemName: value.ItemName,
        ItemCode: value.StockCode,
      });
    } else {
      setMedication({ TMTCode: "", ItemName: "", ItemCode: "" });
    }
  };
  const handleDOseSelect = (event, value) => {
    if (value) {
      setDoseCodes1({
        DoseCode: value.Code,
        ThItemName: value.ThItemName,
      });
      setMedication({
        ...medication,
        DoseCode: value.Code,
        ThItemName: value.ThItemName,
      });
    } else {
      setDoseCodes1({
        DoseCode: "",
        ThItemName: "",
      });
      setMedication({
        ...medication,
        DoseCode: "",
        ThItemName: "",
      });
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      fetchPatient();
    }
  };

  const handleChangeProcedure = (e) => {
    const { name, value } = e.target;
    setProcedure((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    const fetchICDOperation = async () => {
      if (procedure.code.length > 0) {
        try {
          const response = await fetch(
            `${BASE_URL}/api/ICDOperation/search?query=${procedure.code}`
          );
          const data = await response.json();
          setICDOperation(data);
        } catch (error) {
          console.error("Error fetching ICD operation data:", error);
        }
      }
    };
    fetchICDOperation();
  }, [procedure.code]);

  const handleICDOperationSelect = (event, value) => {
    if (value) {
      setProcedure({ code: value.ICDCmCode1, des: value.ICD_Name });
    } else {
      setProcedure({ code: "", des: "" });
    }
  };

  const handleAddProcedure = () => {
    setProcedures((prev) => [...prev, procedure]);
    setProcedure({
      code: "",
      des: "",
    });
    setICDOperation([]);
  };
  const fetchPatient = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/api/Patient/search?idCardNumber=${idCardNumber}`
      );
      const data = await response.json();

      if (Array.isArray(data) && data.length > 0) {
        setPatientData(data);
        if (!data[0].HN) {
          Swal.fire("กรุณาลงทะเบียนคนไข้ในระบบ SSB");
        }
      } else {
        setPatientData([]);
        Swal.fire("กรุณาลงทะเบียนคนไข้ในระบบ SSB");
      }
    } catch (error) {
      console.error("Error fetching patient data:", error);
      Swal.fire("เกิดข้อผิดพลาดในการค้นหาข้อมูลคนไข้");
    }
  };
  useEffect(() => {
    const fetchInvoiceData = async () => {
      try {
        const response = await fetch(BASE_URL + "/api/InvNo");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();

        // Assuming the invoice number structure is like "A026700002"
        if (data?.length > 0) {
          const latestInvoiceNumber = data[0].InvNo;
          const numericPart = parseInt(latestInvoiceNumber.substring(6), 10);
          const incrementedNumericPart = numericPart + 1;
          const newInvoiceNumber = `${latestInvoiceNumber.substring(
            0,
            6
          )}${incrementedNumericPart.toString().padStart(4, "0")}`;
          setInvNo(newInvoiceNumber);
        }
        setInvoiceData(data);
      } catch (error) {
        console.error("Error fetching invoice data:", error);
      }
    };

    fetchInvoiceData();
  }, []); // Empty dependency array to run only once on mount

  // console.log(invoiceData?.[0]?.InvNo);
  const [values, setValues] = useState({
    serviceFee: 0,
    personnelFee1: 0,
  });

  const handleChangeTotal = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });
  };

  const [info, setInfo] = useState("");
  const calculateTotalAdditionalFees = () => {
    const { serviceFee, personnelFee1 } = values;

    return parseFloat(serviceFee) + parseFloat(personnelFee1);
  };
  // รวมรายการอื่นๆ
  const calculateTotal = () => {
    return Object.values(values).reduce(
      (acc, value) => acc + parseFloat(value || 0),
      0
    );
  };
  const calculatedTotalPrice =
    medication.quantity && medication.unitPrice
      ? parseFloat(medication.quantity) * parseFloat(medication.unitPrice)
      : 0;

  // รวมค่ารายการยาและเวชภัณฑ์
  const calculateMedicationsTotal = () => {
    return medications.reduce((total, med) => {
      return total + parseFloat(med.quantity) * parseFloat(med.unitPrice);
    }, 0);
  };
  const totalAll = calculateTotal() + calculateMedicationsTotal();
  useEffect(() => {
    if (clinic === "41749") {
      setStation("A01");
      setDoctor({
        Doctor_No: "6470",
        DoctorName: "นพ.ละคิด จิรรัตน์สถิต",
      });
    } else if (clinic === "41752") {
      setStation("A02");
      setDoctor({
        Doctor_No: "17858",
        DoctorName: "นพ.กรีธาชัย ศตสุข",
      });
    } else if (clinic === "41751") {
      setStation("A03");
      setDoctor({
        Doctor_No: "49312",
        DoctorName: "นพ.เจนพล  แก้วกิติกุล",
      });
    } else if (clinic === "41750") {
      setStation("A04");
      setDoctor({
        Doctor_No: "15120",
        DoctorName: "นพ.ไชยวัฒน์  ภูติยานันต์",
      });
    } else if (clinic === "43851") {
      setStation("A05");
      setDoctor({
        Doctor_No: "59534",
        DoctorName: "นพ.ชัชวาล  ตั๋นคำ",
      });
    } else if (clinic === "43849") {
      setStation("A06");
      setDoctor({
        Doctor_No: "51283",
        DoctorName: "พญ.นิตยา เนาว์ชมภู",
      });
    } else if (clinic === "43850") {
      setStation("A07");
      setDoctor({
        Doctor_No: "51203",
        DoctorName: "พญ.กนกรัตน์ บุญสัมฤทธิ์ผล",
      });
    } else {
      setStation("");
      setDoctor({
        Doctor_No: "",
        DoctorName: "",
      });
    }
  }, [clinic]);
  const handleSend = async () => {
    try {
      if (clinic === "") {
        handleOpen();
      } else if (idCardNumber === "") {
        handleOpen1();
      } else {
        const diagnosisData = [];

        // จัดเตรียมข้อมูล desICDs
        desICDs.forEach((desICD, index) => {
          diagnosisData.push({
            InvNo: invNo,
            Suffix: index + 1,
            ICDCode: desICD.code,
            ICDName: desICD.des,
            ICDType: "1",
          });
        });

        // จัดเตรียมข้อมูล procedures
        procedures.forEach((procedure, index) => {
          diagnosisData.push({
            InvNo: invNo,
            Suffix: desICDs.length + index + 1, // เริ่มต่อจาก desICDs
            ICDCode: procedure.code,
            ICDName: procedure.des,
            ICDType: "2",
          });
        });
        const data = {
          Station: station,
          Serv_date: serv_date,
          InvNo: invNo,
          Hcode: clinic,
          HN: patientData?.[0]?.HN,
          IDCardNo: idCardNumber,
          Name: patientData?.[0]?.Th_Name || patientData?.[0]?.En_Name,
          Doctor_No: doctor.Doctor_No,
          DoctorName: doctor.DoctorName,
          EntryByUser: info,
        };

        // สร้างข้อมูล medications ที่ต้องการส่ง
        const medicationsData = medications.map((med, index) => ({
          ...med,
          Suffix: index + 1,
          Sv_date: serv_date,
          InvNo: invNo,
        }));
        console.log(medicationsData, "medicationsData", info);
        const response = await axios.post(BASE_URL + "/api/billTrans", data);
        // ส่งข้อมูล medications ไปยัง API ของ Medications
        const responseMedications = await axios.post(
          BASE_URL + "/api/medications",
          { medications: medicationsData }
        );
        const responseDiagnosisProcedure = await axios.post(
          BASE_URL + "/api/diagnosis",
          { diagnosis: diagnosisData }
        );
        if (
          response.status === 200 &&
          responseMedications.status === 200 &&
          responseDiagnosisProcedure.status === 200
        ) {
          // setInvNo("");
          setPatientData(null);
          setIdCardNumber("");
          setServ_date(null);
          Swal.fire({
            title: "ส่งข้อมูลสำเร็จ",
            icon: "success",
          });
          // setBillNumber((prev) => prev + 1);
        } else {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Something went wrongaaaaaaaaaaaa!",
          });
        }
      }
    } catch (error) {
      console.error("Error sending data:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong!",
      });
    }
  };

  return (
    <Box p={3} sx={{ background: "#e0e0e0" }}>
      {/*ส่วนที่1 เลือกคลินิก */}
      <Card variant="outlined" sx={{ padding: 2, zIndex: 9999 }}>
        <FormControl fullWidth>
          <InputLabel id="select-clinic-label">เลือกคลินิก</InputLabel>
          <Select
            labelId="select-clinic-label"
            value={clinic}
            label="เลือกคลินิก"
            onChange={(e) => setClinic(e.target.value)}
          >
            <MenuItem value="41749">กิตรการแพทย์ (41749)</MenuItem>
            <MenuItem value="41752">แม่ขะจานคลินิก (41752)</MenuItem>
            <MenuItem value="41751">คลินิกเวชกรรมแพทย์เจนพล (41751)</MenuItem>
            <MenuItem value="41750">คลินิกหมอไชยวัฒน์ (41750)</MenuItem>
            <MenuItem value="43851">คลินิกเวชกรรมหมอชัชวาล (43851)</MenuItem>
            <MenuItem value="43849">คลินิกเวชกรรมหมอนิตยา (43849)</MenuItem>
            <MenuItem value="43850">
              คลินิกเวชกรรมแพทย์กนกรัตน์ (43850)
            </MenuItem>
          </Select>
        </FormControl>
      </Card>
      {/*ส่วนที่2 หัวเรื่อง */}

      <Card variant="outlined" sx={{ marginTop: 2 }}>
        <Typography
          variant="h5"
          align="center"
          gutterBottom
          sx={{ marginTop: "20px" }}
        >
          แบบแจ้งค่ารักษาพยาบาลผู้ป่วยนอก -{" "}
          {clinic === "41749"
            ? "กิตรการแพทย์"
            : clinic === "41752"
            ? "แม่ขะจานคลินิก"
            : clinic === "41751"
            ? "คลินิกเวชกรรมแพทย์เจนพล"
            : clinic === "41750"
            ? "คลินิกหมอไชยวัฒน์"
            : clinic === "43851"
            ? "คลินิกเวชกรรมหมอชัชวาล"
            : clinic === "43849"
            ? "คลินิกเวชกรรมหมอนิตยา"
            : clinic === "43850"
            ? "คลินิกเวชกรรมแพทย์กนกรัตน์"
            : ""}
        </Typography>

        {/*ส่วนที่3 เลขที่สำคัญการเรียก */}

        <Grid item container spacing={2} p={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="เลขที่สำคัญการเรียกเก็บค่ารักษา"
              variant="standard"
              value={invNo}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="วัน-เวลาที่รับบริการ"
              variant="standard"
              type="date"
              InputLabelProps={{ shrink: true }}
              onChange={(e) => setServ_date(e.target.value)}
            />
          </Grid>
        </Grid>
        {/*ส่วนที่4 ค้นหาผู้ป่วยจากเลขบัตรประชาชน */}
        <Grid item container spacing={2} p={3} md={12} lg={12}>
          <Grid item container spacing={2} p={3} md={12} lg={12}>
            <Grid item xs={12} md={3} lg={3}>
              <TextField
                fullWidth
                label="เลขประชาชน"
                variant="outlined"
                value={idCardNumber}
                onChange={handleChangeIDCard}
                onKeyDown={handleKeyDown}
              />
            </Grid>
            {patientData && patientData.length > 0 ? (
              <>
                <Grid item xs={12} md={3} lg={3}>
                  <TextField
                    fullWidth
                    label="ข้อมูลผู้ป่วย"
                    variant="outlined"
                    value={patientData[0].Th_Name || patientData[0].En_Name}
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={3} lg={3}>
                  <TextField
                    fullWidth
                    label="HN"
                    variant="outlined"
                    value={patientData[0].HN || ""}
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                </Grid>
              </>
            ) : (
              <>
                <Grid item xs={12} md={3} lg={3}>
                  <TextField
                    fullWidth
                    label="ข้อมูลผู้ป่วย"
                    variant="outlined"
                    value=""
                    InputProps={{
                      readOnly: true,
                    }}
                    disabled
                  />
                </Grid>
                <Grid item xs={12} md={3} lg={3}>
                  <TextField
                    fullWidth
                    label="HN"
                    variant="outlined"
                    value=""
                    InputProps={{
                      readOnly: true,
                    }}
                    disabled
                  />
                </Grid>
              </>
            )}

            <Grid item xs={12} md={3} lg={3}>
              <TextField
                fullWidth
                label="HMAIN"
                variant="outlined"
                value="12026"
                InputProps={{
                  readOnly: true,
                }}
                disabled
              />
            </Grid>
            <Grid item xs={12} md={3} lg={3}>
              <TextField
                fullWidth
                label="สิทธิการรักษา"
                variant="outlined"
                value="ประกันสังคม"
                InputProps={{
                  readOnly: true,
                }}
                disabled
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="ชื่อผู้รักษา"
                variant="outlined"
                value={
                  clinic === "41749"
                    ? "นพ.ละคิด จิรรัตน์สถิต"
                    : clinic === "41752"
                    ? "นพ.กรีธาชัย ศตสุข"
                    : clinic === "41751"
                    ? "นพ.เจนพล แก้วกิติกุล"
                    : clinic === "41750"
                    ? "นพ.ไชยวัฒน์ ภูติยานันต์"
                    : clinic === "43851"
                    ? "นพ.ชัชวาล ตั๋นคำ"
                    : clinic === "43849"
                    ? "พญ.นิตยา เนาว์ชมภู"
                    : clinic === "43850"
                    ? "พญ.กนกรัตน์ บุญสัมฤทธิ์ผล"
                    : ""
                }
                disabled
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="รหัส"
                variant="outlined"
                value={
                  clinic === "41749"
                    ? "6470"
                    : clinic === "41752"
                    ? "17858"
                    : clinic === "41751"
                    ? "49312"
                    : clinic === "41750"
                    ? "15120"
                    : clinic === "43851"
                    ? "59534"
                    : clinic === "43849"
                    ? "51283"
                    : clinic === "43850"
                    ? "51203"
                    : ""
                }
                disabled
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
          </Grid>
          {/* <Grid
            item
            container
            spacing={2}
            md={6}
            lg={6}
            sx={{
              minHeight: "100px",
              height: "100px",
            }}
          >
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="ชื่อผู้รักษา"
                variant="outlined"
                value={
                  clinic === "41749"
                    ? "นพ.ละคิด จิรรัตน์สถิต"
                    : clinic === "41752"
                    ? "นพ.กรีธาชัย ศตสุข"
                    : clinic === "41751"
                    ? "นพ.เจนพล แก้วกิติกุล"
                    : clinic === "41750"
                    ? "นพ.ไชยวัฒน์ ภูติยานันต์"
                    : clinic === "43851"
                    ? "นพ.ชัชวาล ตั๋นคำ"
                    : clinic === "43849"
                    ? "พญ.นิตยา เนาว์ชมภู"
                    : clinic === "43850"
                    ? "พญ.กนกรัตน์ บุญสัมฤทธิ์ผล"
                    : ""
                }
                disabled
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="รหัส"
                variant="outlined"
                value={
                  clinic === "41749"
                    ? "6470"
                    : clinic === "41752"
                    ? "17858"
                    : clinic === "41751"
                    ? "49312"
                    : clinic === "41750"
                    ? "15120"
                    : clinic === "43851"
                    ? "59534"
                    : clinic === "43849"
                    ? "51283"
                    : clinic === "43850"
                    ? "51203"
                    : ""
                }
                disabled
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
          </Grid> */}
        </Grid>
      </Card>

      {/*ส่วนที่5 รายการยาและเวชภัณฑ์ที่มิใช่ยา */}
      <Card variant="outlined" sx={{ marginTop: 2 }}>
        <Grid item container spacing={2} p={3} md={12} lg={12}>
          <Grid item container spacing={2} p={3}>
            <Grid item xs={12} md={12}>
              <Typography variant="subtitle1">
                รายการยาและเวชภัณฑ์ที่มิใช่ยา
              </Typography>
              <Grid item container spacing={2}>
                <Grid item xs={12} md={3}>
                  <Autocomplete
                    options={stockMaster}
                    getOptionLabel={(option) =>
                      `${option.TMTCode} ${option.ItemName}${option.StockCode}`
                    }
                    onChange={handleMedicationSelect}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="ค้นหายา"
                        name="TMTCode"
                        value={medication.TMTCode}
                        onChange={handleChange}
                        fullWidth
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField
                    fullWidth
                    name="ItemName"
                    label="ชื่อยา"
                    variant="outlined"
                    value={medication.ItemName}
                    onChange={handleChange}
                    disabled
                  />
                </Grid>
                {/* <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    name="ItemCode"
                    label="StockCode"
                    variant="outlined"
                    value={medication.ItemCode}
                    onChange={handleChange}
                    disabled
                  />
                </Grid> */}
                <Grid item xs={12} md={3}>
                  <Autocomplete
                    options={doseCodes}
                    getOptionLabel={(option) =>
                      `${option.Code} ${option.ThItemName}`
                    }
                    onChange={handleDOseSelect}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="DoseCode"
                        name="DoseCode"
                        variant="outlined"
                        value={doseCodes1.DoseCode}
                        onChange={handleChange}
                        fullWidth
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField
                    fullWidth
                    name="ThItemName"
                    label="DoseName"
                    variant="outlined"
                    value={doseCodes1.ThItemName}
                    onChange={handleChange}
                    disabled
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField
                    fullWidth
                    name="quantity"
                    label="จำนวน"
                    variant="outlined"
                    value={medication.quantity}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField
                    fullWidth
                    name="unitPrice"
                    label="ราคาต่อหน่วย"
                    variant="outlined"
                    value={medication.unitPrice}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} md={5}>
                  <TextField
                    fullWidth
                    label="Total Price"
                    name="totalPrice"
                    variant="outlined"
                    value={calculatedTotalPrice.toFixed(2)}
                    disabled
                  />
                </Grid>
                <Grid item xs={12} md={12}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleAddMedication}
                  >
                    Add
                  </Button>
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12} md={12} sx={{ position: "static" }}>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>ลำดับ</TableCell>
                      <TableCell>รหัส TMT</TableCell>
                      <TableCell>ชื่อยา</TableCell>
                      <TableCell>DoseCode</TableCell>
                      <TableCell>จำนวน</TableCell>
                      <TableCell>ราคาต่อหน่วย</TableCell>
                      <TableCell>จำนวนเงิน</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {medications.length > 0 ? (
                      medications.map((med, index) => (
                        <TableRow key={index}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>{med.TMTCode}</TableCell>
                          <TableCell>{med.ItemName}</TableCell>
                          <TableCell>{med.DoseCode}</TableCell>
                          <TableCell>{med.quantity}</TableCell>
                          <TableCell>{med.unitPrice}</TableCell>
                          <TableCell>{med.totalPrice}</TableCell>
                          <TableCell>
                            <IconButton
                              onClick={() => handleDeleteMedications(index)}
                              aria-label="delete"
                            >
                              <DeleteForeverSharpIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <>
                        <TableRow>
                          <TableCell colSpan={8} align="center">
                            ไม่มีข้อมูล
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell colSpan={8} align="center">
                            ไม่มีข้อมูล
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell colSpan={8} align="center">
                            ไม่มีข้อมูล
                          </TableCell>
                        </TableRow>
                      </>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        </Grid>
      </Card>

      <Card variant="outlined" sx={{ marginTop: 2 }}>
        <Grid item container spacing={2} p={3}>
          <Grid item xs={12} md={12}>
            <Typography variant="subtitle1">Diagnosis</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={3}>
                <Autocomplete
                  options={icdOptions}
                  getOptionLabel={(option) =>
                    `${option.ICDCode}: ${option.ICD_Name}`
                  }
                  onChange={handleICDSelect}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      name="code"
                      label="รหัส ICD-10"
                      variant="outlined"
                      value={desICD.code}
                      onChange={handleChangeDes}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  name="des"
                  label="คำบรรยาย"
                  variant="outlined"
                  value={desICD.des}
                  onChange={handleChangeDes}
                  disabled
                />
              </Grid>
              <Grid item xs={12} md={12}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleAddDesICD}
                >
                  Add
                </Button>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} md={12}>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ลำดับ</TableCell>
                    <TableCell>รหัส ICD-10</TableCell>
                    <TableCell>คำบรรยาย</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {desICDs.length > 0 ? (
                    desICDs.map((des, index) => (
                      <TableRow key={index}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{des.code}</TableCell>
                        <TableCell>{des.des}</TableCell>
                        <TableCell>
                          <IconButton
                            onClick={() => handleDeleteDesICD(index)}
                            aria-label="delete"
                          >
                            <DeleteForeverSharpIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <>
                      <TableRow>
                        <TableCell colSpan={4} align="center">
                          ไม่มีข้อมูล
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell colSpan={4} align="center">
                          ไม่มีข้อมูล
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell colSpan={4} align="center">
                          ไม่มีข้อมูล
                        </TableCell>
                      </TableRow>
                    </>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </Card>
      {/*ส่วนที่6 หัตถการ */}
      <Card variant="outlined" sx={{ marginTop: 2 }}>
        <Grid item container spacing={2} p={3} md={12} lg={12}>
          <Grid item container spacing={2} p={3} md={12} lg={12}>
            <Grid item xs={12} md={12}>
              <Typography variant="subtitle1">Procedure</Typography>
              <Grid item container spacing={2}>
                <Grid item xs={12} md={4}>
                  <Autocomplete
                    options={icdOperation}
                    getOptionLabel={(option) =>
                      `${option.ICDCmCode1}: ${option.ICD_Name}`
                    }
                    onChange={handleICDOperationSelect}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        name="code"
                        label="รหัส หัตถการ"
                        variant="outlined"
                        value={procedure.code}
                        onChange={handleChangeProcedure}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    name="des"
                    label="คำบรรยาย"
                    variant="outlined"
                    value={procedure.des}
                    onChange={handleChangeProcedure}
                    disabled
                  />
                </Grid>
                <Grid item xs={12} md={12}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleAddProcedure}
                  >
                    Add
                  </Button>
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12} md={12}>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>ลำดับ</TableCell>
                      <TableCell>รหัส หัตถการ</TableCell>
                      <TableCell>คำบรรยาย</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {procedures.length > 0 ? (
                      procedures.map((proce, index) => (
                        <TableRow key={index}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>{proce.code}</TableCell>
                          <TableCell>{proce.des}</TableCell>
                          <TableCell>
                            <IconButton
                              onClick={() => handleDeleteDesprocedures(index)}
                              aria-label="delete"
                            >
                              <DeleteForeverSharpIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <>
                        <TableRow>
                          <TableCell colSpan={4} align="center">
                            ไม่มีข้อมูล
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell colSpan={4} align="center">
                            ไม่มีข้อมูล
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell colSpan={4} align="center">
                            ไม่มีข้อมูล
                          </TableCell>
                        </TableRow>
                      </>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
          {/*ส่วนที่7 ค่าบริการทางการพยาบาล */}

          {/* <Grid item container spacing={2} p={3} md={6} lg={6}>
            <Typography variant="subtitle1">รายการอื่น</Typography>
            <Grid item xs={12} md={2}>
              <TextField
                fullWidth
                label="ค่าบริการทางการพยาบาล"
                variant="outlined"
                name="serviceFee"
                value={values.serviceFee}
                onChange={handleChangeTotal}
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <TextField
                fullWidth
                label="ค่าธรรมเนียมบุคลากรทางการแพทย์ 1"
                variant="outlined"
                name="personnelFee1"
                value={values.personnelFee1}
                onChange={handleChangeTotal}
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="ผู้บันทึกข้อมูล"
                variant="outlined"
                name="recorder"
                onChange={(e) => setInfo(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6">รวม {calculateTotal()} บาท</Typography>
            </Grid>
          </Grid> */}
        </Grid>
      </Card>
      {/*ส่วนที่8 ผู้บันทึกข้อมูล */}
      <Card variant="outlined" sx={{ marginTop: 2 }}>
        <Grid item container spacing={2} p={3}>
          <Grid item xs={12} md={2}>
            <TextField
              fullWidth
              label="ค่าบริการทางการพยาบาล"
              variant="outlined"
              name="serviceFee"
              value={values.serviceFee}
              onChange={handleChangeTotal}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <TextField
              fullWidth
              label="ค่าธรรมเนียมบุคลากรทางการแพทย์"
              variant="outlined"
              name="personnelFee1"
              value={values.personnelFee1}
              onChange={handleChangeTotal}
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="ผู้บันทึกข้อมูล"
              variant="outlined"
              name="recorder"
              onChange={(e) => setInfo(e.target.value)}
            />
          </Grid>
          {/* <Grid item xs={12}>
              <Typography variant="h6">รวม {calculateTotal()} บาท</Typography>
            </Grid> */}
        </Grid>
        <Grid
          container
          spacing={2}
          item
          p={3}
          md={12}
          lg={12}
          sx={{
            justifyContent: "center",
            alignContent: "center",
          }}
        >
          {/* <Grid item xs={12} md={1}>
            <TextField
              fullWidth
              label="ค่าบริการทางการพยาบาล"
              variant="outlined"
              name="serviceFee"
              value={values.serviceFee}
              onChange={handleChangeTotal}
            />
          </Grid>
          <Grid item xs={12} md={1}>
            <TextField
              fullWidth
              label="ค่าธรรมเนียมบุคลากรทางการแพทย์ 1"
              variant="outlined"
              name="personnelFee1"
              value={values.personnelFee1}
              onChange={handleChangeTotal}
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="ผู้บันทึกข้อมูล"
              variant="outlined"
              name="recorder"
              value={info.recorder}
              onChange={handleInfoChange}
            />
          </Grid> */}
        </Grid>
        <Grid item xs={12} align="center">
          <Typography variant="h6">รวม {totalAll} บาท</Typography>
        </Grid>
        <Grid item xs={12} align="center" sx={{ padding: "20px" }}>
          <Button variant="contained" color="primary" onClick={handleSend}>
            บันทึก
          </Button>
        </Grid>
      </Card>

      <>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
        >
          <Grid
            container
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "80%",
              maxWidth: 400,
              bgcolor: "#f0f0ff",
              boxShadow: 24,
              borderRadius: 4,
              p: 4,
              border: "none",
            }}
          >
            <Typography id="modal-title" variant="h6" component="h2">
              กรุณาเลือกคลินิกก่อน
            </Typography>
            <Typography id="modal-description" sx={{ mt: 2 }}>
              โปรดเลือกคลินิกก่อนที่จะดำเนินการต่อ
            </Typography>
            <Grid container justifyContent="flex-end" sx={{ mt: 2 }}>
              <Button onClick={handleClose}>ปิด</Button>
            </Grid>
          </Grid>
        </Modal>
        <Modal
          open={open1}
          onClose={handleClose1}
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
        >
          <Grid
            container
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "80%",
              maxWidth: 400,
              bgcolor: "#f0f0ff",
              boxShadow: 24,
              borderRadius: 4,
              p: 4,
              border: "none",
            }}
          >
            <Typography id="modal-title" variant="h6" component="h2">
              กรุณากรอกเลขบัตรประชาชน
            </Typography>
            <Typography id="modal-description" sx={{ mt: 2 }}>
              โปรดกรอกเลขบัตรประชาชนก่อนที่จะดำเนินการต่อ
            </Typography>
            <Grid container justifyContent="flex-end" sx={{ mt: 2 }}>
              <Button onClick={handleClose1}>ปิด</Button>
            </Grid>
          </Grid>
        </Modal>
      </>
    </Box>
  );
}

export default MedicalForm;
