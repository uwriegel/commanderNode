<template>
    <div :class="{separatorItem: separator}">
        <div v-show="!menuState.accelerated && !separator">{{name}}</div>
        <div v-show="menuState.accelerated && !separator">
            <span>{{pre}}</span><span class="accelerated">{{acc}}</span><span>{{post}}</span>
        </div>
        <hr v-show="separator" />
    </div>
</template>

<script>
export default {
    name: 'menu-item',
    props: [
        'item',
        'menuState'
    ],
    computed: {
        name: function () {
            return this.item.replace("_", "")
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
            return this.item == '-'
        }
    },
    methods: {
        getParts: function () {
            if (!this.parts) {
                const pos = this.item.indexOf('_')
                if (pos == -1) 
                    this.parts = ["", "", this.item]
                else if (pos == 0) 
                    this.parts = ["", this.item[1], this.item.substring(2)]
                else {
                    this.parts = [ 
                        this.item.substring(0, pos), 
                        this.item[pos + 1], 
                        this.item.substring(pos + 2)
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
    .submenuitem:hover {
        background-color: blue;
        color: white;
    }
    .submenuitem {
        padding: 5px 20px;
    }
    .separatorItem {
        padding: 0px;
    }
    .separatorItem>hr {
        border:solid #ddd 0.5px
    }
</style>
