<template>
    <div class="menuitem" :class="{separatorItem: separator, 'selected': selected }" @click="onClick" @mouseover='onMouseOver'>
        <div class="menuitemtext" v-if="!menuState.accelerated && !separator">
            <span class="selector" :class="{ 'isSelected': isSelected }">✓</span>
            <span>{{name}}</span>
            <span class="spacer"> </span>
            <span v-if='item.accelerator'>{{item.accelerator.name}}</span>
        </div>
        <div class="menuitemtext" v-if="menuState.accelerated && !separator">
            <span class="selector" :class="{ 'isSelected': isSelected }">✓</span>
            <div>
                <span>{{pre}}</span><span class="accelerated">{{acc}}</span><span>{{post}}</span>
            </div>
            <span class="spacer"> </span>
            <span v-if='item.accelerator'>{{item.accelerator.name}}</span>
        </div>
        <hr v-if="separator" />
    </div>
</template>

<script>
export default {
    name: 'menu-item',
    data() {
        return {
            isSelected: false
        }
    },
    props: [
        'item',
        'menuState',
        'index',
        'subMenuState'
    ],
    computed: {
        name: function () {
            return this.item.name.replace("_", "")
        },
        pre: function () {
            return this.getParts()[0]
        },
        acc: function () {
            return this.getParts()[1]
        },
        post: function () {
            return this.getParts()[2]
        },
        separator: function () {
            return this.item.name == '-'
        },
        selected: function () {
            return this.subMenuState && this.subMenuState.selectedIndex == this.index
        }
    },
    mounted() {
        if (this.item.checkSelected) 
            this.isSelected = this.item.checkSelected()
    },
    methods: {
        onMouseOver: function () {
            if (this.subMenuState && !this.separator)
                this.subMenuState.selectedIndex = this.index 
        },       
        onClick: function () {
            this.$emit('on-menu-item-clicked', this.item.action, this)
        },
        getParts: function () {
            if (!this.parts) {
                const pos = this.item.name.indexOf('_')
                if (pos == -1) 
                    this.parts = ["", "", this.item.name]
                else if (pos == 0) 
                    this.parts = ["", this.item.name[1], this.item.name.substring(2)]
                else {
                    this.parts = [ 
                        this.item.name.substring(0, pos), 
                        this.item.name[pos + 1], 
                        this.item.name.substring(pos + 2)
                    ]
                } 
            }
            return this.parts
        }
    }
}
</script>

<style>
    .menuitemtext {
        display: flex;
    }
    .selector {
        display: none;
    }
    .submenuitem .selector {
        display: inline-block;
        opacity: 0;
        padding: 0px 7px;
    }
    .submenuitem .selector.isSelected {
        opacity: 1;
    }
    .submenuitem .spacer {
        flex-grow: 1;
        min-width: 20px;
    }
    .accelerated {
        text-decoration: underline;
    }
    .menuitem.selected {
        background-color: var(--selected-background-color);
        color: var(--selected-color);
    }
    .submenuitem {
        padding: 5px 20px 5px 0px;
    }
    .separatorItem {
        padding: 0px 5px;
    }
    .separatorItem>hr {
        border:solid var(--menu-separator-color) 0.5px
    }
</style>
