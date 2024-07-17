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
import { create } from "xmlbuilder2";
import { BASE_URL } from "../constants/constants";

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
  const handleExport = async () => {
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
          .padStart(2, "0")}`;
      };

      const formattedStartDate = formatDateTime(startDate);
      const formattedEndDate = formatDateTime(endDate);

      const response1 = await axios.get(BASE_URL + "/api/BillTransXML", {
        params: {
          P_FromDate: formattedStartDate,
          P_ToDate: formattedEndDate,
          P_TFlag: status,
        },
      });

      const response2 = await axios.get(BASE_URL + "/api/BillItems", {
        params: {
          P_FromDate: formattedStartDate,
          P_ToDate: formattedEndDate,
        },
      });

      const data1 = response1.data;
      const data2 = response2.data;

      const now = new Date();
      const dateTimeString = new Date(
        now.getTime() + 7 * 60 * 60 * 1000
      ).toISOString();

      const xml = create({ version: "1.0", encoding: "windows-874" })
        .ele("ClaimRec", { System: "OP", PayPlan: "SS", Version: "0.93" })
        .ele("Header")
        .ele("HCODE")
        .txt("12026")
        .up()
        .ele("HNAME")
        .txt("โรงพยาบาล เกษมราษฎร์ศรีบุรินทร์")
        .up()
        .ele("DATETIME")
        .txt(dateTimeString)
        .up()
        .ele("SESSNO")
        .txt("0001")
        .up()
        .ele("RECCOUNT")
        .txt(data1.length + data2.length)
        .up()
        .up()
        .ele("BILLTRAN")
        .ele("BillItems");

      data1.forEach((item) => {
        xml
          .txt(
            `${item.Station}||${item.Authcode}|${item.DTtran}|${item.Hcode}|${item.InvNo}||${item.HN}|${item.MemberNo}|${item.Amount}|${item.Paid}||${item.Tflag}|${item.Pid}|${item.Name}|${item.Hmain}|${item.PayPlan}|${item.ClaimAmt}|${item.OtherPayplan}|${item.OtherPay}`
          )
          .up();
      });

      xml.up().ele("BillItems");

      // data2.forEach((item) => {
      //   xml
      //     .txt(
      //       `${item.InvNo}|${item.Sv_date}|${item.BillMuad}|${item.LCCode}|${item.STDCode}||${item.QTY}|${item.UP}|${item.ChargeAmt}|${item.ClaimUP}|${item.CliamAmount}|${item.SvRefID}|${item.ClaimCat}`
      //     )
      //     .up();
      // });

      const xmlString = xml.end({ prettyPrint: true });
      console.log("Generated XML:", xmlString);
      const blob = new Blob([xmlString], { type: "application/xml" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "exported_data.xml");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      Swal.fire("Exported", "Your data has been exported", "success");
    } catch (error) {
      console.error("Error exporting data", error);
      Swal.fire("Error", "There was an error exporting the data", "error");
    }
  };

  return (
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
            {/* <MenuItem value="">
              <em>เป็นรายการยอดเบิก</em>
            </MenuItem> */}
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
      </Box>
    </Container>
  );
}

export default ExportForm;
