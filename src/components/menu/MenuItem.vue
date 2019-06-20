<template>
    <div class="menuitem" :class="{separatorItem: separator, 'selected': selected }" @click="onClick" >
        <div v-if="!menuState.accelerated && !separator">{{name}}</div>
        <div v-if="menuState.accelerated && !separator">
            <span>{{pre}}</span><span class="accelerated">{{acc}}</span><span>{{post}}</span>
        </div>
        <hr v-if="separator" />
    </div>
</template>

<script>
export default {
    name: 'menu-item',
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
    methods: {
        onClick: function () {
            if (this.item.action)
                this.item.action()
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
            return this.parts;
        }
    },
    parts: null
}
</script>

<style>
    .accelerated {
        text-decoration: underline;
    }
    .menuitem.selected {
        background-color: blue;
        color: white;
    }
    .submenuitem {
        padding: 5px 20px;
    }
    .separatorItem {
        padding: 0px 5px;
    }
    .separatorItem>hr {
        border:solid #ddd 0.5px
    }
</style>
