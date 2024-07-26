import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import {
  Card,
  CardContent,
  CardHeader,
  TextField,
  Button,
  Grid,
  MenuItem,
  Typography,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import { BASE_URL, token } from "../constants/constants";

const PatientRegistration = () => {
  const [patientInfo, setPatientInfo] = useState({
    HN: "",
    idCard: "",
    firstName: "",
    gender: "",
    birthDate: "",
    phone: "",
  });
  const [clinic, setClinic] = useState("");
  const [station, setStation] = useState("");
  useEffect(() => {
    const fetchCurrentHN = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/api/current-hn?station=${station}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        if (data.success) {
          const nextHN = generateNextHN(data.HN, station);
          setPatientInfo((prevInfo) => ({
            ...prevInfo,
            HN: nextHN,
          }));
        } else {
          console.error("Error:", data.error);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchCurrentHN();
  }, [station]);

  useEffect(() => {
    if (clinic === "41749") {
      setStation("A01");
    } else if (clinic === "41752") {
      setStation("A02");
    } else if (clinic === "41751") {
      setStation("A03");
    } else if (clinic === "41750") {
      setStation("A04");
    } else if (clinic === "43851") {
      setStation("A05");
    } else if (clinic === "43849") {
      setStation("A06");
    } else if (clinic === "43850") {
      setStation("A07");
    } else {
      setStation("");
    }
  }, [clinic]);
  const checkDuplicateIdCard = async (idCard) => {
    try {
      const response = await fetch(
        `${BASE_URL}/api/check-id-card?idCard=${idCard}&station=${station}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      return data.exists; // assume the API returns { exists: true/false }
    } catch (error) {
      console.error("Error checking duplicate ID card:", error);
      return false;
    }
  };

  const handleChange = (e) => {
    setPatientInfo({
      ...patientInfo,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    if (!/^\d{10}$/.test(patientInfo.phone)) {
      Swal.fire({
        icon: "error",
        title: "ข้อมูลไม่ถูกต้อง",
        text: "เบอร์โทรศัพท์ต้องเป็นตัวเลข 10 หลัก",
      });
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const isDuplicate = await checkDuplicateIdCard(patientInfo.idCard, station);
    if (isDuplicate) {
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: "เลขบัตรประชาชนนี้ถูกใช้ในสถานีนี้แล้ว",
      });
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/api/patients`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...patientInfo, station }),
      });

      const data = await response.json();
      if (data.success) {
        Swal.fire({
          icon: "success",
          title: "สำเร็จ",
          text: "เพิ่มข้อมูลสำเร็จ",
        });
        setPatientInfo({
          HN: "",
          idCard: "",
          firstName: "",
          gender: "",
          birthDate: "",
          phone: "",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "เกิดข้อผิดพลาด",
          text: "เกิดข้อผิดพลาด: กรุณาติดต่อ ICT",
        });
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const generateNextHN = (currentHN, station) => {
    if (!currentHN || !station) return `${station}-00001`;
    const prefix = station;
    const number = parseInt(currentHN.slice(4), 10);
    return `${prefix}-${(number + 1).toString().padStart(5, "0")}`;
  };
  const getMaxDate = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };
  return (
    <Grid container justifyContent="center" style={{ marginTop: 20 }}>
      <Grid item xs={12} sm={8} md={6}>
        <Card variant="outlined" sx={{ padding: 2, zIndex: 9999 }}>
          <CardHeader title="ลงทะเบียนผู้ป่วย" />

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
        <Card mt={3} sx={{ marginTop: "20px" }}>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="HN"
                  variant="outlined"
                  name="HN"
                  value={patientInfo.HN}
                  onChange={handleChange}
                  disabled
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="เลขบัตรประชาชน"
                  variant="outlined"
                  name="idCard"
                  value={patientInfo.idCard}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="ชื่อ"
                  variant="outlined"
                  name="firstName"
                  value={patientInfo.firstName}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="เพศ"
                  variant="outlined"
                  name="gender"
                  value={patientInfo.gender}
                  onChange={handleChange}
                  select
                >
                  <MenuItem value="ชาย">ชาย</MenuItem>
                  <MenuItem value="หญิง">หญิง</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="วันเกิด"
                  variant="outlined"
                  name="birthDate"
                  value={patientInfo.birthDate}
                  onChange={handleChange}
                  type="date"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{ max: getMaxDate() }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="เบอร์โทร"
                  variant="outlined"
                  name="phone"
                  value={patientInfo.phone}
                  onChange={handleChange}
                  inputProps={{ maxLength: 10 }} // Limits input to 10 characters
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  onClick={handleSubmit}
                >
                  บันทึก
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default PatientRegistration;
