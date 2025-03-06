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
  TextField,
  FormControl,
  InputLabel,
  FormHelperText,
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

// Assuming you have these components as React components
// import TimePeriod from './TimePeriod'; // Replace with the correct path
// import ChannelMiniSelector from './ChannelMiniSelector'; // Replace with the correct path
// import ClipCard from './ClipCard'; // Replace with the correct path

import './ClipsPage.css'; // Assuming you have your styles in ClipsPage.css
import { graphql_searchClips } from '../api/jobService';
import { AIClipDm } from '../models/Models';
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
  const [clips,setClips] = useState<AIClipDm[]>([]);
  const searchPlaceholder = 'Search Clips...'; // Replace with your translation logic

  const onSearchClick = () => {
    setIsSearchExpanded(!isSearchExpanded);
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

  useEffect(() => {
    fetchClips();
  }, []);

  const fetchClips = () => {
    graphql_searchClips()
      .then((clipsData) => { 
        setClips(clipsData);
        setFilteredClips(clipsData);
        console.log(clipsData);
      })
      .catch((error) => console.error("Failed to load channels:", error))
  }

  return (
    <div className="ott ott-background-200 main-div">
      <div className="ott ott-background-200 main-div">
        <div className="sticky-div" style={{ display: welcomeScreenShown ? 'none' : 'block' }}>
          <Toolbar className="search-toolbar ott-background-3000">
            <span className="clips-span">Clips</span>
            <div className="ott-background-200 ott-border-color-1000 search-container">
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
                    />
                    <div className="ott-input-icon ott-left-input-icon">
                      <SearchIcon />
                    </div>
                    {searchTerm !== '' && (
                      <div className="ott-input-icon ott-right-input-icon">
                        <IconButton onClick={() => onSearchClips('')}>
                          <CloseIcon />
                        </IconButton>
                      </div>
                    )}
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
                    style={{ fontWeight: 500 }}
                  >
                    <MenuItem value="All">
                      <Tooltip title="Filter by all the words">
                        <span onClick={() => { /* Implement your searchOperandAnd logic here */ }}>ALL</span>
                      </Tooltip>
                    </MenuItem>
                    <MenuItem value="ANY">
                      <Tooltip title="Filter by any of the words">
                        <span onClick={() => { /* Implement your searchOperandAnd logic here */ }}>ANY</span>
                      </Tooltip>
                    </MenuItem>
                  </Select>
                </FormControl>
                &nbsp;words.
              </FormHelperText>
            </div>
            <span className="example-spacer"></span>
            <Button className="ott-button refresh-button" onClick={refreshAll}>
              <RefreshIcon className="ott-mat-icon-2 button-icon" />
              <span className="button-text">Refresh</span>
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={addNewClip}
              className="add-clip-button"
              style={{ display: 'block' }} // Assuming mediaInsightUserRight is always 2
            >
              <img src="./resources/white_ai.svg" className="add-clip-img" alt="New Clip" />
              New Clip
            </Button>
          </Toolbar>

          <Toolbar
            className={`filters-toolbar sliding-toolbar ott-background-200 ott-border-color-1000 ${isLowerToolbarHidden ? 'hidden-toolbar' : ''}`}
          >
            <div className="category-toolbar">
              {showLeftButton() && (
                <IconButton onClick={() => scrollCategories(-1)} className="arrow-icon">
                  <ChevronLeftIcon />
                </IconButton>
              )}
              <div ref={categoryContainerRef} className="category-container">
                {/* Assuming mediaInsightService.uiClipTags is now a prop or local state */}
                {/* {filteredClips.map((tag) => (
                  <div
                    key={tag.id}
                    className={`ott-background-100 ott-color-10 category ${tag.selected ? 'ott-background-3001' : ''}`}
                    title={tag.text}
                    onClick={() => toggleTagSelection(tag)}
                  >
                    {tag.text}
                  </div>
                ))} */}
              </div>
              {showRightButton() && (
                <IconButton onClick={() => scrollCategories(1)} className="arrow-icon">
                  <ChevronRightIcon />
                </IconButton>
              )}
            </div>

            <span className="example-spacer"></span>
            {/* <TimePeriod className="time-period" onIntervalChanged={onTimeFilterIntervalChanged} initialType="today" />
            <ChannelMiniSelector
              onChannelsSelected={onChannelSelectionChanged}
              refreshChannels={refreshAll} // Assuming refreshAll is the refresh function
              className="channel-field"
              header="Filter by channel"
              width="240px"
              no_channels_selected="No channel filter"
              all_channels="All active channels"
              mat_label_color="ott-background-200"
              // initialChannelIds={mediaInsightService.selectedChannelsIds} // Replace with your logic
            /> */}
            <div className="ca-toolbar-export-time sort-div">
              <TextField
                select
                label="Sort by"
                variant="outlined"
                className="sort-container"
                value={0} // Replace with your selected sort option logic
                onChange={dateChanged}
              >
                <MenuItem value={0}>Newest</MenuItem>
                <MenuItem value={1}>Oldest</MenuItem>
                <MenuItem value={2}>A-&gt;z</MenuItem>
                <MenuItem value={3}>Z-&gt;a</MenuItem>
                <MenuItem value={4}>Longest</MenuItem>
                <MenuItem value={5}>Shortest</MenuItem>
              </TextField>
            </div>
          </Toolbar>

          <Button
            className={`ott-background-200 ott-border-color-1000 appendix mat-stroked-button ${isLowerToolbarHidden ? 'show-filters' : 'hide'}`}
            onClick={toggleLowerToolbars}
          >
            {isLowerToolbarHidden ? (
              <ExpandMoreIcon className="ott-mat-icon-2 appendix-button" />
            ) : (
              <ExpandLessIcon className="ott-mat-icon-2 appendix-button" />
            )}
            <span className="appendix-text">{isLowerToolbarHidden ? 'Show filters' : 'Hide filters'}</span>
          </Button>

          <Toolbar
            className={`clips-summary-toolbar sliding-toolbar ott-background-200 ott-border-color-1000 ${isLowerToolbarHidden ? 'hidden-toolbar' : ''}`}
          >
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

        {welcomeScreenShown && (
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
        )}

        {filteredClips.length === 0 && (
          <div className="ott-background-200 ott-border-color-1000 welcome-screen">
            <div className="image-container">
              <img src={process.env.PUBLIC_URL + '/images/MediaInsightSubtract.png'} alt="Media Insight Subtract" />
              <img src={process.env.PUBLIC_URL + '/images/MediaInsightStart.png'} className="secondary-image" alt="Media Insight Start" />
            </div>
            <h2 className={`ott-color-10 no-clips-yet ${isSearching ? '' : 'hidden'}`}>Loading clips...</h2>
            <h2 className={`ott-color-10 no-clips-yet ${!isSearching ? '' : 'hidden'}`}>No Clips Found...</h2>
          </div>
        )}

        {filteredClips.length > 0 && (
          <div className="video-clip-gallery ott-background-200 ott-border-color-1000" style={{ height: getGalleryHeight() }}>
            {filteredClips.map((clip) => (
              <ClipCard key={clip.Id} clip={clip} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClipsPage;