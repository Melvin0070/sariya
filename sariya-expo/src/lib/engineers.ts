// Engineers who can sign off a record. v1 keeps them on the phone with a fixed PIN; a real key store comes later.
export const ENGINEERS = [
  { id: 'e1', name: 'Er. Melvin', pin: '0000' },
  { id: 'e2', name: 'Er. Alwin', pin: '0000' },
];

export function verifyPin(id: string, pin: string) {
  const e = ENGINEERS.find((x) => x.id === id);
  return e && e.pin === pin ? e : null;
}
