<template>
    <div>
        <button @click="onTest">Test</button>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import affe, {getFiles} from 'extension-fs'

interface FileItem {
    name: string
    size: number
    time: Date
    isDirectory: boolean
    isHidden: boolean
}

enum DriveType
{
	UNKNOWN,
	HARDDRIVE,
	ROM,
	REMOVABLE,
	NETWORK
};

interface DriveItem {
    name: string
    description: string
    size: number
    type: DriveType
    isMounted: boolean
}

interface Version
{
    major: number
    minor: number
    patch: number
    build: number
}

interface Conflict {
    name: string
    sourceSize: number,
    sourceTime: Date,
    sourceVersion?: Version
    targetSize: number,
    targetTime: Date,
    targetVersion?: Version
}

declare module 'extension-fs' {
    function getFiles(path: string): Promise<FileItem[]>
    function getDrives(): Promise<DriveItem[]>
    function getIcon(extension: string): Promise<Buffer>
    function getExifDate(path: string): Promise<Date|null>
    function getConflicts(sourcePath: string, targetPath: string, items: string[]): Promise<Conflict[]>
    
    // TODO: ist das gut? lieeber Version|Null
    function getFileVersion(path: string): Promise<Version>
    function showInfo(path: string): void
    function open(path: string): void
    function openAs(path: string): void
    function createDirectory(path: string): Promise<void>
    function rename(path: string, name: string, newName: string): Promise<void>
    function deleteFiles(pathes: string[]): Promise<void>
    function copyFiles(sourcePath: string, targetPAth: string, files: string[]): Promise<void>
    function moveFiles(sourcePath: string, targetPAth: string, files: string[]): Promise<void>
    function existsFile(path: string): boolean

    // Neuste Nan version 

    // Jetzt
    function getServices(path: string, files: string[], callback: (error: any, res: string[]) => void): void
    function registerServiceEvents(path: string, files: string[], callback: (error: any, res: string[]) => void): void
    function unregisterServiceEvents(path: string, files: string[], callback: (error: any, res: string[]) => void): void
    function startService(path: string, files: string[], callback: (error: any, res: string[]) => void): void
    function stopService(path: string, files: string[], callback: (error: any, res: string[]) => void): void
    function startElevated(path: string, files: string[], callback: (error: any, res: string[]) => void): void
    function startService(path: string, files: string[], callback: (error: any, res: string[]) => void): void
    function getNetShares(path: string, files: string[], callback: (error: any, res: string[]) => void): void
    function getTest(path: string, files: string[], callback: (error: any, res: string[]) => void): void
}

export default {
    methods: {
        onTest() {
            getFiles()
            console.log("Hallo")
        }
    }
    
}
</script>

<style>

</style>