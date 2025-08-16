import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-document-viewer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './document-viewer.component.html',
  styleUrl: './document-viewer.component.css'
})
export class DocumentViewerComponent {
  @Input() documentUrl: string = '';
  showViewer: boolean = false;
  safeUrl: SafeResourceUrl | undefined;

  constructor(private sanitizer: DomSanitizer) {}

  openViewer(url: string) {
    this.documentUrl = url;
    this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    this.showViewer = true;
    document.body.style.overflow = 'hidden'; // Prevent scrolling
  }

  closeViewer() {
    this.showViewer = false;
    document.body.style.overflow = '';
  }
}
