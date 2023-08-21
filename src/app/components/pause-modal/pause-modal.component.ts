import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-pause-modal',
  templateUrl: './pause-modal.component.html',
  styleUrls: ['./pause-modal.component.scss'],
})
export class PauseModalComponent implements OnInit {

  constructor(private modalController: ModalController) { }

  ngOnInit() {}

  closeModal() {
    this.modalController.dismiss();
  }
}
