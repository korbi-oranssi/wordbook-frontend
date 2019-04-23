import { Component, OnInit } from '@angular/core';
import {WordRecord} from '../WordRecord';
import {State} from '../State';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';

// noinspection TsLint
@Component({
  selector: 'app-wordlist',
  templateUrl: './wordlist.component.html',
  styleUrls: ['./wordlist.component.css']
})
export class WordlistComponent implements OnInit {

  constructor(private http: HttpClient, private formBuilder: FormBuilder) {
    this.newWord = formBuilder.group({
      foreignControl: new FormControl(),
      translatedControl: new FormControl()
    });
  }
  private newWord: FormGroup;
  private state: State = State.None;

  public wordList: WordRecord[] = [];
  wordsUrl = 'http://localhost:9090/all_words';

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  public getList() {
    return this.http.get<WordRecord[]>(this.wordsUrl).subscribe(wordsList => {
      this.wordList = wordsList.reverse();
    });
  }

  ngOnInit() {
    this.getList();
    console.log(this.wordList);
  }

  submitByEnter(event) {
    const foreignWord = this.newWord.get('foreignControl').value;
    const translatedWord = this.newWord.get('translatedControl').value;
    if (foreignWord !== '' || translatedWord !== '') {
      this.state = State.Add;
    }
    if (event.key === 'Enter') {
      const wordRecord = new WordRecord(foreignWord, translatedWord);
      this.wordList.unshift(wordRecord);
      this.newWord.controls.foreignControl.setValue('');
      this.newWord.controls.translatedControl.setValue('');
      this.http.post('http://localhost:9090/save_word', wordRecord, this.httpOptions).subscribe();
    }
  }

  editWord(word) {
    this.state = State.Edit;
    document.getElementById(this.generateForeignWordId(word.id)).disabled = false;
    document.getElementById(this.generateTranslatedId(word.id)).disabled = false;
  }

  generateForeignWordId(id) {
    return 'foreign_' + id;
  }

  generateTranslatedId(id) {
    return 'translated_' + id;
  }
}
