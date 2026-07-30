import { Location } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-help',
  standalone: true,
  imports: [],
  templateUrl: './help.html',
  styleUrls: ['./help.scss']
})
export class Help {
  
  constructor(private location: Location) {}

  public goBack(): void {
    this.location.back(); 
  }
}
