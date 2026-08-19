import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookCardComponent } from './book-card/book-card.component';
import { Book } from '../../models/book';
import { BookService } from '../../services/book.service';

@Component({
  selector: 'app-latest',
  standalone: true,
  imports: [CommonModule, BookCardComponent],
  templateUrl: './latest.component.html',
  styleUrls: ['./latest.component.css']
})
export class LatestComponent implements OnInit {
  books: Book[] = [];
  loading: boolean = false;

  constructor(private bookService: BookService) {}

  ngOnInit(): void {
    this.loadBooks();
  }

  loadBooks(): void {
    this.loading = true;
    this.bookService.getBooks().subscribe({
      next: (data) => {
        this.books = data.slice(-10).reverse();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading books:', err);
        this.loading = false;
      }
    });
  }
}
