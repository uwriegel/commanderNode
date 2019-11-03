export enum RootType {
	UNKNOWN,
	HARDDRIVE,
	ROM,
	REMOVABLE,
    NETWORK,
    SHARES,
    SERVICES
}

export enum ServiceStatus {
    DEFAULT,
    STOPPED,
    IS_STARTING,
    IS_STOPPING,
    STARTED
}

declare enum NetShareType {
    DISKTREE,
	PRINTQ,
	DEVICE,
	IPC
}

export interface FileItem {
    name: string
    isSelected: boolean

    size?: number
    time?: Date
    isDirectory: boolean
    isHidden?: boolean

    isExif?: boolean
    version?: string
}

export interface DriveItem {
    name: string
    isSelected: boolean

    description?: string
    size?: number
    type: RootType
    isMounted?: boolean
}

export interface Version
{
    major: number
    minor: number
    patch: number
    build: number
}

export interface Conflict {
    name: string
    sourceSize: number,
    sourceTime: Date,
    sourceVersion?: Version
    targetSize: number,
    targetTime: Date,
    targetVersion?: Version
}

export interface Service {
    name: string,
    displayName: string,
    status: ServiceStatus,
}

export interface NetShare {
    name: string,
    isSelected: boolean
    description: string
    type: NetShareType
}

export interface ExtensionFs {
    getFiles(path: string): Promise<FileItem[]>
    getDrives(): Promise<DriveItem[]>
    getIcon(extension: string): Promise<Buffer>
    getExifDate(path: string): Promise<Date|null>
    getConflicts(sourcePath: string, targetPath: string, items: string[]): Promise<Conflict[]>
    getFileVersion(path: string): Promise<Version>
    showInfo(path: string): void
    open(path: string): void
    openAs(path: string): void
    createDirectory(path: string): Promise<void>
    rename(path: string, name: string, newName: string): Promise<void>
    deleteFiles(pathes: string[]): Promise<void>
    copyFiles(sourcePath: string, targetPAth: string, files: string[]): Promise<void>
    moveFiles(sourcePath: string, targetPAth: string, files: string[]): Promise<void>
    existsFile(path: string): boolean
    getServices(): Promise<Service[]>
    registerServiceEvents(callback: (changeServices: Service[]) => void): number
    unregisterServiceEvents(handle: number): void
    startService(name: string): void
    stopService(name: string): void
    startElevated(): void
    getNetShares(server: string): Promise<NetShare[]>
    getTest(): number
}

const addon: ExtensionFs = (window as any).extFs
export default addon