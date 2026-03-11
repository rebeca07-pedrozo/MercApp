import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { BehaviorSubject } from 'rxjs';

export interface UserPhoto {
  filepath: string;
  webviewPath?: string;
}

@Injectable({ providedIn: 'root' })
export class CameraService {
  private photosSubject = new BehaviorSubject<UserPhoto[]>([]);
  public photos$ = this.photosSubject.asObservable();

  get photos(): UserPhoto[] {
    return this.photosSubject.value;
  }

  async addNewPhoto() {
    const capturedPhoto = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 90,
      allowEditing: false
    });

    const savedPhoto = await this.savePicture(capturedPhoto);
    const updated = [savedPhoto, ...this.photosSubject.value];
    this.photosSubject.next(updated);
    return savedPhoto;
  }

  async selectFromGallery() {
    const capturedPhoto = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Photos,
      quality: 90
    });

    const savedPhoto = await this.savePicture(capturedPhoto);
    const updated = [savedPhoto, ...this.photosSubject.value];
    this.photosSubject.next(updated);
    return savedPhoto;
  }

  private async savePicture(photo: Photo): Promise<UserPhoto> {
    const base64Data = await this.readAsBase64(photo);
    const fileName = `mercapp_${Date.now()}.jpeg`;

    await Filesystem.writeFile({
      path: fileName,
      data: base64Data,
      directory: Directory.Data
    });

    return { filepath: fileName, webviewPath: photo.webPath };
  }

  private async readAsBase64(photo: Photo): Promise<string> {
    const response = await fetch(photo.webPath!);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => resolve(reader.result as string);
      reader.readAsDataURL(blob);
    });
  }

  deletePhoto(photo: UserPhoto) {
    const updated = this.photosSubject.value.filter(p => p.filepath !== photo.filepath);
    this.photosSubject.next(updated);
    Filesystem.deleteFile({ path: photo.filepath, directory: Directory.Data }).catch(() => {});
  }
}