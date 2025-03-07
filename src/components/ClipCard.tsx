import React, { useState, useRef } from 'react';
import { Checkbox, IconButton, Menu, MenuItem, Tooltip } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { AIClipDm, Channel } from '../models/Models';
import Spinner from 'react-spinner-material';
import './ClipCard.css';
import { LockOpen, MoreVert, Delete, Share, AttachFile, PersonOutline, CalendarToday } from '@mui/icons-material';

const ClipCard: React.FC<{ clip: AIClipDm, sharedChannels: Channel[] }> = ({ clip, sharedChannels }) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [showBarAndPoint, setShowBarAndPoint] = useState(false);
  const [barLeft, setBarLeft] = useState(0);
  const [pointLeft, setPointLeft] = useState(0);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [currentResultIndex, setCurrentResultIndex] = useState(0);
  const [queryResults, setQueryResults] = useState(clip.Insights[0]?.Results || []); //TODO PATCH
  const [shouldShowClipNameInfoFlag, setShouldShowClipNameInfoFlag] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [channels, setChannels] = useState<Channel[]>([]);

  const thumbnailImageRef = useRef<HTMLDivElement>(null);

  const searchTerm = "";

  const getThumbnailUrl = (): string => {
    const baseMediaUrl = "/v2/ActIntelligenceService/intelligence/mediadelivery";
    const positionalTime = 0;
    return `${baseMediaUrl}/thumbnail/${clip.Id}?second=${positionalTime}`;
  };

  const convertSecondsToMinutes = (seconds: number): string => {
    const totalSeconds = Math.round(seconds); // Round to the nearest whole second
    const minutes = Math.floor(totalSeconds / 60);
    const remainingSeconds = totalSeconds % 60;
    if (remainingSeconds === 0)
      return `${minutes}`;
    const formattedSeconds = remainingSeconds < 10 ? `0${remainingSeconds}` : `${remainingSeconds}`;
    return `${minutes}:${formattedSeconds}`;
  };

  const handleImageLoad = () => {
    setIsImageLoaded(true);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLImageElement>) => {
    if (thumbnailImageRef.current) {
      const rect = thumbnailImageRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      setBarLeft(x);
      setPointLeft(x);
      setShowBarAndPoint(true);
    }
  };

  const handleMouseOut = () => {
    setShowBarAndPoint(false);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const getHighlightedWords = () => {
    // if (!queryResults[currentResultIndex]?.TimeCodedContentWithSearchData[0]?.text) {
    //   return [];
    // }

    // const text = queryResults[currentResultIndex].timeCodedContentWithSearchData.text;
    // const words: string[] = text.split(' ');
    // return words.map(word => ({
    //   value: word,
    //   isHighlighted: searchTerm && word.toLowerCase().includes(searchTerm.toLowerCase()),
    // }));
  };

  const getPrevResult = () => {
    setCurrentResultIndex(prevIndex => (prevIndex - 1 + queryResults.length) % queryResults.length);
  };

  const getNextResult = () => {
    setCurrentResultIndex(prevIndex => (prevIndex + 1) % queryResults.length);
  };

  const visibleTags = clip.UserTags?.slice(0, 3) || [];
  const hiddenTagsCount = 0;//clip.UserTags?.length > 3 ? clip.UserTags.length - 3 : 0;//PATCH

  const goToClip = () => {

  }
  const onCheckboxClick = (clipId: string, clipSelected: boolean) => {

  }

  const getChannelLogoUrl = (channelDisplayName: string) => {
    const foundChannel = sharedChannels.find(channel => channel.displayName === channelDisplayName);
    if (foundChannel) {
      return foundChannel.logoUrl;
    }
  }

  const deleteClip = (clipId: string) => {

  }

  const share = (event: any): void => {
    throw new Error('Function not implemented.');
  }

  const createReport = (clipId: string, audioLanguage: string, clipName: string) => {

  }

  return (
    <div className={`video-clip ott-border-color-1000 ott-background-200 ${clip.selected ? 'clip-selected' : ''} ${searchTerm ? 'larger-height' : ''}`}>
      {clip.VideoProgress.Value === 'Done' && (
        <div ref={thumbnailImageRef} className="thumbnail-image" onClick={(e) => { e.stopPropagation(); goToClip(); }} onMouseOut={handleMouseOut}>
          <div className="top-elements"> {/* Container for checkbox and logo */}
            <Checkbox className="thumbnail-checkbox" onClick={(e) => { e.stopPropagation(); onCheckboxClick(clip.Id!, !clip.selected); }} checked={clip.selected || false} />
            <div><img src={getChannelLogoUrl(clip.ProxyMetadata!.ChannelDisplayName!)} alt="" className="channel-logo" /></div>
          </div>
          <img src={getThumbnailUrl()} alt={clip.Name} onLoad={handleImageLoad} className="img-thumbnail" hidden={!isImageLoaded} height="175px" width="311px" onMouseMove={handleMouseMove} />
          {showBarAndPoint && <div className="vertical-bar-up" style={{ left: `${barLeft}px` }}></div>}
          {showBarAndPoint && <div className="vertical-bar-bottom" style={{ left: `${barLeft}px` }}></div>}
          {showBarAndPoint && <div className="point" style={{ left: `${pointLeft}px` }}></div>}
          <div className="time-label">{convertSecondsToMinutes(clip.VideoDurationSec)} min</div>
          {clip.InsightsProgress.Value === 'ErrorProcessing' && (
            <div className="error-label">
              <ErrorOutlineIcon style={{ marginRight: '6px', marginTop: '-9px', verticalAlign: 'middle', height: '16px', width: '16px' }} />
              <span className="error-text">Error</span>
            </div>
          )}
          {(clip.InsightsProgress.Value === 'New' || clip.InsightsProgress.Value === 'Processing') && (
            <div className="insight-processing">
              <div className="analyzing-div flex-row">
                <Spinner radius={10} color={"#fff"} stroke={2} visible={clip.InsightsProgress.Value === 'Processing' || isAnalyzing} style={{ margin: '8px 8px 8px -40px' }} />
                <p className="analyzing-text">Analyzing</p>
              </div>
            </div>
          )}
        </div>
      )}

      {(clip.VideoProgress.Value === 'New' || clip.VideoProgress.Value === 'Processing') && (
        <div className="ott-background-300 loading-container">
          <Spinner radius={20} color={"#abb2b966"} stroke={3} visible={true} />
          <div><img src={getChannelLogoUrl(clip.ProxyMetadata!.ChannelDisplayName!)} alt="" className="channel-logo" /></div>
        </div>
      )}

      {clip.VideoProgress.Value === 'ErrorProcessing' && (
        <div className="ott-background-300 video-creation-failed">
          <Checkbox className="thumbnail-checkbox" onClick={(e) => { e.stopPropagation(); onCheckboxClick(clip.Id!, !clip.selected); }} checked={clip.selected || false} />
          <ErrorOutlineIcon className="error-icon" />
          <div><img src={getChannelLogoUrl(clip.ProxyMetadata!.ChannelDisplayName!)} alt="" className="channel-logo" /></div>
          <div className="error-label" title={clip.Status}>
            <ErrorOutlineIcon style={{ marginRight: '6px', marginTop: '-9px', verticalAlign: 'middle', height: '16px', width: '16px' }} />
            <span className="error-text">Error</span>
          </div>
        </div>
      )}

      {/* <div className="details default-cursor" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {clip.Visibility?.Value === 'Private' && <LockOpenIcon className="lock-icon" />}
          <Tooltip title={clip.Name}>
            <span>{clip.Name}</span>
          </Tooltip>
        </div>
        <div style={{ marginLeft: 'auto', position: 'relative', top: '-30px', right: '-15px'}}>
          <IconButton onClick={handleMenuOpen} className="ott-mat-icon-2 ott-pointer menu-button">
            <MoreVertIcon className="menu-icon" />
          </IconButton>
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
            <MenuItem onClick={() => deleteClip(clip.Id!)}>
              <span>Delete</span>
            </MenuItem>
            <MenuItem onClick={share}>
              <span>Share</span>
            </MenuItem>
            <MenuItem onClick={() => createReport(clip.Id!, clip.AudioLanguage, clip.Name)}>
              <span>Report</span>
            </MenuItem>
          </Menu>
        </div>
      </div>
      <div className="time-tags-container ott-body-2-fnt ott-color-20 ott-no-wrap">
        <div className="icon-and-text-container">
          <PersonOutlineIcon className="created-by-icon" />
          <span>
            {clip.CreatedBy} at{' '}
            {new Date(clip.CreatedDate!).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            {' '}
            {new Date(clip.CreatedDate!).toLocaleDateString([], { year: '2-digit', month: 'numeric', day: '2-digit' })}
          </span>
        </div>
        <div className="icon-and-text-container">
          <CalendarTodayIcon className="created-at-icon" />
          <span className="ellipsis">
            {new Date(clip.ProxyMetadata?.From!).toLocaleDateString([], { year: '2-digit', month: 'numeric', day: '2-digit' })}
            {' '}
            {new Date(clip.ProxyMetadata?.From!).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            {' '}
            [{clip.ProxyMetadata?.ChannelDisplayName}]
          </span>
        </div>
        <div className="tags-container">
          {visibleTags.map((tag, index) => (
            <span key={index} className="tag ott-background-3001 ott-color-20">
              {tag}
            </span>
          ))}
          {hiddenTagsCount > 0 && (
            <Tooltip title={clip.UserTags?.slice(3).join(', ')}>
              <span className="tag ott-background-3001 ott-color-20">+{hiddenTagsCount}</span>
            </Tooltip>
          )}
        </div>
        {queryResults.length > 0 && (
          <div className="ott-background-350 ott-border-color-1000 ott-color-20 additional-info">
            <div className="additional-text">
              <img src="./resources/MediaInsightStart.png" className="search-img" alt="Search" />
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
        {shouldShowClipNameInfoFlag && (
          <div className="ott-background-350 ott-border-color-1000 clip-name-info">
            <div className="additional-text">
              <img src="./resources/MediaInsightStart.png" className="search-img" alt="Search" />
              <span>Found in clip's name</span>
            </div>
          </div>
        )}
      </div> */}
      <div className="details default-cursor">
        {/* Clip Header */}
        <div className="row bold smaller-font ott-h3-fnt ott-color-20 ott-no-wrap">
          <div className="left-content ott-h3-fnt ott-color-20 ott-no-wrap">
            {clip.Visibility?.Value === "Private" && <LockOpen className="lock-icon" />}
            <Tooltip title={clip.Name}>
              <span className="clip-name">{clip.Name}</span>
            </Tooltip>
          </div>

          {true && (
            <div className="right-content-menu">
              <IconButton onClick={handleMenuOpen} className="ott-mat-icon-2 ott-pointer menu-button">
                <MoreVert className="menu-icon" />
              </IconButton>
              <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                <MenuItem onClick={() => deleteClip(clip.Id!)}>
                  <Delete color="primary" />
                  <span>Delete</span>
                </MenuItem>
                <MenuItem onClick={share}>
                  <Share color="primary" />
                  <span>Share</span>
                </MenuItem>
                <MenuItem onClick={() => createReport(clip.Id!, clip.AudioLanguage, clip.Name)}>
                  <AttachFile color="primary" />
                  <span>Report</span>
                </MenuItem>
              </Menu>
            </div>
          )}
        </div>

        {/* Time and Tags Section */}
        <div className="time-tags-container ott-body-2-fnt ott-color-20 ott-no-wrap">
          <div className="icon-and-text-container">
            <PersonOutline className="created-by-icon" />
            <span>
              {clip.CreatedBy} at {new Date(clip.CreatedDate!).toLocaleTimeString()} {new Date(clip.CreatedDate!).toLocaleDateString()}
            </span>
          </div>
          <div className="icon-and-text-container">
            <CalendarToday className="created-at-icon" />
            <span className="ellipsis" >
              {clip?.ProxyMetadata?.To ? new Date(clip.ProxyMetadata.To).toLocaleDateString() : ""}
              {clip?.ProxyMetadata?.From ? new Date(clip.ProxyMetadata.From).toLocaleTimeString() : ""}
              [{clip?.ProxyMetadata?.ChannelDisplayName}]
            </span>
          </div>

          {/* Tags */}
          <div className="tags-container">
            {visibleTags.map((tag, index) => (
              <span key={index} className="tag ott-background-3001 ott-color-20">
                {tag}
              </span>
            ))}
            {hiddenTagsCount > 0 && (
              <Tooltip title={clip.UserTags!.slice(3).join(", ")}>
                <span className="tag ott-background-3001 ott-color-20">{"+" + hiddenTagsCount}</span>
              </Tooltip>
            )}
          </div>
        </div>
      </div>

    </div>
  );
};

export default ClipCard;