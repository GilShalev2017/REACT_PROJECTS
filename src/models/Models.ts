export interface JobRequestFilter {
    Start?: Date;
    End?: Date;
    ChannelIds?: number[];
    Operation?: string;
    SearchTerm?: string;
    SortDirection?: number;
}

export interface Channel {
    id: number;
    displayName: string;
    recordingRoot?: string;
    liveRecordingRoot?: string;
    physicalName?: string;
    liveThumbnailUrl?: string;
    serverId?: number;
    serverName?: string;
    backupServerName?: string;
    groupId?: number;
    position_in_group?: number;
    logoUrl?: string;
    color?: string;
    loudnessEnabled?: boolean;
    description?: string;
    player?: any;
    thumb?: string;
    teletextLng?: string[];
    subtitleLng?: string[];
    audioLng?: string[];
    audioOnly?: boolean;
    framesRoot?: string;
    framesize?: string;
    bitrate?: string;
    ts_id?: number;
    license?: string[];
    sibling_channel_ids?: number[];
    category?: any;
}

export class ActEnums {
    constructor(public Value: string) { }

    public static getActEnumObjectByValue = (enum_obj: any, value: string) => {
        const key = Object.keys(enum_obj).find(key => key === value);
        return key ? enum_obj[key] : undefined; // Ensure the key exists before indexing
    };
}

export class VisibilityEnum extends ActEnums {
    static Private = new VisibilityEnum("Private");
    static Everyone = new VisibilityEnum("Everyone");
    constructor(Value: string) {
        super(Value);
    }
}

export class RuleRecurrenceEnum extends ActEnums {
    static readonly Once: RuleRecurrenceEnum = new RuleRecurrenceEnum('Once');
    static readonly Recurring: RuleRecurrenceEnum = new RuleRecurrenceEnum('Recurring');
    constructor(value: string) {
        super(value);
    }
}

export interface Rule {
    Recurrence: RuleRecurrenceEnum;
    Days: number;// = 0b1111111; // Represents each weekday in binary (Mon to Fri)
    RuleStart?: string;
    RuleEnd?: string;
}

export interface ChannelResultStatistics {
    KeywordDetectedAlertsSent?: number;
    KeywordsDetectionsFound?: string[];
    FaceDetectedAlertSent?: number;
    FaceDetectionsFound?: string[];
    LogoDetectedAlertSent?: number;
    LogoDetectionsFound?: string[];
    Mp4FilesProcessed?: number;
    Mp3FilesCreated?: number;
    DistinctAudioLanguages: string[];
    DistinctTranslatedLanguages: string[];
}

export interface ResultStatistics {
    ProcessDurationInMinutes: number;
    ChannelStatistics: { [channelId: string]: ChannelResultStatistics };
}

export interface RunHistoryEntry {
    ActualRunStartTime: Date; // Represents the start time of the run
    ActualRunEndTime: Date;   // Represents the end time of the run
    BroadcastStartTime: Date;
    BroadcastEndTime: Date;
    Statistics: ResultStatistics; // The statistics object for the run
    ChannelErrors: { [channelId: number]: string };
}

export interface AiJobRequest {
    Id?: string;
    Name: string;
    ChannelIds?: number[];
    Channels?: Channel[];
    Notifications?: string[];
    Visibility?: VisibilityEnum;
    Operations?: string[];
    BroadcastStartTime: Date;
    BroadcastEndTime: Date;
    NotificationIds: string[];
    Status?: string;
    Error?: string;
    nextScheduledTime?: string;
    NextScheduledTime?: Date;
    RequestRule?: Rule;
    TranslationLanguages?: string[];
    CreatedAt?: string;
    CreatedBy?: string;
    Keywords?: string[];
    KeywordsLangauges?: string[];
    RunHistory?: RunHistoryEntry[];
    //UI fields
    ShowErrors?: boolean;
    currentRunIndex?: number;
}

export class LanguageDm {
    EnglishName?: string;
    DisplayName: string = '';
    ProvidersLanguageCode?: { [providerId: string]: string } = {};
    isTranslated?: boolean;
}

export class AIClipSourceEnum extends ActEnums {
    static Proxy = new AIClipSourceEnum("Proxy");
    static HLS = new AIClipSourceEnum("HLS");
    static Upload = new AIClipSourceEnum("Upload");
    constructor(value: string) {
        super(value);
    }
}

export interface AIClipProxyMetadata {
    ChannelIds?: number[];
    ChannelDisplayName?: string;
    From: Date;
    To: Date;
    Status?: string;
    ProxyClipId?: string;
}

export interface AIClipUploadMetadata {
    VideoPath: string;
}

export class ProgressEnum extends ActEnums {
    static New = new ProgressEnum("New");
    static Processing = new ProgressEnum("Processing");
    static Done = new ProgressEnum("Done");
    static ErrorProcessing = new ProgressEnum("ErrorProcessing");
    static NotEnoughCredit = new ProgressEnum("NotEnoughCredit");
    constructor(value: string) {
        super(value);
    }
}

export interface KeyValuePair {
    key: string;
    value: string;
}

export interface TimeRange {
    StartInSeconds: number;
    EndInSeconds: number;
    Tooltip?: string;
    Name?: string;
}

export interface TimeCodedItem {
    ImageUrl?: string;
    TimeRanges: TimeRange[];
    Name: string;
    Description?: string;
    AppearancePercentage?: number;
    TotalSeconds: number;
    isSelected: boolean;
    Tooltip?: string;
}

export interface Transcript {
    [x: string]: any
    Text: string,
    StartInSeconds: number,
    EndInSeconds: number,
    isActive?: boolean,
    isPlaying?: boolean
}

export interface EmotionInstance {
    Confidence: number;
    AdjustedStart: number;
    AdjustedEnd: number;
    Start: number;
    End: number;
}

export interface Emotion {
    Id: number;
    Type?: string; //"Anger" | "Fear" | "Joy" | "Neutral" | "Sad" | null;
    Instances?: EmotionInstance[] | null;
}

export interface InsightResult {
    TimeCodedContentWithSearchData?: Transcript[]; //for search
    TimeCodedContent?: Transcript[];
    emotions?: Emotion[];
    Emotions?: Emotion[];
    TimeCodedItems?: TimeCodedItem[];
    //BulkData: string | null = null;
    AiProviderId: string | null;
    Cost?: number;
    Language: string;
    Prompt?: string;
}

export interface TranslateRequest {
    targetLanguage: string;
    Progress?: ProgressEnum;
}

export interface InsightRequest {
    Id?: string;
    InsightType: string;
    UserDefinedPrompt?: string;
    DependsOnInsightType?: string;
    Progress?: ProgressEnum;
    Status?: string;
    Results?: InsightResult[];
    StatusDetails?: string;
    TranslateRequests?: TranslateRequest[];
}

export interface AIClipDm {
    Id?: string;
    InternalId: string; // encoded parh to media file
    Visibility?: VisibilityEnum;
    selectedVisibility: string;
    ClipUrl?: string;
    Name: string;
    Description?: string;
    AIClipSource: AIClipSourceEnum;
    ProxyMetadata?: AIClipProxyMetadata;
    ProxyFrom: Date | string;
    ProxyTo: Date | string;
    ProxyChannelDisplayName: string;
    UploadMetadata?: AIClipUploadMetadata;
    VideoProgress: ProgressEnum;
    AudioProgress: ProgressEnum;
    InsightsProgress: ProgressEnum;
    VideoSizeB: number;
    VideoDurationSec: number;
    AudioDurationSec: number;
    VideoWidth: number;
    VideoHeight: number;
    VideoBitrate: number;
    AudioLanguage: string;
    VideoFilePath: string;
    AudioFilePath: string;
    Status: string;
    UserCategory: KeyValuePair[];
    PublishUrl?: string;
    Insights: InsightRequest[];
    LastUpdatedBy?: string;
    LastUpdateDate?: string;
    CreatedDate?: Date;
    MaxAccessRight?: string;
    UserTags?: string[];
    CreatedBy?: string;

    selected: boolean;
}

export interface UITag {
    text: string;
    selected: boolean;
}