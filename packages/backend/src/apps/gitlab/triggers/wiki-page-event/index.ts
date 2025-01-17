import { IRawTrigger } from '@automatisch/types';
import defineTrigger from '../../../../helpers/define-trigger';
import { GITLAB_EVENT_TYPE } from '../types';
import {
  getRegisterHookFn,
  getTestRunFn,
  projectArgumentDescriptor,
  unregisterHook,
} from '../lib';

import data from './wiki_page_event';

export const triggerDescriptor: IRawTrigger = {
  name: 'Wiki page event',
  description:
    'Wiki page event (triggered when a wiki page is created, updated, or deleted)',
  // info: 'https://docs.gitlab.com/ee/user/project/integrations/webhook_events.html#wiki-page-events',
  key: GITLAB_EVENT_TYPE.wiki_page_events,
  type: 'webhook',
  arguments: [projectArgumentDescriptor],
  testRun: getTestRunFn(data),
  registerHook: getRegisterHookFn(GITLAB_EVENT_TYPE.wiki_page_events),
  unregisterHook,
};

export default defineTrigger(triggerDescriptor);
