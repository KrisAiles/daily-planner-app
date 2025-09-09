<script setup lang="ts">
import { useUserStore } from '../stores/user';
import { useWindowStore } from '../stores/window';
import { useRoute } from 'vue-router';

const route = useRoute();
const windowStore = useWindowStore();
const store = useUserStore();

if (route.params.emailid) {
    store.verifyUserEmail(String(route.params.emailid));
}

if (route.params.passwordid) {
    store.saveResetToken(String(route.params.passwordid));
}

</script>

<template>
    <div id="login-container"  :style="{minHeight: windowStore.windowWidth < 687 ? '1640px' : 'auto'}">        
        <div class="login-form-container" v-if="store.showLogin">
            <p>Please login or<br /><span class="login-create" @click="store.toggleLogin">create a new account</span></p>
            <h1>Login</h1>
            <p class="error" v-if="store.errorMessage">{{ store.errorMessage }}</p>
            <p class="success" v-if="store.successMessage">{{ store.successMessage }}</p>
            <p class="success" v-if="store.showVerifyLink"><span class="login-create" @click="store.toggleLoginVerify">Resend verification email</span></p>
            <form @submit.prevent="store.onLogin">
                <label for="login-email">Email:</label><br />
                <input id="login-email" name="login-email" type="email" v-model="store.inputEmail" required /><br /><br />
                <label for="login-password">Password:</label><br />
                <input id="login-password" name="login-password" type="password" v-model="store.inputPassword" required /><br /><br />
                <p><span class="login-create" @click="store.toggleLoginPassword">forgotten password</span></p><br />
                <input id="login-submit" class="button-style" name="submit" type="submit" />
            </form>
        </div>
        <div class="login-form-container" v-if="store.showCreate">
            <p>If you already have an account<br />please <span class="login-create" @click="store.toggleCreate">login</span></p>
            <h1>Create Account</h1>
            <p class="error" v-if="store.errorMessage">{{ store.errorMessage }}</p>
            <form @submit.prevent="store.onCreateAccount">
                <label for="first">First name:</label><br />
                <input id="create-first" name="first" type="text" v-model="store.createFirstName" required /><br /><br />
                <label for="last">Last name:</label><br />
                <input id="create-last" name="last" type="text" v-model="store.createLastName" required /><br /><br />
                <label for="email">Email:</label><br />
                <input id="create-email" name="email" type="email" v-model="store.createEmail" required /><br /><br />
                <label for="password">Password:</label><br />
                <input id="create-password" name="password" type="password" v-model="store.createPassword" required /><br /><br />
                <input id="create-submit" class="button-style" name="submit" type="submit" />
            </form>
        </div>
        <div class="login-form-container" v-if="store.showVerify">
            <p>If you already have an account<br />please <span class="login-create" @click="store.toggleVerify">login</span></p>
            <h1>Verify Email Address</h1>
            <p class="error" v-if="store.errorMessage">{{ store.errorMessage }}</p>
            <p class="success" v-if="store.successMessage">{{ store.successMessage }}</p>
            <form @submit.prevent="store.onVerifyEmail">
                <label for="verify-email">Email:</label><br />
                <input id="verify-email" name="verify-email" type="email" v-model="store.inputEmail" required /><br /><br />
                <input id="verify-submit" class="button-style" name="submit" type="submit" />
            </form>
        </div>
        <div class="login-form-container" v-if="store.showPasswordReset">
            <p>If you already have an account<br />please <span class="login-create" @click="store.togglePassword">login</span></p>
            <h1>Reset Password</h1>
            <p class="error" v-if="store.errorMessage">{{ store.errorMessage }}</p>
            <p class="success" v-if="store.successMessage">{{ store.successMessage }}</p>
            <form @submit.prevent="store.onResetPassword">
                <label for="reset-password">Password:</label><br />
                <input id="reset-password" name="reset-password" type="password" v-model="store.inputPassword" required /><br /><br />
                <input id="reset-password-submit" class="button-style" name="submit" type="submit" />
            </form>
        </div>
        <div class="login-form-container" v-if="store.showSendPasswordReset">
            <p>If you already have an account<br />please <span class="login-create" @click="store.togglePasswordSend">login</span></p>
            <h1>Forgotten Password</h1>
            <p class="error" v-if="store.errorMessage">{{ store.errorMessage }}</p>
            <p class="success" v-if="store.successMessage">{{ store.successMessage }}</p>
            <form @submit.prevent="store.onSendPasswordReset">
                <label for="reset-email">Email:</label><br />
                <input id="reset-email" name="reset-email" type="email" v-model="store.inputEmail" required /><br /><br />
                <input id="reset-email-submit" class="button-style" name="submit" type="submit" />
            </form>
        </div>
    </div>
    
</template>

<style lang="scss" scoped>
@use '../assets/css/variables.scss';
@use '../assets/css/mixins.scss';

.login-create {
    text-decoration: underline;
    cursor: pointer;
}

#login-container {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    padding: 1.4375rem;
    border-bottom: variables.$borders;
    background-color: variables.$white-color;
}

.button-style {
    @include mixins.button-style;

    span {
        font-family: "Quicksand", sans-serif;
        font-size: 0.75rem;
        font-weight: 600;
    }
}

.login-form-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 17.625rem;
    min-width: 17.625rem;
    min-height: 17.625rem;
    padding: 8px;
    border-radius: 0.3125rem;
    background-color: variables.$olive-color;
    box-shadow: variables.$box-shadow;
    color: white;
    text-align: center;

    h1 {
        font-size: 32px;
        padding-bottom: 16px;
    }

    form {
        text-align: center;
    }
}

.error {
    color: red;
    margin-bottom: 16px;
}

.success {
    color: white;
    margin-bottom: 16px;
}

</style>