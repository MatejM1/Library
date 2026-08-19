export interface Book {
  id: number;              // edinstven ID za sledenje (časovni vrstni red)
  title: string;           // naslov knjige
  author: string;          // avtor
  year: number;            // leto izdaje
  description?: string;    // kratek opis (neobvezno)
  likes: number;           // število všečkov
  dislikes: number;        // število nevšečkov
  imageUrl?: string;       // pot za sliko
}
