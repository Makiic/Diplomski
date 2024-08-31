import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-route-details-modal',
  templateUrl: './route-details-modal.component.html',
  styleUrls: ['./route-details-modal.component.css']
})
export class RouteDetailsModalComponent {
  constructor(
    public dialogRef: MatDialogRef<RouteDetailsModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { name: string, distance: number, weight: number }
  ) {}

  save(): void {
    this.dialogRef.close(this.data);
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
