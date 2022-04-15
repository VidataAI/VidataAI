import { Component } from '@angular/core';
import { AzureBlobStorageService } from './azure-blob-storage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

    // SAS (shared access signatures)
    sas = "sp=racwdl&st=2022-04-14T04:42:38Z&se=2023-12-31T12:42:38Z&spr=https&sv=2020-08-04&sr=c&sig=7bcqUQvVIW2FByzlrVJ1Yji0QYMuGKr0u4HgqQwSrnU%3D";

    picturesList: string[] = [];
    picturesDownloaded: string[] = []
  
    videosList: string[] = [];
    videoDownloaded;
  
    constructor(private blobService: AzureBlobStorageService) {
  
    }
  
    ngOnInit(): void {
      this.reloadImages()
    }
  
    public setSas(event) {
      this.sas = event.target.value
    }
  
    public imageSelected(file: File) {
      this.blobService.uploadImage(this.sas, file, file.name, () => {
        this.reloadImages()
      })
    }
  

  
    public downloadImage (name: string) {
      this.blobService.downloadImage(this.sas, name, blob => {
        let url = window.URL.createObjectURL(blob);
        window.open(url);
      })
    }
  
    private reloadImages() {
      this.blobService.listImages(this.sas).then(list => {
        this.picturesList = list
        const array = []
        this.picturesDownloaded = array
  
        for (let name of this.picturesList) {
          this.blobService.downloadImage(this.sas, name, blob => {
            var reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onloadend = function () {
              array.push(reader.result as string)
            }
          })
        }
      })
    }
  }
