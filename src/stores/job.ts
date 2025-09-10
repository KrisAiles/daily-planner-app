import { ref } from 'vue';
import { defineStore } from 'pinia';
import type { Jobs } from '../assets/types/types';
import { useUserStore } from './user';
import { testUuid } from '../composables/testUuid';
import { testInput } from '../composables/testInput';
import { useUrlStore } from './url';

export const useJobsStore = defineStore('jobs', () => {
    const userStore = useUserStore();
    const urlStore = useUrlStore();
    const jobItems = ref<Jobs []>([]);
    const addOpen = ref(false);
    const editOpen = ref<number | undefined>();
    const inputCompany = ref('');
    const inputJob = ref('');
    const disableEdit = ref(false);
    const tooltipStatus = ref<number | undefined>();
    const tooltipType = ref('');

    const getAllJobs = async () => {
        try {
            const response = await fetch(`${urlStore.url}/job`, {
                method: "GET",
                credentials: "include"
            });
            const jsonData = await response.json();

            if (jsonData.authErrorMessage) {
                userStore.onLogout();
                return console.log('not logged in');
            }

            jobItems.value = jsonData;

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

    const deleteJob = async (index: number, job_id: string) => {
        if (disableEdit.value) {
            return;
        }
        if (!testUuid(job_id)) {
            return;
        }
        try {
            const deleteJob = await fetch(`${urlStore.url}/job/${job_id}`, {
                method: "DELETE",
                credentials: "include"
            });

            const jsonData = await deleteJob.json();
            
            if (jsonData.authErrorMessage) {
                userStore.onLogout();
                return console.log('not logged in');
            }

            if (jsonData.errorMessage) {
                return console.log(jsonData.errorMessage);
            }

            if (jsonData.message) {
                jobItems.value.splice(index, 1);
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

    function cancelEditJob() {
        inputCompany.value = '';
        inputJob.value = '';
        editOpen.value = undefined;
        disableEdit.value = false;
    };

    function cancelAddJob() {
        inputCompany.value = '';
        inputJob.value = '';
        addOpen.value = !addOpen.value;
        disableEdit.value = false;
    };

    function toggleAddJobOpen() {
        addOpen.value = !addOpen.value;
        disableEdit.value = true;
    };

    const addJob = async () => {
        if (inputCompany.value === '') {
            return alert('Company can not be empty.');
        }
        if (inputJob.value === '') {
            return alert('Job can not be empty.');
        }
        if (testInput(inputCompany.value)) {
            return alert('Text can not contain <>`$;`');
        }
        if (testInput(inputJob.value)) {
            return alert('Text can not contain <>`$;`');
        }
        try {
            const company = inputCompany.value;
            const job = inputJob.value;
            const body = { company, job };
            const response = await fetch(`${urlStore.url}/job`, {
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

            jobItems.value.push(jsonData);
            inputCompany.value = '';
            inputJob.value = '';
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

    const updateJob = async (index: number, job_id: string) => {
        if (inputCompany.value === '') {
            return alert('Company can not be empty.');
        }
        if (inputJob.value === '') {
            return alert('Job can not be empty.');
        }
        if (!testUuid(job_id)) {
            return;
        }
        if (testInput(inputCompany.value)) {
            return alert('Text can not contain <>`$;`');
        }
        if (testInput(inputJob.value)) {
            return alert('Text can not contain <>`$;`');
        }
        try {
            const company = inputCompany.value;
            const job = inputJob.value;
            const body = { company, job };
            const response = await fetch(`${urlStore.url}/job/${job_id}`, {
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

            jobItems.value[index].company = inputCompany.value;
            jobItems.value[index].job = inputJob.value;
            inputCompany.value = '';
            inputJob.value = '';
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

    const updateCv = async (index: number, job_id: string) => {
        if (!testUuid(job_id)) {
            return false;
        }
        try {
            const cv = jobItems.value[index].cv;
            const body = { cv };
            const response = await fetch(`${urlStore.url}/job/cv/${job_id}`, {
                method: "PUT",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });

            const jsonData = await response.json();
            
            if (jsonData.errorMessage) {
                console.log(jsonData.errorMessage);
                return false;
            }

            return true;
            
        } catch (err: unknown) {
            if (err instanceof Error) {
                console.error(err.name);
                console.error(err.message);
                console.error(err.stack);
            } else {
                console.log('error');
            }       
            return false;  
        }
    };

    const updateInterview = async (index: number, job_id: string) => {
        if (!testUuid(job_id)) {
            return false;
        }
        try {
            const interview = jobItems.value[index].interview;
            const body = { interview };
            const response = await fetch(`${urlStore.url}/job/interview/${job_id}`, {
                method: "PUT",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });

            const jsonData = await response.json();
            
            if (jsonData.errorMessage) {
                console.log(jsonData.errorMessage);
                return false;
            }

            return true;
            
        } catch (err: unknown) {
            if (err instanceof Error) {
                console.error(err.name);
                console.error(err.message);
                console.error(err.stack);
            } else {
                console.log('error');
            }       
            return false;   
        }
    };

    const increaseCv = async (index: number, job_id: string) => {
        jobItems.value[index].cv += 1;
        const response = await updateCv(index, job_id);
        if (!response) {
            jobItems.value[index].cv -= 1;
            return alert('Something went wrong, please try again.');
        }
    };

    const decreaseCv = async (index: number, job_id: string) => {
        if (jobItems.value[index].cv === 0) {
            return alert('Number can not be less than 0.');
        }
        jobItems.value[index].cv -= 1;
        const response = await updateCv(index, job_id);
        if (!response) {
            jobItems.value[index].cv += 1;
            return alert('Something went wrong, please try again.');
        }
    };

    const increaseInterview = async (index: number, job_id: string) => {
        jobItems.value[index].interview += 1;
        const response = await updateInterview(index, job_id);
        if (!response) {
            jobItems.value[index].interview -= 1;
            return alert('Something went wrong, please try again.');
        }
    };

    const decreaseInterview = async (index: number, job_id: string) => {
        if (jobItems.value[index].interview === 0) {
            return alert('Number can not be less than 0.');
        }
        jobItems.value[index].interview -= 1;
        const response = await updateInterview(index, job_id);
        if (!response) {
            jobItems.value[index].interview += 1;
            return alert('Something went wrong, please try again.');
        }
    };


    function openJobEdit(company: string, job: string, index: number) {
        if (disableEdit.value) {
            return;
        }
        inputCompany.value = company;
        inputJob.value = job;
        editOpen.value = index;
        disableEdit.value = true;
        tooltipStatus.value = undefined;
        tooltipType.value = '';
    };

    const showToolTip = (index: number, type: string) => {
        tooltipStatus.value = index;
        tooltipType.value = type;
    }

    const hideToolTip = () => {
        tooltipStatus.value = undefined;
        tooltipType.value = '';
    }

    return { jobItems, addOpen, editOpen, inputCompany, inputJob, disableEdit, tooltipStatus, tooltipType, getAllJobs, deleteJob, toggleAddJobOpen, updateInterview, cancelEditJob, cancelAddJob, addJob, updateJob, increaseCv, decreaseCv, increaseInterview, decreaseInterview, openJobEdit, showToolTip, hideToolTip }
})