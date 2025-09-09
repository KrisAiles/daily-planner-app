import { ref } from 'vue';
import { defineStore } from 'pinia';
import type { Interviews } from '../assets/types/types';
import { useUserStore } from './user';
import { testUuid } from '../composables/testUuid';
import { testInput } from '../composables/testInput';

export const useInterviewStore = defineStore('interview', () => {
    const userStore = useUserStore();
    const interviewItems = ref<Interviews []>([]);
    const mondayInterviewItems = ref<Interviews []>([]);
    const tuesdayInterviewItems = ref<Interviews []>([]);
    const wednesdayInterviewItems = ref<Interviews []>([]);
    const thursdayInterviewItems = ref<Interviews []>([]);
    const fridayInterviewItems = ref<Interviews []>([]);
    const addOpen = ref(false);
    const editOpen = ref<string | undefined>();
    const currentDate = ref('');
    const currentTime = ref('');
    const currentInterviewIndex = ref<string []>([]);
    const pastInterviewIndex = ref<string []>([]);
    const inputCompany = ref('');
    const inputJob = ref('');
    const inputCandidate = ref('');
    const inputTime = ref('');
    const inputDate = ref('');
    const inputStage = ref(1);
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

    const getAllInterviews = async () => {
        try {
            const response = await fetch("http://localhost:3000/interview", {
                method: "GET",
                credentials: "include"
            });
            const jsonData = await response.json();

            if (jsonData.authErrorMessage) {
                userStore.onLogout();
                return console.log('not logged in');
            }

            const tempArray: Interviews [] = jsonData;
            interviewItems.value = tempArray.sort((a, b) => (new Date(a.interview_time).getTime() > new Date(b.interview_time).getTime() ? 1 : new Date(b.interview_time).getTime() > new Date(a.interview_time).getTime() ? -1 : 0));                
            
            checkInterviewDay();
            checkInterviewStatus();

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

    const checkInterviewDay = async () => {
        mondayInterviewItems.value = [];
        tuesdayInterviewItems.value = [];
        wednesdayInterviewItems.value = [];
        thursdayInterviewItems.value = [];
        fridayInterviewItems.value = [];
        for (let i = 0; i < interviewItems.value.length; i++) {
            switch (new Date(interviewItems.value[i].interview_time).getDay()) {
                case 1:
                    mondayInterviewItems.value.push(interviewItems.value[i])
                    break;
                case 2:
                    tuesdayInterviewItems.value.push(interviewItems.value[i])
                    break;
                case 3:
                    wednesdayInterviewItems.value.push(interviewItems.value[i])
                    break;
                case 4:
                    thursdayInterviewItems.value.push(interviewItems.value[i])
                    break;
                case 5:
                    fridayInterviewItems.value.push(interviewItems.value[i])
                    break;
                default:
                    break;
            }
        }
    }

    const checkInterviewStatus = async () => {
        const currentDate = Date.now() ;
        const currentTime = new Date(currentDate).getTime();
        const currentDay = new Date(currentDate).getDate();
        const currentMonth = new Date(currentDate).getMonth();
        for (let i = 0; i < interviewItems.value.length; i++) {
            if (new Date(interviewItems.value[i].interview_time).getTime() + (1 * 60 * 60 * 1000) <= currentTime) {
                if (!pastInterviewIndex.value.includes(interviewItems.value[i].interview_id)) {
                    pastInterviewIndex.value.push(interviewItems.value[i].interview_id);
                }
            } else {
                if (pastInterviewIndex.value.includes(interviewItems.value[i].interview_id)) {
                    const removeIndex = pastInterviewIndex.value.indexOf(interviewItems.value[i].interview_id);
                    if (removeIndex !== -1) {
                        pastInterviewIndex.value.splice(removeIndex, 1);
                    }
                }
            }
            if (new Date(interviewItems.value[i].interview_time).getDate() === currentDay && new Date(interviewItems.value[i].interview_time).getMonth() === currentMonth) {
                if (!currentInterviewIndex.value.includes(interviewItems.value[i].interview_id)) {
                    currentInterviewIndex.value.push(interviewItems.value[i].interview_id);
                }
            } else {
                if (currentInterviewIndex.value.includes(interviewItems.value[i].interview_id)) {
                    const removeIndex = currentInterviewIndex.value.indexOf(interviewItems.value[i].interview_id);
                    if (removeIndex !== -1) {
                        currentInterviewIndex.value.splice(removeIndex, 1);
                    }
                }
            }
        }
    };

    const deleteInterview = async (interview_id: string) => {
        if (disableEdit.value) {
            return;
        }
        if (!testUuid(interview_id)) {
            return;
        }
        try {
            const deleteInterview = await fetch(`http://localhost:3000/interview/${interview_id}`, {
                method: "DELETE",
                credentials: "include"
            });
            
            const jsonData = await deleteInterview.json();

            if (jsonData.authErrorMessage) {
                userStore.onLogout();
                return console.log('not logged in');
            }

            if (jsonData.errorMessage) {
                return console.log(jsonData.errorMessage);
            }

            if (jsonData.message) {
                for (let i = 0; i < interviewItems.value.length; i++) {
                    const removeIndex = interviewItems.value[i].interview_id.indexOf(interview_id);
                    if (removeIndex !== -1) {
                        interviewItems.value.splice(i, 1);
                        interviewItems.value = interviewItems.value.sort((a, b) => (new Date(a.interview_time).getTime() > new Date(b.interview_time).getTime() ? 1 : new Date(b.interview_time).getTime() > new Date(a.interview_time).getTime() ? -1 : 0));
                        checkInterviewDay();
                        checkInterviewStatus();
                        return;
                    }
                } 
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

    function cancelAddInterview() {
        inputDate.value = '';
        inputTime.value = '';
        inputCompany.value = '';
        inputJob.value = '';
        inputCandidate.value = '';
        inputStage.value = 1;
        addOpen.value = false;
        disableEdit.value = false;
    };

    function toggleAddInterviewOpen() {
        setCurrentDate();
        inputTime.value = currentTime.value;
        inputDate.value = currentDate.value;
        addOpen.value = true;
        disableEdit.value = true;
    };

    const addInterview = async () => {
        if (inputCompany.value === '') {
            return alert('Company can not be empty.');
        }
        if (inputJob.value === '') {
            return alert('Job can not be empty.');
        }
        if (inputCandidate.value === '') {
            return alert('Candidate can not be empty.');
        }
        if (testInput(inputCompany.value)) {
            return alert('Text can not contain <>`$;`');
        }
        if (testInput(inputJob.value)) {
            return alert('Text can not contain <>`$;`');
        }
        if (testInput(inputCandidate.value)) {
            return alert('Text can not contain <>`$;`');
        }
        if (testInput(String(inputStage.value))) {
            return alert('Text can not contain <>`$;`');
        }
        if (testInput(inputDate.value)) {
            return alert('Text can not contain <>`$;`');
        }
        if (testInput(inputTime.value)) {
            return alert('Text can not contain <>`$;`');
        }
        try {
            const company = inputCompany.value;
            const job = inputJob.value;
            const candidate = inputCandidate.value;
            const stage = inputStage.value;
            const interview_time = `${inputDate.value} ${inputTime.value}`;
            const body = { company, job, candidate, stage, interview_time };
            const response = await fetch("http://localhost:3000/interview", {
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

            const tempArray = interviewItems.value;
            tempArray.push(jsonData);
            interviewItems.value = tempArray.sort((a, b) => (new Date(a.interview_time).getTime() > new Date(b.interview_time).getTime() ? 1 : new Date(b.interview_time).getTime() > new Date(a.interview_time).getTime() ? -1 : 0));

            checkInterviewDay();
            checkInterviewStatus();
            
            inputDate.value = '';
            inputTime.value = '';
            inputCompany.value = '';
            inputJob.value = '';
            inputCandidate.value = '';
            inputStage.value = 1;
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

    function cancelEditInterview() {
        inputDate.value = '';
        inputTime.value = '';
        inputCompany.value = '';
        inputJob.value = '';
        inputCandidate.value = '';
        inputStage.value = 1;
        editOpen.value = undefined;
        disableEdit.value = false;
    };

    function openEditInterview(interview_time: string, company: string, job: string, candidate: string, stage: number, interview_id: string) {
        if (disableEdit.value) {
            return;
        }
        inputDate.value = setEditDate(interview_time);
        inputTime.value = setTime(interview_time);
        inputCompany.value = company;
        inputJob.value = job;
        inputCandidate.value = candidate;
        inputStage.value = stage;
        editOpen.value = interview_id;
        disableEdit.value = true;
        tooltipStatus.value = undefined;
        tooltipType.value = '';
    };

    const updateInterview = async (interview_id: string) => {
        if (!testUuid(interview_id)) {
            return;
        }
        if (testInput(inputCompany.value)) {
            return alert('Text can not contain <>`$;`');
        }
        if (testInput(inputJob.value)) {
            return alert('Text can not contain <>`$;`');
        }
        if (testInput(inputCandidate.value)) {
            return alert('Text can not contain <>`$;`');
        }
        if (testInput(String(inputStage.value))) {
            return alert('Text can not contain <>`$;`');
        }
        if (testInput(inputDate.value)) {
            return alert('Text can not contain <>`$;`');
        }
        if (testInput(inputTime.value)) {
            return alert('Text can not contain <>`$;`');
        }
        try {
            const company = inputCompany.value;
            const job = inputJob.value;
            const candidate = inputCandidate.value;
            const stage = inputStage.value;
            const interview_time = `${inputDate.value} ${inputTime.value}`;
            const body = { company, job, candidate, stage, interview_time };
            const response = await fetch(`http://localhost:3000/interview/${interview_id}`, {
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

            for (let i = 0; i < interviewItems.value.length; i++) {
                if (interviewItems.value[i].interview_id === interview_id) {
                    interviewItems.value[i].company = inputCompany.value;
                    interviewItems.value[i].job = inputJob.value;
                    interviewItems.value[i].candidate = inputCandidate.value;
                    interviewItems.value[i].stage = inputStage.value;
                    interviewItems.value[i].interview_time = `${inputDate.value} ${inputTime.value}`;
                }
            }

            interviewItems.value = interviewItems.value.sort((a, b) => (new Date(a.interview_time).getTime() > new Date(b.interview_time).getTime() ? 1 : new Date(b.interview_time).getTime() > new Date(a.interview_time).getTime() ? -1 : 0));

            checkInterviewDay();
            checkInterviewStatus();

            inputDate.value = '';
            inputTime.value = '';
            inputCompany.value = '';
            inputJob.value = '';
            inputCandidate.value = '';
            inputStage.value = 1;
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

    function setDate(time: string) {
        const day = new Date(time).getDate();
        let fullDay: string;
        if (day < 10) {
            fullDay = `0${day}`;
        } else {
            fullDay =String(day);
        }
        const month = new Date(time).getMonth() + 1;
        let fullMonth: string;
        if (month < 10) {
            fullMonth = `0${month}`;
        } else {
            fullMonth =String(month);
        }
        const fullYear = new Date(time).getFullYear();
        
        const fullDate = `${fullDay}/${fullMonth}/${fullYear}`;
        return fullDate;
    };

    function setEditDate(time: string) {
        const day = new Date(time).getDate();
        let fullDay: string;
        if (day < 10) {
            fullDay = `0${day}`;
        } else {
            fullDay =String(day);
        }
        const month = new Date(time).getMonth() + 1;
        let fullMonth: string;
        if (month < 10) {
            fullMonth = `0${month}`;
        } else {
            fullMonth =String(month);
        }
        const fullYear = new Date(time).getFullYear();
        
        const fullDate = `${fullYear}-${fullMonth}-${fullDay}`;
        return fullDate;
    };

    function setStage(stage: number) {
        switch (stage) {
            case 1:
                return `${stage}st`;
            case 2:
                return `${stage}nd`;
            case 3:
                return `${stage}rd`;       
            default:
                return `${stage}th`;
        }
    }

    const showToolTip = (index: number, type: string) => {
        tooltipStatus.value = index;
        tooltipType.value = type;
    }

    const hideToolTip = () => {
        tooltipStatus.value = undefined;
        tooltipType.value = '';
    }

    return { interviewItems, addOpen, editOpen, currentDate, currentTime, currentInterviewIndex, pastInterviewIndex, mondayInterviewItems, tuesdayInterviewItems, wednesdayInterviewItems, thursdayInterviewItems, fridayInterviewItems, inputCompany, inputJob, inputCandidate, inputTime, inputDate, inputStage, tooltipStatus, tooltipType, setCurrentDate, getAllInterviews, checkInterviewStatus, deleteInterview, cancelEditInterview, cancelAddInterview, toggleAddInterviewOpen, addInterview, updateInterview, openEditInterview, setTime, setDate, setStage, showToolTip, hideToolTip }
})