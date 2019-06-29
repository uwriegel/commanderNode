<template>
    <table>
        <columns :columns='columns' :columnsWidths='columnsWidths' @on-columns-widths-changed='onColumnsWidthChanged'></columns>
        <tbody>
            <tr>
                <td>Test</td>
                <td>txt</td>
                <td>25.02.1999 14:23</td>
            </tr>
            <tr>
                <td>Bild</td>
                <td>jpg</td>
                <td>15.12.2009 12:39</td>
            </tr>
        </tbody>
    </table>        
</template>

<script>
export default {
    name: 'table-view'
}
</script>

<style scoped>

</style>
