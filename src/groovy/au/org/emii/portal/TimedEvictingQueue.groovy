package au.org.emii.portal

import java.util.ArrayDeque

class TimedEvictingQueue<T> {

    // A queue item
    private class TimedEvictingQueueItem<T> {
        Date date
        T item
    }

    def queue

    long backlogIntervalMilli = 600 * 1000

    TimedEvictingQueue() {
        queue = new ArrayDeque<TimedEvictingQueueItem>()
    }

    def add(T item) {
        evict()

        def itemWithTimestamp = [date: new Date(), item: item] as TimedEvictingQueueItem<T>
        queue.addLast(itemWithTimestamp)
    }

    def size() {
        evict()

        return queue.size()
    }

    def evict() {
        def now = new Date()

        while (queue.size() > 0) {
            def itemIntervalFromNow = now.getTime() - queue.getFirst().date.getTime()
            if (itemIntervalFromNow < backlogIntervalMilli) {
                // We're done, anything else here should still stay in the queue
                return
            }
            queue.removeFirst()
        }
    }
}
