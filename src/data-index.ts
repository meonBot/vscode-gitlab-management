
let openMR: any = 'no_data';
let branchArray = [{
    branch: 'development'
}, {
    branch: 'master'
}];

export function updateOpenMr(data: any) {
    openMR = data.toString();
}

export function checkOpenMr(data: any): boolean {
    return typeof openMR !== 'undefined';
}

export function getOpenMr(): any[] {
    return openMR.toString();
}

export function setBranchArray(data: string) {
    branchArray.push({ branch: data });
}

export function getBranchArray() {
    return branchArray;
}
