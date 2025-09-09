<script setup lang="ts">
import { useNoteStore } from '../stores/note';

const store = useNoteStore();

if (store.noteItems.length === 0) {
    store.getNotes();
}

</script>

<template>
    <div id="note-display-container">
        <h2>Notes</h2>                   
        <div id="notes"> 
            <TransitionGroup name="fade-right" appear>
                <div class="note-item" v-for="(item, index) in store.noteItems" :key="item.note_id" :style="{border: item.note_progress ? '0.3125rem solid #008080' : 'none'}">
                    <div class="note-check">
                        <div class="note-completed">
                            <input type="checkbox" name="completed" class="completed" v-model="item.note_completed" :disabled="store.addOpen" @change="store.changeCompleted(index, item.note_id)" @mouseover="store.showToolTip(index, 'completed')" @mouseleave="store.hideToolTip()" />
                            <div class="tooltip" v-if="store.tooltipStatus === index && store.tooltipType === 'completed'">completed</div>
                        </div> / 
                        <div class="note-progress">
                            <input type="checkbox" name="progress" class="completed" v-model="item.note_progress" :disabled="store.addOpen || item.note_completed" @change="store.changeProgress(index, item.note_id)" @mouseover="store.showToolTip(index, 'progress')" @mouseleave="store.hideToolTip()" /> 
                            <div class="tooltip" v-if="store.tooltipStatus === index && store.tooltipType === 'progress'">in progress</div>
                        </div>
                    </div>
                    <div class="note-description" :style="{color: item.note_completed ? 'lightgray' : 'white', textDecorationLine: item.note_completed ? 'line-through' : 'none', fontSize: item.note_progress ? '2.5rem' : '2rem'}">
                        <p>{{ item.note_description }}</p>
                    </div>
                    <div class="edit-delete">
                        <div class="note-edit">
                            <img src="../assets/images/edit.png" alt="edit pen" @click="store.noteEditOpen(index)" @mouseover="store.showToolTip(index, 'edit')" @mouseleave="store.hideToolTip()" />
                            <div class="tooltip" v-if="store.tooltipStatus === index && store.tooltipType === 'edit'">edit</div>
                        </div>
                        <div class="note-delete">
                            <img src="../assets/images/delete.png" alt="delete bin" @click="store.deleteNote(index, item.note_id)" @mouseover="store.showToolTip(index, 'delete')" @mouseleave="store.hideToolTip()" />
                            <div class="tooltip" v-if="store.tooltipStatus === index && store.tooltipType === 'delete'">delete</div>
                        </div>
                    </div>
                    <div class="note-edit-container" v-if="store.editIndex === index">
                        <form class="note-form" @submit.prevent="store.editNote(index, item.note_id)">
                            <label for="description">Note: </label>
                            <textarea name="description" id="description" class="edit-description input-style" v-model="store.editDescription" required ></textarea><br />
                            <input name="submit" class="button-style" id="note-edit-submit" type="submit" value="Save" /> <button class="button-style" @click.prevent="store.noteEditClose">Cancel</button>
                        </form>
                    </div>
                </div>
            </TransitionGroup>
            <div id="note-add">
                <button class="button-style" @click="store.toggleAddOpen" :disabled="store.editIndex !== undefined">Add</button>  
                <div id="note-add-container" v-if="store.addOpen">
                    <form class="note-form" @submit.prevent="store.addNoteItem">
                        <label for="add-description">Note: </label>
                        <textarea name="add-description" id="add-description" class="edit-description input-style" v-model="store.addInput" required ></textarea><br />
                        <input class="button-style" name="submit" id="note-add-submit" type="submit" value="Add" /> <button class="button-style" @click.prevent="store.closeNoteAdd">Cancel</button>
                    </form>
                </div> 
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@use '../assets/css/variables.scss';
@use '../assets/css/mixins.scss';

.fade-right-enter-active,
.fade-leave-active {
    @include mixins.enter-leave;
}

.fade-right-enter-from,
.fade-right-leave-to {
    @include mixins.from-to-right;
}

#note-display-container {
    @include mixins.display-container;
}

#notes {
    position: relative;
    width: 100%;    
    min-height: 51.75rem;
    background-color: variables.$olive-color;
    box-shadow: variables.$box-shadow;

    @include mixins.large-desktop {
        height: 90%;
    }

    @include mixins.desktop {
        height: 90%;
    }

    @include mixins.tablet {
        height: 90%;
    }

    @include mixins.mobile {
        height: 90%;
    }
}

.note-item {
    @include mixins.item-container;
    box-shadow: none;
    font-size: 2rem;
    font-family: "Indie Flower", cursive;

    @include mixins.mobile {
        flex-direction: column;
    }
}

.note-check {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 0.5rem;
    width: 2.5rem;
    height: 1.875rem;
    margin-right: 0.5rem;
}

.note-description {
    width: 100%;
    border-bottom: 0.125rem solid variables.$white-color;

    @include mixins.mobile {
        border-bottom: none;
    }
}

.completed {
    position: relative;
    cursor: pointer;
}

.edit-delete {
    @include mixins.edit-delete-container;

    @include mixins.mobile {
        width: 100%;
        border-bottom: 0.125rem solid variables.$white-color;
    }
}

.note-edit {
    position: relative;
    @include mixins.edit-delete;
    margin: 0 0.5rem;
}

.note-delete {
    position: relative;
    @include mixins.edit-delete;
}

.tooltip {
    position: absolute;
    background-color: variables.$white-color;
    color: variables.$olive-color;
    padding: 0 0.25rem;
    font-size: 1.25rem;
    z-index: 605;
    font-family: "Quicksand", sans-serif;
}

.note-edit-container {
    @include mixins.add-container;
    z-index: 905;
    font-size: 1.25rem;
    font-family: "Quicksand", sans-serif;

    @include mixins.tablet {
        font-size: 1rem;
    }

    @include mixins.mobile {
        font-size: 1rem;
    }
}

.edit-description {
    width: 80%;
    height: 2.5rem;
    vertical-align: middle;
}

.button-style {
    @include mixins.button-style;
}

.input-style {
    @include mixins.input-style;
}

#note-add {
    @include mixins.add-display;
    min-height: 4.75rem;
    z-index: 805;
}

#note-add-container {
    @include mixins.add-container;
    z-index: 705;

    @include mixins.tablet {
        font-size: 1rem;
    }

    @include mixins.mobile {
        font-size: 1rem;
    }
}

.note-form {
    width: 100%;
}

</style>