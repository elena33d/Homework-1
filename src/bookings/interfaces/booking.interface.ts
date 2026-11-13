export interface BookedSeat {
  row: number;
  seat: number;
}

export interface Booking {
  id: string;
  showingId: string;
  seats: BookedSeat[];
  totalPrice: number;
}
