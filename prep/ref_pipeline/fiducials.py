"""Board definitions shared by printing (notes/07-data-plan/make_fiducials.py), calibration and detection.

One dictionary (DICT_5X5_1000) for everything; ID ranges tell the objects apart:
  cards   ids 18k .. 18k+17 (k = 0..19)   6x6 ChArUco, 30 mm squares, 22 mm markers, 10 mm margin
  card S  ids 360 .. 377 (k = 20)         half-scale demo card: 15 mm squares, 11 mm markers, 5 mm margin
  strip   ids 400 .. 439                  40 mm markers at 50 mm pitch on a 2000 x 60 mm band
  strip_300 ids 450 .. 461                half-scale demo strip: 20 mm markers at 25 mm pitch on 300 x 30 mm
  calib   ids 500 .. 543                  11x8 ChArUco, 35 mm squares, 26 mm markers (A3)

Plane frame (what "card mm" / "strip mm" mean everywhere in this package): OpenCV board frame,
x to the right and y DOWN in the printed artwork, origin at the top-left corner of the chess
pattern (card) or of the band (strip), units mm, z = 0 on the print.  The Kotlin port must build
the same Board objects with the same ids so detections match the print.
"""
from __future__ import annotations

import numpy as np
import cv2

DICT_ID = cv2.aruco.DICT_5X5_1000
DICT = cv2.aruco.getPredefinedDictionary(DICT_ID)

CARD_SQUARES = 6
CARD_SQ_MM = 30.0
CARD_MK_MM = 22.0
CARD_MARGIN_MM = 10.0
CARD_IDS_PER = 18
CARD_COUNT = 21  # card 20 = card S (half-scale demo)
CARD_SQ_MM_BY_ID = {20: 15.0}

STRIP_ID0 = 400
STRIP_N = 40
STRIP_PITCH_MM = 50.0
STRIP_MK_MM = 40.0
STRIP_W_MM = 60.0
STRIP_LEN_MM = 2000.0

# Half-scale demo strip (strip_300.pdf): marker centre at 12.5 + (id - 450) * 25 mm from the 0 end.
STRIP300 = dict(id0=450, n=12, pitch=25.0, mk=20.0, w=30.0, length=300.0)

CALIB_IDS = np.arange(500, 544, dtype=np.int32)
CALIB_SIZE = (11, 8)
CALIB_SQ_MM = 35.0
CALIB_MK_MM = 26.0


def card_board(k: int, square_mm: float | None = None) -> cv2.aruco.CharucoBoard:
    """`square_mm` is the vernier-measured pitch of the printed card (print shops scale)."""
    if square_mm is None:
        square_mm = CARD_SQ_MM_BY_ID.get(k, CARD_SQ_MM)
    ids = np.arange(CARD_IDS_PER * k, CARD_IDS_PER * k + CARD_IDS_PER, dtype=np.int32)
    scale = square_mm / CARD_SQ_MM
    return cv2.aruco.CharucoBoard((CARD_SQUARES, CARD_SQUARES), float(square_mm),
                                  float(CARD_MK_MM * scale), DICT, ids)


def card_id_from_marker(marker_id: int) -> int | None:
    if 0 <= marker_id < CARD_IDS_PER * CARD_COUNT:
        return int(marker_id) // CARD_IDS_PER
    return None


def card_outline_mm(square_mm: float = CARD_SQ_MM) -> np.ndarray:
    s = CARD_SQUARES * square_mm
    m = CARD_MARGIN_MM * square_mm / CARD_SQ_MM
    return np.array([[-m, -m], [s + m, -m], [s + m, s + m], [-m, s + m]], np.float32)


def strip300_board(pitch_mm: float = STRIP300["pitch"]) -> cv2.aruco.Board:
    """strip_300: marker i (id 450+i) sits at x in [i*pitch + 2.5, i*pitch + 22.5], y in [5, 25]."""
    s = pitch_mm / STRIP300["pitch"]
    mk = STRIP300["mk"] * s
    y0 = (STRIP300["w"] - STRIP300["mk"]) / 2 * s
    obj = []
    for i in range(STRIP300["n"]):
        x0 = i * pitch_mm + (STRIP300["pitch"] - STRIP300["mk"]) / 2 * s
        obj.append(np.array([[x0, y0, 0], [x0 + mk, y0, 0], [x0 + mk, y0 + mk, 0], [x0, y0 + mk, 0]], np.float32))
    ids = np.arange(STRIP300["id0"], STRIP300["id0"] + STRIP300["n"], dtype=np.int32)
    return cv2.aruco.Board(np.stack(obj), DICT, ids)


def strip300_outline_mm(pitch_mm: float = STRIP300["pitch"]) -> np.ndarray:
    s = pitch_mm / STRIP300["pitch"]
    return np.array([[0, 0], [STRIP300["length"] * s, 0], [STRIP300["length"] * s, STRIP300["w"] * s],
                     [0, STRIP300["w"] * s]], np.float32)


def strip_board(pitch_mm: float = STRIP_PITCH_MM) -> cv2.aruco.Board:
    """Marker i sits at x in [i*pitch + 5, i*pitch + 45], y in [10, 50] on the print.

    Corner order matches OpenCV's detected-marker order (TL, TR, BR, BL in the marker's own
    orientation), which is the unrotated orientation on the strip artwork.
    `pitch_mm` is the measured pitch (10 pitches = 500 mm nominal) for the printed copy.
    """
    s = pitch_mm / STRIP_PITCH_MM
    mk = STRIP_MK_MM * s
    y0 = (STRIP_W_MM - STRIP_MK_MM) / 2 * s
    obj = []
    for i in range(STRIP_N):
        x0 = i * pitch_mm + (STRIP_PITCH_MM - STRIP_MK_MM) / 2 * s
        obj.append(np.array([[x0, y0, 0], [x0 + mk, y0, 0], [x0 + mk, y0 + mk, 0], [x0, y0 + mk, 0]], np.float32))
    ids = np.arange(STRIP_ID0, STRIP_ID0 + STRIP_N, dtype=np.int32)
    return cv2.aruco.Board(np.stack(obj), DICT, ids)


def strip_position_mm(marker_id: int, pitch_mm: float = STRIP_PITCH_MM) -> float:
    """Marker centre, in mm from the strip's 0 end (the end laid at the column face)."""
    return (int(marker_id) - STRIP_ID0 + 0.5) * pitch_mm


def strip_outline_mm(pitch_mm: float = STRIP_PITCH_MM) -> np.ndarray:
    s = pitch_mm / STRIP_PITCH_MM
    return np.array([[0, 0], [STRIP_LEN_MM * s, 0], [STRIP_LEN_MM * s, STRIP_W_MM * s], [0, STRIP_W_MM * s]], np.float32)


def calib_board(square_mm: float = CALIB_SQ_MM) -> cv2.aruco.CharucoBoard:
    scale = square_mm / CALIB_SQ_MM
    return cv2.aruco.CharucoBoard(CALIB_SIZE, float(square_mm), float(CALIB_MK_MM * scale), DICT, CALIB_IDS)


def detector_params() -> cv2.aruco.DetectorParameters:
    p = cv2.aruco.DetectorParameters()
    # Sub-pixel corner refinement is what makes the 0.2 px corner term in error_band.py true.
    p.cornerRefinementMethod = cv2.aruco.CORNER_REFINE_SUBPIX
    p.cornerRefinementWinSize = 5
    p.minMarkerPerimeterRate = 0.01
    return p
