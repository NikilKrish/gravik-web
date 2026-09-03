// Shared Sport / Date / Court-or-Net / Players field grid, used by the
// review step and the post-send confirmation screen.

import { formatFullDate } from '../../lib/booking/slots';
import type { RailDay, Sport } from '../../lib/booking/types';

interface BookingFieldsProps {
  sport: Sport;
  day: RailDay;
  courtName: string;
  players: number;
}

export function BookingFields({ sport, day, courtName, players }: BookingFieldsProps) {
  return (
    <div className="review-field-grid">
      <div className="review-field">
        <span className="review-field-label">Sport</span>
        <span className="review-field-value">{sport.name}</span>
      </div>
      <div className="review-field">
        <span className="review-field-label">Date</span>
        <span className="review-field-value">{formatFullDate(day.date)}</span>
      </div>
      <div className="review-field">
        <span className="review-field-label">{sport.courtWord}</span>
        <span className="review-field-value">{courtName}</span>
      </div>
      <div className="review-field">
        <span className="review-field-label">Players</span>
        <span className="review-field-value">{players}</span>
      </div>
    </div>
  );
}
