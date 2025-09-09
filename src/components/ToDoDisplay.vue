<script setup lang="ts">
import { useTodoStore } from '../stores/todo';

const store = useTodoStore();

if (store.todoItems.length === 0) {
    store.getTodos();
}

</script>

<template>
    <div id="to-do-display-container">
        <h2>To-Do List</h2>   
        <TransitionGroup name="fade-right" appear>               
            <div class="to-do-item" v-for="(item, index) in store.todoItems" :key="item.todo_id" :style="{border: item.todo_progress ? '0.3125rem solid #008080' : 'none'}">
                <div class="to-do-check">
                    <div class="to-do-completed">
                        <input type="checkbox" name="completed" class="completed" v-model="item.todo_completed" :disabled="store.addOpen || store.editIndex !== undefined" @change="store.changeCompleted(index, item.todo_id)" @mouseover="store.showToolTip(index, 'completed')" @mouseleave="store.hideToolTip()" />
                        <div class="tooltip" v-if="store.tooltipStatus === index && store.tooltipType === 'completed'">completed</div>
                    </div> / 
                    <div class="to-do-progress">
                        <input type="checkbox" name="progress" class="completed" v-model="item.todo_progress" :disabled="store.addOpen || item.todo_completed || store.editIndex !== undefined" @change="store.changeProgress(index, item.todo_id)" @mouseover="store.showToolTip(index, 'progress')" @mouseleave="store.hideToolTip()" /> 
                        <div class="tooltip" v-if="store.tooltipStatus === index && store.tooltipType === 'progress'">in progress</div>
                    </div>
                </div>
                <div class="to-do-description" :style="{color: item.todo_completed ? 'lightgray' : 'white', textDecorationLine: item.todo_completed ? 'line-through' : 'none', fontSize: item.todo_progress ? '1.5rem' : '1.25rem'}">
                    <p>{{ item.todo_description }}</p>
                </div>
                <div class="edit-delete">
                    <div class="to-do-edit">
                        <img src="../assets/images/edit.png" alt="edit pen" @click="store.openTodoEdit(index)" @mouseover="store.showToolTip(index, 'edit')" @mouseleave="store.hideToolTip()" />
                        <div class="tooltip" v-if="store.tooltipStatus === index && store.tooltipType === 'edit'">edit</div>
                    </div>
                    <div class="to-do-delete">
                        <img src="../assets/images/delete.png" alt="delete bin" @click="store.deleteTodo(index, item.todo_id)" @mouseover="store.showToolTip(index, 'delete')" @mouseleave="store.hideToolTip()" />
                        <div class="tooltip" v-if="store.tooltipStatus === index && store.tooltipType === 'delete'">delete</div>
                    </div>
                </div>
                <div class="to-do-edit-container" v-if="store.editIndex === index">
                    <form class="todo-form" @submit.prevent="store.editTodo(index, item.todo_id)">
                        <label for="description">To-do: </label>
                        <input name="description" id="description" class="todo-description-input input-style" type="text" v-model="store.editDescription" required /><br />
                        <input name="submit" class="button-style" id="todo-edit-submit" type="submit" value="Save" /> <button class="button-style" @click.prevent="store.closeTodoEdit">Cancel</button>
                    </form>
                </div>
            </div>
        </TransitionGroup> 
        <div id="to-do-add">
            <button class="button-style" @click="store.openTodoAdd" :disabled="store.editIndex !== undefined">Add</button>  
            <div id="to-do-add-container" v-if="store.addOpen">
                <form class="todo-form" @submit.prevent="store.addTodoItem">
                    <label for="add-description">To-do: </label>
                    <input name="add-description" id="add-description" class="todo-description-input input-style" type="text" v-model="store.addInput" required /><br />
                    <input class="button-style" name="submit" id="todo-add-submit" type="submit" value="Add" /> <button class="button-style" @click.prevent="store.closeTodoAdd">Cancel</button>
                </form>
            </div> 
        </div>
    </div>
</template>

<style lang="scss" scoped>
@use '../assets/css/variables.scss';
@use '../assets/css/mixins.scss';

.fade-right-enter-active,
.fade-right-leave-active {
    @include mixins.enter-leave;
}

.fade-right-enter-from,
.fade-right-leave-to {
    @include mixins.from-to-right;
}

#to-do-display-container {
    @include mixins.display-container;
}

.to-do-item {
    @include mixins.item-container;

    @include mixins.mobile {
        flex-direction: column;
    }
}

.to-do-check {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 0.5rem;
    width: 2.5rem;
    height: 1.875rem;
    margin-right: 0.5rem;
}

.to-do-description {
    @include mixins.item-description;

    @include mixins.mobile {
        justify-content: center;
    }
}

.completed {
    position: relative;
    cursor: pointer;
}

.edit-delete {
    @include mixins.edit-delete-container;
}

.to-do-edit {
    position: relative;
    @include mixins.edit-delete;
    margin: 0 0.5rem;
}

.tooltip {
    position: absolute;
    background-color: variables.$white-color;
    color: variables.$olive-color;
    padding: 0 0.25rem;
    font-size: 1.25rem;
    z-index: 602;
}

.to-do-delete {
    position: relative;
    @include mixins.edit-delete;
}

.to-do-edit-container {
    @include mixins.add-container;
    min-height: 4.75rem;
    z-index: 902;

    @include mixins.tablet {
        font-size: 1rem;
    }

    @include mixins.mobile {
        font-size: 1rem;
    }
}

.todo-description-input {
    width: 80%;
    margin-bottom: 0.25rem;
}

.button-style {
    @include mixins.button-style;
}

.input-style {
    @include mixins.input-style;
}

#to-do-add {
    @include mixins.add-display;
    z-index: 802;
    min-height: 4.75rem;
}

#to-do-add-container {
    @include mixins.add-container;
    z-index: 702;

    @include mixins.tablet {
        font-size: 1rem;
    }

    @include mixins.mobile {
        font-size: 1rem;
    }
}

.todo-form {
    width: 100%;
}

</style>