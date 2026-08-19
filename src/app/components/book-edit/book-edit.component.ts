import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { BookFormComponent } from '../book-form/book-form.component';
import { Book } from '../../models/book';
import { BookService } from '../../services/book.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-book-edit',
  standalone: true,
  imports: [CommonModule, BookFormComponent],
  templateUrl: './book-edit.component.html',
  styleUrls: ['./book-edit.component.css']
})
export class BookEditComponent implements OnInit {
  book: Book | undefined;
  bookId: number = 0;
  loading: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bookService: BookService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.bookId = Number(params.get('id'));
      this.loadBook();
    });
  }

  loadBook(): void {
    this.loading = true;
    this.bookService.getBookById(this.bookId).subscribe({
      next: (data) => {
        this.book = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Book not found:', err);
        this.loading = false;
        this.router.navigate(['/books']);
      }
    });
  }

  updateBook(book: Book): void {
    this.bookService.updateBook(this.bookId, book).subscribe({
      next: () => {
        console.log('✏️ Book updated:', book);
        this.router.navigate(['/books']);
      },
      error: (err) => console.error('Error updating book:', err)
    });
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }
}