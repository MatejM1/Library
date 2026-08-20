import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BookService } from '../../services/book.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: []
})
export class HomeComponent implements OnInit {
  totalBooks: number = 0;
  loading: boolean = true;

  constructor(private bookService: BookService) {}

  ngOnInit(): void {
    this.bookService.getBooks().subscribe({
      next: (books) => {
        this.totalBooks = books.length;
        this.loading = false;
      },
      error: (err) => {
        console.error('Napaka pri nalaganju knjig:', err);
        this.loading = false;
      }
    });
  }
}