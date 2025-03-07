import React, { useState } from "react";
import { Tooltip, IconButton, Menu, MenuItem } from "@mui/material";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

const ClipDetails = ({ clip, mediaInsightUserRight, deleteClip, share, createReport, queryResults, visibleTags, hiddenTagsCount, shouldShowClipNameInfoFlag, getPrevResult, getNextResult, currentResultIndex }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className="details default-cursor">
      {/* Header Section */}
      <div className="row bold smaller-font ott-h3-fnt ott-color-20 ott-no-wrap">
        <div className="left-content ott-h3-fnt ott-color-20 ott-no-wrap">
          {clip.Visibility.Value === "Private" && <LockOpenIcon className="lock-icon" />}
          <Tooltip title={clip.Name}>
            <span>{clip.Name}</span>
          </Tooltip>
        </div>
        {mediaInsightUserRight === 2 && (
          <div className="right-content-menu">
            <IconButton onClick={handleMenuOpen} className="ott-mat-icon-2 ott-pointer menu-button">
              <MoreVertIcon className="menu-icon" />
            </IconButton>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
              <MenuItem onClick={() => deleteClip(clip.Id)}>
                <span>Delete</span>
              </MenuItem>
              <MenuItem onClick={share}>
                <span>Share</span>
              </MenuItem>
              <MenuItem onClick={() => createReport(clip.Id, clip.AudioLanguage, clip.Name)}>
                <span>Report</span>
              </MenuItem>
            </Menu>
          </div>
        )}
      </div>

      {/* Time and Tags Container */}
      <div className="time-tags-container ott-body-2-fnt ott-color-20 ott-no-wrap">
        <div className="icon-and-text-container">
          <PersonOutlineIcon className="created-by-icon" />
          <span>
            {clip.CreatedBy} at {new Date(clip.CreatedDate).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}{" "}
            {new Date(clip.CreatedDate).toLocaleDateString()}
          </span>
        </div>
        <div className="icon-and-text-container">
          <CalendarTodayIcon className="created-at-icon" />
          <span className="ellipsis">
            {clip.ProxyMetadata?.To && new Date(clip.ProxyMetadata.To).toLocaleDateString()}{" "}
            {clip.ProxyMetadata?.From && new Date(clip.ProxyMetadata.From).toLocaleTimeString()}{" "}
            [{clip.ProxyMetadata?.ChannelDisplayName}]
          </span>
        </div>

        {/* Tags */}
        <div className="tags-container">
          {visibleTags.slice(0, 3).map((tag, index) => (
            <span key={index} className="tag ott-background-3001 ott-color-20">{tag}</span>
          ))}
          {hiddenTagsCount > 0 && (
            <Tooltip title={clip.UserTags.slice(3).join(", ")}>
              <span className="tag ott-background-3001 ott-color-20">+{hiddenTagsCount}</span>
            </Tooltip>
          )}
        </div>

        {/* Query Results */}
        {queryResults.length > 0 && (
          <div className="ott-background-350 ott-border-color-1000 ott-color-20 additional-info">
            <div className="additional-text">
              <img src="./resources/MediaInsightStart.png" className="search-img" alt="Search" />
              {/* Implement getHighlightedWords function */}
            </div>
            <div className="additional-info-row">
              <div className="line-number">
                {currentResultIndex + 1}/{queryResults.length}
              </div>
              {queryResults.length > 1 && (
                <div className="arrows">
                  <span onClick={getPrevResult}>&lt;</span>
                  <span onClick={getNextResult}>&gt;</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Clip Name Search Result */}
        {shouldShowClipNameInfoFlag && (
          <div className="ott-background-350 ott-border-color-1000 clip-name-info">
            <div className="additional-text">
              <img src="./resources/MediaInsightStart.png" className="search-img" alt="Search" />
              <span>Found in clip's name</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClipDetails;
