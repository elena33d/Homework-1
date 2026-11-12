export interface Showing {
  id: string;
  filmId: string;
  hallId: string;
  startsAt: string;
  price: number;
}

export interface ShowingWithDetails {
  id: string;
  filmId: string;
  hallId: string;
  filmTitle: string;
  hallName: string;
  startsAt: string;
  price: number;
}

export interface ShowingSeat {
  row: number;
  seat: number;
  isBooked: boolean;
}