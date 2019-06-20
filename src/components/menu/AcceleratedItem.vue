<template>
    <div>
        <span>{{pre}}</span><span class="accelerated">{{acc}}</span><span>{{post}}</span>
    </div>    
</template>

<script>
export default {
    name: 'accelerated-item',
    props: [ 
        'item'
    ],
    computed: {
        pre: function () {
            return this.getParts()[0]
        },
        acc: function () {
            return this.getParts()[1]
        },
        post: function () {
            return this.getParts()[2]
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
                else 
                    this.parts = ["das", "gibts", "nich"]
            }
            return this.parts;
        }
    },
    parts: null
}
</script>

<style scoped>
    .accelerated {
        text-decoration: underline;
    }
</style>

