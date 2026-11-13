export interface Showing {
  id: string;
  filmId: string;
  hallId: string;
  startsAt: string;
  price: number;
}

/** Showing as returned to clients: film and hall names instead of ids */
export interface ShowingWithDetails {
  id: string;
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
