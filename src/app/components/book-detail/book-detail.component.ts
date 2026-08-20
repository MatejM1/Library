import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Book } from '../../models/book';
import { BookService } from '../../services/book.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-book-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './book-detail.component.html',
  styleUrls: ['./book-detail.component.css']
})
export class BookDetailComponent implements OnInit {
  book: Book | undefined;
  bookId: number = 0;
  loading: boolean = false;

  selectedVote: 'like' | 'dislike' | null = null;
  hasVoted: boolean = false;
  voteMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private bookService: BookService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.bookId = Number(params.get('id'));
      this.loadBook();
      this.checkIfVoted();
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
        console.error('Knjiga ni najdena:', err);
        this.loading = false;
      }
    });
  }

  checkIfVoted(): void {
    const votedKey = `voted_${this.bookId}`;
    const voteKey = `vote_${this.bookId}`;
    const hasVoted = localStorage.getItem(votedKey);

    if (hasVoted === 'true') {
      this.hasVoted = true;
      const savedVote = localStorage.getItem(voteKey);
      this.selectedVote = savedVote as 'like' | 'dislike' | null;
      this.voteMessage = `Za to knjigo ste že oddali glas.`;
    } else {
      this.hasVoted = false;
      this.selectedVote = null;
      this.voteMessage = '';
    }
  }

  submitVote(): void {
    if (!this.selectedVote) {
      alert('Izbrite Všeč mi je ali Ni mi všeč!');
      return;
    }

    if (this.hasVoted) {
      alert('Za to knjigo ste že oddali glas!');
      return;
    }

    if (this.book) {
      if (this.selectedVote === 'like') {
        this.book.likes++;
      } else {
        this.book.dislikes++;
      }

      this.bookService.updateBook(this.book.id, this.book).subscribe({
        error: (err: any) => console.error('Error updating votes:', err)
      });
    }

    localStorage.setItem(`voted_${this.bookId}`, 'true');
    localStorage.setItem(`vote_${this.bookId}`, this.selectedVote);

    this.hasVoted = true;
    this.voteMessage = `Oddali ste glas! Hvala.`;
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }
}