import { ref } from 'vue';
import { defineStore } from 'pinia';
import { useUserStore } from '../stores/user';
import { useUrlStore } from './url';
import { testUuid } from '../composables/testUuid';
import { testInput } from '../composables/testInput';

export const useTodoStore = defineStore('todo', () => {
    const userStore = useUserStore();
    const urlStore = useUrlStore();
    const todoItems = ref<{todo_id: string, todo_description: string, todo_completed: boolean, todo_progress: boolean}[]>([]);
    const addOpen = ref(false);
    const addInput = ref('');
    const editIndex = ref<number | undefined>();
    const editDescription = ref('');
    const disableEdit = ref(false);
    const tooltipStatus = ref<number | undefined>();
    const tooltipType = ref('');

    const getTodos = async () => {
        try {
            const response = await fetch(`${urlStore.url}/todo`, {
                method: "GET",
                credentials: "include"
            });
            const jsonData = await response.json();

            if (jsonData.authErrorMessage) {
                userStore.onLogout();
                return console.log('not logged in');
            }

            todoItems.value = jsonData;

        } catch (err: unknown) {
            if (err instanceof Error) {
                console.error(err.name);
                console.error(err.message);
                console.error(err.stack);
            } else {
                console.log('error');
            }         
            userStore.onLogout();   
        }
    };

    const addTodoItem = async () => {
        if (testInput(addInput.value)) {
            return alert('Text can not contain <>`$;`');
        }
        try {
            const todo_description = addInput.value;
            const body = { todo_description };
            const response = await fetch(`${urlStore.url}/todo`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });
            
            const jsonData = await response.json();

            todoItems.value.push(jsonData);
            addInput.value = '';
            addOpen.value = !addOpen.value;
            disableEdit.value = false;

        } catch (err: unknown) {
            if (err instanceof Error) {
                console.error(err.name);
                console.error(err.message);
                console.error(err.stack);
            } else {
                console.log('error');
            }        
            return alert('Something went wrong please try again.');     
        }
    };  

    function closeTodoAdd() {
        addInput.value = '';
        addOpen.value = !addOpen.value;
        disableEdit.value = false;
    }

    function openTodoAdd() {
        addOpen.value = !addOpen.value;
        disableEdit.value = true;
    }

    function closeTodoEdit() {
        editIndex.value = undefined;
        editDescription.value = ''; 
        disableEdit.value = false;
    }

    function openTodoEdit(index: number) {
        if (disableEdit.value) {
            return;
        }
        editDescription.value = todoItems.value[index].todo_description;
        editIndex.value = index;
        disableEdit.value = true;
        tooltipStatus.value = undefined;
        tooltipType.value = '';
    }

    const editTodo = async (index: number, todo_id: string) => {
        if (editDescription.value === '') {
            return alert('Description can not be empty.');
        }
        if (!testUuid(todo_id)) {
            return;
        }
        if (testInput(editDescription.value)) {
            return alert('Text can not contain <>`$;`');
        }
        try {            
            const todo_description = editDescription.value;
            const body = { todo_description };
            const response = await fetch(`${urlStore.url}/todo/${todo_id}`, {
                method: "PUT",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });

            const jsonData = await response.json();

            if (!jsonData) {
                return alert('Something went wrong please try again.');
            }  
            todoItems.value[index].todo_description = editDescription.value;
            editIndex.value = undefined;
            disableEdit.value = false;
            
        } catch (err: unknown) {
            if (err instanceof Error) {
                console.error(err.name);
                console.error(err.message);
                console.error(err.stack);
            } else {
                console.log('error');
            }         
            return alert('Something went wrong please try again.');    
        }    
    };

    const deleteTodo = async (index: number, todo_id: string) => {
        if (disableEdit.value) {
            return;
        }
        if (!testUuid(todo_id)) {
            return;
        }
        try {
            const deleteTodo = await fetch(`${urlStore.url}/todo/${todo_id}`, {
                method: "DELETE",
                credentials: "include"
            });

            const jsonData = await deleteTodo.json();

            if (jsonData.message) {
                todoItems.value.splice(index, 1);
            }

        } catch (err: unknown) {
            if (err instanceof Error) {
                console.error(err.name);
                console.error(err.message);
                console.error(err.stack);
            } else {
                console.log('error');
            } 
            return alert('Something went wrong please try again.'); 
        }  
    };

    const changeCompleted = async (index: number, todo_id: string) => {   
        if (!testUuid(todo_id)) {
            return;
        }
        try {
            todoItems.value[index].todo_progress = false;
            const todo_completed = todoItems.value[index].todo_completed;
            const todo_progress = todoItems.value[index].todo_progress;
            const body = { todo_completed, todo_progress };
            const response = await fetch(`${urlStore.url}/todo/completed/${todo_id}`, {
                method: "PUT",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });

            const jsonData = await response.json();
            
            if (!jsonData) {
                return alert('Something went wrong please try again.');
            }      
            
        } catch (err: unknown) {
            if (err instanceof Error) {
                console.error(err.name);
                console.error(err.message);
                console.error(err.stack);
            } else {
                console.log('error');
            }       
            return alert('Something went wrong please try again.'); 
        }   
    };

    const changeProgress = async (index: number, todo_id: string) => {  
        if (!testUuid(todo_id)) {
            return;
        }
        try {
            const todo_progress = todoItems.value[index].todo_progress;
            const body = { todo_progress };
            const response = await fetch(`${urlStore.url}/todo/progress/${todo_id}`, {
                method: "PUT",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });

            const jsonData = await response.json();

            if (!jsonData) {
                return alert('Something went wrong please try again.');
            }            
            
        } catch (err: unknown) {
            if (err instanceof Error) {
                console.error(err.name);
                console.error(err.message);
                console.error(err.stack);
            } else {
                console.log('error');
            }           
            return alert('Something went wrong please try again.'); 
        }   
    };

    const showToolTip = (index: number, type: string) => {
        tooltipStatus.value = index;
        tooltipType.value = type;
    }

    const hideToolTip = () => {
        tooltipStatus.value = undefined;
        tooltipType.value = '';
    }

  return { todoItems, addOpen, addInput, editIndex, editDescription, tooltipStatus, tooltipType, getTodos, addTodoItem, closeTodoAdd, openTodoAdd, openTodoEdit, closeTodoEdit, editTodo, deleteTodo, changeCompleted, changeProgress, showToolTip, hideToolTip  }
});