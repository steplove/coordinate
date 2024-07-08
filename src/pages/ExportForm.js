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

function ExportForm() {
  const [site, setSite] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState("");
  const [hn, setHn] = useState("");
  const [billNumber, setBillNumber] = useState("");

  const handleExport = () => {
    // Add your export logic here
    Swal.fire("Exported", "Your data has been exported", "success");
  };

  const handleExit = () => {
    // Add your exit logic here
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
