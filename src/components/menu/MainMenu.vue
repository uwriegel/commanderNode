<template>
    <div>
        <div class="flex">
            <ul id="menubar">
                <li id="menubar1" tabindex="1" @click="onClick0">
                    <span class="accelerator">D</span><span>atei</span>
                </li>
                <li id="menubar2" tabindex="2" @click="onClick1">
                    <span class="accelerator">N</span><span>avigation</span>
                </li>
                <li id="menubar3" tabindex="3" @click="onClick2">
                    <span class="accelerator">S</span><span>elektion</span>
                </li>
                <li id="menubar4" tabindex="4" @click="onClick3">
                    <span class="accelerator">A</span><span>nsicht</span>
                </li>
            </ul>
        </div>
        <SubMenu />
    </div>
</template>

<script>
import SubMenu from './SubMenu.vue'

export default {
    name: 'MainMenu',
    isInitialized: false,
    isActive: false,
    keyboardActivated: false,
    menuBar: null,
    subMenuOpened: true,
    components: {
        SubMenu
    },
    methods: {
        onClick: function (evt, index) {
            const li = evt.target.closest('li')
            const selected = li.classList.contains("selected")

            if (!this.isInitialized)
                this.initialize()

            if (!this.isActive)
                this.setActive()
            this.subMenuOpened = true

            this.clearSelection()
            if (!selected)
                this.focusLi(li)
            else
            {
                this.close()
                evt.stopPropagation()
                evt.preventDefault()
            }            
        },
        initialize: function () {
            this.menuBar = document.getElementById("menubar")
            this.menuBar.addEventListener("focusout", evt => {
                if (!(this.subMenuOpened && this.keyboardActivated) && !this.menuBar.contains(evt.relatedTarget))
                    this.close()
            })
        },
        focusLi: function (li) {
            li.classList.add("selected")
            li.focus()
            this.isActive = true
        },
        setActive: function () {},
        clearSelection: function () {
            Array.from(this.menuBar.querySelectorAll("#menubar>li")).forEach(n => n.classList.remove("selected"))
        },
        close: function () {
            // this.closeSubMenus()
            this.menuBar.classList.remove("keyboardActivated")
            this.keyboardActivated = false
            this.clearSelection()
            this.hasFocus = false
            this.isActive = false
            // this.acceleratorInitiated = false
            // this.setSubMenuClosed()
            // if (this.openedSubMenu)
            //    this.openedSubMenu.close()
            //this.openedSubMenu = null
            let lis = Array.from(this.menuBar.querySelectorAll("#menubar>li"))
            lis.forEach(n => n.onmouseover = null)
//            setTimeout(() => this.focusedView.focus(), 100)
        },
        onClick0: function(evt) { this.onClick(evt, 0) },
        onClick1: function(evt) { this.onClick(evt, 1) },
        onClick2: function(evt) { this.onClick(evt, 2) },
        onClick3: function(evt) { this.onClick(evt, 3) }
    }
}
</script>

<style>
.flex {
    display: flex;
}
#menubar
{
    user-select: none;
    cursor:default;
    list-style: none;
    padding: 0;
    margin: 0;
}
#menubar>li
{
    cursor: default;
    display: block;
    float: left;
    position: relative;
    padding-left: 5px;
    padding-top: 2px;
    padding-right: 5px;
    padding-bottom: 2px;
}

#menubar>li:focus
{
    outline: none;
}

#menubar>li:hover
{
    background-color: rgb(235,235,255);
}

#menubar>li.selected
{
    background-color: blue;
    color: white;
}

#menubar.subMenuOpened > li.selected
{
    background-color: rgb(235,235,255);
    color: black;
}
</style>
