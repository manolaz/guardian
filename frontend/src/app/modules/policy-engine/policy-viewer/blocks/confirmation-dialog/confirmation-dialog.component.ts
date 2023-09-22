import { Component, Inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

/**
 * Dialog allowing you to select a file and load schemes.
 */
@Component({
    selector: 'confirmation-dialog',
    templateUrl: './confirmation-dialog.component.html',
    styleUrls: ['./confirmation-dialog.component.css']
})
export class ConfirmationDialog {
    value: FormControl = new FormControl(
        '',
        Validators.required
        );
    title: string = "";
    description?: string;
    descriptions?: string[];

    constructor(
        public dialogRef: MatDialogRef<ConfirmationDialog>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this.title = data.title;
        if(Array.isArray(data.description)) {
            this.descriptions  = data.description;
        } else {
            this.description = data.description;
        }
    }

    ngOnInit() {
    }

    onNoClick(): void {
        this.dialogRef.close(null);
    }

    onSubmit() {
        if (this.value.invalid) {
            return;
        }
        this.dialogRef.close(this.value.value);
    }
}
