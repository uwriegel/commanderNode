<template>
    <div class=dialogroot>
        <transition name="fade" appear>
            <div class=fader >
            </div>
        </transition>                        
        <transition name="fade2" appear>
            <div class="affe">Affe</div>        
        </transition>                        
        <!-- <div class="shader" v-if="isShowing"></div> -->
    </div>
</template>
    
</template>

<script>
export default {
}
</script>

<style scoped>
.dialogroot {
    position: absolute;
    width: 100%;
    height: 100%;
}
.fader {
    position: absolute;
    width: 100%;
    height: 100%;
    opacity: 1;
    background-color: rgba(0, 0, 0, 0.50);
}
.affe {
    background-color: red;
    padding: 30px;
}
.fade-enter-active, .fade-leave-active {
    transition: opacity 0.4s;
}
.fade-enter, .fade-leave-to {
    opacity: 0;
}

.fade2-enter-active, .fade2-leave-active {
    transition: opacity 8s;
}
.fade2-enter, .fade2-leave-to {
    opacity: 0;
}

</style>
