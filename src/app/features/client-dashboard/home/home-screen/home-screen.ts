import { Component } from '@angular/core';
import { Slider } from "../components/slider/slider";
import { ServiceSection } from "../components/service-section/service-section";
import { CategorySection } from "../components/category-section/category-section";

@Component({
  selector: 'app-home-screen',
  imports: [Slider, ServiceSection, CategorySection],
  templateUrl: './home-screen.html',
  styleUrl: './home-screen.css'
})
export class HomeScreen {

}
