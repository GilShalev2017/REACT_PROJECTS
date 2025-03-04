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
    recordingRoot: string;
    liveRecordingRoot: string;
    physicalName: string;
    liveThumbnailUrl: string;
    serverId: number;
    serverName: string;
    backupServerName: string;
    groupId: number;
    position_in_group: number;
    logoUrl: string;
    color: string;
    loudnessEnabled: boolean;
    description: string;
    player?: any;
    thumb?: string;
    teletextLng: string[];
    subtitleLng: string[];
    audioLng: string[];
    audioOnly: boolean;
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
