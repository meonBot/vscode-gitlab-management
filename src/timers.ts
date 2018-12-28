export let timers: any[] = [];

export function attachTimer(timer: any) {
    timers.push(timer);
}
export function getTimers() {
    return timers;
}
