import { NgModule } from '@angular/core';
import { MatDialogModule, MatFormFieldModule, MatInputModule } from '@angular/material';

@NgModule({
    imports: [
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule
    ],
    exports: [
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule
    ]
})
export class MaterialModule {}
