import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarExport,
} from "@mui/x-data-grid";
import {
  Button,
  Stack,
  Typography,
  Box,
  Paper,
  AppBar,
  Toolbar,
  IconButton,
  Modal,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slide,
  Dialog,
  Grid,
  Card,
  Autocomplete,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableBody,
  Table,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { BASE_URL, token } from "../constants/constants";
// import CloudUploadIcon from "@mui/icons-material/CloudUpload";
// import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
// import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Swal from "sweetalert2";
import DeleteForeverSharpIcon from "@mui/icons-material/DeleteForeverSharp";
import ExcelImport from "../components/ExcelImport";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function ReportHistory() {
  const [rows, setRows] = useState([]);
  // const [view, setView] = useState("export");
  const [billTransRows, setBillTransRows] = useState("");
  const [billItemsRows, setBillItemsRows] = useState("");
  const [billDiagRows, setBillDiagRows] = useState("");
  const [billDiagRows1, setBillDiagRows1] = useState("");
  const [editData, setEditData] = useState(null);
  const [clinic, setClinic] = useState("");
  const [open, setOpen] = useState(false);
  // const [invNo, setInvNo] = useState("");
  const [serv_date, setServ_date] = useState("");
  const [idCardNumber, setIdCardNumber] = useState("");
  const [patientData, setPatientData] = useState(null);
  const [station, setStation] = useState("");
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
  const [icdOptions, setIcdOptions] = useState([]);
  const [icdOperation, setICDOperation] = useState([]);
  const [stockMaster, setStockMaster] = useState([]);
  const [doseCodes, setDoseCodes] = useState([]);
  const [info, setInfo] = useState("");
  const [values, setValues] = useState({
    serviceFee: 0,
    personnelFee1: 0,
  });
  // const [doctor, setDoctor] = useState({
  //   Doctor_No: "",
  //   DoctorName: "",
  // });
  const [open1, setOpen1] = useState(false);
  const handleOpen1 = () => setOpen1(true);
  const handleClose1 = () => setOpen1(false);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChangeIDCard = (event) => {
    setIdCardNumber(event.target.value);
  };
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      fetchPatient();
    }
  };
  const handleChangeTotal = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });
  };
  const fetchPatient = async () => {
    try {
      if (!clinic) {
        handleOpen1();
      } else {
        setTimeout(() => {
          Swal.fire({
            title: "กำลังค้นหาข้อมูล",
            text: `ค้นหาข้อมูลจากเลขบัตรประชาชน ${idCardNumber}`,
            allowOutsideClick: false,
            didOpen: () => {
              Swal.showLoading();
            },
          });
        }, 100);

        await new Promise((resolve) => setTimeout(resolve, 2000));

        const response = await fetch(
          `${BASE_URL}/api/Patient/search?idCardNumber=${idCardNumber}&station=${station}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        console.log(data[0].HN, "data");

        Swal.close();

        if (Array.isArray(data) && data.length > 0) {
          setPatientData(data);
          if (!data[0].HN) {
            Swal.fire("กรุณาลงทะเบียนคนไข้ในระบบ ลงทะเบียนผู้ป่วย");
          }
        } else {
          setPatientData([]);
          Swal.fire("กรุณาลงทะเบียนคนไข้ในระบบ ลงทะเบียนผู้ป่วย");
        }
      }
    } catch (error) {
      console.error("Error fetching patient data:", error);

      // Close loading alert
      Swal.close();

      Swal.fire("กรุณาลงทะเบียนคนไข้ในระบบ ลงทะเบียนผู้ป่วย");
    }
  };
  useEffect(() => {
    axios
      .get(BASE_URL + "/api/getAllBill_Trans", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        const fetchedRows = response.data.map((item, index) => ({
          id: index + 1,
          station: item.Station,
          servDate: new Date(item.Serv_Date).toLocaleString(),
          invNo: item.InvNo,
          hcode: item.Hcode,
          hn: item.HN,
          entryByUser: item.EntryByUser || "ไม่รู้จัก",
          status: item.Status_Bill,
        }));
        setRows(fetchedRows);
        console.log(fetchedRows);
      });
  }, []);
  useEffect(() => {
    const fetchMedicationOperation = async () => {
      if (medication && medication.TMTCode && medication.TMTCode.length >= 1) {
        try {
          const response = await fetch(
            `${BASE_URL}/api/medication/search?query=${medication.TMTCode}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
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
            `${BASE_URL}/api/dose/search?query=${medication.DoseCode}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
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
    setEditData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
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
    setSelectedMedication(null);
    setSelectedDOse(null);
  };

  useEffect(() => {
    const fetchICDOptions = async () => {
      if (desICD.code.length > 1) {
        try {
          const response = await fetch(
            `${BASE_URL}/api/ICD/search?query=${desICD.code}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
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
  const [selectedMedication, setSelectedMedication] = useState(null);
  const [selectedDOse, setSelectedDOse] = useState(null);
  const handleAddDesICD = () => {
    setDesICDs((prev) => [...prev, desICD]);
    setDesICD({
      des: "",
      code: "",
    });
    setSelectedICDDiagnosis(null);
  };
  const handleDeleteDesICD = (index) => {
    const updatedDesICDs = [...desICDs];
    updatedDesICDs.splice(index, 1);
    setDesICDs(updatedDesICDs);
  };
  // ฟังก์ชันลบรายการจาก medications
  const handleDeleteMedications = (index) => {
    const updatedDesICDs = [...medications];
    updatedDesICDs.splice(index, 1);
    setMedications(updatedDesICDs);
    console.log("ลบแล้ว");
  };

  // ฟังก์ชันลบรายการจาก billItemsRows ผ่าน API
  const handleDeleteBillItem = async (id) => {
    try {
      await axios.delete(BASE_URL + `/api/deleteBillItem/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("ลบข้อมูลสำเร็จ");
      // หลังจากลบจาก API สำเร็จ, อัปเดต state
      const updatedBillItemsRows = billItemsRows.filter(
        (item) => item.id !== id
      );
      setBillItemsRows(updatedBillItemsRows);
    } catch (error) {
      console.error("Error deleting bill item:", error);
      alert("ลบข้อมูลไม่สำเร็จ");
    }
  };
  const handleDeleteDesprocedures = (index) => {
    const updatedDesICDs = [...procedures];
    updatedDesICDs.splice(index, 1);
    setProcedures(updatedDesICDs);
  };
  const [selectedICDDiagnosis, setSelectedICDDiagnosis] = useState(null);
  const handleICDSelect = (event, value) => {
    setSelectedICDDiagnosis(value);
    if (value) {
      setDesICD({ code: value.ICDCode, des: value.ICD_Name });
    } else {
      setDesICD({ code: "", des: "" });
    }
  };

  const handleMedicationSelect = (event, value) => {
    setSelectedMedication(value);
    if (value) {
      setMedication({
        TMTCode: value.TMTCode,
        ItemName: value.ItemName,
        ItemCode: value.StockCode,
        StockComposeCategory: value.StockComposeCategory,
        UnitCode: value.UnitCode,
      });
    } else {
      setMedication({
        TMTCode: "",
        ItemName: "",
        ItemCode: "",
        StockComposeCategory: "",
        UnitCode: "",
      });
    }
  };
  const handleDOseSelect = (event, value) => {
    setSelectedDOse(value);
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
            `${BASE_URL}/api/ICDOperation/search?query=${procedure.code}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
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
  const [selectedICDOperation, setSelectedICDOperation] = useState(null);
  const handleICDOperationSelect = (event, value) => {
    setSelectedICDOperation(value);
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
    setSelectedICDOperation(null);
    setICDOperation("");
    setICDOperation(null);
    setICDOperation([]);
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
  const calculateTotal = () => {
    return Object.values(values).reduce(
      (acc, value) => acc + parseFloat(value || 0),
      0
    );
  };
  const totalAll = calculateTotal() + calculateMedicationsTotal();

  const columns = [
    { field: "id", headerName: "ID", flex: 0.5, minWidth: 80 },
    { field: "station", headerName: "คลินิก", flex: 1, minWidth: 120 },
    {
      field: "servDate",
      headerName: "วันที่รับบริการ",
      flex: 1.5,
      minWidth: 180,
    },
    { field: "invNo", headerName: "Invoice No", flex: 1, minWidth: 150 },
    { field: "entryByUser", headerName: "ผู้บันทึก", flex: 1, minWidth: 150 },
    {
      field: "status",
      headerName: "สถานะ",
      flex: 1,
      minWidth: 120,
      renderCell: (params) => {
        const statusText = params.value === "A" ? "สำเร็จ" : "ไม่สำเร็จ";
        const statusColor = params.value === "A" ? "green" : "red";

        return (
          <Typography
            sx={{
              color: statusColor,
              fontWeight: "bold",
              marginTop: "13px",
            }}
          >
            {statusText}
          </Typography>
        );
      },
    },
    {
      field: "actions",
      headerName: "เครื่องมือ",
      flex: 0.8,
      minWidth: 120,
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          <IconButton size="small" onClick={() => handleEdit(params.row)}>
            <EditIcon />
          </IconButton>
          {/* <IconButton
            size="small"
            color="error"
            onClick={() => handleDelete(params.row.id)}
          >
            <DeleteIcon />
          </IconButton> */}
        </Stack>
      ),
    },
  ];

  // const calculateFees = (items) => {
  //   const serviceFee = items
  //     .filter((item) => item.ItemName === "ค่าบริการทางการพยาบาล")
  //     .reduce((acc, item) => acc + (item.TotalAmont || 0), 0);

  //   const personnelFee1 = items
  //     .filter((item) => item.ItemName === "ค่าธรรมเนียมบุคลากรทางการแพทย์")
  //     .reduce((acc, item) => acc + (item.TotalAmont || 0), 0);

  //   setValues({
  //     serviceFee,
  //     personnelFee1,
  //   });
  // };

  const handleEdit = (row) => {
    // console.log("Selected row:", row);
    setEditData(row);
    handleClickOpen();

    const invNo = row.invNo;
    const HN = row.hn;

    if (HN) {
      fetchBill_Trans(HN, invNo);
    } else {
      console.error("Error: HN is missing in the selected row.");
    }
    if (invNo) {
      fetchBill_Items(invNo);
      fetchBill_Diag(invNo);
    } else {
      console.error("Error: InvNo is missing in the selected row.");
    }
  };
  const fetchBill_Trans = (HN, invNo) => {
    if (!HN || !invNo) {
      console.error("Error: HN or InvNo is null or undefined.");
      return;
    }

    axios
      .get(`${BASE_URL}/api/getBill_Trans/${HN}/${invNo}`)
      .then((response) => {
        const fetchedRows = response.data.map((item, index) => ({
          id: index + 1,
          InvNo: item.InvNo,
          Serv_Date: item.Serv_Date,
          HN: item.HN,
          Hcode: item.Hcode,
          IDCardNo: item.IDCardNo,
          PatientName: item.PatientName,
          DoctorName: item.DoctorName,
          EntryByUser: item.EntryByUser,
        }));
        setBillTransRows(fetchedRows);
        console.log(fetchedRows, "fetchedRows");
        if (fetchedRows.length > 0) {
          setInfo(fetchedRows[0].EntryByUser);
        }
      })
      .catch((error) => {
        console.error("Error fetching Bill Transactions:", error);
      });
  };

  const fetchBill_Items = (invNo) => {
    if (!invNo) {
      console.error("Error: InvNo is null or undefined.");
      return;
    }

    axios
      .get(`${BASE_URL}/api/getAllBill_Items/${invNo}`)
      .then((response) => {
        const fetchedRows = response.data.map((item, index) => ({
          id: index + 1,
          InvNo: item.InvNo,
          Suffix: item.Suffix,
          ItemCode: item.ItemCode,
          ItemName: item.ItemName,
          TMTCode: item.TMTCode,
          DoseCode: item.DoseCode,
          Qty: item.Qty,
          UnitPrice: item.UnitPrice,
          TotalAmont: item.TotalAmont,
        }));
        const serviceItems = fetchedRows.filter(
          (item) => item.ItemName === "ค่าบริการทางการแพทย์"
        );
        const serviceItems1 = fetchedRows.filter(
          (item) => item.ItemName === "ค่าธรรมเนียมบุคลาการทางการแพทย์"
        );
        const totalServiceFee = serviceItems.reduce(
          (sum, item) => sum + item.TotalAmont,
          0
        );
        const totalPersonnelFee = serviceItems1.reduce(
          (sum, item) => sum + item.TotalAmont,
          0
        );
        console.log(totalPersonnelFee, "totalPersonnelFee");

        setValues((prev) => ({
          ...prev,
          serviceFee: totalServiceFee,
          personnelFee1: totalPersonnelFee,
        }));
        setBillItemsRows(fetchedRows);
      })
      .catch((error) => {
        console.error("Error fetching Bill Items:", error);
      });
  };

  const fetchBill_Diag = (invNo) => {
    if (!invNo) {
      console.error("Error: InvNo is null or undefined.");
      return;
    }

    axios
      .get(`${BASE_URL}/api/getAllBill_Diag/${invNo}`)
      .then((response) => {
        const fetchedRows = response.data.map((item, index) => ({
          id: index + 1,
          InvNo: item.InvNo,
          Suffix: item.Suffix,
          ICDCode: item.ICDCode,
          ICDName: item.ICDName,
          hn: item.HN,
          ICDType: item.ICDType,
        }));
        const suffix1Rows = fetchedRows.filter((row) => row.ICDType === "1");
        const suffix2Rows = fetchedRows.filter((row) => row.ICDType === "2");
        setBillDiagRows(suffix1Rows);
        setBillDiagRows1(suffix2Rows);
      })
      .catch((error) => {
        console.error("Error fetching Bill Diagnosis:", error);
      });
  };

  // const handleDelete = (id) => {
  //   setRows((prevRows) => prevRows.filter((row) => row.id !== id));
  // };

  const handleSave = async () => {
    const updatedData = {
      invNo: billTransRows[0]?.InvNo,
      servDate: billTransRows[0].Serv_Date,
      idCardNo: billTransRows[0]?.IDCardNo || patientData[0]?.IDCardNo,
      patientName: billTransRows[0]?.PatientName || patientData[0]?.FirstName,
      hn: billTransRows[0]?.HN || patientData[0]?.HN,
      doctorName: billTransRows[0]?.DoctorName,
      hcode: billTransRows[0]?.Hcode,
      medications: [
        ...billItemsRows.map((medication) => ({
          id: medication.id || null,
          InvNo: medication.InvNo || billTransRows[0]?.InvNo,
          Suffix: medication.Suffix || 0,
          ItemCode: medication.ItemCode || "",
          ItemName: medication.ItemName || "",
          TMTCode: medication.TMTCode || "",
          DoseCode: medication.DoseCode || "",
          Qty: medication.Qty || 1,
          UnitPrice: medication.UnitPrice || 0,
          TotalAmont: medication.TotalAmont || 0,
        })),
        ...medications.map((medication) => ({
          id: medication.id || null,
          InvNo: medication.InvNo || billTransRows[0]?.InvNo,
          Suffix: medication.Suffix || 0,
          ItemCode: medication.ItemCode || "",
          ItemName: medication.ItemName || "",
          TMTCode: medication.TMTCode || "",
          DoseCode: medication.DoseCode || "",
          Qty: medication.quantity || 1,
          UnitPrice: medication.unitPrice || 0,
          TotalAmont: medication.totalPrice || 0,
        })),
      ],
      diagnosis: [
        ...billDiagRows.map((diag) => ({
          InvNo: billTransRows[0]?.InvNo,
          Suffix: diag.Suffix,
          ICDCode: diag.ICDCode,
          ICDName: diag.ICDName,
          ICDType: diag.ICDType,
        })),
        ...desICDs.map((desICD, index) => ({
          InvNo: billTransRows[0]?.InvNo,
          Suffix: index + 1,
          ICDCode: desICD.code,
          ICDName: desICD.des,
          ICDType: "1",
        })),
      ],
      procedures: [
        ...billDiagRows1.map((proc) => ({
          InvNo: billTransRows[0]?.InvNo,
          Suffix: proc.Suffix,
          ICDCode: proc.ICDCode,
          ICDName: proc.ICDName,
          ICDType: proc.ICDType,
        })),
        ...procedures.map((procedure, index) => ({
          InvNo: billTransRows[0]?.InvNo,
          Suffix: desICDs.length + index + 1,
          ICDCode: procedure.code,
          ICDName: procedure.des,
          ICDType: "2",
        })),
      ],
    };

    try {
      const response = await axios.put(
        BASE_URL + "/api/updateReport",
        updatedData
      );

      if (response.status === 200) {
        alert("อัปเดตข้อมูลสำเร็จ");
        handleClose();
      } else {
        alert("เกิดข้อผิดพลาดในการอัปเดตข้อมูล");
      }
    } catch (error) {
      console.error("Error updating data:", error);
      alert("เกิดข้อผิดพลาดในการอัปเดตข้อมูล");
    }
  };

  const formatDateTime = (date) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toISOString().slice(0, 16);
  };
  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ p: 2 }}>
        <ExcelImport />
        <DataGrid
          rows={rows}
          columns={columns}
          autoHeight
          disableSelectionOnClick
          components={{
            Toolbar: () => (
              <GridToolbarContainer>
                <GridToolbarExport />
              </GridToolbarContainer>
            ),
          }}
        />
      </Paper>

      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
        scroll="paper"
        sx={{
          "& .MuiDialog-paper": {
            maxWidth: "70%",
            margin: "auto",
            backgroundColor: "gray",
          },
        }}
      >
        <AppBar sx={{ position: "relative" }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClose={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              แก้ไข {editData?.invNo}
            </Typography>
            <Button autoFocus color="inherit" onClose={handleClose}>
              save
            </Button>
          </Toolbar>
        </AppBar>
        {/*ส่วนที่1 เลือกคลินิก */}
        <div
          style={{
            overflowY: "auto",
          }}
        >
          <Card variant="outlined" sx={{ padding: 2, zIndex: 9999 }}>
            <FormControl fullWidth sx={{ marginTop: "10px" }}>
              <InputLabel id="select-clinic-label">เลือกคลินิก</InputLabel>
              <Select
                labelId="select-clinic-label"
                value={
                  billTransRows.length > 0 ? billTransRows[0].Hcode : clinic
                }
                label="เลือกคลินิก"
                onChange={(e) => setClinic(e.target.value)}
              >
                <MenuItem value="41749">กิตรการแพทย์ (41749)</MenuItem>
                <MenuItem value="41752">แม่ขะจานคลินิก (41752)</MenuItem>
                <MenuItem value="41751">
                  คลินิกเวชกรรมแพทย์เจนพล (41751)
                </MenuItem>
                <MenuItem value="41750">คลินิกหมอไชยวัฒน์ (41750)</MenuItem>
                <MenuItem value="43851">
                  คลินิกเวชกรรมหมอชัชวาล (43851)
                </MenuItem>
                <MenuItem value="43849">คลินิกเวชกรรมหมอนิตยา (43849)</MenuItem>
                <MenuItem value="43850">
                  คลินิกเวชกรรมแพทย์กนกรัตน์ (43850)
                </MenuItem>
              </Select>
            </FormControl>
          </Card>

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
                  value={billTransRows.length > 0 ? billTransRows[0].InvNo : ""}
                  variant="standard"
                  disabled
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="วัน-เวลาที่รับบริการ"
                  variant="standard"
                  type="datetime-local"
                  InputLabelProps={{ shrink: true }}
                  value={
                    billTransRows.length > 0
                      ? formatDateTime(billTransRows[0].Serv_Date)
                      : ""
                  }
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
                    value={
                      billTransRows.length > 0 ? billTransRows[0].IDCardNo : ""
                    }
                    onChange={handleChangeIDCard}
                    onKeyDown={handleKeyDown}
                  />
                </Grid>
                {billTransRows.length > 0 ? (
                  <>
                    <Grid item xs={12} md={3} lg={3}>
                      <TextField
                        fullWidth
                        label="ข้อมูลผู้ป่วย"
                        variant="outlined"
                        value={billTransRows[0].PatientName || ""}
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
                        value={billTransRows[0].HN || ""}
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
                        value={
                          patientData && patientData.length > 0
                            ? patientData[0].FirstName
                            : ""
                        }
                        InputProps={{
                          readOnly: true,
                        }}
                        disabled={!patientData || patientData.length === 0}
                      />
                    </Grid>
                    <Grid item xs={12} md={3} lg={3}>
                      <TextField
                        fullWidth
                        label="HN"
                        variant="outlined"
                        value={
                          patientData && patientData.length > 0
                            ? patientData[0].HN
                            : ""
                        }
                        InputProps={{
                          readOnly: true,
                        }}
                        disabled={!patientData || patientData.length === 0}
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
                      billTransRows.length > 0
                        ? billTransRows[0].DoctorName
                        : clinic === "41749"
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
                      billTransRows.length > 0
                        ? billTransRows[0].Hcode
                        : clinic === "41749"
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
                          `${option.TMTCode} ${option.ItemName}${option.StockCode}${option.StockComposeCategory}${option.UnitCode}`
                        }
                        value={selectedMedication}
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
                    <Grid item xs={12} md={3}>
                      <Autocomplete
                        options={doseCodes}
                        getOptionLabel={(option) =>
                          `${option.Code} ${option.ThItemName}`
                        }
                        value={selectedDOse}
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
                        {[...billItemsRows, ...medications].filter(
                          (med) =>
                            ![
                              "ค่าบริการทางการแพทย์",
                              "ค่าธรรมเนียมบุคลาการทางการแพทย์",
                            ].includes(med.ItemName)
                        ).length > 0 ? (
                          [...billItemsRows, ...medications]
                            .filter(
                              (med) =>
                                ![
                                  "ค่าบริการทางการแพทย์",
                                  "ค่าธรรมเนียมบุคลาการทางการแพทย์",
                                ].includes(med.ItemName)
                            )
                            .map((med, index) => (
                              <TableRow key={index}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>
                                  {med.TMTCode || med.TMTCode}
                                </TableCell>
                                <TableCell>
                                  {med.ItemName || med.ItemName}
                                </TableCell>
                                <TableCell>
                                  {med.DoseCode || med.DoseCode}
                                </TableCell>
                                <TableCell>
                                  {med.Qty || med.quantity || 0}
                                </TableCell>
                                <TableCell>
                                  {med.UnitPrice || med.unitPrice || 0}
                                </TableCell>
                                <TableCell>
                                  {med.TotalAmount || med.totalPrice || 0}
                                </TableCell>
                                <TableCell>
                                  {index < billItemsRows.length ? (
                                    // ข้อมูลจาก billItemsRows - ลบจากฐานข้อมูล
                                    <IconButton
                                      onClick={() =>
                                        handleDeleteBillItem(med.TMTCode)
                                      }
                                      aria-label="delete"
                                    >
                                      <DeleteForeverSharpIcon />
                                    </IconButton>
                                  ) : (
                                    // ข้อมูลที่เพิ่มใหม่ - ลบจาก state medications
                                    <IconButton
                                      onClick={() =>
                                        handleDeleteMedications(med.TMTCode)
                                      }
                                      aria-label="delete"
                                    >
                                      <DeleteForeverSharpIcon />
                                    </IconButton>
                                  )}
                                </TableCell>
                              </TableRow>
                            ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={8} align="center">
                              ไม่มีข้อมูล
                            </TableCell>
                          </TableRow>
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
                      value={selectedICDDiagnosis}
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
                      {[...billDiagRows, ...desICDs].length > 0 ? (
                        [...billDiagRows, ...desICDs].map((diag, index) => (
                          <TableRow key={index}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>{diag.ICDCode || diag.code}</TableCell>
                            <TableCell>{diag.ICDName || diag.des}</TableCell>
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
                        <TableRow>
                          <TableCell colSpan={4} align="center">
                            ไม่มีข้อมูล
                          </TableCell>
                        </TableRow>
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
                        value={selectedICDOperation}
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
                        {[...billDiagRows1, ...procedures].length > 0 ? (
                          [...billDiagRows1, ...procedures].map(
                            (item, index) => (
                              <TableRow key={index}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>
                                  {item.ICDCode || item.code}
                                </TableCell>
                                <TableCell>
                                  {item.ICDName || item.des}
                                </TableCell>
                                <TableCell>
                                  <IconButton
                                    onClick={() =>
                                      handleDeleteDesprocedures(index)
                                    }
                                    aria-label="delete"
                                  >
                                    <DeleteForeverSharpIcon />
                                  </IconButton>
                                </TableCell>
                              </TableRow>
                            )
                          )
                        ) : (
                          <TableRow>
                            <TableCell colSpan={4} align="center">
                              ไม่มีข้อมูล
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              </Grid>
              {/*ส่วนที่7 ค่าบริการทางการพยาบาล */}
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
                  value={
                    values.serviceFee !== undefined ? values.serviceFee : ""
                  }
                  onChange={handleChangeTotal}
                />
              </Grid>
              <Grid item xs={12} md={2}>
                <TextField
                  fullWidth
                  label="ค่าธรรมเนียมบุคลากรทางการแพทย์"
                  variant="outlined"
                  name="personnelFee1"
                  value={
                    values.personnelFee1 !== undefined
                      ? values.personnelFee1
                      : ""
                  }
                  onChange={handleChangeTotal}
                />
              </Grid>

              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="ผู้บันทึกข้อมูล"
                  variant="outlined"
                  name="recorder"
                  value={info}
                  onChange={(e) => setInfo(e.target.value)}
                />
              </Grid>
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
            ></Grid>
            <Grid item xs={12} align="center">
              <Typography variant="h6">รวม {totalAll} บาท</Typography>
            </Grid>
            <Grid item xs={12} align="center" sx={{ padding: "20px" }}>
              <Button variant="contained" color="primary" onClick={handleSave}>
                บันทึก
              </Button>
            </Grid>
          </Card>
        </div>
      </Dialog>
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
            กรุณาเลือกคลินิกก่อน
          </Typography>
          <Typography id="modal-description" sx={{ mt: 2 }}>
            โปรดเลือกคลินิกก่อนที่จะดำเนินการต่อ
          </Typography>
          <Grid container justifyContent="flex-end" sx={{ mt: 2 }}>
            <Button onClick={handleClose1}>ปิด</Button>
          </Grid>
        </Grid>
      </Modal>
    </Box>
  );
}

export default ReportHistory;
