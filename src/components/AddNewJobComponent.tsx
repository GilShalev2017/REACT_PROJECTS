import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Tabs,
  Tab,
  styled,
  ListItemText,
  OutlinedInput,
  Box,
  Chip,
  Theme,
  useTheme,
} from "@mui/material";
import { AiJobRequest, Channel, RuleRecurrenceEnum } from "../models/Job";
import { getChannels } from "../api/jobService";
import { DatePicker, LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Dayjs } from "dayjs";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

interface AddNewJobComponentProps {
  open: boolean;
  onClose: () => void;
  onJobAdded?: (jobData: any) => void;
}

const AddNewJobComponent: React.FC<AddNewJobComponentProps> = ({ open, onClose, onJobAdded }) => {
  const [name, setName] = useState("");
  const [visibility, setVisibility] = useState("Private");
  const [selectedChannels, setSelectedChannels] = useState<number[]>([]);
  const [repeat, setRepeat] = useState(false);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState(0);

  const [channels, setChannels] = useState<Channel[]>([]);
  const [loadingChannels, setLoadingChannels] = useState(true);
  const [errorChannels, setErrorChannels] = useState<string | null>(null);

  const weekDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  // const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs());
  // const [startTime, setStartTime] = useState<Dayjs | null>(dayjs().set('hour', 20).set('minute', 0));
  // const [endTime, setEndTime] = useState<Dayjs | null>(dayjs().set('hour', 22).set('minute', 0));

  const theme = useTheme();

  useEffect(() => {
    const fetchChannelsData = async () => {
      setLoadingChannels(true);
      setErrorChannels(null);
      try {
        const fetchedChannels = await getChannels();
        setChannels(fetchedChannels);
      } catch (err: any) {
        setErrorChannels(err.message || "Failed to fetch channels");
        console.error("Error fetching channels:", err);
      } finally {
        setLoadingChannels(false);
      }
    };

    fetchChannelsData();
  }, []);

  const handleSave = () => {
    if (name && selectedChannels) {
      const jobData: AiJobRequest = {
        // Visibility: visibility,
        Name: name,
        Operations: ["DetectKeywords"],
        ChannelIds: [1, 2, 3], //todo use selectedChannels
        BroadcastStartTime: new Date(2025, 2, 3, 20, 0, 0),
        BroadcastEndTime: new Date(2025, 2, 3, 22, 0, 0),
        RequestRule: {
          Recurrence: RuleRecurrenceEnum.Once,
          Days: 0b1111111
        },
        Keywords: ["Biden", "Trump", "Israel"],
        KeywordsLangauges: ["English"],
        NotificationIds: []
      }

      onJobAdded?.(jobData);
      onClose();
    } else {
      alert("Please fill in all fields.");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>New AI Job</DialogTitle>
      <DialogContent>
        <TextField
          label="Job Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          margin="normal"
        />

        <div style={{ display: "flex", alignItems: "center" }}>
          <FormControl sx={{ marginRight: 2, minWidth: 150 }}>
            <InputLabel>Visibility</InputLabel>
            <Select value={visibility} onChange={(e) => setVisibility(e.target.value)} label="Visibility">
              <MenuItem value="Private">Private</MenuItem>
              <MenuItem value="Everyone">Everyone</MenuItem>
            </Select>
          </FormControl>
          {loadingChannels ? (
            <p>Loading channels...</p>
          ) : errorChannels ? (
            <p>Error: {errorChannels}</p>
          ) : (
            <FormControl sx={{ minWidth: 300, flex: 1 }}>
              <InputLabel id="demo-multiple-checkbox-label">Filter by Channel</InputLabel>
              <Select
                labelId="demo-multiple-checkbox-label"
                id="demo-multiple-checkbox"
                multiple
                value={selectedChannels}
                onChange={(e) => setSelectedChannels(e.target.value as number[])}
                input={<OutlinedInput label="Filter by Channel" />}
                renderValue={(selected) => {
                  return channels
                    .filter((channel) => selected.includes(channel.id))
                    .map((channel) => channel.displayName)
                    .join(", ");
                }}
                MenuProps={MenuProps}
              >
                {channels.map((channel) => (
                  <MenuItem key={channel.id} value={channel.id}>
                    <Checkbox checked={selectedChannels.includes(channel.id)} />
                    <ListItemText primary={channel.displayName} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        </div>

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker />
        </LocalizationProvider>
        {/* <div style={{ display: "flex", alignItems: "center", marginTop: '16px' }}>
            <DatePicker
              label="Select Date"
              value={selectedDate}
              onChange={(newValue) => setSelectedDate(newValue)}
              renderInput={(params) => <TextField {...params} sx={{ marginRight: 2, minWidth: 150 }} />}
            />
            <TimePicker
              label="Start Time"
              value={startTime}
              onChange={(newValue) => setStartTime(newValue)}
              renderInput={(params) => <TextField {...params} sx={{ marginRight: 2, minWidth: 150 }} />}
            />
            <TimePicker
              label="End Time"
              value={endTime}
              onChange={(newValue) => setEndTime(newValue)}
              renderInput={(params) => <TextField {...params} sx={{ minWidth: 150 }} />}
            />
          </div>
        </LocalizationProvider> */}

        <FormControlLabel
          control={<Checkbox checked={repeat} onChange={() => setRepeat(!repeat)} />}
          label="Repeat (optional)"
        />

        {repeat && (
          <div>
            {weekDays.map((day) => (
              <FormControlLabel
                key={day}
                control={
                  <Checkbox
                    checked={selectedDays.includes(day)}
                    onChange={(e) => {
                      setSelectedDays((prev) =>
                        e.target.checked ? [...prev, day] : prev.filter((d) => d !== day)
                      );
                    }}
                  />
                }
                label={day}
              />
            ))}
          </div>
        )}

        <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)}>
          <Tab label="Keyword Detection Alerts" />
          <Tab label="Closed Captions" />
        </Tabs>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSave} color="primary" variant="contained">
          Create Job
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddNewJobComponent;

