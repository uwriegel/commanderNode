<template>
    <div class="submenu">
        <menu-item class="submenuitem" v-for="(item, index) in items" :key="index" :item='item' :menuState='menuState' :index='index' 
            :subMenuState='subMenuState' />
    </div>    
</template>

<script>
import MenuItem from './MenuItem.vue'
import { getAccelerators, parseAccelerators } from './accelerators'

export default {
    name: 'sub-menu',
    data: function () {
        return {
            subMenuState: {
                selectedIndex: -1
            }
        }
    },
    components: {
        MenuItem
    },
    props: [
        'items',
        'menuState'
    ],
    methods: {
        onKeyDown: function (evt) {
            switch (evt.which) {
                case 40: //  |d
                    this.subMenuState.selectedIndex++
                    if (this.items.length == this.subMenuState.selectedIndex)
                        this.subMenuState.selectedIndex = 0
                    if (this.items[this.subMenuState.selectedIndex].name == '-')
                        this.subMenuState.selectedIndex++
                    break
                case 38: //  |^
                    this.subMenuState.selectedIndex--
                    if (this.subMenuState.selectedIndex < 0)
                        this.subMenuState.selectedIndex = this.items.length - 1
                    if (this.items[this.subMenuState.selectedIndex].name == '-')
                        this.subMenuState.selectedIndex--
                    break
                case 13: // Enter
                case 32: // Space
                    if (this.items[this.subMenuState.selectedIndex].action)
                        this.items[this.subMenuState.selectedIndex].action()
                    break
                default:
                    const hits = parseAccelerators(this.accelerators, evt.key)
                    if (hits.length == 1 && this.items[hits[0]].action)
                            this.items[hits[0]].action()
                    break
            }
        }
    },
    mounted: function () {
        this.accelerators = getAccelerators(this.items)
    },
    accelerators: {}
}
</script>

<style>
    .submenu {
        background-color: white; 
        position: absolute;
        color: black;
        border-color: lightgray;
        border-style: solid;
        border-width: 1px;
        white-space: nowrap;
        box-shadow: 3px 3px 3px rgba(0, 0, 0, 0.21);
    }
</style>
