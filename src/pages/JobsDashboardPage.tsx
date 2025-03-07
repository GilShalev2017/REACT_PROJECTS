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
  IconButton,
  Avatar,
} from "@mui/material";
import AddNewJobComponent from "../components/AddNewJobComponent";
import "./JobStatus.css";
import { AiJobRequest, Channel, JobRequestFilter } from "../models/Models";
import { format } from "date-fns";
import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import DeleteIcon from '@mui/icons-material/Delete';

const statusesData = [
  { text: "Pending", selected: false },
  { text: "In Progress", selected: false },
  { text: "Completed", selected: false },
  { text: "Failed", selected: false },
  { text: "Paused", selected: false },
  { text: "Stopped", selected: false },
];

// Styled component for the job name container
const JobNameContainer = styled('div')({
  width: '100%',
  '& .job-name-grid': {
    display: 'grid',
    gridTemplateRows: 'min-content auto min-content min-content auto min-content',
    height: '100%',
    width: '100%',
    padding: '1px 20px',
  },
  '& .ott-no-wrap': {
    whiteSpace: 'nowrap',
  },
  '& .ott-h2-fnt': {
    fontSize: '1.5rem', // Adjust as needed
    fontWeight: 'bold', // Or your specific font weight
  },
  '& .ott-h4-fnt': {
    fontSize: '1rem', // Adjust as needed
  },
  '& .ott-color-30': {
    color: 'rgba(0, 0, 0, 0.3)', // Or your specific color
  },
  '& .ott-body-35-fnt': {
    fontSize: '0.875rem', // Adjust as needed
    fontStyle: 'italic',
    lineHeight: '12px',
    color: 'rgba(0, 0, 0, 0.3)',
  },
});

const DateCellContainer = styled('div')({
  padding: '10px 20px',
  textAlign: 'center',
});

interface DateCellProps {
  job: AiJobRequest;
}

const DateCell = ({ job }: DateCellProps) => {
  const isItToday = (d: Date | undefined | null): boolean => {
    if (!d || !(d instanceof Date) || isNaN(d.getTime())) return false; // Added checks

    const today = new Date();
    return (
      today.getFullYear() === d.getFullYear() &&
      today.getMonth() === d.getMonth() &&
      today.getDate() === d.getDate()
    );
  };

  if (!job.NextScheduledTime) {
    return <TableCell sx={{ borderRight: '1px solid #ddd' }}>N/A</TableCell>;
  }

  const isToday = isItToday(job.NextScheduledTime);

  return (
    <TableCell sx={{ borderRight: '1px solid #ddd', width: '7%' }}>
      <DateCellContainer>
        <div
          className={isToday ? '' : 'ott-color-1000'}
          style={{ fontSize: '14px', fontWeight: 400, lineHeight: '12px', marginBottom: '-3px' }}
        >
          {job.NextScheduledTime && format(job.NextScheduledTime, 'MMM')}
        </div>
        <div
          className={isToday ? '' : 'ott-color-1000'}
          style={{ fontSize: '48px', fontWeight: 600, lineHeight: '48px' }}
        >
          {job.NextScheduledTime && format(job.NextScheduledTime, 'd')}
        </div>
        <div
          className={isToday ? '' : 'ott-color-1000'}
          style={{ fontSize: '14px', fontWeight: 400, lineHeight: '12px', marginTop: '0px' }}
        >
          {job.NextScheduledTime && format(job.NextScheduledTime, 'EEE')}
        </div>
      </DateCellContainer>
    </TableCell>
  );
};

const NextScheduledTimeCellContainer = styled('div')({
  textAlign: 'center',
  padding: '0px 50px',
  width: '5%',
});

const NextScheduledTimeContent = styled('div')({
  borderWidth: '5px',
  borderStyle: 'solid',
  borderRadius: '100px',
  padding: '5px 10px',
  display: 'inline-block',
  width: '240px',
  borderColor: 'rgba(0, 0, 0, 0.1)',
});

interface NextScheduledTimeCellProps {
  job: AiJobRequest;
}

const NextScheduledTimeCell = ({ job }: NextScheduledTimeCellProps) => {
  const checkRecurrenceDay = (recurrenceDays: number, day: number) => {
    let i = 1;
    i = i << day;
    return (recurrenceDays & i) > 0;
  };

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  if (!job.RequestRule || !job.RequestRule.Recurrence) {
    return <TableCell sx={{ borderRight: '1px solid #ddd' }}>N/A</TableCell>;
  }

  return (
    <TableCell sx={{ borderRight: '1px solid #ddd' }}>
      <NextScheduledTimeCellContainer>
        <NextScheduledTimeContent>
          <div className="ott-h4-fnt ott-no-wrap" style={{ fontStyle: 'italic', lineHeight: '12px' }}>
            <span>{job.RequestRule.Recurrence.Value}</span>
          </div>
          <div className="ott-h4-fnt-bold ott-no-wrap">
            {job.BroadcastStartTime && format(job.BroadcastStartTime, 'HH:mm')} -{' '}
            {job.BroadcastEndTime && format(job.BroadcastEndTime, 'HH:mm')}
          </div>
          <div className="ott-body-35-fnt ott-no-wrap ott-color-30" style={{ fontStyle: 'italic', lineHeight: '12px' }}>
            {job.RequestRule.Days &&
              weekDays.map((day, index) => (
                <span
                  key={index}
                  className={job.RequestRule && job.RequestRule.Days && checkRecurrenceDay(job.RequestRule.Days, index) ? 'ott-color-20' : ''} // Added null check
                  style={{ marginLeft: '5px' }}
                >
                  {day}
                </span>
              ))}
            <span style={{ marginLeft: '5px' }}>&nbsp;</span>
          </div>
        </NextScheduledTimeContent>
      </NextScheduledTimeCellContainer>
    </TableCell>
  );
};

const ActionsCellContainer = styled('div')({
  textAlign: 'center',
  width: '8%',
});

const ActionButtonsContainer = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '10px',
});

interface ActionsCellProps {
  job: AiJobRequest;
  pauseJob: (job: AiJobRequest) => void;
  resumeJob: (job: AiJobRequest) => void;
  stopJob: (job: AiJobRequest) => void;
  deleteJob: (job: AiJobRequest) => void;
  canPause: (job: AiJobRequest) => boolean;
  canResume: (job: AiJobRequest) => boolean;
  canStop: (job: AiJobRequest) => boolean;
  canDelete: (job: AiJobRequest) => boolean;
}

const ActionsCell = ({ job, pauseJob, resumeJob, stopJob, deleteJob, canPause, canResume, canStop, canDelete }: ActionsCellProps) => {
  return (
    <TableCell>
      <ActionsCellContainer>
        <ActionButtonsContainer>
          {canPause(job) && (
            <Button
              variant="contained"
              color="warning"
              size="small"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                pauseJob(job);
              }}
            >
              <PauseIcon />
            </Button>
          )}
          {canResume(job) && (
            <Button variant="contained" color="primary" size="small" onClick={() => resumeJob(job)}>
              <PlayArrowIcon />
            </Button>
          )}
          {canStop(job) && (
            <Button variant="contained" color="warning" size="small" onClick={() => stopJob(job)}>
              <StopIcon />
            </Button>
          )}
          <Button
            variant="contained"
            color="secondary"
            size="small"
            onClick={() => deleteJob(job)}
            disabled={!canDelete(job)}
          >
            <DeleteIcon />
          </Button>
        </ActionButtonsContainer>
      </ActionsCellContainer>
    </TableCell>
  );
};

function pauseJob(job: AiJobRequest): void {
  console.log("Pause Job:", job); // Replace with your actual implementation
}

function resumeJob(job: AiJobRequest): void {
  console.log("Resume Job:", job); // Replace with your actual implementation
}

function stopJob(job: AiJobRequest): void {
  console.log("Stop Job:", job); // Replace with your actual implementation
}

function deleteJob(job: AiJobRequest): void {
  console.log("Delete Job:", job); // Replace with your actual implementation
}

function canResume(job: AiJobRequest): boolean {
  console.log("Can Resume:", job); // Replace with your actual implementation
  return true; // Or false based on your logic
}

function canStop(job: AiJobRequest): boolean {
  console.log("Can Stop:", job); // Replace with your actual implementation
  return true; // Or false based on your logic
}

function canPause(job: AiJobRequest): boolean {
  console.log("Can Pause:", job); // Replace with your actual implementation
  return true; // Or false based on your logic
}

function canDelete(job: AiJobRequest): boolean {
  console.log("Can Delete:", job); // Replace with your actual implementation
  return true; // Or false based on your logic
}

const JobDashboardPage: React.FC = () => {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [jobs, setJobs] = useState<AiJobRequest[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<AiJobRequest[]>([]);
  const [statuses, setStatuses] = useState([...statusesData]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedTimeRangeFilter, setSelectedTimeRangeFilter] = useState<string | null>('lmonth');
  const [filterFromDate, setFilterFromDate] = useState<Date | undefined>();
  const [filterToDate, setFilterToDate] = useState<Date | undefined>();

  const [selectedChannels, setSelectedChannels] = useState<number[]>([-1]); // Default to placeholder
  const [openNewJobDialog, setOpenNewJobDialog] = useState(false);
  //const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [selectedSortBy, setSelectedSortBy] = useState<number>(0);

  const filterByCategory = (statusToToggle: { text: string }) => {
    setStatuses((prevStatuses) => {
      return prevStatuses.map((s) => ({
        ...s,
        selected: s.text === statusToToggle.text ? !s.selected : false,
      }));
    });
  };

  const applyFilters = (): void => {
    const selectedStatuses = statuses.filter((status) => status.selected).map((status) => status.text);
    const curFilteredJobs = selectedStatuses.length
      ? jobs.filter((job) => selectedStatuses.includes(job.Status!))
      : jobs;

    setFilteredJobs(curFilteredJobs);
  };

  useEffect(() => {
    applyFilters();
  }, [statuses, jobs]);

  useEffect(() => {
    const currentDate = new Date();
    setFilterFromDate(new Date(currentDate.getTime() - 14 * 24 * 60 * 60 * 1000));
    setFilterToDate(new Date(currentDate.getTime() + 1 * 24 * 60 * 60 * 1000));

    fetchChannels();
  }, []);

  const fetchChannels = () => {
    getChannels()
      .then((data) => setChannels(data))
      .catch((error: any) => console.error("Failed to load channels:", error))
  }

  const fetchJobs = () => {
    if (!filterFromDate || !filterToDate) return;

    //remove the placeholder channel
    const realChannels = selectedChannels.filter(channel => channel !== -1);
    const filter: JobRequestFilter = {
      Start: filterFromDate,
      End: filterToDate,
      ChannelIds: realChannels,
      SortDirection: selectedSortBy,
    };

    setLoading(true);
    getFilteredJobRequests(filter)
      .then((data) => {
        // Fill job.Channels for every fetched job
        const updatedJobs = data.map(job => {
          if (job.ChannelIds) {
            job.Channels = job.ChannelIds
              .map(chnl => getChannelById(chnl))
              .filter((ch): ch is Channel => ch != null);
          } else {
            job.Channels = undefined;
          }
          return job;
        });
        setJobs(updatedJobs);
        setFilteredJobs(updatedJobs);
        setJobs(data)
      })
      .catch((error) => console.error("Failed to load jobs:", error))
      .finally(() => setLoading(false));
  };

  const getChannelById = (chnl_id: number): Channel | undefined => {
    return channels.find(chnl => chnl.id === chnl_id);
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
  // Fetch jobs on filter change (optimized)
  useEffect(() => {
    if (channels.length > 0) { // Only fetch jobs if channels are loaded
      fetchJobs();
    }
  }, [filterFromDate, filterToDate, selectedChannels, selectedSortBy, channels]); // Include 'channels' in the dependency array


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
      <TableCell sx={{ borderRight: '1px solid #ddd', width: '10%' }}>
        <span className={`category ${getStatusClass(job.Status)}`}>
          {job.Status}
        </span>
      </TableCell>
    );
  };

  return (
    <Paper>

      <Toolbar sx={{ display: "flex", justifyContent: "space-between", backgroundColor: '#EEEFF7' }}>
        <Typography variant="h6">Job Dashboard</Typography>
        <div>
          <Button variant="contained" color="secondary" onClick={fetchJobs} sx={{ marginRight: 1 }}>
            Refresh
          </Button>
          <Button variant="contained" color="primary" onClick={handleOpenNewJobDialog}>
            New Job
          </Button>
        </div>
      </Toolbar>

      <Toolbar sx={{ display: "flex", justifyContent: "space-between",border: "1px solid #D6DBF8" }}>
        <div className="category-container"
          style={{ display: 'flex', alignItems: 'center' }}>
          {statuses.map((status) => (
            <div
              key={status.text}
              className={`ott-background-100 ott-color-10 category ${status.selected ? 'selected-category' : ''} ${getStatusClass(status.text)}`}
              onClick={() => filterByCategory(status)} >
              {status.text}
            </div>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center" }} >
          <FormControl margin="normal" sx={{ marginRight: 2, minWidth: 150 }}>
            <InputLabel>Filter by Time-Range</InputLabel>
            <Select value={selectedTimeRangeFilter} onChange={(e) => setSelectedTimeRangeFilter(e.target.value)}
              label="Filter by Time-Range" sx={{ height: '35px' }}>
              <MenuItem value="today">Today</MenuItem>
              <MenuItem value="lweek">Last week</MenuItem>
              <MenuItem value="l2week">Last two weeks</MenuItem>
              <MenuItem value="lmonth">Last month</MenuItem>
            </Select>
          </FormControl>

          <FormControl margin="normal" sx={{ marginRight: 2, minWidth: 150 }}>
            <InputLabel>Filter by Channel</InputLabel>
            <Select
              multiple
              value={selectedChannels}
              onChange={(e) => setSelectedChannels(e.target.value as number[])}
              label="Filter by Channel"
              sx={{ height: '35px' }}
              renderValue={(selected) => {
                if (selected.length === 1 && selected[0] === -1) {
                  return "No channel filter";
                }
                return selected
                  .filter((value) => value !== -1)
                  .map((value) => {
                    const channel = channels.find((c) => c.id === value);
                    return channel ? channel.displayName : null;
                  })
                  .filter(Boolean)
                  .join(', ');
              }}
            >
              <MenuItem key="-1" value={-1}>
                {"No channel filter"}
              </MenuItem>
              {channels.map((channel) => (
                <MenuItem key={channel.id} value={channel.id}>
                  {channel.displayName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl margin="normal" sx={{ minWidth: 120 }}>
            <InputLabel>Sort By</InputLabel>
            <Select value={selectedSortBy} onChange={(e) => setSelectedSortBy(e.target.value as number)}
              label="Sort By" sx={{ height: '35px' }}>
              <MenuItem value="0">Newest</MenuItem>
              <MenuItem value="1">Oldest</MenuItem>
            </Select>
          </FormControl>
        </div>
      </Toolbar>

      {/* sx={{ border: "1px solid #EDE7F6" }} */}
      <TableContainer >
        <Table>
          <TableHead >
            <TableRow sx={{backgroundColor: '#EDE7F6'}}>
              <TableCell sx={{ backgroundColor: '#EDE7F6', fontWeight: 'Bold', textAlign: 'center' }}>Name</TableCell>
              <TableCell sx={{ backgroundColor: '#EDE7F6', fontWeight: 'Bold', textAlign: 'center' }}>Status</TableCell>
              <TableCell sx={{ backgroundColor: '#EDE7F6', fontWeight: 'Bold', textAlign: 'center' }}>Date</TableCell>
              <TableCell sx={{ backgroundColor: '#EDE7F6', fontWeight: 'Bold', textAlign: 'center' }}>Next Scheduled Time</TableCell>
              <TableCell sx={{ backgroundColor: '#EDE7F6', fontWeight: 'Bold', textAlign: 'center' }}>Channels</TableCell>
              <TableCell sx={{ backgroundColor: '#EDE7F6', fontWeight: 'Bold', textAlign: 'center' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : (
              filteredJobs.map((job) => (
                <TableRow key={job.Id}>
                  <TableCell sx={{ width: '35%', borderRight: '1px solid #ddd' }}>
                    <JobNameContainer>
                      <div className="job-name-grid" >
                        <div className="ott-no-wrap ott-h2-fnt">{job.Name}</div>
                        <div></div>
                        {job.Operations?.length && (
                          <div className="ott-h4-fnt">
                            <span className="ott-color-30" style={{ marginRight: '5px' }}>
                              Operations:
                            </span>
                            {job.Operations.map((operation, index, array) => (
                              <span key={index} style={{ fontStyle: 'italic' }}>
                                {operation}
                                {index < array.length - 1 && <span>,</span>}
                              </span>
                            ))}
                          </div>
                        )}
                        {job.Keywords?.length && (
                          <div className="ott-h4-fnt">
                            <span className="ott-color-30" style={{ marginRight: '5px' }}>
                              Searched words:
                            </span>
                            {job.Keywords.map((word, index, array) => (
                              <span key={index} style={{ fontStyle: 'italic' }}>
                                {word}
                                {index < array.length - 1 && <span>,</span>}
                              </span>
                            ))}
                          </div>
                        )}
                        {job.Notifications?.length && (
                          <div className="ott-h4-fnt">
                            <span className="ott-color-30" style={{ marginRight: '5px' }}>
                              Notifications:
                            </span>
                            {job.Notifications.map((notification, index, array) => (
                              <span key={index} style={{ fontStyle: 'italic' }}>
                                {notification}
                                {index < array.length - 1 && <span>,</span>}
                              </span>
                            ))}
                          </div>
                        )}
                        <div></div>
                        <div className="ott-body-35-fnt ott-no-wrap ott-color-30">
                          <span>Created on </span>
                          <span style={{ marginLeft: '5px' }}>
                            {job.CreatedAt && format(new Date(job.CreatedAt), 'MM/dd/yyyy')}
                          </span>
                          <span style={{ marginLeft: '5px' }}>
                            {job.CreatedAt && format(new Date(job.CreatedAt), 'HH:mm')}
                          </span>
                          <span style={{ marginLeft: '5px', marginRight: '5px' }}>by</span>
                          <span>{job.CreatedBy}</span>
                        </div>
                      </div>
                    </JobNameContainer>
                  </TableCell>
                  <JobStatusCell job={{ Status: job.Status! }} />
                  <DateCell job={job} />
                  <NextScheduledTimeCell job={job} />
                  <TableCell sx={{ borderRight: '1px solid #ddd' }}>
                    {job.Channels?.map((channel) => (
                      <div
                        key={channel.id} // Add a unique key for each element in the map
                        style={{ fontSize: '14px', fontWeight: 400 }}
                      >
                        {channel.displayName}
                      </div>
                    ))}
                  </TableCell>
                  <TableCell>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <IconButton style={{ backgroundColor: 'red' }} aria-label="pause">
                        {/* <Avatar sx={{ bgcolor: 'red' }}> */}
                        <PauseIcon sx={{ color: 'white' }} />
                        {/* </Avatar> */}
                      </IconButton>
                      <IconButton style={{ backgroundColor: 'blue' }} aria-label="delete">
                        {/* <Avatar sx={{ bgcolor: 'blue' }}> */}
                        <DeleteIcon sx={{ color: 'white' }} />
                        {/* </Avatar> */}
                      </IconButton>
                    </div>
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

    </Paper >
  );
};

export default JobDashboardPage;

