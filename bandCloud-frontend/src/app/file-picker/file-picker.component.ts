import { Component, ViewChild } from "@angular/core";
import { FilePickerDirective, ReadFile, ReadMode } from "ngx-file-helpers";


@Component({
  selector: 'app-file-picker',
  templateUrl: './file-picker.component.html',
  styleUrls: ['./file-picker.component.scss']
})
export class FilePickerComponent {

  public readMode = ReadMode.dataURL;
  public picked: ReadFile | null = null;
  public status: string | null = null;

  @ViewChild("filePicker", { static: false })
  private filePicker: FilePickerDirective | null = null;

  ignoreTooBigFile(file: File): boolean {
    return file.size < 100000;
  }

  onReadStart(fileCount: number) {
    this.status = `Reading ${fileCount} file(s)...`;
  }

  onFilePicked(file: ReadFile) {
    this.picked = file;
  }

  onReadEnd(fileCount: number) {
    this.status = `Read ${fileCount} file(s) on ${new Date().toLocaleTimeString()}.`;
    if (this.filePicker !== null) {
      this.filePicker.reset();
    }
  }

}
