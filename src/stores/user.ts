import { ref } from 'vue';
import { defineStore } from 'pinia';
import router from '../router/index';
import type { Profile } from '../assets/types/types';
import { useAppointmentStore } from './appointment';
import { useNoteStore } from './note';
import { useTodoStore } from './todo';
import { useJobsStore } from './job';
import { useInterviewStore } from './interview';
import { useUrlStore } from './url';

export const useUserStore = defineStore('user', () => {
    const appointmentStore = useAppointmentStore();
    const noteStore = useNoteStore();
    const todoStore = useTodoStore();
    const jobStore = useJobsStore();
    const interviewStore = useInterviewStore();
    const urlStore = useUrlStore();
    const userProfile = ref<Profile>({user_profile_id: '', first_name: '', last_name: '', email: ''});
    const inputEmail = ref('');
    const inputPassword = ref('');
    const createFirstName = ref('');
    const createLastName = ref('');
    const createEmail = ref('');
    const createPassword = ref('');
    const showCreate = ref(false);
    const errorMessage = ref('');
    const successMessage = ref('');
    const loggedIn = ref(localStorage.getItem('isAuthenticated'));
    const showFirstNameToolTip = ref(false);
    const showLastNameToolTip = ref(false);
    const showEmailToolTip = ref(false);
    const showPasswordToolTip = ref(false);
    const editFirstName = ref(false);
    const editLastName = ref(false);
    const editEmail = ref(false);
    const editPassword = ref(false);
    const editFirstNameInput = ref('');
    const editLastNameInput = ref('');
    const editEmailInput = ref('');
    const editPasswordInput = ref('');
    const verifyPassword = ref('');
    const disableEdit = ref(false);
    const showLogin = ref(true);
    const showVerify = ref(false);
    const showVerifyLink = ref(false);
    const showPasswordReset = ref(false);
    const showSendPasswordReset = ref(false);
    const resetToken = ref('');

    const getUser = async () => {
        try {
        const response = await fetch(`${urlStore.url}/user`, {
            method: "GET",
            credentials: "include"
        });

        const jsonData = await response.json();

        if (jsonData.errorMessage) {
            onLogout();
            return;
        }
           
        userProfile.value = jsonData;
        editFirstNameInput.value = userProfile.value.first_name;
        } catch (error) {
            if (error instanceof Error) {
                console.error(error.name);
                console.error(error.message);
                console.error(error.stack);
            } else {
                console.log('error');
            } 
            onLogout();
        }
    }

    const onLogin = async () => {
        errorMessage.value = '';
        if (!checkEmail(inputEmail.value)) {
            return errorMessage.value = 'Please enter a valid email address';
        }
        if (!checkPassword(inputPassword.value)) {
            return errorMessage.value = 'Please enter a password between 8 and 30 characters, with at least one uppercase letter, lowercase letter, number and special character.';
        }
        try {
            const email = inputEmail.value;
            const password = inputPassword.value;
            const body = { email, password };
            const response = await fetch(`${urlStore.url}/auth/login`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });

            const jsonData = await response.json();
            
            if (jsonData.message) {
                errorMessage.value = jsonData.message;
                return;
            }
            
            if (jsonData.errorMessage) {
                errorMessage.value = jsonData.errorMessage;
                return;
            }

            if (jsonData.verifyMessage) {
                errorMessage.value = jsonData.verifyMessage;
                showVerifyLink.value = true;
                return;
            }

            userProfile.value = jsonData;
            localStorage.setItem('isAuthenticated', 'true');
            loggedIn.value = localStorage.getItem('isAuthenticated');
            inputEmail.value = '';
            inputPassword.value = '';
            router.push({ path: '/daily-planner' });
            
        } catch (error) {
            if (error instanceof Error) {
                console.error(error.name);
                console.error(error.message);
                console.error(error.stack);
            } else {
                console.log('error');
            } 
            return errorMessage.value = 'Something went wrong, please try again.';
        }
    };

    const onCreateAccount = async () => {
        errorMessage.value = '';
        if (!checkName(createFirstName.value)) {
            return errorMessage.value = 'Please enter a valid first name';
        }  
        const validatedFirstName = firstCharCap(createFirstName.value);
        if (!checkName(createLastName.value)) {
            return errorMessage.value = 'Please enter a valid last name';
        }
        const validatedLastName = firstCharCap(createLastName.value);
        if (!checkEmail(createEmail.value)) {
            return errorMessage.value = 'Please enter a valid email address';
        }
        const validatedEmail = createEmail.value;
        if (!checkPassword(createPassword.value)) {
        return errorMessage.value = 'Please enter a password between 8 and 30 characters, with at least one uppercase letter, lowercase letter, number and special character.';
        }
        const validatedPassword = createPassword.value;
        try {
            const first_name = validatedFirstName;
            const last_name = validatedLastName;
            const email = validatedEmail;
            const password = validatedPassword;
            const body = { email, password, first_name, last_name };
            const response = await fetch(`${urlStore.url}/auth/create`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });

            const jsonData = await response.json();
            if (jsonData.email) {
            inputEmail.value = jsonData.email;
            createFirstName.value = '';
            createLastName.value = '';
            createEmail.value = '';
            createPassword.value = '';
            successMessage.value = 'Account successfuly created, please log in.';
            showCreate.value = false;
            showLogin.value = true;
            return;
            }
            if (jsonData.message) {
                return errorMessage.value = jsonData.message;
            }
            errorMessage.value = 'Something went wrong, please try again.';       
            
        } catch (error) {
            if (error instanceof Error) {
                console.error(error.name);
                console.error(error.message);
                console.error(error.stack);
            } else {
                console.log('error');
            } 
            return errorMessage.value = 'Something went wrong, please try again.';
        }
    };

    const firstCharCap = (name: string) => {
    const lower = name.toLowerCase();
    const newName = lower.charAt(0).toUpperCase() + lower.slice(1);
    return newName;
    };

    const onLogout = async () => {
        errorMessage.value = '';
        verifyPassword.value = '';
        try {
            const response = await fetch(`${urlStore.url}/user/logout`, {
                method: "POST",
                credentials: "include",
            });

            const jsonData = await response.json();

            if (jsonData.message || jsonData.authErrorMessage) {
                appointmentStore.appointmentItems = [];
                noteStore.noteItems = [];
                todoStore.todoItems = [];  
                jobStore.jobItems = [];
                interviewStore.interviewItems = [];
                userProfile.value = {user_profile_id: '', first_name: '', last_name: '', email: ''};
                localStorage.removeItem('isAuthenticated');
                loggedIn.value = localStorage.getItem('isAuthenticated');
                router.push({ path: '/login' });
            }
            console.log('called log out function');
            return;
            
        } catch (error) {
            if (error instanceof Error) {
                console.error(error.name);
                console.error(error.message);
                console.error(error.stack);
            } else {
                console.log('error');
            } 
            appointmentStore.appointmentItems = [];
            noteStore.noteItems = [];
            todoStore.todoItems = [];  
            jobStore.jobItems = [];
            interviewStore.interviewItems = [];
            userProfile.value = {user_profile_id: '', first_name: '', last_name: '', email: ''};
            localStorage.removeItem('isAuthenticated');
            loggedIn.value = localStorage.getItem('isAuthenticated');
            router.push({ path: '/login' });
        }
    };

    const toggleCreate = () => {
        showCreate.value = false;
        showLogin.value = true;
        inputEmail.value = '';
        inputPassword.value = '';
        createFirstName.value = '';
        createLastName.value = '';
        createEmail.value = '';
        createPassword.value = '';
        successMessage.value = '';
        errorMessage.value = '';
    };

    const toggleLogin = () => {
        showLogin.value = false;
        showCreate.value = true;
        inputEmail.value = '';
        inputPassword.value = '';
        successMessage.value = '';
        errorMessage.value = '';
    };

    const toggleLoginVerify = () => {
        showLogin.value = false;
        showVerify.value = true;
        inputEmail.value = '';
        successMessage.value = '';
        errorMessage.value = '';
    };

    const toggleVerify = () => {
        showVerify.value = false;
        showLogin.value = true;
        inputEmail.value = '';
        successMessage.value = '';
        errorMessage.value = '';
    };

    const togglePassword = () => {
        showPasswordReset.value = false;
        showLogin.value = true;
        inputPassword.value = '';
        successMessage.value = '';
        errorMessage.value = '';
    };

    const togglePasswordSend = () => {
        showSendPasswordReset.value = false;
        showLogin.value = true;
        inputPassword.value = '';
        successMessage.value = '';
        errorMessage.value = '';
    };

    const toggleLoginPassword = () => {
        showLogin.value = false;
        showSendPasswordReset.value = true;    
        inputPassword.value = '';
        successMessage.value = '';
        errorMessage.value = '';
    };

    const showEditProfile = (key: string) => {
        if (disableEdit.value) {
            return;
        }
        errorMessage.value = '';
        verifyPassword.value = '';
        switch (key) {
            case "first":
                editFirstName.value = !editFirstName.value;
                showFirstNameToolTip.value = false;
                editFirstNameInput.value = userProfile.value.first_name;
                disableEdit.value = !disableEdit.value;
                break;
            case "last":
                editLastName.value = !editLastName.value;
                showLastNameToolTip.value = false;
                editLastNameInput.value = userProfile.value.last_name;
                disableEdit.value = !disableEdit.value;
                break;
            case "email":
                editEmail.value = !editEmail.value;
                showEmailToolTip.value = false;
                editEmailInput.value = userProfile.value.email;
                disableEdit.value = !disableEdit.value;
                break;
            case "password":
                editPassword.value = !editPassword.value;
                showPasswordToolTip.value = false;
                editPasswordInput.value = '';
                disableEdit.value = !disableEdit.value;
                break;
            default:
                break;
        }
    };

    const hideEditProfile = (key: string) => {
        disableEdit.value = false;
        errorMessage.value = '';
        verifyPassword.value = '';
        switch (key) {
            case "first":
                editFirstName.value = !editFirstName.value;
                showFirstNameToolTip.value = false;
                editFirstNameInput.value = userProfile.value.first_name;
                break;
            case "last":
                editLastName.value = !editLastName.value;
                showLastNameToolTip.value = false;
                editLastNameInput.value = userProfile.value.last_name;
                break;
            case "email":
                editEmail.value = !editEmail.value;
                showEmailToolTip.value = false;
                editEmailInput.value = userProfile.value.email;
                break;
            case "password":
                editPassword.value = !editPassword.value;
                showPasswordToolTip.value = false;
                editPasswordInput.value = '';
                break;
            default:
                break;
        }
    };

    const showToolTip = (key: string) => {
        switch (key) {
            case "first":
            showFirstNameToolTip.value = !showFirstNameToolTip.value;
                break;
            case "last":
                showLastNameToolTip.value = !showLastNameToolTip.value;
                break;
            case "email":
                showEmailToolTip.value = !showEmailToolTip.value;
                break;
            case "password":
                showPasswordToolTip.value = !showPasswordToolTip.value;
                break;
            default:
                break;
        }
    };

    const submitFirstName = async (key: string) => {
        errorMessage.value = '';
        if (!checkName(editFirstNameInput.value)) {
            return errorMessage.value = 'Please enter a valid first name';
        }        
        const validatedFirstName = firstCharCap(editFirstNameInput.value);
        if (!checkPassword(verifyPassword.value)) {
            return errorMessage.value = 'Please enter a password between 8 and 30 characters, with at least one uppercase letter, lowercase letter, number and special character.';
        }
        const validatedPassword = verifyPassword.value;
        try {
            const firstName = validatedFirstName;
            const userId = userProfile.value.user_profile_id;
            const password = validatedPassword;
            const body = { firstName, userId, password };
            const response = await fetch(`${urlStore.url}/auth/firstname`, {
                method: "PUT",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });

            const jsonData = await response.json();
            
            if (jsonData.errorMessage) {
            errorMessage.value = jsonData.errorMessage;
            return;
            }       
            userProfile.value.first_name = validatedFirstName;
            hideEditProfile(key);
            verifyPassword.value = '';
            
        } catch (error) {
            if (error instanceof Error) {
                console.error(error.name);
                console.error(error.message);
                console.error(error.stack);
            } else {
                console.log('error');
            } 
            return errorMessage.value = 'Something went wrong, please try again.';
        }
    };

    const submitLastName = async (key: string) => {
        errorMessage.value = '';
        if (!checkName(editLastNameInput.value)) {
            return errorMessage.value = 'Please enter a valid last name';
        }
        const validatedLastName = firstCharCap(editLastNameInput.value);
        if (!checkPassword(verifyPassword.value)) {
            return errorMessage.value = 'Please enter a password between 8 and 30 characters, with at least one uppercase letter, lowercase letter, number and special character.';
        }
        const validatedPassword = verifyPassword.value;
        try {
            const lastName = validatedLastName;
            const userId = userProfile.value.user_profile_id;
            const password = validatedPassword;
            const body = { lastName, userId, password };
            const response = await fetch(`${urlStore.url}/auth/lastname`, {
                method: "PUT",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });

            const jsonData = await response.json();
            
            if (jsonData.errorMessage) {
            errorMessage.value = jsonData.errorMessage;
            return;
            }         
            userProfile.value.last_name = validatedLastName;
            hideEditProfile(key);
            verifyPassword.value = '';
            
        } catch (error) {
            if (error instanceof Error) {
                console.error(error.name);
                console.error(error.message);
                console.error(error.stack);
            } else {
                console.log('error');
            } 
            return errorMessage.value = 'Something went wrong, please try again.';
        }
    };

    const submitEmail = async (key: string) => {
        errorMessage.value = '';
        if (!checkEmail(editEmailInput.value)) {
            return errorMessage.value = 'Please enter a valid email address';
        }
        const validatedEmail = editEmailInput.value;
        if (!checkPassword(verifyPassword.value)) {
            return errorMessage.value = 'Please enter a password between 8 and 30 characters, with at least one uppercase letter, lowercase letter, number and special character.';
        }
        const validatedPassword = verifyPassword.value;
        try {
            const userId = userProfile.value.user_profile_id;
            const email = validatedEmail;
            const password = validatedPassword;
            const body = { userId, email, password };
            const response = await fetch(`${urlStore.url}/auth/email`, {
                method: "PUT",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });

            const jsonData = await response.json();
            
            if (jsonData.errorMessage) {
            errorMessage.value = jsonData.errorMessage;
            return;
            }          
            userProfile.value.email = validatedEmail;
            hideEditProfile(key);
            verifyPassword.value = '';
            
        } catch (error) {
            if (error instanceof Error) {
                console.error(error.name);
                console.error(error.message);
                console.error(error.stack);
            } else {
                console.log('error');
            } 
            return errorMessage.value = 'Something went wrong, please try again.';
        }
    };

    const submitPassword = async (key: string) => {
        errorMessage.value = '';
        if (!checkPassword(verifyPassword.value)) {
            return errorMessage.value = 'Please enter a password between 8 and 30 characters, with at least one uppercase letter, lowercase letter, number and special character.';
        }
        const validatedPassword = verifyPassword.value;
        if (!checkPassword(editPasswordInput.value)) {
            return errorMessage.value = 'Please enter a new password between 8 and 30 characters, with at least one uppercase letter, lowercase letter, number and special character.';
        }
        const validatedNewPassword = editPasswordInput.value;
        try {
            const userId = userProfile.value.user_profile_id;
            const newPassword = validatedNewPassword;
            const password = validatedPassword;
            const body = { newPassword, userId, password };
            const response = await fetch(`${urlStore.url}/auth/password`, {
                method: "PUT",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });

            const jsonData = await response.json();
            
            if (jsonData.errorMessage) {
            errorMessage.value = jsonData.errorMessage;
            return;
            }         
            hideEditProfile(key);
            verifyPassword.value = '';
            
        } catch (error) {
            if (error instanceof Error) {
                console.error(error.name);
                console.error(error.message);
                console.error(error.stack);
            } else {
                console.log('error');
            } 
            return errorMessage.value = 'Something went wrong, please try again.';
        }
    };

    const onVerifyEmail = async () => {
        errorMessage.value = '';
        successMessage.value = '';
        if (!checkEmail(inputEmail.value)) {
            return errorMessage.value = 'Please enter a valid email address';
        }
        const validatedEmail = inputEmail.value;
        try {
            const email = validatedEmail;
            const body = { email };
            const response = await fetch(`${urlStore.url}/auth/resend-verify-email`, {
                method: "PUT",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });

            const jsonData = await response.json();
            
            if (jsonData.message) {
            errorMessage.value = jsonData.message;
            return;
            }        
            
            if (jsonData.existsMessage) {
            errorMessage.value = jsonData.existsMessage;
            showVerify.value = false;
            showLogin.value = true;
            return;
            } 

            showVerify.value = false;
            showLogin.value = true;
            successMessage.value = 'Verification email successfully sent.';
            inputEmail.value = jsonData;
            
        } catch (error) {
            if (error instanceof Error) {
                console.error(error.name);
                console.error(error.message);
                console.error(error.stack);
            } else {
                console.log('error');
            } 
            return errorMessage.value = 'Something went wrong, please try again.';
        }
    };

    const verifyUserEmail = async (access: string) => {
        try {
            const body = { access };
            const response = await fetch(`${urlStore.url}/auth/verify-email`, {
                method: "PUT",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });

            const jsonData = await response.json();

            router.push({ path: '/login' });
            
            if (jsonData.errorMessage) {
                showLogin.value = false;
                showVerify.value = true;                
                errorMessage.value = jsonData.errorMessage;
                return;
            }

            if (jsonData.successMessage) {
                successMessage.value = jsonData.successMessage;
                inputEmail.value = jsonData.userEmail;
            }


        } catch (error) {
            if (error instanceof Error) {
                console.error(error.name);
                console.error(error.message);
                console.error(error.stack);
            } else {
                console.log('error');
            } 
            return errorMessage.value = 'Something went wrong, please try again.';
        }
    }

    const onSendPasswordReset = async () => {
        errorMessage.value = '';
        successMessage.value = '';
        if (!checkEmail(inputEmail.value)) {
            return errorMessage.value = 'Please enter a valid email address';
        }
        const validatedEmail = inputEmail.value;
        try {
            const email = validatedEmail;
            const body = { email };
            const response = await fetch(`${urlStore.url}/auth/forgotten-password`, {
                method: "PUT",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });

            const jsonData = await response.json();
            
            if (jsonData.message) {
            errorMessage.value = jsonData.message;
            return;
            }        

            showSendPasswordReset.value = false;
            showLogin.value = true;
            successMessage.value = jsonData.successMessage;
            
        } catch (error) {
            if (error instanceof Error) {
                console.error(error.name);
                console.error(error.message);
                console.error(error.stack);
            } else {
                console.log('error');
            } 
            return errorMessage.value = 'Something went wrong, please try again.';
        }
    };

    const saveResetToken = (token: string) => {
        resetToken.value = token;
        router.push({ path: '/login' });
        showLogin.value = false;
        showPasswordReset.value = true;
    }

    const onResetPassword = async () => {
        errorMessage.value = '';
        successMessage.value = '';
        if (!checkPassword(inputPassword.value)) {
            return errorMessage.value = 'Please enter a password between 8 and 30 characters, with at least one uppercase letter, lowercase letter, number and special character.';
        }
        const validatedNewPassword = inputPassword.value;
        try {
            const password = validatedNewPassword;
            const access = resetToken.value;
            const body = { password, access };
            const response = await fetch(`${urlStore.url}/auth/update-forgotten-password`, {
                method: "PUT",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });

            const jsonData = await response.json();

            if (jsonData.message) {
            errorMessage.value = jsonData.message;
            return;
            }  
            
            if (jsonData.errorMessage) {
            errorMessage.value = jsonData.errorMessage;
            return;
            }         

            showPasswordReset.value = false;
            inputPassword.value = '';
            showLogin.value = true;
            successMessage.value = jsonData.successMessage;
            resetToken.value = '';
            
        } catch (error) {
            if (error instanceof Error) {
                console.error(error.name);
                console.error(error.message);
                console.error(error.stack);
            } else {
                console.log('error');
            } 
            return errorMessage.value = 'Something went wrong, please try again.';
        }
    };

    const checkName = (firstName: string) => {
        const regexName = /^[A-Za-z]+$/;
        if (firstName.length === 0 || firstName.length > 30 || !regexName.test(firstName)) {
            return false;
        }
        return true;
    }

    const checkEmail = (email: string) => {
        const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (email.length === 0 || email.length > 256 || !regexEmail.test(email)) {
            return false;
        }
        return true;
    }

    const checkPassword = (password: string) => {
        const regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&])[A-Za-z\d@.#$!%*?&]{8,30}$/;
        if (password.length < 8 || password.length > 15 || !regexPassword.test(password)) {
            return false;
        }
        return true;
    }

  return { userProfile, successMessage, createFirstName, createLastName, createEmail, createPassword, inputEmail, inputPassword, errorMessage, loggedIn, showCreate, showFirstNameToolTip, showLastNameToolTip, showEmailToolTip, showPasswordToolTip, editFirstName, editLastName, editEmail, editPassword, editFirstNameInput, editLastNameInput, editEmailInput, editPasswordInput, verifyPassword, disableEdit, showLogin, showVerify, showVerifyLink, showPasswordReset, showSendPasswordReset, toggleLogin, toggleLoginVerify, toggleVerify, onLogin, onLogout, getUser, onCreateAccount, toggleCreate, showEditProfile, hideEditProfile, showToolTip, submitFirstName, submitLastName, submitEmail, submitPassword, verifyUserEmail, onVerifyEmail, togglePassword, togglePasswordSend, toggleLoginPassword, onSendPasswordReset, onResetPassword, saveResetToken }
})