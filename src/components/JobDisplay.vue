<script setup lang="ts">
import { useJobsStore } from '../stores/job';

const jobStore = useJobsStore();

if (jobStore.jobItems.length === 0) {
    jobStore.getAllJobs();
}

</script>

<template>
    <div id="jobs-container">
        <h2>Jobs</h2>
        <TransitionGroup name="fade-left" appear>
            <div class="job-item" v-for="(job, index) in jobStore.jobItems" :key="job.job_id">
                <div class="company-job">
                    <div class="job-company">{{ job.company }}</div>
                    <div class="job-title">{{ job.job }}</div>
                </div>
                <div class="job-cv-container">
                    <div class="job-cv" @mouseover="jobStore.showToolTip(index, 'cv')" @mouseleave="jobStore.hideToolTip()">
                        <button class="button-style-small" @click="jobStore.decreaseCv(index, job.job_id)" :disabled="job.cv === 0 || jobStore.disableEdit"><div class="minus">-</div></button> {{ job.cv }} <button class="button-style-small" @click="jobStore.increaseCv(index, job.job_id)" :disabled="jobStore.disableEdit"><div class="plus">+</div></button>
                    </div>
                    <div class="cv-tooltip" v-if="jobStore.tooltipStatus === index && jobStore.tooltipType === 'cv'">cv&lsquo;s</div>
                    <div class="job" @mouseover="jobStore.showToolTip(index, 'interview')" @mouseleave="jobStore.hideToolTip()">
                        <button class="button-style-small" @click="jobStore.decreaseInterview(index, job.job_id)" :disabled="job.interview === 0 || jobStore.disableEdit"><div class="minus">-</div></button> {{ job.interview }} <button class="button-style-small" @click="jobStore.increaseInterview(index, job.job_id)" :disabled="jobStore.disableEdit"><div class="plus">+</div></button>                    
                    </div>
                    <div class="interview-tooltip" v-if="jobStore.tooltipStatus === index && jobStore.tooltipType === 'interview'">interview&lsquo;s</div>
                </div>
                <div class="edit-delete">
                    <div class="job-edit">
                        <img src="../assets/images/edit.png" alt="edit pen" @click="jobStore.openJobEdit(job.company, job.job, index)" @mouseover="jobStore.showToolTip(index, 'edit')" @mouseleave="jobStore.hideToolTip()" />
                        <div class="tooltip" v-if="jobStore.tooltipStatus === index && jobStore.tooltipType === 'edit'">edit</div>
                    </div>
                    <div class="job-delete">
                        <img src="../assets/images/delete.png" alt="delete bin" @click="jobStore.deleteJob(index, job.job_id)" @mouseover="jobStore.showToolTip(index, 'delete')" @mouseleave="jobStore.hideToolTip()" />
                        <div class="tooltip" v-if="jobStore.tooltipStatus === index && jobStore.tooltipType === 'delete'">delete</div>
                    </div>
                </div>
                <div class="edit-job-container" v-if="jobStore.editOpen === index">
                    <form class="job-form" @submit.prevent="jobStore.updateJob(index, job.job_id)">
                        <label for="company-name">Company: </label>
                        <input class="job-edit-input input-style" id="company-name" name="company-name" type="text" required v-model="jobStore.inputCompany" /><br />
                        <label for="job-title">Job: </label>
                        <input class="job-edit-input input-style" id="job-title" name="job-title" type="text" required v-model="jobStore.inputJob" /><br />
                        <input class="submit button-style" name="submit" type="submit" value="Submit"> <button class="cancel button-style" @click="jobStore.cancelEditJob">Cancel</button>                       
                    </form>
                </div>
            </div>
        </TransitionGroup>
        <div id="job-add">
            <button class="button-style" @click="jobStore.toggleAddJobOpen" :disabled="jobStore.editOpen !== undefined">Add</button>
            <div class="job-add-container" v-if="jobStore.addOpen">
                <form class="job-form" @submit.prevent="jobStore.addJob">
                    <label for="add-company-name">Company: </label>
                    <input class="job-edit-input input-style" id="add-company-name" name="add-company-name" type="text" required v-model="jobStore.inputCompany" /><br />
                    <label for="add-job-title">Job: </label>
                    <input class="job-edit-input input-style" id="add-job-title" name="add-job-title" type="text" required v-model="jobStore.inputJob" /><br />
                    <input class="submit button-style" name="submit" type="submit" value="Submit"> <button class="cancel button-style" @click="jobStore.cancelAddJob">Cancel</button>                         
                </form>
            </div>
        </div>      
    </div>           
</template>

<style lang="scss" scoped>
@use '../assets/css/variables.scss';
@use '../assets/css/mixins.scss';

.fade-left-enter-active,
.fade-left-leave-active {
    @include mixins.enter-leave;
}

.fade-left-enter-from,
.fade-left-leave-to {
    @include mixins.from-to-left;
}

#jobs-container {
    @include mixins.display-container;
}

.job-item {
    @include mixins.item-container;

    @include mixins.mobile {
        flex-direction: column;
    }
}

.company-job {
    @include mixins.item-description;

    @include mixins.mobile {
        flex-direction: column;
        justify-content: center;
    }
}

.job-company {
    width: 40%;
    text-align: left;

    @include mixins.mobile {
        width: 100%;
        text-align: center;
    }
}

.job-title {
    width: 60%;
    text-align: left;
    padding: 0 0.5rem;

    @include mixins.mobile {
        width: 100%;
        text-align: center;
        padding: 0;
    }
}

.job-cv-container {
    position: relative;
    @include mixins.flex-center;
    width: 9.375rem;
}

.job-cv {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 4.6875rem;
}

.job {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 4.6875rem;
}

.edit-delete {
    @include mixins.edit-delete-container;
}

.job-edit {
    position: relative;
    @include mixins.edit-delete;
    margin: 0 0.5rem;
}

.job-delete {
    position: relative;
    @include mixins.edit-delete;
}

.tooltip {
    position: absolute;
    background-color: variables.$white-color;
    color: variables.$olive-color;
    padding: 0 0.25rem;
    font-size: 1.25rem;
    z-index: 603;
}

.interview-tooltip {
    position: absolute;
    bottom: -1.5rem;
    right: -1rem;
    background-color: variables.$white-color;
    color: variables.$olive-color;
    padding: 0 0.25rem;
    font-size: 1.25rem;
    z-index: 613;
}

.cv-tooltip {
    position: absolute;
    bottom: -1.5rem;
    left: 1rem;
    background-color: variables.$white-color;
    color: variables.$olive-color;
    padding: 0 0.25rem;
    font-size: 1.25rem;
    z-index: 623;
}

.edit-job-container {
    @include mixins.add-container;
    z-index: 903;

    @include mixins.tablet {
        font-size: 1rem;
    }

    @include mixins.mobile {
        font-size: 1rem;
        min-height: 8.4375rem;
    }
}

.job-edit-input {
    width: 70%;
}

.input-style {
    @include mixins.input-style;
    margin-bottom: 0.5rem;
}

#job-add {
    @include mixins.add-display;
    min-height: 6.25rem;
    z-index: 803;
}

.job-add-container {
    @include mixins.add-container;
    z-index: 703;

    @include mixins.tablet {
        font-size: 1rem;
    }

    @include mixins.mobile {
        font-size: 1rem;
    }
}

.button-style {
    @include mixins.button-style;

    span {
        font-family: "Quicksand", sans-serif;
        font-size: 0.75rem;
        font-weight: 600;
    }
}

.button-style-small {
    @include mixins.button-style-small;
    position: relative;

    span {
        font-family: "Quicksand", sans-serif;
        font-size: 0.75rem;
        font-weight: 600;
    }
}

.minus {
    position: absolute;
    top: -0.1875rem;
    left: 0.40625rem;
    font-size: 1.25rem;
    font-weight: 600;
}

.plus {
    position: absolute;
    top: -0.1875rem;
    left: 0.28125rem;
    font-size: 1.25rem;
    font-weight: 600;
}

.cancel {
    margin-left: 0.25rem;
    cursor: pointer;
}

.submit {
    cursor: pointer;
}

.job-form {
    width: 100%;
}

</style>