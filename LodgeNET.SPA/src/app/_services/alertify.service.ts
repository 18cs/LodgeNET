import { Injectable } from '@angular/core';
declare let alertify: any;

@Injectable()
export class AlertifyService {

    constructor() { }

    confirm(message: string, okCallback: () => any) {
        alertify.confirm(message, function(e) {
            console.log(e);
            if (e) {
                okCallback();
            } else {
            }
        }).setHeader('LodgeNET');
    }

    success(message: string) {
        alertify.success(message);
    }

    error(message: string) {
        alertify.error(message);
    }

    warning(message: string) {
        alertify.warning(message);
    }

    message(message: string) {
        alertify.message(message);
    }

    prompt(message: string) {
        alertify.prompt(message);
    }
}
