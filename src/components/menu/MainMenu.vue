<template>
    <ul id="menubar">
        <li id="menubar1" tabindex="1">
            <span class="accelerator">D</span><span>atei</span>
        </li>
        <li id="menubar2" tabindex="2">
            <span class="accelerator">N</span><span>avigation</span>
        </li>
        <li id="menubar3" tabindex="3">
            <span class="accelerator">S</span><span>elektion</span>
        </li>
        <li id="menubar4" tabindex="4">
            <span class="accelerator">A</span><span>nsicht</span>
        </li>
    </ul>
</template>

<script>
export default {
    name: 'MainMenu'
}
</script>

<style>
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
