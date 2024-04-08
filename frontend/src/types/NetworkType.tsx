export interface RecordType {
    DownloadSpeed: number,
    IPS: string,
    Ping: number,
    Time: Date,
    UploadSpeed: number
}

export interface HeartbeatType {
    IsAlive: boolean | null,
    Time: Date | null
}

export interface RecordStatusType {
    networkStatus: string
    networkStatusColor: "Success" | "Warning" | "Danger" | "Secondary"
    networkTime: string
    networkLatency: string
    networkLatencyColor: "Success" | "Warning" | "Danger" | "Secondary"
    networkUploadSpeed: string
    networkUploadSpeedColor: "Success" | "Warning" | "Danger" | "Secondary"
    networkDownloadSpeed: string
    networkDownloadSpeedColor: "Success" | "Warning" | "Danger" | "Secondary"
}