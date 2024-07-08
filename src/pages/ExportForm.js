import React from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  MenuItem,
} from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import AdapterDateFns from "@mui/x-date-pickers/AdapterDateFns";
import { th } from "date-fns/locale";

const ExportForm = () => {
  const [site, setSite] = React.useState("");
  const [startDate, setStartDate] = React.useState(new Date());
  const [endDate, setEndDate] = React.useState(new Date());
  const [status, setStatus] = React.useState("");

  const handleSiteChange = (event) => {
    setSite(event.target.value);
  };

  const handleStatusChange = (event) => {
    setStatus(event.target.value);
  };

  return (
    <Container maxWidth="sm">
      <Box textAlign="center" my={4}>
        <Typography variant="h4" color="secondary">
          SSO Export KSBR
        </Typography>
      </Box>
      <Box my={2}>
        <TextField
          fullWidth
          select
          label="Site"
          value={site}
          onChange={handleSiteChange}
          variant="outlined"
        >
          <MenuItem value="">
            <em>Please Choose</em>
          </MenuItem>
          <MenuItem value="site1">Site 1</MenuItem>
          <MenuItem value="site2">Site 2</MenuItem>
        </TextField>
      </Box>
      <LocalizationProvider dateAdapter={AdapterDateFns} locale={th}>
        <Box my={2}>
          <DatePicker
            label="ตั้งแต่วันที่"
            value={startDate}
            onChange={(newValue) => setStartDate(newValue)}
            renderInput={(params) => (
              <TextField {...params} fullWidth variant="outlined" />
            )}
          />
        </Box>
        <Box my={2}>
          <DatePicker
            label="ถึงวันที่"
            value={endDate}
            onChange={(newValue) => setEndDate(newValue)}
            renderInput={(params) => (
              <TextField {...params} fullWidth variant="outlined" />
            )}
          />
        </Box>
      </LocalizationProvider>
      <Box my={2}>
        <TextField
          fullWidth
          select
          label="สถานะการส่ง"
          value={status}
          onChange={handleStatusChange}
          variant="outlined"
        >
          <MenuItem value="เป็นรายการขาระบิล">เป็นรายการขาระบิล</MenuItem>
          <MenuItem value="option2">Option 2</MenuItem>
        </TextField>
      </Box>
      <Box display="flex" justifyContent="space-between" mt={4}>
        <Button variant="contained" color="primary" startIcon={<ExportIcon />}>
          Export
        </Button>
        <Button variant="contained" color="secondary" startIcon={<ExitIcon />}>
          Exit Program
        </Button>
      </Box>
    </Container>
  );
};

// Placeholder icons, replace these with the actual icons you're using
const ExportIcon = () => <span>📁</span>;
const ExitIcon = () => <span>🔴</span>;

export default ExportForm;
