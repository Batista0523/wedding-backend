import db from "../config/db.config";

export interface Guest {
  id?: string;
  full_name: string;
  status?: "pending" | "confirmed" | "declined";
  responded_at?: Date | null;
  created_at?: Date;
  updated_at?: Date;
}

export const getAllGuests = async (): Promise<Guest[]> => {
  return await db.any<Guest>(
    `SELECT 
       id,
       full_name,
       status,
       responded_at,
       created_at,
       updated_at
     FROM guests
     ORDER BY full_name`
  );
};

export const searchGuestsByName = async (search: string): Promise<Guest[]> => {
  return await db.any<Guest>(
    `SELECT 
       id,
       full_name,
       status,
       responded_at
     FROM guests
     WHERE full_name ILIKE '%' || $1 || '%'
     ORDER BY full_name`,
    [search]
  );
};

export const getGuestById = async (id: string): Promise<Guest | null> => {
  return await db.oneOrNone<Guest>(
    `SELECT 
       id,
       full_name,
       status,
       responded_at,
       created_at,
       updated_at
     FROM guests
     WHERE id = $1`,
    [id]
  );
};

export const updateGuestStatus = async (
  id: string,
  status: "confirmed" | "declined"
): Promise<Guest | null> => {
  return await db.oneOrNone<Guest>(
    `UPDATE guests
     SET status = $2,
         responded_at = NOW(),
         updated_at = NOW()
     WHERE id = $1
     RETURNING
       id,
       full_name,
       status,
       responded_at,
       updated_at`,
    [id, status]
  );
};

export const getGuestStats = async (): Promise<
  { status: string; total: number }[]
> => {
  return await db.any(
    `SELECT status, COUNT(*)::int AS total
     FROM guests
     GROUP BY status`
  );
};
