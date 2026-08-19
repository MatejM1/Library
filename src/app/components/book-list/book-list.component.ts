import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Book } from '../../models/book';
import { BookService } from '../../services/book.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.css']
})
export class BookListComponent implements OnInit {
  allBooks: Book[] = [];
  filteredBooks: Book[] = [];
  searchTerm: string = '';
  sortColumn: string = 'id';
  sortDirection: 'asc' | 'desc' = 'asc';
  loading: boolean = false;

  constructor(
    private bookService: BookService,
    public authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadBooks();

    // Ob vsaki navigaciji na /books ponovno naloži podatke
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd && this.router.url === '/books') {
        this.loadBooks();
      }
    });
  }

  loadBooks(): void {
    this.loading = true;
    this.bookService.getBooks().subscribe({
      next: (data) => {
        this.allBooks = data;
        this.applyFilterAndSort();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading books:', err);
        this.loading = false;
      }
    });
  }

  applyFilterAndSort(): void {
    let filtered = this.allBooks.filter(book =>
      book.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(this.searchTerm.toLowerCase())
    );

    filtered.sort((a, b) => {
      const aVal = a[this.sortColumn as keyof Book];
      const bVal = b[this.sortColumn as keyof Book];

      if (typeof aVal === 'string') {
        return this.sortDirection === 'asc'
          ? aVal.localeCompare(bVal as string)
          : (bVal as string).localeCompare(aVal);
      } else {
        return this.sortDirection === 'asc'
          ? (aVal as number) - (bVal as number)
          : (bVal as number) - (aVal as number);
      }
    });

    this.filteredBooks = filtered;
  }

  sort(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.applyFilterAndSort();
  }

  deleteBook(id: number): void {
    if (confirm('Si res želite izbrisati knjigo?')) {
      this.bookService.deleteBook(id).subscribe({
        next: () => {
          console.log(`Izbrisana knjiga z ID: ${id}`);
          this.loadBooks();
        },
        error: (err) => console.error('Napaka pri izbrisu knjige:', err)
      });
    }
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }
}