import { Component } from '@angular/core';
import { Slider } from "../components/slider/slider";
import { ServiceSection } from "../components/service-section/service-section";

@Component({
  selector: 'app-home-screen',
  imports: [Slider, ServiceSection],
  templateUrl: './home-screen.html',
  styleUrl: './home-screen.css'
})
export class HomeScreen {

}
