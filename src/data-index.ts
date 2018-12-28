
let openMR: any = [];

function updateOpenMr(data: any) {
    openMR.push(data);
}

function checkOpenMr(data: any) {
    return openMR.lastIndexOf(data) > -1 ? true : false;
}
