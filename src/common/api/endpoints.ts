'use strict';

const API_ENDPOINT_PREFIX = '/api/';
export const CANCEL_JOB = API_ENDPOINT_PREFIX + 'canceljob/:jobNumber';
export const GET_JOB_CONFIGURATIONS = API_ENDPOINT_PREFIX + 'jobdefinitions';
export const GET_JOB_INFOS = API_ENDPOINT_PREFIX + 'jobs';
export const RUN_JOB = API_ENDPOINT_PREFIX + 'runjob/:jobId';
