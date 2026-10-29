export function Unavailable({ what }: { what: string }) {
  return (
    <p role="status" className="rounded-(--radius) border hairline p-6 text-fg-muted">
      {what} ne peuvent pas être chargés pour le moment. Recharge la page dans un instant.
    </p>
  );
}
