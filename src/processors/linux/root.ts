import { Processor, ROOT, SERVICES, SHARES, FolderColumns, FolderItem, DriveViewItem } from '../processor'
import { DriveItem, RootType } from '../../extensionFs'
import { getDirectoryProcessor } from '../directory'
const child_process = window.require('child_process')

const processorName = "root"
/*
struct Drive_item {
	const std::wstring name;
	const std::wstring description;
	const uint64_t size;
	const Drive_type type;
	const bool is_mounted;
};
*/

export function getRootProcessor(processor: Processor): Processor {
    if (processor) {
        if (processor.name == processorName)
            return processor
        processor.dispose()
    }
    let sortIndex: number | null = null
    let sortDescending = false
    
    function checkPath(path: string) { return path == ROOT }

    function getColumns(recentColumns: FolderColumns) {
        return recentColumns.type == ROOT
            ? recentColumns
            : {
                type: ROOT,
                values: [{
                        isSortable: true,
                        name: "Name"
                    }, {
                        isSortable: true,
                        name: "Beschreibung"
                    }, {
                        isSortable: true,
                        name: "Mount"
                    }, 
                    {
                        isSortable: true,
                        name: "Größe"
                    }, 
                    {
                        isSortable: true,
                        name: "Typ"
                    }
                ]
            }
    }

    function dispose() {}

    async function getItems() {
        const blkString = await lsblk()

        const items = ([] as DriveItem[]) //(await extFs.getDrives()).filter(n => n.isMounted)
            .concat([ 
                { name: "SHARES_NAME", type: RootType.SHARES, size: 0 },
                { name: "SERVICES_NAME", type: RootType.SERVICES, size: 0 }
            ])
            .map((n, i) => {
                const dvi = n as DriveViewItem
                if (i == 0)
                    dvi.isSelected = true
                return dvi
            })
        return refresh(items)
    }
    
    function sort(items: FolderItem[], index: number, descending: boolean) {
        sortIndex = index
        sortDescending = descending
        return refresh(items)
    }

    function refresh(items: FolderItem[]) {
        if (sortIndex != null) {
            const sort = 
            sortIndex == 0 
                ? (a: DriveItem, b: DriveItem) => a.name.localeCompare(b.name) :
                sortIndex == 1 
                ? (a: DriveItem, b: DriveItem) => a.description && b.description ? a.description.localeCompare(b.description) : 0
                : (a: DriveItem, b: DriveItem) => a.size - b.size
                
                return items.sort((a: FolderItem, b: FolderItem) => (sortDescending ? -1 : 1) * sort(a as DriveViewItem, b as DriveViewItem))
        }
        else 
            return items
    }    

    function onAction(items: FolderItem[]) {
        const driveItems = items as DriveViewItem[]
        if (driveItems.length == 1)
            return {
                done: false,
                newProcessor: getDirectoryProcessor(thisProcessor, driveItems[0].name), 
                path: driveItems[0].name
            }
    }    
    
    function getItemWithPath(path: string, item: DriveViewItem) { return item.name }

    function canCreateFolder() { return false }
    function canDelete() { return false }
    function canRename() { return false }
    function canExtendedRename() { return false }
    function canCopyItems() { return false }
    function canMoveItems() { return false }
    function canInsertItems() { return false }

    var thisProcessor = {
        name: processorName,
        path: ROOT,
        dispose,
        checkPath,
        getColumns,
        getItems,
        sort,
        refresh,
        onAction,
        getItemWithPath,
        canCreateFolder,
        canDelete,
        canRename,
        canExtendedRename,
        canCopyItems,
        canMoveItems,        
        canInsertItems
    }
    return thisProcessor
}

function lsblk() {
    return new Promise<string>((res, rej) => 
        child_process.exec('lsblk --bytes --output NAME,LABEL,MOUNTPOINT,FSTYPE,SIZE', (error: any, stdout: string, stderr: any) => res(stdout))
    )
}

/*
mport { RootPresenter as RootPresenterBase, PresenterBase, RootItem } from '../../rootpresenter.js'
import { ColumnsControl } from '../../../columnscontrol.js'
import { formatFileSize } from '../../../filehelper.js'

export interface LinuxRootItem extends RootItem {
    type: string
}

export class RootPresenter extends RootPresenterBase {

    constructor() {
        super()
    }

    protected setColumns() {
        this.view.setColumns(new ColumnsControl(["Name", "Typ", "Beschreibung", "Mount", "Größe"], "4"))
    }

    protected processFill() {
        return new Promise<void>(async resolve => {

            const initialItems = [ {
                displayName: 'Home',
                description: "Persönlicher Ordner",
                size: -1,
                type: "",
                path: process.env.HOME!,
                isDirectory: true
            }]

            var rootItems = await this.getItems()

            this.items = initialItems.concat(rootItems)
            this.view.itemsChanged(0)

            resolve()
        })
    }

    protected createItem(item?: RootItem) : HTMLTableRowElement {
        const tr = document.createElement("tr")
        
        const linuxRootItem = item as LinuxRootItem
        if (item && !item.path)
            tr.classList.add("it-hidden")
    
        let td = PresenterBase.itemIconNameTemplate.cloneNode(true) as HTMLTableDataCellElement
        let img = td.querySelector('img') as HTMLImageElement
        img.src = "assets/images/drive.png"
        let span = td.querySelector('span') as HTMLSpanElement
        span.innerText = item ? item.displayName : 'W'
        tr.appendChild(td)
        
        td = PresenterBase.itemTemplate.cloneNode(true) as HTMLTableDataCellElement
        span = td.querySelector('span') as HTMLSpanElement
        span.innerText = linuxRootItem ? linuxRootItem.type : 'W'
        tr.appendChild(td)

        td = PresenterBase.itemTemplate.cloneNode(true) as HTMLTableDataCellElement
        span = td.querySelector('span') as HTMLSpanElement
        span.innerText = item ? item.description : 'W'
        tr.appendChild(td)

        td = PresenterBase.itemTemplate.cloneNode(true) as HTMLTableDataCellElement
        span = td.querySelector('span') as HTMLSpanElement
        span.innerText = item ? item.path : 'W'
        tr.appendChild(td)

        td = PresenterBase.itemRightTemplate.cloneNode(true) as HTMLTableDataCellElement
        span = td.querySelector('span') as HTMLSpanElement
        span.innerText = item ? formatFileSize(item.size) : 'W'
        tr.appendChild(td)
        
        tr.tabIndex = 1
        return tr
    }

    async getItems() {
        const childProcess = require("child_process")

        async function getDrives() {
            return new Promise<string>(resolve => {
                let result = ""
                const process = childProcess.spawn('lsblk',["--bytes", "--output", "NAME,FSTYPE,LABEL,MOUNTPOINT,MODEL,SIZE"])
                process.stdout.on('data', (data: Buffer) => {
                    const lines = data.toString('utf8').trim()
                    if (lines != "None") 
                        result += lines
                })
                process.on('close', () => resolve(result));
            })
        }

        const result = await getDrives()
        const lines = result.split("\n")
        const header = lines[0]
        const pos2 = header.indexOf("FSTYPE")
        const pos3 = header.indexOf("LABEL")
        const pos4 = header.indexOf("MOUNTPOINT")
        const pos5 = header.indexOf("MODEL")
                
        const filteredLines = lines.filter(n => !n.startsWith("NAME") && !n.startsWith("loop"))
        const drives = filteredLines.filter(n => !n.startsWith("└") && !n.startsWith("├"))
        const partitions = filteredLines.filter(n => n.startsWith("└") || n.startsWith("├"))
    
        const driveItems = drives.map(n => { return {
                name: n.substring(0, pos2).trim(),
                model: n.substring(pos5).trim()
            }
        })
    
        return partitions.map(n =>{ 
            const name = n.substring(2, pos2).trim() 
            let label = n.substring(pos3, pos4).trim() 
            if (!label) 
                label = driveItems.find(n => n.name == name.substr(0, 3))!.model
                
            const laststr = n.substr(pos5)
            const pos = laststr.indexOf(' ')
            const size = laststr.substr(pos).trim()

            return {
                displayName: name,
                description: label,
                size: Number.parseInt(size),
                type: n.substring(pos2, pos3).trim(),
                path: n.substring(pos4, pos5).trim(),
                isDirectory: true
            }
        }).filter(n => n.type && n.type != "swap")
    }
}
*/