<template>
    <td class="icon-name"  >
        <img :src='itemUrl' @error="error" v-on:load="onload"  :class="{ hidden: defaultIcon==true }" >
        <file-icon v-if='defaultIcon==true'/>
        {{ itemName | nameOnly }}
    </td>
</template>

<script lang="ts">
import Vue, { PropType} from 'vue'
import FileIcon from '../../icons/FileIcon.vue'

export default Vue.extend({
    components: {
        FileIcon
    },
    data() {
        return {
            defaultIcon: false
        }
    },
    props: {
        itemUrl: String,
        itemName: String
    },
    methods: {
        onload(e: any) {
            this.defaultIcon = false
        },
        error(e: any) {
            this.$nextTick(() => this.defaultIcon = true)
        }
    }
})
</script>

<style scoped>
.hidden {
    opacity: 0.4;
    width: 0px;
}
img,svg {
    vertical-align: bottom;
    height: 16px;
}
.icon-name {
    display: block;
}
    </style>