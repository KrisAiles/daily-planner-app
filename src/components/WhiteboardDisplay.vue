<script setup lang="ts">
import { useInterviewStore } from '../stores/interview';
import { useJobsStore } from '../stores/job';
import InterviewDisplay from './InterviewDisplay.vue';
import JobDisplay from './JobDisplay.vue';

const interviewStore = useInterviewStore();
const jobStore = useJobsStore();

interviewStore.setCurrentDate();

if (interviewStore.interviewItems.length === 0) {
    interviewStore.getAllInterviews();
}

if (jobStore.jobItems.length === 0) {
    jobStore.getAllJobs();
}

setInterval(interviewStore.checkInterviewStatus, 60000);

</script>

<template>
    <div>
        <JobDisplay />        
        <InterviewDisplay />             
    </div> 
</template>

<style lang="scss" scoped>

</style>