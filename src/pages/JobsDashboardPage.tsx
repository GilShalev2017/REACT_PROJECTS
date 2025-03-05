import React, { useEffect, useState } from "react";
import { getFilteredJobRequests, addNewJob, getChannels } from "../api/jobService";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Button, Toolbar, Typography, Dialog, DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  styled,
  DialogProps,
  Box,
  DialogActions,
  DialogContent,
  DialogContentText,
  FormControlLabel,
  Switch,
  SelectChangeEvent
} from "@mui/material";
import AddNewJobComponent from "../components/AddNewJobComponent";
import "./JobStatus.css";
import { AiJobRequest, Channel, JobRequestFilter } from "../models/Job";


const statuses = [
  { text: "Pending", selected: false },
  { text: "In Progress", selected: false },
  { text: "Completed", selected: false },
  { text: "Failed", selected: false },
  { text: "Paused", selected: false },
  { text: "Stopped", selected: false },
];

// const WideDialog = styled(Dialog)(({ theme }) => ({
//   '& .MuiDialog-paper': {
//     width: '180%',
//     maxWidth: 'none',
//   },
// }));

const JobDashboardPage: React.FC = () => {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [jobs, setJobs] = useState<AiJobRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedTimeRangeFilter, setSelectedTimeRangeFilter] = useState<string | null>(null);
  const [filterFromDate, setFilterFromDate] = useState<Date | undefined>();
  const [filterToDate, setFilterToDate] = useState<Date | undefined>();
  const [selectedChannels, setSelectedChannels] = useState<number[]>([]);
  const [openNewJobDialog, setOpenNewJobDialog] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [selectedSortBy, setSelectedSortBy] = useState<number>(0);

  // const [fullWidth, setFullWidth] = React.useState(true);
  // const [maxWidth, setMaxWidth] = React.useState<DialogProps['maxWidth']>('lg');
  // const [open, setOpen] = React.useState(false);

  const filterByCategory = (status: { text: string }) => {
    setSelectedStatus(status.text);
  };

  useEffect(() => {
    const currentDate = new Date();
    setFilterFromDate(new Date(currentDate.getTime() - 14 * 24 * 60 * 60 * 1000));
    setFilterToDate(new Date(currentDate.getTime() + 1 * 24 * 60 * 60 * 1000));

    fetchChannels();
  }, []);

  const fetchChannels = () => {
    getChannels()
      .then((data) => setChannels(data))
      .catch((error) => console.error("Failed to load channels:", error))
  }

  const fetchJobs = () => {
    if (!filterFromDate || !filterToDate) return; 

    const filter: JobRequestFilter = {
      Start: filterFromDate,
      End: filterToDate,
      ChannelIds: selectedChannels,
      SortDirection: selectedSortBy,
    };

    setLoading(true);
    getFilteredJobRequests(filter)
      .then((data) => setJobs(data))
      .catch((error) => console.error("Failed to load jobs:", error))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    const currentDate = new Date();
    let fromDate: Date | undefined;
    let toDate: Date | undefined;

    switch (selectedTimeRangeFilter) {
      case "today":
        fromDate = currentDate;
        toDate = new Date(currentDate.getTime() + 1 * 24 * 60 * 60 * 1000);
        break;
      case "lweek":
        fromDate = new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000);
        toDate = new Date(currentDate.getTime() + 1 * 24 * 60 * 60 * 1000); // including today
        break;
      case "l2week":
        fromDate = new Date(currentDate.getTime() - 14 * 24 * 60 * 60 * 1000);
        toDate = new Date(currentDate.getTime() + 1 * 24 * 60 * 60 * 1000); // including today
        break;
      case "lmonth":
        fromDate = new Date(currentDate.getTime() - 30 * 24 * 60 * 60 * 1000);
        toDate = new Date(currentDate.getTime() + 1 * 24 * 60 * 60 * 1000); // including today
        break;
      default:
        fromDate = new Date(currentDate.getTime() - 14 * 24 * 60 * 60 * 1000);
        toDate = new Date(currentDate.getTime() + 1 * 24 * 60 * 60 * 1000);
        break;
    }

    setFilterFromDate(fromDate);
    setFilterToDate(toDate);
  }, [selectedTimeRangeFilter]);

  // Fetch jobs on filter change
  useEffect(fetchJobs, [filterFromDate, filterToDate, selectedChannels, selectedSortBy]);


  const handleOpenNewJobDialog = () => {
    setOpenNewJobDialog(true);
  };

  const handleCloseNewJobDialog = () => {
    setOpenNewJobDialog(false);
  };

  const handleSaveNewJob = (jobData: AiJobRequest) => {
    addNewJob(jobData)
      .then(/*(data) => setJobs(data)*/)
      .catch((error) => console.error("Failed to save new job:", error))
    // .finally(() => setLoading(false));
  }

  const getStatusClass = (status: string) => {
    switch (status) {
      case "In Progress":
        return "status-in-progress";
      case "Completed":
        return "status-completed";
      case "Failed":
        return "status-failed";
      case "Pending":
        return "status-pending";
      case "Paused":
        return "status-paused";
      case "Stopped":
        return "status-stopped";
      default:
        return "";
    }
  };

  const JobStatusCell = ({ job }: { job: { Status: string } }) => {
    return (
      <TableCell>
        <span className={`category ${getStatusClass(job.Status)}`}>
          {job.Status}
        </span>
      </TableCell>
    );
  };

  // const handleClickOpen = () => {
  //   setOpen(true);
  // };

  // const handleClose = () => {
  //   setOpen(false);
  // };

  // const handleMaxWidthChange = (event: SelectChangeEvent<typeof maxWidth>) => {
  //   setMaxWidth(
  //     // @ts-expect-error autofill of arbitrary value is not handled.
  //     event.target.value,
  //   );
  // };

  // const handleFullWidthChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setFullWidth(event.target.checked);
  // };

  return (
    <Paper>

      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h6">Job Dashboard</Typography>
        <div>
          <Button variant="contained" color="secondary" onClick={fetchJobs} sx={{ marginRight: 1 }}>
            Refresh
          </Button>
          <Button variant="contained" color="primary" onClick={handleOpenNewJobDialog}>
            New Job
          </Button>
          {/* <Button variant="outlined" onClick={handleClickOpen}>
            Open max-width dialog
          </Button> */}
        </div>
      </Toolbar>


      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>

        <div className="category-container">
          {statuses.map((status) => (
            <div
              key={status.text}
              className={`ott-background-100 ott-color-10 category ${getStatusClass(status.text)}`}
              onClick={() => filterByCategory(status)}
            >
              {status.text}
            </div>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center" }}>
          <FormControl margin="normal" sx={{ marginRight: 2, minWidth: 150 }}>
            <InputLabel>Filter by Time-Range</InputLabel>
            <Select value={selectedTimeRangeFilter} onChange={(e) => setSelectedTimeRangeFilter(e.target.value)} label="Filter by Time-Range">
              <MenuItem value="today">Today</MenuItem>
              <MenuItem value="lweek">Last week</MenuItem>
              <MenuItem value="l2week">Last two weeks</MenuItem>
              <MenuItem value="lmonth">Last month</MenuItem>
            </Select>
          </FormControl>

          <FormControl margin="normal" sx={{ marginRight: 2, minWidth: 150 }}>
            <InputLabel>Filter by Channel</InputLabel>
            <Select multiple value={selectedChannels} onChange={(e) => setSelectedChannels(e.target.value as number[])} label="Filter by Channel">
              {channels.map((channel) => (
                <MenuItem key={channel.id} value={channel.id}>
                  {channel.displayName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl margin="normal" sx={{ minWidth: 120 }}>
            <InputLabel>Sort By</InputLabel>
            <Select value={selectedSortBy} onChange={(e) => setSelectedSortBy(e.target.value as number)} label="Sort By">
              <MenuItem value="0">Newest</MenuItem>
              <MenuItem value="1">Oldest</MenuItem>
            </Select>
          </FormControl>
        </div>
      </Toolbar>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : (
              jobs.map((job) => (
                <TableRow key={job.Id}>
                  <TableCell>{job.Name}</TableCell>
                  {/* <TableCell>{job.Status}</TableCell> */}
                  <JobStatusCell job={{ Status: job.Status! }} />
                  <TableCell>{job.CreatedAt}</TableCell>
                  <TableCell>
                    {job.NextScheduledTime ? new Date(job.NextScheduledTime).toDateString() : "N/A"}
                  </TableCell>
                  <TableCell>
                    <Button variant="contained" color="primary">
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      
      <Dialog open={openNewJobDialog} onClose={handleCloseNewJobDialog}
        fullWidth={true}
        maxWidth={'lg'}>
        {/* <DialogTitle>Add New Job</DialogTitle> */}
        <AddNewJobComponent open={openNewJobDialog} onClose={handleCloseNewJobDialog} onJobAdded={handleSaveNewJob} />
      </Dialog>

    </Paper>
  );
};

export default JobDashboardPage;
