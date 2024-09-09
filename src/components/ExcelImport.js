import React, { useState } from "react";
import * as XLSX from "xlsx";
import axios from "axios";
import { BASE_URL } from "../constants/constants";
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";

function ExcelImport() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fileUploaded, setFileUploaded] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const binaryStr = e.target.result;
      const workbook = XLSX.read(binaryStr, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {
        header: 1,
      });

      const formattedData = worksheet.map((row) => {
        const Status_Bill = row[0] ? row[0].trim().charAt(0).toUpperCase() : "";
        const InvNo = row[1] ? row[1].trim() : "";
        const Remark = row.slice(2).join(", ").trim();

        return {
          Status_Bill: Status_Bill,
          InvNo: InvNo,
          Remark: Remark,
        };
      });

      setData(formattedData);
      setFileUploaded(true);
      setSnackbarMessage(
        "File uploaded successfully. You can now submit the data."
      );
      setOpenSnackbar(true);
    };

    reader.readAsBinaryString(file);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await axios.post(BASE_URL + "/api/updateDataExcel", {
        data,
      });
      console.log("Response:", response);
      setSnackbarMessage("Data submitted successfully!");
    } catch (error) {
      console.error(
        "Error submitting data:",
        error.response ? error.response.data : error.message
      );
      setSnackbarMessage("Failed to submit data.");
    } finally {
      setLoading(false);
      setOpenSnackbar(true);
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h6" gutterBottom>
        Import Excel Data
      </Typography>
      <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
      <Box mt={2}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={!fileUploaded || loading}
        >
          Submit Data
        </Button>
      </Box>
      {loading && (
        <Box mt={2}>
          <CircularProgress />
        </Box>
      )}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity={snackbarMessage.includes("Failed") ? "error" : "success"}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default ExcelImport;
