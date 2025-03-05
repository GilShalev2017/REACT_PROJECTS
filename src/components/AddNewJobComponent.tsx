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
  FormHelperText,
  Paper,
} from "@mui/material";
import { AiJobRequest, Channel, LanguageDm, RuleRecurrenceEnum } from "../models/Job";
import { getChannels, getLanguages } from "../api/jobService";
import { DatePicker, LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from "dayjs";
import { red } from "@mui/material/colors";

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

  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs());
  const [startTime, setStartTime] = useState<Dayjs | null>(dayjs().set('hour', 20).set('minute', 0));
  const [endTime, setEndTime] = useState<Dayjs | null>(dayjs().set('hour', 22).set('minute', 0));

  const [keywordLanguage, setKeywordLanguage] = useState("");
  const [keywords, setKeywords] = useState<string[]>([]);
  const [alertDestinations, setAlertDestinations] = useState<number[]>([]);
  const [sameLanguageCaptions, setSameLanguageCaptions] = useState(false);
  const [translatedLanguages, setTranslatedLanguages] = useState<string[]>([]);

  const [languages, setLanguages] = useState<LanguageDm[]>([]);

  const theme = useTheme();

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

  const fetchLanguagesData = async () => {
    try {
      const fetchedLanguages = await getLanguages();
      setLanguages(fetchedLanguages);
    } catch (err: any) {
      console.error("Error fetching languages:", err);
    }
  };

  useEffect(() => {
    fetchChannelsData();
    fetchLanguagesData();
  }, []);

  const handleKeywordsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const keywordsArray = inputValue.split(',').map((keyword) => keyword.trim());
    setKeywords(keywordsArray);
    console.log(keywords);
  };
  
  const isCreateJobDisabled = () => {
    return (
      !name ||
      selectedChannels.length === 0 ||
      (!sameLanguageCaptions && (!keywords || keywords.length === 0))
    );
  };
  
  const handleSave = () => {
    if (name && selectedChannels && selectedDate && startTime && endTime) {
      const startDateTime = selectedDate
        .set('hour', startTime.hour())
        .set('minute', startTime.minute())
        .toDate();
      const endDateTime = selectedDate
        .set('hour', endTime.hour())
        .set('minute', endTime.minute())
        .toDate();

      const operations: string[] = [];

      if (keywords && keywords.length > 0) {
        operations.push('DetectKeywords');
      }

      if (sameLanguageCaptions) {
        operations.push('CreateClosedCaptions');
      }

      if (translatedLanguages && translatedLanguages.length > 0) {
        operations.push('TranslateTranscription');
      }

      const jobData: AiJobRequest = {
        Name: name,
        Operations: operations,
        ChannelIds: selectedChannels, // Use selectedChannels from state
        BroadcastStartTime: startDateTime,
        BroadcastEndTime: endDateTime,
        RequestRule: {
          Recurrence: RuleRecurrenceEnum.Once,
          Days: 0b1111111,
        },
        Keywords: keywords, // Use keywords from state (string array)
        KeywordsLangauges: [keywordLanguage], // Use keywordLanguage from state
        NotificationIds: []//alertDestinations, // Use alertDestinations from state
      };

      onJobAdded?.(jobData);
      onClose();
    } else {
      alert('Please fill in all fields.');
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
          <FormControl sx={{ marginLeft: 2, minWidth: 150 }}>
            <InputLabel>Visibility</InputLabel>
            <Select value={visibility} onChange={(e) => setVisibility(e.target.value)} label="Visibility">
              <MenuItem value="Private">Private</MenuItem>
              <MenuItem value="Everyone">Everyone</MenuItem>
            </Select>
          </FormControl>
        </div>

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <div style={{ display: "flex", alignItems: "center", marginTop: '16px' }}>
            <DatePicker
              label="Select Date"
              value={selectedDate}
              onChange={(newValue) => setSelectedDate(newValue)}
            // renderInput={(params) => <TextField {...params} sx={{ marginRight: 2, minWidth: 150 }} />}
            />
            <TimePicker
              label="Start Time"
              value={startTime}
              sx={{ marginRight: 2, marginLeft: 2 }}
              onChange={(newValue) => setStartTime(newValue)}
            // renderInput={(params) => <TextField {...params} sx={{ marginRight: 2, minWidth: 150 }} />}
            />
            <TimePicker
              label="End Time"
              value={endTime}
              onChange={(newValue) => setEndTime(newValue)}
            // renderInput={(params) => <TextField {...params} sx={{ minWidth: 150 }} />}
            />
          </div>
        </LocalizationProvider>

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

        <Tabs value={activeTab}
          onChange={(_, newValue) => setActiveTab(newValue)}
          sx={{ height: '310' }} >
          <Tab label="Keyword Detection Alerts" sx={{ textTransform: 'none' }}/>
          <Tab label="Closed Captions" sx={{ textTransform: 'none' }}/>
        </Tabs>

        {activeTab === 0 && (
          <div style={{ height: '310px', overflowY: 'auto', backgroundColor: 'whitesmoke' }}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Select the language of your keywords</InputLabel>
              <Select
                value={keywordLanguage}
                onChange={(e) => setKeywordLanguage(e.target.value)}
                label="Select the language of your keywords" >
                <MenuItem value="English">English</MenuItem>
                <MenuItem value="Spanish">Spanish</MenuItem>
                {/* Add more languages as needed */}
              </Select>
              <FormHelperText>Select the language of your keywords</FormHelperText>
            </FormControl>

            <TextField
              label="Enter the keywords to search for, separated by commas"
              value={keywords.join(', ')} // Display keywords as comma-separated string
              onChange={handleKeywordsChange} // Use the new handler
              fullWidth
              margin="normal"
              helperText="Enter keywords, separated by commas"
            />

            <FormControl fullWidth margin="normal">
              <InputLabel>Select Alert Destinations</InputLabel>
              <Select
                multiple
                value={alertDestinations}
                onChange={(e) => setAlertDestinations(e.target.value as number[])}
                input={<OutlinedInput label="Select Alert Destinations" />}
                renderValue={(selected) => selected.join(", ")}
                MenuProps={MenuProps}
                label="Select Alert Destinations"
              >
                {channels.map((channel) => (
                  <MenuItem key={channel.id} value={channel.id}>
                    <Checkbox checked={alertDestinations.includes(channel.id)} />
                    <ListItemText primary={channel.displayName} />
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>Select the destinations for alert notifications</FormHelperText>
            </FormControl>
          </div>
        )}

        {activeTab === 1 && (
          <div style={{ height: '310px', overflowY: 'auto', backgroundColor: 'whitesmoke' }}>
            <FormControlLabel
              control={<Checkbox checked={sameLanguageCaptions} onChange={() => setSameLanguageCaptions(!sameLanguageCaptions)} />}
              label="Generate closed captions in the same language as their audio"
            />

            <FormControl fullWidth margin="normal">
              <InputLabel>Select translated languages</InputLabel>
              <Select
                multiple
                value={translatedLanguages}
                onChange={(e) => setTranslatedLanguages(e.target.value as string[])}
                input={<OutlinedInput label="Select translated languages" />}
                renderValue={(selected) => selected.join(", ")}
                MenuProps={MenuProps}
                label="Select translated languages"
                disabled={!sameLanguageCaptions} >
                <MenuItem value="English">English</MenuItem>
                <MenuItem value="Spanish">Spanish</MenuItem>
                {/* Add more languages as needed */}
              </Select>
              <FormHelperText>Select the languages to translate closed captions to</FormHelperText>
            </FormControl>
          </div>
        )}

      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSave} color="primary" variant="contained" disabled={isCreateJobDisabled()}>
          Create Job
        </Button>
      </DialogActions>
    </Dialog >
  );
};

export default AddNewJobComponent;

