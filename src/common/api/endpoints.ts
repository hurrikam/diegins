'use strict';

const API_ENDPOINT_PREFIX = '/api/';
export const CANCEL_JOB = API_ENDPOINT_PREFIX + 'canceljob/:jobNumber';
export const CREATE_JOB_CONFIGURATION = API_ENDPOINT_PREFIX + 'jobconfiguration/create';
export const GET_JOB_CONFIGURATION = API_ENDPOINT_PREFIX + 'jobconfiguration/:jobId';
export const GET_JOB_CONFIGURATIONS = API_ENDPOINT_PREFIX + 'jobconfigurations';
export const GET_JOB_INFOS = API_ENDPOINT_PREFIX + 'jobs';
export const RUN_JOB = API_ENDPOINT_PREFIX + 'runjob/:jobId';
export const SAVE_JOB_CONFIGURATION = API_ENDPOINT_PREFIX + 'jobconfiguration';
