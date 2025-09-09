<script setup lang="ts">
import InterviewSlot from './InterviewItem.vue';
import { useInterviewStore } from '../stores/interview';

const interviewStore = useInterviewStore();

interviewStore.setCurrentDate();

if (interviewStore.interviewItems.length === 0) {
    interviewStore.getAllInterviews();
}

setInterval(interviewStore.checkInterviewStatus, 60000);
</script>

<template>
    <div id="interviews-container">
        <h2>Interviews</h2>
        <h3>Monday</h3>
        <div class="interviews">
            <TransitionGroup name="fade-left" appear>
                <div class="interview-item" v-for="(interview, index) in interviewStore.mondayInterviewItems" :key="interview.interview_id" :style="{border: interviewStore.currentInterviewIndex.includes(interview.interview_id) ? '0.3125rem solid #008080' : 'none'}">
                    <InterviewSlot :interview_time="interview.interview_time" :interview_id="interview.interview_id" :company="interview.company" :job="interview.job" :candidate="interview.candidate" :stage="interview.stage" :index="index" edit="monday-edit" delete-name="monday-delete" />
                </div>
            </TransitionGroup>
        </div>    
        <h3>Tuesday</h3>
        <div class="interviews">
            <TransitionGroup name="fade-left" appear>
                <div class="interview-item" v-for="(interview, index) in interviewStore.tuesdayInterviewItems" :key="interview.interview_id" :style="{border: interviewStore.currentInterviewIndex.includes(interview.interview_id) ? '0.3125rem solid #008080' : 'none'}">
                    <InterviewSlot :interview_time="interview.interview_time" :interview_id="interview.interview_id" :company="interview.company" :job="interview.job" :candidate="interview.candidate" :stage="interview.stage" :index="index" edit="tuesday-edit" delete-name="tuesday-delete" />
                </div>
            </TransitionGroup>
        </div>
        <h3>Wednesday</h3>
        <div class="interviews">
            <TransitionGroup name="fade-left" appear>
                <div class="interview-item" v-for="(interview, index) in interviewStore.wednesdayInterviewItems" :key="interview.interview_id" :style="{border: interviewStore.currentInterviewIndex.includes(interview.interview_id) ? '0.3125rem solid #008080' : 'none'}">
                    <InterviewSlot :interview_time="interview.interview_time" :interview_id="interview.interview_id" :company="interview.company" :job="interview.job" :candidate="interview.candidate" :stage="interview.stage" :index="index" edit="wednesday-edit" delete-name="wednesday-delete" />
                </div>
            </TransitionGroup>
        </div>
        <h3>Thursday</h3>
        <div class="interviews">
            <TransitionGroup name="fade-left" appear>
                <div class="interview-item" v-for="(interview, index) in interviewStore.thursdayInterviewItems" :key="interview.interview_id" :style="{border: interviewStore.currentInterviewIndex.includes(interview.interview_id) ? '0.3125rem solid #008080' : 'none'}">
                    <InterviewSlot :interview_time="interview.interview_time" :interview_id="interview.interview_id" :company="interview.company" :job="interview.job" :candidate="interview.candidate" :stage="interview.stage" :index="index" edit="thursday-edit" delete-name="thursday-delete" />
                </div>
            </TransitionGroup>
        </div>
        <h3>Friday</h3>
        <div class="interviews">
            <TransitionGroup name="fade-left" appear>
                <div class="interview-item" v-for="(interview, index) in interviewStore.fridayInterviewItems" :key="interview.interview_id" :style="{border: interviewStore.currentInterviewIndex.includes(interview.interview_id) ? '0.3125rem solid #008080' : 'none'}">
                    <InterviewSlot :interview_time="interview.interview_time" :interview_id="interview.interview_id" :company="interview.company" :job="interview.job" :candidate="interview.candidate" :stage="interview.stage" :index="index" edit="friday-edit" delete-name="friday-delete" />
                </div>
            </TransitionGroup>
        </div>
        <div class="interview-add">
            <button class="button-style" @click="interviewStore.toggleAddInterviewOpen" :disabled="interviewStore.editOpen !== undefined">Add</button>
            <div class="interview-add-container" v-if="interviewStore.addOpen">
                <form class="interview-form" @submit.prevent="interviewStore.addInterview">
                    <label for="date">Date: </label>
                    <input class="input-style" id="date" name="date" type="date" required v-model="interviewStore.inputDate" />
                    <label for="time"> Time: </label>
                    <input class="input-style" id="time" name="time" type="time" required v-model="interviewStore.inputTime" />
                    <div class="stage-input"><label for="stage"> Stage: </label>
                    <input class="input-style" name="stage" type="number" required v-model="interviewStore.inputStage" min="1" max="10" value="1" /></div><br />
                    <label for="company-name">Company: </label>
                    <input class="interview-input input-style" id="company-name" name="company-name" type="text" required v-model="interviewStore.inputCompany" /><br />
                    <label for="job-title">Job: </label>
                    <input class="interview-input input-style" id="job-title" name="job-title" type="text" required v-model="interviewStore.inputJob" /><br />
                    <label for="candidate">Candidate: </label>
                    <input class="interview-input input-style" id="candidate" name="candidate" type="text" required v-model="interviewStore.inputCandidate" /><br />                    
                    <input class="submit button-style" name="submit" type="submit" value="Submit"> <button class="cancel button-style" @click="interviewStore.cancelAddInterview">Cancel</button>  
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

#interviews-container {
    @include mixins.display-container;
}

.interviews {
    width: 100%;
    margin: 0.5rem 0;
}

.interview-item {
    @include mixins.item-container;

    @include mixins.mobile {
        flex-direction: column;
    }    
}

.interview-add {
    @include mixins.add-display;
    z-index: 804;
    min-height: 10.75rem;

    @include mixins.tablet {
        min-height: 9.75rem;
    }

    @include mixins.mobile {
        min-height: 12.75rem;
    }
}

.interview-add-container {
    @include mixins.add-container;
    z-index: 704;

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
</style>