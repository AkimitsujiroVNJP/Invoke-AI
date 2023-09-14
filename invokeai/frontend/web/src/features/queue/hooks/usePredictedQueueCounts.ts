import { createSelector } from '@reduxjs/toolkit';
import { stateSelector } from 'app/store/store';
import { useAppSelector } from 'app/store/storeHooks';
import { useMemo } from 'react';
import { useGetQueueStatusQuery } from 'services/api/endpoints/queue';

const selector = createSelector(
  stateSelector,
  ({ dynamicPrompts, generation }) => {
    return dynamicPrompts.prompts.length * generation.iterations;
  }
);

export const usePredictedQueueCounts = () => {
  const { data: queueStatus } = useGetQueueStatusQuery();
  const requested = useAppSelector(selector);
  const counts = useMemo(() => {
    if (!queueStatus) {
      return;
    }
    const { max_queue_size, pending } = queueStatus;
    const maxNew = max_queue_size - pending;
    return {
      requested,
      max_queue_size,
      predicted: Math.min(requested, maxNew),
    };
  }, [queueStatus, requested]);
  return counts;
};