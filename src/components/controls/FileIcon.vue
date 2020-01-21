<template>
    <td class="icon-name"  >
        <img :src='itemUrl' @error="error" v-if='defaultIcon==false'>
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
        error(e: any) {
            this.$nextTick(() => this.defaultIcon = true)
        }
    }
})
</script>

<style scoped>
img,svg {
    vertical-align: bottom;
    height: 16px;
}
.icon-name {
    display: block;
}
    </style>