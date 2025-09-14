import { ref } from 'vue';
import { defineStore } from 'pinia';
import type { Appointments } from '../assets/types/types';
import { useUserStore } from '../stores/user';
import { useUrlStore } from './url';
import { testUuid } from '../composables/testUuid';
import { testInput } from '../composables/testInput';

export const useAppointmentStore = defineStore('appointment', () => {
    const userStore = useUserStore();
    const urlStore = useUrlStore();
    const appointmentItems = ref<Appointments []>([]);
    const addOpen = ref(false);
    const editOpen = ref<number | undefined>();
    const inputDescription = ref('');
    const inputStartTime = ref('');
    const inputEndTime = ref('');
    const currentDate = ref('');
    const midnightYesterday = ref<number>(1754521140000);
    const currentAppointmentIndex = ref<number []>([]);
    const pastAppointmentIndex = ref<number []>([]);
    const currentTime = ref('');
    const disableEdit = ref(false);
    const tooltipStatus = ref<number | undefined>();
    const tooltipType = ref('');

    function setCurrentDate() {
        const todaysDate = Date.now();
        const year = new Date(todaysDate).getFullYear();
        const currentMonth = new Date(todaysDate).getMonth() + 1;
        const currentDay = new Date(todaysDate).getDate();
        let month: string;
        let day: string;

        if (currentMonth < 10) {
            month = `0${currentMonth}`;
        } else {
            month = String(currentMonth);
        };

        if (currentDay < 10) {
            day = `0${currentDay}`;
        } else {
            day = String(currentDay);
        }

        currentDate.value = `${year}-${month}-${day}`;

        const midnightToday = new Date(`${currentDate.value} 23:59`).getTime();
        const yesterday = midnightToday - (24 * 60 * 60 * 1000);
        midnightYesterday.value = new Date(yesterday).getTime();

        const hour = new Date(todaysDate).getHours();
        let fullHour: string;
        if (hour < 10) {
            fullHour = `0${hour}`;
        } else {
            fullHour =String(hour);
        }
        const minutes = new Date(todaysDate).getMinutes();
        let fullMintues: string;
        if (minutes < 10) {
            fullMintues = `0${minutes}`;
        } else {
            fullMintues = String(minutes);
        }
        currentTime.value = `${fullHour}:${fullMintues}`;

    };

    const getAllAppointments = async () => {
        try {
            const response = await fetch(`${urlStore.url}/appointment`, {
                method: "GET",
                credentials: "include"
            });
            const jsonData = await response.json();

            if (jsonData.authErrorMessage) {
                userStore.onLogout();
                return console.log('not logged in');
            }

            const tempArray: Appointments [] = jsonData;
            appointmentItems.value = tempArray.sort((a, b) => (new Date(a.start_time).getTime() > new Date(b.start_time).getTime() ? 1 : new Date(b.start_time).getTime() > new Date(a.start_time).getTime() ? -1 : 0));

            let i = 0;
            let j = appointmentItems.value.length;
            while (i < j) {
                if (new Date(appointmentItems.value[i].end_time).getTime() < midnightYesterday.value) {
                    await deleteAppointment(i, appointmentItems.value[i].appointment_id);
                    i--;
                    j--;
                };
                i++;
            };                   
                
            checkAppointmentStatus();

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

    const checkAppointmentStatus = async () => {
        const currentDate = Date.now() ;
        const currentTime = new Date(currentDate).getTime();

        if (midnightYesterday.value + (24 * 60 * 60 * 1000) < currentTime) {
            setCurrentDate();
            await getAllAppointments();
        }
        for (let i = 0; i < appointmentItems.value.length; i++) {
            if (new Date(appointmentItems.value[i].start_time).getTime() <= currentTime && new Date(appointmentItems.value[i].end_time).getTime() >= currentTime) {
                if (!currentAppointmentIndex.value.includes(i)) {
                    currentAppointmentIndex.value.push(i);
                }
                if (pastAppointmentIndex.value.includes(i)) {
                    const removeIndex = pastAppointmentIndex.value.indexOf(i);
                    if (removeIndex !== -1) {
                        pastAppointmentIndex.value.splice(removeIndex, 1);
                    }
                }
            } else if (new Date(appointmentItems.value[i].end_time).getTime() < currentTime) {
                if (currentAppointmentIndex.value.includes(i)) {
                    const removeIndex = currentAppointmentIndex.value.indexOf(i);
                    if (removeIndex !== -1) {
                        currentAppointmentIndex.value.splice(removeIndex, 1);
                    }
                }
                if (!pastAppointmentIndex.value.includes(i)) {
                    pastAppointmentIndex.value.push(i);
                }
            } else {
                if (pastAppointmentIndex.value.includes(i)) {
                    const removeIndex = pastAppointmentIndex.value.indexOf(i);
                    if (removeIndex !== -1) {
                        pastAppointmentIndex.value.splice(removeIndex, 1);
                    }
                }
                if (currentAppointmentIndex.value.includes(i)) {
                    const removeIndex = currentAppointmentIndex.value.indexOf(i);
                    if (removeIndex !== -1) {
                        currentAppointmentIndex.value.splice(removeIndex, 1);
                    }
                }
            }
        }
    };

    const deleteAppointment = async (index: number, appointment_id: string) => {
        if (disableEdit.value) {
            return;
        }
        if (!testUuid(appointment_id)) {
            return;
        }
        try {
            const response = await fetch(`${urlStore.url}/appointment/${appointment_id}`, {
                method: "DELETE",
                credentials: "include"
            });

            const jsonData = await response.json();

            if (jsonData.authErrorMessage) {
                userStore.onLogout();
                return console.log('not logged in');
            }

            if (jsonData.errorMessage) {
                return console.log(jsonData.errorMessage);
            }

            if (jsonData.message) {
                appointmentItems.value.splice(index, 1);
                checkAppointmentStatus();
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

    function cancelAppointment() {
        inputDescription.value = '';
        inputStartTime.value = '';
        inputEndTime.value = '';
        editOpen.value = undefined;
        disableEdit.value = false;
    };

    function cancelAddAppointment() {
        inputDescription.value = '';
        inputStartTime.value = '';
        inputEndTime.value = '';
        addOpen.value = !addOpen.value;
        disableEdit.value = false;
    };

    function toggleAddOpen() {
        setCurrentDate();
        inputStartTime.value = currentTime.value;
        inputEndTime.value = currentTime.value;
        addOpen.value = !addOpen.value;
        disableEdit.value = true;
    };

    const addAppointment = async () => {
        if (inputDescription.value === '') {
            return alert('Description can not be empty.');
        }
        if (inputEndTime.value < inputStartTime.value) {
            return alert('Appointment end time must be greater than start time.');
        }
        if (inputStartTime.value === inputEndTime.value) {
            return alert('Appointment end time must be after start time.');
        }
        if (testInput(inputDescription.value)) {
            return alert('Text can not contain <>`$;`');
        }
        if (testInput(inputStartTime.value)) {
            return alert('Text can not contain <>`$;`');
        }
        if (testInput(inputEndTime.value)) {
            return alert('Text can not contain <>`$;`');
        }
        try {
            const appointment_description = inputDescription.value;
            const start_time = `${currentDate.value} ${inputStartTime.value}`;
            const end_time = `${currentDate.value} ${inputEndTime.value}`;
            const body = { appointment_description, start_time, end_time };
            const response = await fetch(`${urlStore.url}/appointment`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });

            const jsonData = await response.json();

            if (jsonData.authErrorMessage) {
                console.log(jsonData.authErrorMessage);
                userStore.onLogout();
                return console.log('not logged in');
            }

            if (jsonData.errorMessage) {
                return console.log(jsonData.errorMessage);
            }

            const tempArray = appointmentItems.value;
            tempArray.push(jsonData);
            appointmentItems.value = tempArray.sort((a, b) => (new Date(a.start_time).getTime() > new Date(b.start_time).getTime() ? 1 : new Date(b.start_time).getTime() > new Date(a.start_time).getTime() ? -1 : 0));

            checkAppointmentStatus();
            inputDescription.value = '';
            inputStartTime.value = '';
            inputEndTime.value = '';
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

    const updateAppointment = async (index: number, appointment_id: string) => {
        if (inputDescription.value === '') {
            return alert('Description can not be empty.');
        }
        if (inputEndTime.value < inputStartTime.value) {
            return alert('Appointment end time must be greater than start time.');
        }
        if (inputStartTime.value === inputEndTime.value) {
            return alert('Appointment end time must be after start time.');
        }
        if (!testUuid(appointment_id)) {
            return;
        }
        if (testInput(inputDescription.value)) {
            return alert('Text can not contain <>`$;`');
        }
        if (testInput(inputStartTime.value)) {
            return alert('Text can not contain <>`$;`');
        }
        if (testInput(inputEndTime.value)) {
            return alert('Text can not contain <>`$;`');
        }
        try {            
            const appointment_description = inputDescription.value;
            const start_time = `${currentDate.value} ${inputStartTime.value}`;
            const end_time = `${currentDate.value} ${inputEndTime.value}`;
            const body = { appointment_description, start_time, end_time };
            const response = await fetch(`${urlStore.url}/appointment/${appointment_id}`, {
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

            appointmentItems.value[index].appointment_description = inputDescription.value;
            appointmentItems.value[index].start_time = `${currentDate.value} ${inputStartTime.value}`;
            appointmentItems.value[index].end_time = `${currentDate.value} ${inputEndTime.value}`;

            appointmentItems.value = appointmentItems.value.sort((a, b) => (new Date(a.start_time).getTime() > new Date(b.start_time).getTime() ? 1 : new Date(b.start_time).getTime() > new Date(a.start_time).getTime() ? -1 : 0));
            checkAppointmentStatus();

            inputDescription.value = '';
            inputStartTime.value = '';
            inputEndTime.value = '';
            editOpen.value = undefined;
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

    function toggleAppointmentEdit(startTime: string, endTime: string, description: string, index: number) {
        if (disableEdit.value) {
            return;
        }
        inputStartTime.value = setTime(startTime);
        inputEndTime.value = setTime(endTime);
        inputDescription.value = description;
        editOpen.value = index;
        disableEdit.value = true;
        tooltipStatus.value = undefined;
        tooltipType.value = '';
    };

    function setTime(time: string) {
        const hour = new Date(time).getHours();
        let fullHour: string;
        if (hour < 10) {
            fullHour = `0${hour}`;
        } else {
            fullHour =String(hour);
        }
        const minutes = new Date(time).getMinutes();
        let fullMintues: string;
        if (minutes < 10) {
            fullMintues = `0${minutes}`;
        } else {
            fullMintues = String(minutes);
        }
        const fullTime = `${fullHour}:${fullMintues}`;
        return fullTime;
    };

    const onTimeChange = (time: string) => {
        inputEndTime.value = time;
    }

    const showToolTip = (index: number, type: string) => {
        tooltipStatus.value = index;
        tooltipType.value = type;
    }

    const hideToolTip = () => {
        tooltipStatus.value = undefined;
        tooltipType.value = '';
    }

    return { appointmentItems, addOpen, editOpen, inputDescription, inputStartTime, inputEndTime, currentDate, midnightYesterday, currentAppointmentIndex, pastAppointmentIndex, tooltipStatus, tooltipType, setCurrentDate, getAllAppointments, checkAppointmentStatus, deleteAppointment, cancelAppointment, cancelAddAppointment, toggleAddOpen, addAppointment, updateAppointment, toggleAppointmentEdit, setTime, onTimeChange, showToolTip, hideToolTip }
})