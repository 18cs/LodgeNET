import { NgModule } from '@angular/core';
import { MatDialogModule, MatFormFieldModule, MatInputModule, MatAutocompleteModule } from '@angular/material';

@NgModule({
    imports: [
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatAutocompleteModule
    ],
    exports: [
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatAutocompleteModule
    ]
})
export class MaterialModule {}
