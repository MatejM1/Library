import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Book } from '../../models/book';

@Component({
  selector: 'app-book-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './book-form.component.html',
  styleUrls: ['./book-form.component.css']
})
export class BookFormComponent {
  @Input() book: Book = {
    id: 0,
    title: '',
    author: '',
    year: new Date().getFullYear(),
    description: '',
    likes: 0,
    dislikes: 0,
    imageUrl: ''
  };

  @Input() buttonLabel: string = 'Shrani';
  @Input() isEditMode: boolean = false;

  @Output() formSubmit = new EventEmitter<Book>();

  currentYear: number = new Date().getFullYear();

  onSubmit(): void {
    this.formSubmit.emit(this.book);
  }
}