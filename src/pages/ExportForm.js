import React, { useState, useEffect } from "react";
import {
  TextField,
  Typography,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Container,
} from "@mui/material";
import Swal from "sweetalert2";
import axios from "axios";
import { BASE_URL } from "../constants/constants";
import CryptoJS from "crypto-js";

function ExportForm() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState("");
  const [clinic, setClinic] = useState("");
  const [station, setStation] = useState("");

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

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const handleExport = async () => {
    const showProgress = (percentage) => {
      const progressBar = document.getElementById("progress-bar");
      const progressText = document.getElementById("progress-text");
      progressBar.value = percentage;
      progressText.textContent = `${percentage}%`;
    };

    try {
      const formatDateTime = (date) => {
        const d = new Date(date);
        return `${d.getFullYear()}-${(d.getMonth() + 1)
          .toString()
          .padStart(2, "0")}-${d.getDate().toString().padStart(2, "0")}T${d
          .getHours()
          .toString()
          .padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}:${d
          .getSeconds()
          .toString()
          .padStart(2, "0")}.000Z`;
      };

      const formattedStartDate = formatDateTime(startDate);
      const formattedEndDate = formatDateTime(endDate);

      const progressContainer = document.getElementById("progress-container");
      progressContainer.style.display = "block";
      showProgress(0);

      const fetchData = async (endpoint, params, progressStart, progressEnd) => {
        const response = await axios.get(BASE_URL + endpoint, {
          params: params,
          onDownloadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              progressStart +
                (progressEvent.loaded * (progressEnd - progressStart)) /
                  progressEvent.total
            );
            showProgress(percentCompleted);
          },
        });
        await delay(500);
        return response.data;
      };

      const data1 = await fetchData(
        "/api/BillTransXML",
        {
          P_FromDate: formattedStartDate,
          P_ToDate: formattedEndDate,
          P_TFlag: status,
        },
        0,
        25
      );

      const data2 = await fetchData(
        "/api/BillItems",
        {
          P_FromDate: formattedStartDate,
          P_ToDate: formattedEndDate,
        },
        25,
        50
      );

      const now = new Date();
      const dateTimeString = new Date(
        now.getTime() + 7 * 60 * 60 * 1000
      ).toISOString();
      const fileDateString = now.toISOString().slice(0, 10).replace(/-/g, "");

      const generateMD5 = (data) => {
        return CryptoJS.MD5(data).toString(CryptoJS.enc.Hex).toUpperCase();
      };

      const generateXML1 = (data1, data2, fileName) => {
        let xmlString = `<?xml version="1.0" encoding="windows-874"?>
<ClaimRec System="OP" PayPlan="SS" Version="0.93">
<Header>
<HCODE>12026</HCODE>
<HNAME>โรงพยาบาล เกษมราษฎร์ศรีบุรินทร์</HNAME>
<DATETIME>${dateTimeString}</DATETIME>
<SESSNO>0001</SESSNO>
<RECCOUNT>${data1.length + data2.length}</RECCOUNT>
</Header>
<BILLTRAN>`;

        data1.forEach((item) => {
          xmlString += `
${item.Station}||${item.Authcode}|${item.DTtran}|${item.Hcode}|${item.InvNo}||${item.HN}|${item.MemberNo}|${item.Amount}|${item.Paid}||${item.Tflag}|${item.Pid}|${item.Name}|${item.Hmain}|${item.PayPlan}|${item.ClaimAmt}|${item.OtherPayplan}|${item.OtherPay}`;
        });

        xmlString += `
</BILLTRAN>
<BillItems>`;

        data2.forEach((item) => {
          xmlString += `
${item.InvNo}|${item.Sv_date}|${item.BillMuad}|${item.LCCode}|${item.STDCode}||${item.QTY}|${item.UP}|${item.ChargeAmt}|${item.ClaimUP}|${item.CliamAmount}|${item.SvRefID}|${item.ClaimCat}`;
        });

        xmlString += `
</BillItems>
</ClaimRec>`;

        const md5Hash = generateMD5(xmlString);
        xmlString += `\n<?EndNote HMAC="${md5Hash}"?>`;

        console.log("Generated XML:", xmlString);

        const blob = new Blob([xmlString], { type: "application/xml" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", fileName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      };

      const generateXML2 = (fileName) => {
        let xmlString = `<?xml version="1.0" encoding="windows-874"?>
<ClaimRec System="OP" PayPlan="SS" Version="0.93">
<Header>
<HCODE>12026</HCODE>
<HNAME>โรงพยาบาล เกษมราษฎร์ศรีบุรินทร์ </HNAME>
<DATETIME>${dateTimeString}</DATETIME>
<SESSNO>0001</SESSNO>
<RECCOUNT>0</RECCOUNT>
</Header>
<OPServices>
</OPServices>
<OPDx>
</OPDx>
</ClaimRec>`;

        const md5Hash = generateMD5(xmlString);
        xmlString += `\n<?EndNote HMAC="${md5Hash}"?>`;

        console.log("Generated XML:", xmlString);

        const blob = new Blob([xmlString], { type: "application/xml" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", fileName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      };

      const generateXML3 = (fileName) => {
        let xmlString = `<?xml version="1.0" encoding="windows-874"?>
<ClaimRec System="OP" PayPlan="SS" Version="0.93">
<Header>
<HCODE>12026</HCODE>
<HNAME>โรงพยาบาล เกษมราษฎร์ศรีบุรินทร์ </HNAME>
<DATETIME>${dateTimeString}</DATETIME>
<SESSNO>0001</SESSNO>
<RECCOUNT>0</RECCOUNT>
</Header>
<Dispensing>
</Dispensing>
<DispensedItems>
</DispensedItems>
</ClaimRec>`;

        const md5Hash = generateMD5(xmlString);
        xmlString += `\n<?EndNote HMAC="${md5Hash}"?>`;

        console.log("Generated XML:", xmlString);

        const blob = new Blob([xmlString], { type: "application/xml" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", fileName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      };

      generateXML1(data1, data2, `BILLTRAN${fileDateString}.txt`);
      generateXML2(`OPServices${fileDateString}.txt`);
      generateXML3(`BILLDISP${fileDateString}.txt`);

      showProgress(100);

      Swal.fire("สำเร็จ", "", "success");
    } catch (error) {
      Swal.fire("Error", "ข้อผิดพลาดติดต่อ ICT", "error");
    } finally {
      const progressContainer = document.getElementById("progress-container");
      progressContainer.style.display = "none";
    }
  };


  return (
    <div>
      <Container maxWidth="sm">
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mt: 4,
          }}
        >
          <Typography variant="h4" color="primary" gutterBottom>
            SSO Export KSBR
          </Typography>
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
          <TextField
            fullWidth
            label="ตั้งแต่วันที่"
            type="date"
            variant="standard"
            InputLabelProps={{ shrink: true }}
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            margin="normal"
          />
          <TextField
            fullWidth
            label="ถึงวันที่"
            type="date"
            variant="standard"
            InputLabelProps={{ shrink: true }}
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            margin="normal"
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>สถานะการส่ง</InputLabel>
            <Select value={status} onChange={(e) => setStatus(e.target.value)}>
              <MenuItem value="0">เป็นรายการขอเบิก</MenuItem>
              <MenuItem value="1">แก้ไขรายการ</MenuItem>
              <MenuItem value="2">ยกเลิกรายการ</MenuItem>
            </Select>
          </FormControl>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mt: 3,
              width: "100%",
            }}
          >
            <Button variant="contained" color="primary" onClick={handleExport}>
              Export
            </Button>
          </Box>
          <Box
            id="progress-container"
            sx={{ display: "none", width: "100%", mt: 3 }}
          >
            <Typography id="progress-text" variant="body1">
              0%
            </Typography>
            <progress
              id="progress-bar"
              value="0"
              max="100"
              style={{ width: "100%" }}
            ></progress>
          </Box>
        </Box>
      </Container>
    </div>
  );
}

export default ExportForm;
