<template>
    <div>
        <p>
            <input ref="enabled" type="checkbox" v-model="enabled"><span>Erweitertes Umbenennen</span>
        </p>
        <table>
            <tr>
                <td class="title">Prefix:</td>
                <td><input ref="prefix" type="text" :disabled="!enabled" v-model="prefix" v-selectall></td>
            </tr>
            <tr>
                <td class="title">Stellen:</td>
                <td>
                    <select ref="digits" :disabled="!enabled" v-model="digits">
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                    </select>                    
                </td>
            </tr>
            <tr>
                <td class="title">Start:</td>
                <td><input ref="startIndex" type="number" :disabled="!enabled" v-model="startIndex" v-selectall></td>
            </tr>
        </table>
    </div>
</template>

<script>
export default {
    data() {
        return {
            enabled: false,
            prefix: localStorage["extendedRenamePrexix"] || "Bild",
            digits: localStorage["extendedRenameDigits"] || 3,
            startIndex: localStorage["extendedRenameStartIndex"] || 0,
        }
    },
    methods: {
        getFocusables() {
            return [ this.$refs.enabled, this.$refs.prefix, this.$refs.digits, this.$refs.startIndex ]
        },
        getFocusIndex(buttonCount) {
            return buttonCount
        },
        getDefaultButton(defBtn) { return defBtn }
    },
    destroyed() {
        localStorage["extendedRenamePrexix"] = this.prefix
        localStorage["extendedRenameDigits"] = this.digits
        localStorage["extendedRenameStartIndex"] = this.startIndex
    }

}
</script>

<style scoped>
.title {
    text-align: right;
}
</style>