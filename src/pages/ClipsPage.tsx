import React, { useState, useRef, useEffect } from 'react';
import {
  Toolbar,
  Input,
  IconButton,
  Icon,
  Select,
  MenuItem,
  Checkbox,
  Divider,
  Button,
  Tooltip,
  FormControl,
  InputLabel,
  FormHelperText,
  Typography,
  InputAdornment,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import RefreshIcon from '@mui/icons-material/Refresh';
import DeleteIcon from '@mui/icons-material/Delete';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import CancelIcon from '@mui/icons-material/Cancel';

import './ClipsPage.css'; // Assuming you have your styles in ClipsPage.css
import { getChannels, graphql_searchClips} from '../api/jobService';
import { AIClipDm, Channel, UITag } from '../models/Models';
import ClipCard from '../components/ClipCard';

const ClipsPage = () => {
  const [welcomeScreenShown, setWelcomeScreenShown] = useState(false); // Replace with your logic
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [searchTerm, setSearchTerm] = useState(''); // Assuming searchTerm is a local state
  const [hasText, setHasText] = useState(false);
  const [selectedSearch, setSelectedSearch] = useState('All');
  const [isLowerToolbarHidden, setIsLowerToolbarHidden] = useState(false);
  const [isAllClipsSelected, setIsAllClipsSelected] = useState(false);
  const [selectedClips, setSelectedClips] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [filteredClips, setFilteredClips] = useState<AIClipDm[]>([]); // Assuming filteredClips is a local state
  const [isSearching, setIsSearching] = useState(false);
  const categoryContainerRef = useRef(null);
  const [clips, setClips] = useState<AIClipDm[]>([]);
  const searchPlaceholder = 'Search Clips...'; // Replace with your translation logic

  const [selectedTimeRangeFilter, setSelectedTimeRangeFilter] = useState<string | null>('lmonth');
  const [filterFromDate, setFilterFromDate] = useState<Date | undefined>();
  const [filterToDate, setFilterToDate] = useState<Date | undefined>();
  const [selectedChannels, setSelectedChannels] = useState<number[]>([-1]); // Default to placeholder
  const [channels, setChannels] = useState<Channel[]>([]);
  const [selectedSortBy, setSelectedSortBy] = useState<number>(0);
  const [uiClipTags, setUiClipTags] = useState<UITag[]>([]);

  const onSearchClick = () => {
    // setIsSearchExpanded(!isSearchExpanded);
  };

  const onSearchClips = (value: any) => {
    setSearchTerm(value);
    // Implement your search logic here
  };

  const onInput = () => {
    setHasText(searchTerm !== '');
  };

  const refreshAll = () => {
    // Implement your refresh logic here
  };

  const addNewClip = () => {
    // Implement your add new clip logic here
  };

  const toggleLowerToolbars = () => {
    setIsLowerToolbarHidden(!isLowerToolbarHidden);
    console.log(isLowerToolbarHidden);
  };

  const selectAllClips = (checked: boolean | ((prevState: boolean) => boolean)) => {
    setIsAllClipsSelected(checked);
    // Implement your select all clips logic here
  };

  const deleteSelected = () => {
    // Implement your delete selected clips logic here
  };

  const onTimeFilterIntervalChanged = (event: any) => {
    // Implement your time filter logic here
  };

  const onChannelSelectionChanged = (event: any) => {
    // Implement your channel selection logic here
  };

  const dateChanged = () => {
    // Implement your date change logic here
  };

  const scrollCategories = (direction: any) => {
    // if (categoryContainerRef.current) {
    //   categoryContainerRef.current.scrollLeft += direction * 100; // Adjust scroll amount as needed
    // }
  };

  const showLeftButton = () => {
    // if (categoryContainerRef.current) {
    //   return categoryContainerRef.current.scrollLeft > 0;
    // }
    return false;
  };

  const showRightButton = () => {
    if (categoryContainerRef.current) {
      // if (categoryContainerRef.current) {
      //   return categoryContainerRef.current.scrollLeft < categoryContainerRef.current.scrollWidth - categoryContainerRef.current.clientWidth;
      // }
    }
    return false;
  };

  const toggleTagSelection = (tag: any) => {
    // Implement your tag selection logic here
  };

  const unselectAllTags = () => {
    // Implement your unselect all tags logic here
  };

  const unselectTag = (tag: any) => {
    // Implement your unselect tag logic here
  };

  const getGalleryHeight = () => {
    // Implement your gallery height logic here
    return '500px'; // Example height
  };

  const findAndSetUiClipTags = (clips: AIClipDm[]): UITag[] => {
    const clipTagsSet = new Set<string>();

    clips.forEach(clip => {
        clip?.UserTags?.forEach(tag => {
            if (tag.trim() !== "") {
                clipTagsSet.add(tag.trim());
            }
        });
    });

    return Array.from(clipTagsSet, tag => ({ text: tag, selected: false }));
    //return Array.from(clipTagsSet, tag => ({ text: tag, selected: this.selectedTags.includes(tag) }));
}

  useEffect(() => {
    fetchChannels();
    fetchClips();
  }, []);

  const fetchChannels = () => {
    getChannels()
      .then((channels) => setChannels(channels))
      .catch((error: any) => console.error("Failed to load channels:", error))
  }

  const fetchClips = () => {
    graphql_searchClips()
      .then((clipsData) => {
        setClips(clipsData);
        setFilteredClips(clipsData);
        const tags = findAndSetUiClipTags(clipsData);
        setUiClipTags(tags);
        console.log(clipsData);
      })
      .catch((error) => console.error("Failed to load channels:", error))
  }

  return (
    <div className="ott ott-background-200 main-div">
      <div className="ott ott-background-200 main-div">
        <div className="sticky-div" style={{ display: welcomeScreenShown ? 'none' : 'block' }}>

          <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#EEEFF7', gap: 3 }}>
            <Typography variant="h6" sx={{ width: '200px' }}>Clips</Typography>
            <div className="ott-background-200 ott-border-color-1000 search-container" style={{ marginLeft: '-800px' }}>

              <div className={`search-div ${isSearchExpanded ? 'expanded' : ''}`} onClick={onSearchClick}>
                <div className="animated-search">
                  <div className="ott-input-with-suffix-prefix animated-search-div">
                    <Input
                      autoComplete="off"
                      value={searchTerm}
                      onChange={(e) => onSearchClips(e.target.value)}
                      placeholder={searchPlaceholder}
                      className="override-placeholder-style"
                      classes={{ input: hasText ? 'has-text' : '' }}
                      onInput={onInput}
                      startAdornment={ // Add SearchIcon as startAdornment
                        <InputAdornment position="start">
                          <SearchIcon />
                        </InputAdornment>
                      }
                      endAdornment={ // Add CloseIcon as endAdornment
                        searchTerm !== '' && (
                          <InputAdornment position="end">
                            <IconButton onClick={() => onSearchClips('')} edge="end">
                              <CloseIcon />
                            </IconButton>
                          </InputAdornment>
                        )
                      }
                      sx={{ // Add styling for input field
                        backgroundColor: 'white', // Whitish background
                        border: '1px solid lightgray', // Add border
                        borderRadius: '6px', // Maintain border-radius
                      }}
                    />
                  </div>
                </div>
              </div>
              <FormHelperText className="ott-color-20">
                Search for &nbsp;
                <FormControl>
                  <Select
                    value={selectedSearch}
                    onChange={(e) => setSelectedSearch(e.target.value)}
                    className="primary-color"
                    style={{ fontWeight: 500, height: '20px' }} >
                    <MenuItem value="All">
                      <Tooltip title="Filter by all the words">
                        <span onClick={() => { }}>ALL</span>
                      </Tooltip>
                    </MenuItem>
                    <MenuItem value="ANY">
                      <Tooltip title="Filter by any of the words">
                        <span onClick={() => { }}>ANY</span>
                      </Tooltip>
                    </MenuItem>
                  </Select>
                </FormControl>
                &nbsp;words.
              </FormHelperText>
            </div>
            <div>
              <Button className="ott-button refresh-button" variant="outlined" onClick={refreshAll} sx={{ marginRight: 2 }}>
                <RefreshIcon className="ott-mat-icon-2 button-icon" />
                <span className="button-text">Refresh</span>
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={addNewClip}
                className="add-clip-button">
                <img src="./resources/white_ai.svg" className="add-clip-img" alt="New Clip" />
                New Clip
              </Button>
            </div>
          </Toolbar>

          <Toolbar sx={{ display: "flex", justifyContent: "space-between", border: "2px solid #D6DBF8", backgroundColor: 'whitesmoked' }}
            className={`filters-toolbar sliding-toolbar ott-background-200 ott-border-color-1000 ${isLowerToolbarHidden ? 'hidden-toolbar' : ''}`}>
            <Typography variant="h6"></Typography>
            <div className="category-toolbar">
              {showLeftButton() && (
                <IconButton onClick={() => scrollCategories(-1)} className="arrow-icon">
                  <ChevronLeftIcon />
                </IconButton>
              )}
              <div ref={categoryContainerRef} className="category-container">
                {uiClipTags.map((tag) => (
                  <div
                    key={tag.text}
                    className={`ott-background-100 ott-color-10 category ${tag.selected ? 'ott-background-3001' : ''}`}
                    title={tag.text}
                    onClick={() => toggleTagSelection(tag)}
                  >
                    {tag.text}
                  </div>
                ))}
              </div>
              {showRightButton() && (
                <IconButton onClick={() => scrollCategories(1)} className="arrow-icon">
                  <ChevronRightIcon />
                </IconButton>
              )}
            </div>
            <div>
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
                  <MenuItem value={0}>Newest</MenuItem>
                  <MenuItem value={1}>Oldest</MenuItem>
                  <MenuItem value={2}>A-&gt;z</MenuItem>
                  <MenuItem value={3}>Z-&gt;a</MenuItem>
                  <MenuItem value={4}>Longest</MenuItem>
                  <MenuItem value={5}>Shortest</MenuItem>
                </Select>
              </FormControl>
            </div>
          </Toolbar>

          <Button variant='outlined'
            className={`ott-background-200 ott-border-color-1000 appendix mat-stroked-button ${isLowerToolbarHidden ? 'show-filters' : 'hide'}`}
            onClick={() => toggleLowerToolbars()}>
            {isLowerToolbarHidden ? (
              <ExpandMoreIcon className="ott-mat-icon-2 appendix-button" />
            ) : (
              <ExpandLessIcon className="ott-mat-icon-2 appendix-button" />
            )}
            <span className="appendix-text">{isLowerToolbarHidden ? 'Show filters' : 'Hide filters'}</span>
          </Button>

          <Toolbar className={`clips-summary-toolbar sliding-toolbar ott-background-200 ott-border-color-1000 ${isLowerToolbarHidden ? 'hidden-toolbar' : ''}`} >
            <Checkbox
              className="select-all-clips"
              checked={isAllClipsSelected}
              onChange={(e) => selectAllClips(e.target.checked)}
            />
            <span className="summary-font ott-no-wrap clips-length">
              {filteredClips.length} Clips
            </span>
            {filteredClips.length === 1000 && ( // Replace 1000 with your actual limitNumberOfClips
              <FormHelperText className="clips-limit-mat-hint ott-color-20">
                Displaying first 1000 clips.
                <Tooltip
                  title={`You've reached the limit of 1000 clips allowed. Consider narrowing down the results using one or a combination of the following filters: time interval, channels or search words.`}
                  placement="right"
                >
                  <span className="primary-color">(*)</span>
                </Tooltip>
              </FormHelperText>
            )}
            <Divider orientation="vertical" className="divider" />
            {selectedClips.length > 0 && (
              <span className="summary-font ott-no-wrap selected-clips">
                {selectedClips.length} Clips Selected
              </span>
            )}
            {selectedClips.length > 0 && ( // Assuming mediaInsightUserRight is always 2
              <Button variant="outlined" className="ott-button delete-button" onClick={deleteSelected}>
                <DeleteIcon className="ott-mat-icon-2 button-icon" color="primary" />
                <span className="button-text">Delete</span>
              </Button>
            )}
            {selectedTags.length > 0 && <Divider orientation="vertical" className="divider" />}
            {selectedTags.length > 0 && (
              <div className="filtered-by-container">
                <IconButton className="primary-color" title="Clear filter" onClick={unselectAllTags}>
                  <CancelIcon />
                </IconButton>
                <span className="summary-font ott-no-wrap selected-clips">Filtered by:</span>
                <div className="selected-category-container primary-color">
                  {selectedTags.map((tag, index) => (
                    <span
                      key={index}
                      className="selected-category summary-font ott-no-wrap"
                      title={tag}
                      onClick={() => unselectTag(tag)}
                    >
                      {tag}
                      {index < selectedTags.length - 1 && ','}
                    </span>
                  ))}
                </div>
              </div>
            )}
            <span className="example-spacer"></span>
          </Toolbar>
        </div>

        {
          welcomeScreenShown && (
            <div className="ott-background-200 ott-border-color-1000 welcome-screen">
              <div className="image-container">
                <img src="./resources/MediaInsightSubtract.png" alt="Media Insight Subtract" />
                <img src="./resources/MediaInsightStart.png" className="secondary-image" alt="Media Insight Start" />
              </div>
              <h2 className="no-clips-yet">You don't have any clips yet</h2>
              <span>Create a clip and start using Actus Ai features</span>
              <Button variant="contained" color="primary" onClick={addNewClip} className="welcome-new-clip-button">
                <img src="./resources/white_ai.svg" className="new-clip-img" alt="New Clip" />
                New Clip
              </Button>
            </div>
          )
        }

        {
          filteredClips.length === 0 && (
            <div className="ott-background-200 ott-border-color-1000 welcome-screen">
              <div className="image-container">
                <img src={process.env.PUBLIC_URL + '/images/MediaInsightSubtract.png'} alt="Media Insight Subtract" />
                <img src={process.env.PUBLIC_URL + '/images/MediaInsightStart.png'} className="secondary-image" alt="Media Insight Start" />
              </div>
              <h2 className={`ott-color-10 no-clips-yet ${isSearching ? '' : 'hidden'}`}>Loading clips...</h2>
              <h2 className={`ott-color-10 no-clips-yet ${!isSearching ? '' : 'hidden'}`}>No Clips Found...</h2>
            </div>
          )
        }

        {
          filteredClips.length > 0 && (
            <div className="video-clip-gallery ott-background-200 ott-border-color-1000" style={{ height: getGalleryHeight() }}>
              {filteredClips.map((clip) => (
                <ClipCard key={clip.Id} clip={clip} sharedChannels={channels}/>
              ))}
            </div>
          )
        }
      </div >
    </div >
  );
};

export default ClipsPage;