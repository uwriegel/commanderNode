// import { createProcessor } from './processor'
// const name = "extendedRename"

// export function reset(processor) {
//     return createProcessor(null, processor.path)
// }

// export function create(directoryProcessor) {
//     const processor = directoryProcessor
//     processor.name = name
//     processor.getColumns = function (columns) {
//         return columns && columns.type == name
//             ? columns
//             : {
//                 type: name,
//                 values: [{
//                         isSortable: true,
//                         name: "Name"
//                     }, {
//                         name: "Neu"
//                     }, {
//                         isSortable: true,
//                         name: "Erw."
//                     }, {
//                         isSortable: true,
//                         name: "Datum"
//                     }, {
//                         isSortable: true,
//                         name: "Größe"
//                     }
//                 ]
//             }
//     }
//     const baseSort = processor.sort
//     processor.sort = function (items, index, descending, showHidden) {
//         const renameSortIndex = index > 1 ? index - 1 : index
//         return baseSort(items, renameSortIndex, descending, showHidden)
//     }

//     return processor
// }