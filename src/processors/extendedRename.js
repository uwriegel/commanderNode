import { createProcessor } from './processor'
const name = "extendedRename"

export function reset(processor) {
    return createProcessor(processor.path)
}

export function create(directoryProcessor) {
    const processor = directoryProcessor
    processor.name = name
    processor.getColumns = function (columns) {
        return columns && columns.type == name
            ? columns
            : {
                type: name,
                values: [{
                        isSortable: true,
                        name: "Name"
                    }, {
                        isSortable: true,
                        name: "Neu"
                    }, {
                        isSortable: true,
                        name: "Erw."
                    }, {
                        isSortable: true,
                        name: "Datum"
                    }, {
                        isSortable: true,
                        name: "Größe"
                    }
                ]
            }
    }

    return processor
}