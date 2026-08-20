import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { BookFormComponent } from '../book-form/book-form.component';
import { Book } from '../../models/book';
import { BookService } from '../../services/book.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-book-create',
  standalone: true,
  imports: [CommonModule, BookFormComponent],
  templateUrl: './book-create.component.html',
  styleUrls: []
})
export class BookCreateComponent {
  newBook: Book = {
    id: 0,
    title: '',
    author: '',
    year: new Date().getFullYear(),
    description: '',
    likes: 0,
    dislikes: 0,
    imageUrl: ''
  };

  constructor(
    private router: Router,
    private bookService: BookService,
    public authService: AuthService
  ) {}

  saveBook(book: Book): void {
    const { id, ...bookWithoutId } = book;

    this.bookService.addBook(bookWithoutId).subscribe({
      next: (newBook) => {
        console.log('Knjiga je vpisana:', newBook);
        this.router.navigate(['/books']);
      },
      error: (err) => {
        console.error('Napaka pri vpisu knjige:', err);
      }
    });
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }
}