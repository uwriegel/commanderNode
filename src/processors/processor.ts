import { isLinux, pathDelimiter } from '../platform'
import { getRootProcessor as getWindowsRootProcessor } from './windows/root'
import { getRootProcessor as getLinuxRootProcessor } from './linux/root'
import { DriveItem } from '../extensionFs'
import { getServicesProcessor } from './services'
import { getNetworkSharesProcessor } from './networkShares'
import { getNetworkShareProcessor } from './networkShare'
import { getDirectoryProcessor } from './directory'

export interface DriveViewItem extends DriveItem, FolderItem {} 

export const ROOT = "root:"
export const SERVICES = "services:"
export const SHARES = "shares:"

// TODO: onAction: getShares mit starker Verzögerung, wenn dann bereits weiter geändert

export interface FolderColumn {
    name: string
    isSortable?: boolean
    sortAscending?: boolean
    columnsType?: number
    width?: number | string
}

export const FOLDER_DEFAULT = "DEFAULT"

export interface FolderColumns {
    type: string
    values: FolderColumn[]
}

export interface FolderItem {
    name: string
    isCurrent?: boolean
    index?: number
    isSelected?: boolean
    isDirectory: boolean
    isHidden?: boolean    
}

export interface Processor {
    name: string
    path: string
    dispose(): void
    getColumns(recentColumns: FolderColumns): FolderColumns
    getItems(path?: string, showHidden?: boolean): Promise<FolderItem[]>
    onAction(items: FolderItem[]): OnActionResult
    sort(items: FolderItem[], index: number, descending: boolean, showHidden?: boolean): FolderItem[],
    getItemWithPath(path: string, item: FolderItem): string | undefined
}

export interface OnActionResult {
    done: boolean,
    newProcessor?: Processor,
    path?: string
    lastPath?: string
}

export function createProcessor(recentProcessor: Processor, path: string) {
    switch (path) {
        case ROOT:
            return isLinux 
                ? getLinuxRootProcessor(recentProcessor) 
                : getWindowsRootProcessor(recentProcessor)
        case SERVICES:
            return getServicesProcessor(recentProcessor)
        case SHARES:
            return getNetworkSharesProcessor(recentProcessor)
        default:
            return (path && path.startsWith("\\\\") && path.indexOf('\\', 2) == -1)
                ? getNetworkShareProcessor(recentProcessor, path)
                : getDirectoryProcessor(recentProcessor, path)
   }
}

export function getDefaultProcessor(): Processor {
    return { 
        name: "default",
        path: "default",
        dispose: () => {},
        getColumns: (recentColumns: FolderColumns) => { return { type: FOLDER_DEFAULT, values: []} },
        getItems: () => new Promise<FolderItem[]>(_ => {}),
        onAction: (items: FolderItem[]) => { return { done: false }},
        sort: (items: FolderItem[], index: number, descending: boolean, showHidden?: boolean) => [],
        getItemWithPath: (path: string, item: FolderItem) => undefined 
    }
}

export function combinePath(path1: string, path2: string) {
    if (path2 == "..") {
        let pos = path1.lastIndexOf(pathDelimiter, path1.length - 2)
        if (path1[pos - 1] == ':')
            pos += 1
        return pos != -1 ? path1.substr(0, pos) : undefined
    }
    return path1.endsWith(pathDelimiter) ? path1 + path2 : path1 + pathDelimiter + path2
}


