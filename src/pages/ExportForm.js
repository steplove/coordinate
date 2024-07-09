import React, { useState } from "react";
import {
  Grid,
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

function ExportForm() {
  const [site, setSite] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState("");
  const [hn, setHn] = useState("");
  const [billNumber, setBillNumber] = useState("");

  const handleExport = () => {
    const xml = create({ version: "1.0", encoding: "UTF-8" })
      .ele("ExportData")
      .ele("Site")
      .txt(site)
      .up()
      .ele("StartDate")
      .txt(startDate)
      .up()
      .ele("EndDate")
      .txt(endDate)
      .up()
      .ele("Status")
      .txt(status)
      .up()
      .ele("HN")
      .txt(hn)
      .up()
      .ele("BillNumber")
      .txt(billNumber)
      .up()
      .end({ prettyPrint: true });

    const blob = new Blob([xml], { type: "application/xml" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "exported_data.xml");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    Swal.fire("Exported", "Your data has been exported", "success");
  };

  const handleExit = () => {
    Swal.fire("Exit", "Program will close", "warning");
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
        <FormControl fullWidth margin="normal">
          <InputLabel>Site</InputLabel>
          <Select value={site} onChange={(e) => setSite(e.target.value)}>
            <MenuItem value="">
              <em>Please Choose</em>
            </MenuItem>
            <MenuItem value="site1">Site 1</MenuItem>
            <MenuItem value="site2">Site 2</MenuItem>
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
            <MenuItem value="">
              <em>เป็นรายการยอดเบิก</em>
            </MenuItem>
            <MenuItem value="status1">Status 1</MenuItem>
            <MenuItem value="status2">Status 2</MenuItem>
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
