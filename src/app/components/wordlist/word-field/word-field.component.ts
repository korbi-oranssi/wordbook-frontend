import {Component, HostListener, Input, OnInit} from '@angular/core';
import {Word} from '../../../DTO/Word';
import {State} from '../../../DTO/State';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {WordlistComponent} from '../wordlist.component';
import {AlertService} from '../../../services/alert.service';
import {AuthService} from '../../../services/auth.service';
import {UserResponse} from '../../../DTO/UserResponse';

@Component({
  selector: 'app-word-field',
  templateUrl: './word-field.component.html',
  styleUrls: ['./word-field.component.css']
})
export class WordFieldComponent implements OnInit {
  constructor(private http: HttpClient,
              private alertService: AlertService,
              private authService: AuthService) {
  }

  @Input() word: Word;
  @Input() wordListRef: WordlistComponent;
  private state: State = State.None;
  tagNames = '';
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  closeDropdownMenu() {
    const dropdowns = document.getElementsByClassName('dropdown-content');
    let i;
    for (i = 0; i < dropdowns.length; i++) {
      const openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }

  ngOnInit() {
    this.wordListRef.getTags().forEach(tag => {
        if (this.word.tagIds != null && this.word.tagIds.includes(tag.id)) {
          this.addTagName(tag.name);
        }
      }
    );
  }

  enableEditing(tags: HTMLInputElement, foreignWord: HTMLInputElement, translatedWord: HTMLInputElement, submitBlock: HTMLDivElement) {
    if (this.state === State.None) {
      this.state = State.Edit;
      this.closeDropdownMenu();
      tags.disabled = false;
      foreignWord.disabled = false;
      translatedWord.disabled = false;
      submitBlock.style.display = 'inline-block';
    }
  }

  finishEditing(tags: HTMLInputElement, foreignField: HTMLInputElement, translatedField: HTMLInputElement, submitBlock: HTMLDivElement) {
    foreignField.disabled = true;
    translatedField.disabled = true;
    tags.disabled = true;
    submitBlock.style.display = 'none';
    this.state = State.None;
  }

  openDropdownMenu(menuDropdown: HTMLDivElement) {
    menuDropdown.classList.toggle('show');
  }

  submitEdits(tags: HTMLInputElement, foreignField: HTMLInputElement, translatedField: HTMLInputElement, submitBlock: HTMLDivElement) {
    this.word.foreignWord = foreignField.value;
    this.word.translatedWord = translatedField.value;
    this.http.put<UserResponse>('api/update_word', this.word, this.httpOptions).subscribe(result => {
        this.alertService.success(result.message);
      }, error => this.authService.coordinateError(error)
    );
    this.finishEditing(tags, foreignField, translatedField, submitBlock);
  }

  cancelEdits(tags: HTMLInputElement, foreignField: HTMLInputElement, translatedField: HTMLInputElement, submitBlock: HTMLDivElement) {
    foreignField.value = this.word.foreignWord;
    translatedField.value = this.word.translatedWord;
    this.finishEditing(tags, foreignField, translatedField, submitBlock);
  }

  deleteWord() {
    this.http.delete<UserResponse>('api/delete_word?word_id=' + this.word.id).subscribe(result => {
      this.alertService.success(result.message);
      this.wordListRef.deleteWord(this.word);
    }, error => this.authService.coordinateError(error));
  }

  enableAddTag(tagsDropdown: HTMLDivElement) {
    tagsDropdown.classList.toggle('show');
  }

  getTags() {
    return this.wordListRef.getTags();
  }

  addTagName(tagName: string) {
    let separator = '; ';
    if (this.tagNames.length === 0) {
      separator = '';
    }
    this.tagNames = this.tagNames.concat(separator + tagName);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    // @ts-ignore
    if (event.target.id !== 'menu-dropdown-button' && event.target.id !== 'add-tag-dropdown-button') {
      this.closeDropdownMenu();
    }
  }
}
