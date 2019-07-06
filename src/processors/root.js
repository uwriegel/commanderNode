const name = "root"

export function getRootProcessor() {
    function checkPath(path) { return path == name }
    function getColumns(columns) {
        return columns && columns.type == name
            ? columns
            : {
                type: name,
                values: [{
    //                    columnsType: ColumnsType.String,
                        isSortable: true,
                        name: "Name"
                    }, {
    //                    columnsType: ColumnsType.String,
                        isSortable: true,
                        name: "Beschreibung"
                    }, {
    //                    columnsType: ColumnsType.Size,
                        isSortable: true,
                        name: "Größe"
                    }
                ]
            }
    }

    return {
        checkPath,
        getColumns
    }
}