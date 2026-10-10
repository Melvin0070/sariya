// How a pre-pour check runs, shown on the Device tab. Distances are for the half-scale props (BUILD-PLAN §7).
export const STEPS = [
  { title: 'Print card S and strip_300', body: 'Print at 100%. Measure the card pattern with a tape: it must be 90 mm. The strip has a 25 mm marker pitch.' },
  { title: 'Enter the drawing values', body: 'Pick slab, beam or column and type each value from the drawing. With no drawing, run measure-only: values, no verdict.' },
  { title: 'Place the card or strip', body: 'Card flat on the slab bars, edges along the bars. Strip along the beam, 0 end at the column face. On a column, scan twice: 0 end at the floor, then at the beam bottom.' },
  { title: 'Scan and lock', body: 'Torch on, about 30 cm away. Live numbers start with ~. Hold still and Lock: only a locked value gets a verdict.' },
  { title: 'Readings by hand', body: 'Cover with a tape, a 200 mm offcut on a kitchen scale, hooks against the 135° template.' },
  { title: 'Fix and re-scan', body: 'Play the fix to the mason in Hindi or Kannada. After the fix, scan that zone again.' },
  { title: 'Sign and send', body: 'Sign the capture, send the pack by Office Kit. The engineer approves on their own phone with their PIN.' },
];
