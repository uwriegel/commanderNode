import { getDirectoryProcessor } from '../directory'
import { ROOT, SERVICES, SHARES } from '../processor'
import { getServicesProcessor, SERVICES_NAME } from '../services'
import { getNetworkSharesProcessor, SHARES_NAME } from '../networkShares'

const processorName = "root"

/*
enum class Drive_type
{
	UNKNOWN,
	HARDDRIVE,
	ROM,
	REMOVABLE,
    NETWORK,
    
    Services,
    NetworkShares
};

struct Drive_item {
	const std::wstring name;
	const std::wstring description;
	const uint64_t size;
	const Drive_type type;
	const bool is_mounted;
};
*/

export function getRootProcessor(processor) {
    if (processor) {
        if (processor.name == processorName)
            return processor
        processor.dispose()
    }
    let sortIndex = null
    let sortDescending = false
    
    function checkPath(path) { return path == ROOT }

    function getColumns(columns) {
        return columns && columns.type == ROOT
            ? columns
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
        const items = [] //(await extFs.getDrives()).filter(n => n.isMounted)
            .concat([ 
                { name: SHARES_NAME, type: 6 },
                { name: SERVICES_NAME, type: 5 }
            ])
        items.forEach(n => {
            n.isSelected = false
            n.isExif = false
            n.version = ""
        })
        return refresh(items)
    }
    function sort(items, index, descending) {
        sortIndex = index
        sortDescending = descending
        return refresh(items)
    }
    function refresh(items) {
        if (sortIndex != null) {
            const sort = 
            sortIndex == 0 
                    ? (a, b) => a.name.localeCompare(b.name) :
                    sortIndex == 1 
                    ? (a, b) => a.description.localeCompare(b.description)
                    : (a, b) => a.size - b.size
                    
            return items.sort((a, b) => (sortDescending ? -1 : 1) * sort(a, b))
        }
        else 
            return items
    }    

    function onAction(items) {
        if (items.length == 1)
            return {
                done: false,
                newProcessor: items[0].type == 5 
                        ? getServicesProcessor(thisProcessor) 
                        : (items[0].type == 6 
                            ? getNetworkSharesProcessor(thisProcessor) 
                            : getDirectoryProcessor(thisProcessor, items[0].name)), 
                path: items[0].type == 5 
                    ? SERVICES 
                    : (items[0].type == 6 
                        ? SHARES
                        :items[0].name)
            }
    }    
    
    function getItemWithPath(path, item) { return item.name }

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