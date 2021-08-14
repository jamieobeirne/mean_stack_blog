import { AbstractControl } from "@angular/forms";
import { Observable, Observer } from "rxjs";


//a function that takes input and determines if it is correct = validator
export const mimeType =
(control: AbstractControl): Promise<{ [key: string]: any }> | Observable<{ [key: string]: any }> => {

  const file = control.value as File;
  const fileReader = new FileReader();
  const frObs = Observable.create( //file reader observable

    (observer: Observer<{ [key: string]: any }>) => {
      fileReader.addEventListener("loadend", () => {
        const arr = new Uint8Array(fileReader.result as ArrayBuffer).subarray(0, 4);
        let header = "";
        let isValid = false;
        for (let i = 0; i < arr.length; i++) {
          header += arr[i].toString(16);
        }
        switch (header) {
          case "89504e47": //patterns which stand for jpeg or png file types
            isValid = true;
            break;
          case "ffd8ffe0":
          case "ffd8ffe1":
          case "ffd8ffe2":
          case "ffd8ffe3":
          case "ffd8ffe8":
            isValid = true;
            break;
          default:
            isValid = false; // Or you can use the blob.type as fallback
            break;
        }
        if (isValid) {
          observer.next(null);//we emit this if the file is valid
        } else {
          observer.next({ invalidMimeType: true });
        }
        observer.complete();//closes subscribers
      });
      fileReader.readAsArrayBuffer(file);
    }
  );
  return frObs; //return the observable

};
