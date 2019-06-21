<template>
    <div class="submenu">
        <menu-item class="submenuitem" v-for="(item, index) in items" :key="index" :item='item' 
            :menuState='menuState' :index='index' :subMenuState='subMenuState' />
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
        'menuState', 
        'keyDown'
    ],
    watch: {
        keyDown: function (newVal, oldVal) {
            this.onKeyDown(newVal)            
        }
    },
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
                    // transfer to event
                    this.menuState.closeMenu()
                    evt.preventDefault()
                    evt.stopPropagation()
                    break
                default:
                    const hits = parseAccelerators(this.accelerators, evt.key)

                    if (this.acceleratorHits) {
                        if (this.acceleratorHits.key == evt.key) {
                            this.acceleratorHits.index++
                            if (this.acceleratorHits.index >= this.acceleratorHits.hits.length)
                                this.acceleratorHits.index = 0
                            this.subMenuState.selectedIndex = hits[this.acceleratorHits.index]
                            return
                        }
                        this.acceleratorHits = null
                    }

                    if (hits.length == 1) {
                        if (this.items[hits[0]].action) 
                            this.items[hits[0]].action()
                        this.menuState.closeMenu()
                        evt.preventDefault()
                        evt.stopPropagation()
                        return
                    }
                    if (hits.length > 1) {
                        this.acceleratorHits = { key: evt.key, hits: hits, index: 0 }
                        this.subMenuState.selectedIndex = hits[0]
                    }
                    break
            }
        }
    },
    mounted: function () {
        this.accelerators = getAccelerators(this.items)
    },
    accelerators: {},
    acceleratorHits: null
}
</script>

<style>
    .submenu {
        color: var(--main-color);
        background-color: var(--main-background-color); 
        position: absolute;
        border-color: var(--menu-border-color);
        border-style: solid;
        border-width: 1px;
        white-space: nowrap;
        box-shadow: 3px 3px 3px var(--menu-shadow-color);
    }
</style>
