<script setup lang="ts">
import { useUserStore } from '../stores/user';
import { useWindowStore } from '../stores/window';

const windowStore = useWindowStore();
const store = useUserStore();

if (store.userProfile.user_profile_id === '') {
    store.getUser();
}

</script>

<template>
    <div id="account-container" :style="{minHeight: windowStore.windowWidth < 687 ? '1640px' : 'auto'}">
        <h2>Welcome back {{ store.userProfile.first_name }}</h2>
        <div id="user-info-container">
            <h3>Account details</h3>
            <div class="account-details" v-if="!store.editFirstName">
                <div>First name: {{ store.userProfile.first_name }}</div>
                <div class="edit-image"><img src="../assets/images/edit.png" alt="edit pen" @mouseover="store.showToolTip('first')" @mouseleave="store.showToolTip('first')" @click="store.showEditProfile('first')" /><div class="tooltip" v-if="store.showFirstNameToolTip">edit</div></div>
            </div>
            <div class="account-edit" v-if="store.editFirstName">
                <div class="error" v-if="store.errorMessage">{{ store.errorMessage }}</div>
                <form @submit.prevent="store.submitFirstName('first')">
                    <label for="edit-first-name">First name: </label>
                    <input class="first-name-input" id="edit-first-name" name="edit-first-name" type="text" required v-model="store.editFirstNameInput" /><br />
                    <label for="verify-password">Password: </label>
                    <input class="verify-password" id="verify-password" name="verify-password" type="password" required v-model="store.verifyPassword" /><br />
                    <input class="button-style" id="first-name-submit" name="first-name-submit" type="submit" /> <button class="button-style" @click="store.hideEditProfile('first')">Cancel</button>
                </form>                
            </div>
            <div class="account-details" v-if="!store.editLastName">
                <div>Last name: {{ store.userProfile.last_name }}</div>
                <div class="edit-image"><img src="../assets/images/edit.png" alt="edit pen" @mouseover="store.showToolTip('last')" @mouseleave="store.showToolTip('last')" @click="store.showEditProfile('last')" /><div class="tooltip" v-if="store.showLastNameToolTip">edit</div></div>
            </div>
            <div class="account-edit" v-if="store.editLastName">
                <div class="error" v-if="store.errorMessage">{{ store.errorMessage }}</div>
                <form @submit.prevent="store.submitLastName('last')">
                    <label for="edit-last-name">Last name: </label>
                    <input class="last-name-input" id="edit-last-name" name="edit-last-name" type="text" required v-model="store.editLastNameInput" /><br />
                    <label for="verify-password">Password: </label>
                    <input class="verify-password" id="verify-password" name="verify-password" type="password" required v-model="store.verifyPassword" /><br />
                    <input class="button-style" id="last-name-submit" name="last-name-submit" type="submit" /> <button class="button-style" @click="store.hideEditProfile('last')">Cancel</button>
                </form>  
            </div>
            <div class="account-details" v-if="!store.editEmail">
                <div>Email: {{ store.userProfile.email }}</div>
                <div class="edit-image"><img src="../assets/images/edit.png" alt="edit pen" @mouseover="store.showToolTip('email')" @mouseleave="store.showToolTip('email')" @click="store.showEditProfile('email')" /><div class="tooltip" v-if="store.showEmailToolTip">edit</div></div>
            </div>
            <div class="account-edit" v-if="store.editEmail">
                <div class="error" v-if="store.errorMessage">{{ store.errorMessage }}</div>
                <form @submit.prevent="store.submitEmail('email')">
                    <label for="edit-email">Email: </label>
                    <input class="email-input" id="edit-email" name="edit-email" type="email" required v-model="store.editEmailInput" /><br />
                    <label for="verify-password">Password: </label>
                    <input class="verify-password" id="verify-password" name="verify-password" type="password" required v-model="store.verifyPassword" /><br />
                    <input class="button-style" id="email-submit" name="email-submit" type="submit" /> <button class="button-style" @click="store.hideEditProfile('email')">Cancel</button>
                </form>  
            </div>
            <div class="account-details" v-if="!store.editPassword">
                <div>Update password</div>
                <div class="edit-image"><img src="../assets/images/edit.png" alt="edit pen" @mouseover="store.showToolTip('password')" @mouseleave="store.showToolTip('password')" @click="store.showEditProfile('password')" /><div class="tooltip" v-if="store.showPasswordToolTip">edit</div></div>
            </div>
            <div class="account-edit" v-if="store.editPassword">
                <div class="error" v-if="store.errorMessage">{{ store.errorMessage }}</div>
                <form @submit.prevent="store.submitPassword('password')">
                    <label for="edit-password">New password: </label>
                    <input class="password-input" id="edit-password" name="edit-passsword" type="password" required v-model="store.editPasswordInput" /><br />
                    <label for="verify-password">Password: </label>
                    <input class="verify-password" id="verify-password" name="verify-password" type="password" required v-model="store.verifyPassword" /><br />
                    <input class="button-style" id="password-submit" name="password-submit" type="submit" /> <button class="button-style" @click="store.hideEditProfile('password')">Cancel</button>
                </form>  
            </div>
            <div class="account-details">
                <button class="button-style" @click="store.onLogout">Logout</button>
            </div>
        </div>        
    </div>
    
</template>

<style lang="scss" scoped>
@use '../assets/css/variables.scss';
@use '../assets/css/mixins.scss';

.account-details {
    display: flex;
    margin-top: 0.5rem;
}

.edit-image {
    position: relative;
    margin-left: 0.5rem;
    cursor: pointer;

    img {
        height: 1rem;
        width: 1rem;        
    }
}

.tooltip {
    position: absolute;
    background-color: variables.$white-color;
    color: variables.$olive-color;
    padding: 0 0.25rem;
    z-index: 650;
}

#account-container {
    width: 100%;
    padding: 1.4375rem;
    border-bottom: variables.$borders;
    background-color: variables.$white-color;
    text-align: center;

    h2 {
        font-size: 2rem;
        font-weight: 600;
        padding-bottom: 1rem;
        color: variables.$olive-color;
    }
}

#user-info-container {
    display: flex;
    flex-direction: column;
    width: 17.625rem;
    min-height: 17.625rem;
    min-height: 20.5rem;
    padding: 1rem;
    margin: 0 auto;
    border-radius: 0.3125rem;
    background-color: variables.$olive-color;
    box-shadow: variables.$box-shadow;
    color: variables.$white-color;
    
    h3 {
            font-size: 1.5rem;
            padding-bottom: 1rem;
        }   
}

.account-edit {
    text-align: left;
}

.button-style {
    @include mixins.button-style;
}

.error {
    color: red;
}

.verify-password {
    width: 10.625rem;
}

.first-name-input {
    width: 10.1875rem;
}

.last-name-input {
    width: 10.1875rem;
}

.email-input {
    width: 12.5625rem;
}

.password-input {
    width: 8.25rem;
}

</style>