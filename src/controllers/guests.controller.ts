import { Router, Request, Response } from "express";
import {
  getAllGuests,
  getGuestById,
  searchGuestsByName,
  updateGuestStatus,
  getGuestStats,
} from "../queries/guests.queries";

const Guests = Router();

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

Guests.patch("/:id/rsvp", async (req: Request, res: Response) => {
  try {
    const { status, has_plus_one, plus_one_name, attendance } = req.body;

    if (status !== "confirmed" && status !== "declined") {
      return res.status(400).json({
        success: false,
        error: "Invalid status",
      });
    }

    if (status === "confirmed") {
      if (typeof has_plus_one !== "boolean") {
        return res.status(400).json({
          success: false,
          error: "has_plus_one must be a boolean",
        });
      }

      if (has_plus_one && !plus_one_name) {
        return res.status(400).json({
          success: false,
          error: "plus_one_name is required when has_plus_one is true",
        });
      }

      if (!["ceremony", "celebration", "both"].includes(attendance)) {
        return res.status(400).json({
          success: false,
          error: "Invalid attendance value",
        });
      }
    }

    const updated = await updateGuestStatus(
      req.params.id,
      status,
      has_plus_one ?? false,
      plus_one_name ?? null,
      attendance ?? "both"
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
