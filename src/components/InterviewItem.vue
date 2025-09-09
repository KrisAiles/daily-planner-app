<script setup lang="ts">
import { useInterviewStore } from '../stores/interview';

const interviewStore = useInterviewStore();

defineProps<{
  interview_time: string
  interview_id: string
  company: string
  job: string
  candidate: string
  stage: number
  index: number
  edit: string
  deleteName: string
}>();

</script>

<template>
        <div class="date-time">
            <div class="interview-date">{{ interviewStore.setDate(interview_time) }}</div>
            <div class="interview-time">{{ interviewStore.setTime(interview_time) }}</div>
        </div>  
        <div class="interview-description" :style="{color: interviewStore.pastInterviewIndex.includes(interview_id) ? 'lightgray' : 'white', textDecorationLine: interviewStore.pastInterviewIndex.includes(interview_id) ? 'line-through' : 'none', fontSize: interviewStore.currentInterviewIndex.includes(interview_id) ? '1.5rem' : '1.25rem'}">
            <div class="interview-company">{{ company }}</div>
            <div class="interview-job">{{ job }}</div>
            <div class="interview-candidate">{{ candidate }}</div>
            <div class="interview-stage">{{ interviewStore.setStage(stage)}}</div>
        </div>
        <div class="edit-delete">
            <div class="interview-edit">
                <img src="../assets/images/edit.png" alt="edit pen" @click="interviewStore.openEditInterview(interview_time, company, job, candidate, stage, interview_id)" @mouseover="interviewStore.showToolTip(index, edit)" @mouseleave="interviewStore.hideToolTip()" />
                <div class="tooltip" v-if="interviewStore.tooltipStatus === index && interviewStore.tooltipType === edit">edit</div>
            </div>
            <div class="interview-delete">
                <img src="../assets/images/delete.png" alt="delete bin" @click="interviewStore.deleteInterview(interview_id)" @mouseover="interviewStore.showToolTip(index, deleteName)" @mouseleave="interviewStore.hideToolTip()" />
                <div class="tooltip" v-if="interviewStore.tooltipStatus === index && interviewStore.tooltipType === deleteName">delete</div>
            </div>
        </div>
        <div class="interview-edit-container" v-if="interviewStore.editOpen === interview_id">
            <form class="interview-form" @submit.prevent="interviewStore.updateInterview(interview_id)">
                <label for="date">Date: </label>
                <input class="input-style" id="date" name="date" type="date" required v-model="interviewStore.inputDate" />
                <label for="time">Time: </label>
                <input class="input-style" id="time" name="time" type="time" required v-model="interviewStore.inputTime" />
                <div class="stage-input"><label for="stage">Stage: </label>
                <input class="input-style" name="stage" type="number" required v-model="interviewStore.inputStage" min="1" max="10" value="1" /></div><br />
                <label for="company-name">Company: </label>
                <input class="interview-input input-style" id="company-name" name="company-name" type="text" required v-model="interviewStore.inputCompany" /><br />
                <label for="job-title">Job: </label>
                <input class="interview-input input-style" id="job-title" name="job-title" type="text" required v-model="interviewStore.inputJob" /><br />
                <label for="candidate">Candidate: </label>
                <input class="interview-input input-style" id="candidate" name="candidate" type="text" required v-model="interviewStore.inputCandidate" /><br />
                <input class="submit button-style" name="submit" type="submit" value="Submit"> <button class="cancel button-style" @click="interviewStore.cancelEditInterview">Cancel</button>                
            </form>
        </div>
</template>

<style lang="scss" scoped>
@use '../assets/css/variables.scss';
@use '../assets/css/mixins.scss';

.interview-description {
    @include mixins.item-description;
    padding: 0;

    @include mixins.mobile {
        flex-direction: column;
    }
}

.interview-company {
    text-align: left;
    width: 25%;
    padding: 0.25rem;

    @include mixins.mobile {
        text-align: center;
        width: 100%;
    }
}

.interview-job {
    width: 41%;
    text-align: left;
    padding: 0.25rem;

    @include mixins.mobile {
        text-align: center;
        width: 100%;
    }
}

.interview-candidate {
    text-align: left;
    width: 25%;
    padding: 0.25rem;

    @include mixins.mobile {
        text-align: center;
        width: 100%;
    }
}

.interview-stage {
    text-align: right;
    width: 9%;
    padding: 0.25rem;

    @include mixins.mobile {
        text-align: center;
        width: 100%;
    }
}

.interview-edit-container {
    @include mixins.add-container;
    z-index: 904;

    @include mixins.tablet {
        font-size: 1rem;
    }

    @include mixins.mobile {
        font-size: 1rem;
    }
}

.interview-form {
    width: 100%;        
}

.button-style {
    @include mixins.button-style;
}

.interview-input {
    @include mixins.large-desktop {
        width: 75%;
    }

    @include mixins.desktop {
        width: 85%;
    }

    @include mixins.tablet {
        width: 85%;
    }

    @include mixins.mobile {
        width: 70%;
    }
}

.stage-input {
    display: inline-block;
    margin-left: 0.25rem;
}

.input-style {
    @include mixins.input-style;
    margin-bottom: 0.5rem;
}

.cancel {
    margin-left: 0.25rem;
    cursor: pointer;
}

.submit {
    cursor: pointer;
}

.edit-delete {
    @include mixins.edit-delete-container;
}

.interview-edit {
    position: relative;
    @include mixins.edit-delete;
    margin: 0 0.5rem;
}

.interview-delete {
    position: relative;
    @include mixins.edit-delete;
}

.tooltip {
    position: absolute;
    background-color: variables.$white-color;
    color: variables.$olive-color;
    padding: 0 0.25rem;
    font-size: 1.25rem;
    z-index: 604;
}

.date-time {    
    @include mixins.time-container;
    width: 6.875rem;        
}

.interview-date {
    @include mixins.flex-center;
    border-bottom: 0.0625rem solid variables.$white-color;
}

.interview-time {
    @include mixins.flex-center;
}
</style>