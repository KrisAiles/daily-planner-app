import { ref } from 'vue';
import { defineStore } from 'pinia';
import { useUserStore } from '../stores/user';
import { testUuid } from '../composables/testUuid';
import { testInput } from '../composables/testInput';

export const useNoteStore = defineStore('note', () => {
    const userStore = useUserStore();
    const noteItems = ref<{note_id: string, note_description: string, note_completed: boolean, note_progress: boolean}[]>([]);
    const addOpen = ref(false);
    const addInput = ref('');
    const editIndex = ref<number | undefined>();
    const editDescription = ref('');
    const disableEdit = ref(false);
    const tooltipStatus = ref<number | undefined>();
    const tooltipType = ref('');

    const getNotes = async () => {
        try {
            const response = await fetch("http://localhost:3000/note", {
                method: "GET",
                credentials: "include"
            });
            const jsonData = await response.json();

            if (jsonData.authErrorMessage) {
                userStore.onLogout();
                return console.log('not logged in');
            }

            noteItems.value = jsonData;
            
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

    const addNoteItem = async () => {
        if (addInput.value === '') {
            return alert('Note can not be empty.');
        }
        if (testInput(addInput.value)) {
            return alert('Text can not contain <>`$;`');
        }
        try {
            const note_description = addInput.value;
            const body = { note_description };
            const response = await fetch("http://localhost:3000/note", {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });
            
            const jsonData = await response.json();

            if (jsonData.authErrorMessage) {
                userStore.onLogout();
                return console.log('not logged in');
            }

            if (jsonData.errorMessage) {
                return console.log(jsonData.errorMessage);
            }

            noteItems.value.push(jsonData);
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
        }
    };  

    function closeNoteAdd() {
        addInput.value = '';
        addOpen.value = !addOpen.value;
        disableEdit.value = false;
    }

    function toggleAddOpen() {
        addOpen.value = !addOpen.value;
        disableEdit.value = true;
    }

    function noteEditClose() {
        editIndex.value = undefined;
        editDescription.value = '';
        disableEdit.value = false;
    }

    function noteEditOpen(index: number) {
        if (disableEdit.value) {
            return;
        }
        editDescription.value = noteItems.value[index].note_description;
        editIndex.value = index;
        disableEdit.value = true; 
        tooltipStatus.value = undefined;
        tooltipType.value = '';
    }

    const editNote = async (index: number, note_id: string) => {
        if (addInput.value === '') {
            return alert('Note can not be empty.');
        }
        if (testInput(editDescription.value)) {
            return alert('Text can not contain <>`$;`');
        }
        if (!testUuid(note_id)) {
            return;
        }
        try {
            const note_description = editDescription.value;
            const body = { note_description };
            const response = await fetch(`http://localhost:3000/note/${note_id}`, {
                method: "PUT",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });

            const jsonData = await response.json();
            
            if (jsonData.authErrorMessage) {
                userStore.onLogout();
                return console.log('not logged in');
            }

            if (jsonData.errorMessage) {
                return console.log(jsonData.errorMessage);
            }
            
            noteItems.value[index].note_description = editDescription.value;
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
        }    
    };

    const deleteNote = async (index: number, note_id: string) => {
        if (disableEdit.value) {
            return;
        }
        if (!testUuid(note_id)) {
            return;
        }
        try {
            const deleteTodo = await fetch(`http://localhost:3000/note/${note_id}`, {
                method: "DELETE",
                credentials: "include"
            });

            const jsonData = await deleteTodo.json();

            if (jsonData.authErrorMessage) {
                userStore.onLogout();
                return console.log('not logged in');
            }

            if (jsonData.errorMessage) {
                return console.log(jsonData.errorMessage);
            }

            if (jsonData.message) {
                noteItems.value.splice(index, 1);
            }             

        } catch (err: unknown) {
            if (err instanceof Error) {
                console.error(err.name);
                console.error(err.message);
                console.error(err.stack);
            } else {
                console.log('error');
            } 
        }  
    };

    const changeCompleted = async (index: number, note_id: string) => {    
        if (!testUuid(note_id)) {
            return;
        }
        try {
            noteItems.value[index].note_progress = false;
            const note_completed = noteItems.value[index].note_completed;
            const note_progress = noteItems.value[index].note_progress;
            const body = { note_completed, note_progress };
            const response = await fetch(`http://localhost:3000/note/completed/${note_id}`, {
                method: "PUT",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });

            const jsonData = await response.json();
            
            if (jsonData.authErrorMessage) {
                userStore.onLogout();
                return console.log('not logged in');
            }

            if (jsonData.errorMessage) {
                return console.log(jsonData.errorMessage);
            }  
            
        } catch (err: unknown) {
            if (err instanceof Error) {
                console.error(err.name);
                console.error(err.message);
                console.error(err.stack);
            } else {
                console.log('error');
            }            
        }   
    };

    const changeProgress = async (index: number, note_id: string) => {    
        if (!testUuid(note_id)) {
            return;
        }
        try {
            const note_progress = noteItems.value[index].note_progress;
            const body = { note_progress };
            const response = await fetch(`http://localhost:3000/note/progress/${note_id}`, {
                method: "PUT",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });

            const jsonData = await response.json();
            
            if (jsonData.authErrorMessage) {
                userStore.onLogout();
                return console.log('not logged in');
            }

            if (jsonData.errorMessage) {
                return console.log(jsonData.errorMessage);
            } 
            
        } catch (err: unknown) {
            if (err instanceof Error) {
                console.error(err.name);
                console.error(err.message);
                console.error(err.stack);
            } else {
                console.log('error');
            }            
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

    return { noteItems, addOpen, addInput, editIndex, editDescription, tooltipStatus, tooltipType, noteEditClose, getNotes, addNoteItem, closeNoteAdd, toggleAddOpen, noteEditOpen, editNote, deleteNote, changeCompleted, changeProgress, showToolTip, hideToolTip }
})