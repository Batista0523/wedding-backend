import { Router, Request, Response } from "express";
import {
  getAllGuests,
  getGuestById,
  searchGuestsByName,
  updateGuestStatus,
  getGuestStats,
} from "../queries/guests.queries";

const Guests = Router();

/**
 * GET /guests
 * ?search=
 */
Guests.get("/", async (req: Request, res: Response) => {
  try {
    const search = req.query.search as string | undefined;

    const guests = search
      ? await searchGuestsByName(search)
      : await getAllGuests();

    return res.status(200).json({
      success: true,
      payload: guests,
    });
  } catch {
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
});

/**
 * GET /guests/stats
 */
Guests.get("/stats", async (_req: Request, res: Response) => {
  try {
    const stats = await getGuestStats();

    return res.status(200).json({
      success: true,
      payload: stats,
    });
  } catch {
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
});

/**
 * GET /guests/:id
 */
Guests.get("/:id", async (req: Request, res: Response) => {
  try {
    const guest = await getGuestById(req.params.id);

    if (!guest) {
      return res.status(404).json({
        success: false,
        error: "Guest not found",
      });
    }

    return res.status(200).json({
      success: true,
      payload: guest,
    });
  } catch {
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
});

/**
 * PATCH /guests/:id/rsvp
 * body:
 * {
 *   status: "confirmed" | "declined",
 *   has_plus_one: boolean,
 *   plus_one_name?: string
 * }
 */
Guests.patch("/:id/rsvp", async (req: Request, res: Response) => {
  try {
    const { status, has_plus_one, plus_one_name } = req.body;

    // validar status
    if (status !== "confirmed" && status !== "declined") {
      return res.status(400).json({
        success: false,
        error: "Invalid status",
      });
    }

    // validar has_plus_one
    if (typeof has_plus_one !== "boolean") {
      return res.status(400).json({
        success: false,
        error: "has_plus_one must be a boolean",
      });
    }

    // si trae acompañante, nombre es obligatorio
    if (has_plus_one && !plus_one_name) {
      return res.status(400).json({
        success: false,
        error: "plus_one_name is required when has_plus_one is true",
      });
    }

    const updated = await updateGuestStatus(
      req.params.id,
      status,
      has_plus_one,
      plus_one_name
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        error: "Guest not found",
      });
    }

    return res.status(200).json({
      success: true,
      payload: updated,
    });
  } catch {
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
});

export default Guests;
